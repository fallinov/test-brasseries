// Test e2e : verifie qu'au chargement, au moins une pin Leaflet est rendue.
// On mocke la reponse Overpass via page.route() : le test reste rapide
// et determinste, et ne depend pas de la disponibilite du serveur OSM.

const { test, expect } = require('@playwright/test');

// Fixture minimaliste imitant la reponse d'Overpass : 2 brasseries
// valides + 1 sans coordonnees (qui doit etre filtree par la regle metier).
const OVERPASS_FIXTURE = {
  version: 0.6,
  generator: 'fixture',
  elements: [
    { type: 'node',     id: 1, lat: 46.948, lon: 7.447, tags: { name: 'Brasserie de Berne' } },
    { type: 'way',      id: 2, center: { lat: 47.376, lon: 8.541 }, tags: { name: 'Brasserie de Zurich' } },
    { type: 'node',     id: 3, tags: { name: 'Sans coordonnees — doit etre filtree' } },
  ],
};

// Helper : installe le mock Overpass sur toutes les requetes de la page.
async function mockOverpass(page) {
  await page.route('**/overpass.osm.ch/api/interpreter', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(OVERPASS_FIXTURE),
    })
  );
}

test('au chargement, des pins sont rendues sur la carte', async ({ page }) => {
  await mockOverpass(page);
  await page.goto('/');

  // Au moins une pin (les CircleMarker de Leaflet sont des <path> SVG
  // dans la couche .leaflet-overlay-pane).
  const pins = page.locator('.leaflet-overlay-pane path');
  await expect(pins.first()).toBeVisible();

  // 2 brasseries avec coord -> 2 pins (la 3e sans coord est filtree).
  await expect(pins).toHaveCount(2);

  // Et le compteur du footer suit.
  await expect(page.locator('.app-footer')).toHaveText('2 brasseries affichées');
});

test('au clic sur "Marquer comme visitee", la pin change de couleur', async ({ page }) => {
  await mockOverpass(page);
  await page.goto('/');

  // Etat initial : la pin est ambre (#B8651A = primary).
  const firstPin = page.locator('.leaflet-overlay-pane path').first();
  await expect(firstPin).toHaveAttribute('fill', '#B8651A');

  // Ouvre le popup et clique sur le bouton.
  await firstPin.click();
  await page.getByRole('button', { name: 'Marquer comme visitée' }).click();

  // La pin est maintenant verte (#5C7A3D = secondary, vert mousse).
  await expect(firstPin).toHaveAttribute('fill', '#5C7A3D');
});
