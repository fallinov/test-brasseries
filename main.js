// Carte interactive des brasseries de Suisse.
// Pour l'instant : carte centree sur la Suisse, tuiles OpenStreetMap.
// Les marqueurs des brasseries seront ajoutes dans une PR suivante.

// Coordonnees approximatives du centre geographique de la Suisse
// (region d'Obwald, proche de Sachseln).
const SWITZERLAND_CENTER = [46.8, 8.3];
const INITIAL_ZOOM = 8;

const map = L.map('map').setView(SWITZERLAND_CENTER, INITIAL_ZOOM);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
