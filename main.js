// Carte interactive des brasseries de Suisse.
// Donnees : OpenStreetMap via l'API Overpass.

// Coordonnees approximatives du centre geographique de la Suisse
// (region d'Obwald, proche de Sachseln).
const SWITZERLAND_CENTER = [46.8, 8.3];
const INITIAL_ZOOM = 8;

const map = L.map('map').setView(SWITZERLAND_CENTER, INITIAL_ZOOM);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Couleur primary du DESIGN.md (ambre / orange-brun).
const BREWERY_COLOR = '#B8651A';

// Requete Overpass : voir query-overpass.txt.
// On veut les brasseries (craft=brewery), microbrasseries et brasseries
// industrielles dans le pays "CH". `out center` donne lat/lon pour les
// nodes et center.lat/center.lon pour les ways/relations.
// Miroir suisse d'Overpass — instance officielle (overpass-api.de)
// down au moment du developpement (2026-06-14).
const OVERPASS_URL = 'https://overpass.osm.ch/api/interpreter';
const OVERPASS_QUERY = `[out:json][timeout:90];
area["ISO3166-1"="CH"]->.ch;
(
  nwr["craft"="brewery"](area.ch);
  nwr["microbrewery"="yes"](area.ch);
  nwr["industrial"="brewery"](area.ch);
);
out center;`;

async function loadBreweries() {
  try {
    const response = await fetch(OVERPASS_URL, {
      method: 'POST',
      body: 'data=' + encodeURIComponent(OVERPASS_QUERY),
    });
    if (!response.ok) {
      throw new Error(`Statut HTTP ${response.status}`);
    }
    const data = await response.json();
    renderBreweries(data.elements);
  } catch (error) {
    showFooterError();
  }
}

function renderBreweries(elements) {
  let visibleCount = 0;
  for (const element of elements) {
    // `out center` renvoie lat/lon pour les nodes, center.lat/center.lon
    // pour les ways/relations. Une brasserie sans coordonnees n'est pas
    // affichee (regle metier).
    const lat = element.lat ?? element.center?.lat;
    const lon = element.lon ?? element.center?.lon;
    if (lat == null || lon == null) continue;

    const name = element.tags?.name ?? 'Brasserie sans nom';
    L.circleMarker([lat, lon], {
      radius: 7,
      color: BREWERY_COLOR,
      fillColor: BREWERY_COLOR,
      fillOpacity: 0.85,
      weight: 2,
    })
      .bindPopup(name)
      .addTo(map);
    visibleCount += 1;
  }
  updateFooter(`${visibleCount} brasseries affichées`);
}

function showFooterError() {
  updateFooter(
    'Impossible de charger les brasseries — vérifiez votre connexion réseau.'
  );
}

function updateFooter(message) {
  const footer = document.querySelector('.app-footer');
  if (footer) footer.textContent = message;
}

loadBreweries();
