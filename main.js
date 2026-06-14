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

// Couleur primary du DESIGN.md (ambre / orange-brun) pour les brasseries
// non visitees, secondary (vert mousse) pour les visitees.
const BREWERY_COLOR = '#B8651A';
const VISITED_COLOR = '#5C7A3D';

// Tous les markers vivent dans ce groupe. Le filtre add/remove des
// markers individuels du groupe sans recreer les CircleMarker.
const breweriesLayer = L.layerGroup().addTo(map);

// Liste des brasseries en memoire. Chaque entree :
//   { id, name, marker, searchableName }
// id : identifiant OSM (string) — sert de cle dans localStorage.
// searchableName : nom pre-normalise (minuscules + sans accents).
const breweries = [];

// Persistence de l'etat "visitee" : un Set d'IDs OSM serialise en tableau
// dans localStorage sous la cle "visited_breweries".
const VISITED_STORAGE_KEY = 'visited_breweries';
const visitedIds = loadVisitedIds();

function loadVisitedIds() {
  try {
    const raw = localStorage.getItem(VISITED_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveVisitedIds() {
  localStorage.setItem(VISITED_STORAGE_KEY, JSON.stringify([...visitedIds]));
}

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
  for (const element of elements) {
    // `out center` renvoie lat/lon pour les nodes, center.lat/center.lon
    // pour les ways/relations. Une brasserie sans coordonnees n'est pas
    // affichee (regle metier).
    const lat = element.lat ?? element.center?.lat;
    const lon = element.lon ?? element.center?.lon;
    if (lat == null || lon == null) continue;

    const id = String(element.id);
    const name = element.tags?.name ?? 'Brasserie sans nom';
    const color = visitedIds.has(id) ? VISITED_COLOR : BREWERY_COLOR;

    const marker = L.circleMarker([lat, lon], {
      radius: 7,
      color,
      fillColor: color,
      fillOpacity: 0.85,
      weight: 2,
    }).addTo(breweriesLayer);

    const brewery = { id, name, marker, searchableName: searchable(name) };
    // Fonction (pas string) : Leaflet la rappelle a chaque ouverture du
    // popup, donc le label du bouton reflete toujours l'etat courant.
    marker.bindPopup(() => createPopupContent(brewery));
    breweries.push(brewery);
  }
  applyFilter('');
}

function createPopupContent(brewery) {
  const visited = visitedIds.has(brewery.id);

  const container = document.createElement('div');
  container.className = 'brewery-popup';

  const title = document.createElement('p');
  title.className = 'brewery-popup__name';
  title.textContent = brewery.name;
  container.appendChild(title);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'visited-button';
  button.textContent = visited
    ? 'Marquer comme non visitée'
    : 'Marquer comme visitée';
  button.addEventListener('click', () => toggleVisited(brewery));
  container.appendChild(button);

  return container;
}

function toggleVisited(brewery) {
  const willBeVisited = !visitedIds.has(brewery.id);
  if (willBeVisited) {
    visitedIds.add(brewery.id);
  } else {
    visitedIds.delete(brewery.id);
  }
  saveVisitedIds();

  const color = willBeVisited ? VISITED_COLOR : BREWERY_COLOR;
  brewery.marker.setStyle({ color, fillColor: color });

  // Met a jour le contenu du popup affiche (regenere le bouton avec le bon
  // label "Marquer comme non visitee" / "Marquer comme visitee").
  brewery.marker.setPopupContent(createPopupContent(brewery));
}

// Decompose les caracteres accentues (NFD) puis supprime les diacritiques
// pour qu'une recherche "lorrach" matche "Lörrach". On passe en minuscules
// pour l'insensibilite a la casse.
function searchable(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function applyFilter(query) {
  const needle = searchable(query.trim());
  let visibleCount = 0;
  for (const { marker, searchableName } of breweries) {
    if (needle === '' || searchableName.includes(needle)) {
      breweriesLayer.addLayer(marker);
      visibleCount += 1;
    } else {
      breweriesLayer.removeLayer(marker);
    }
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

// Filtre temps reel : "input" (pas "change") pour reagir a chaque frappe.
document.getElementById('search').addEventListener('input', (event) => {
  applyFilter(event.target.value);
});

loadBreweries();
