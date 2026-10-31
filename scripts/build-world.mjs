// Erzeugt public/data/world.json aus world-atlas (Natural Earth 1:50m)
// und ersetzt die numerischen IDs durch ISO-3166 Alpha-2-Codes.
// Aufruf: npm install && npm run build:map
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const iso = require('i18n-iso-countries');
const topo = JSON.parse(readFileSync(require.resolve('world-atlas/countries-50m.json'), 'utf8'));

// Gebiete ohne ISO-Nummer in Natural Earth
const SPECIAL = { 'Somaliland': 'SO', 'Kosovo': 'XK', 'N. Cyprus': 'NCY', 'Indian Ocean Ter.': 'CX', 'Siachen Glacier': null };

for (const g of topo.objects.countries.geometries) {
  const a2 = g.id === undefined ? SPECIAL[g.properties.name] : iso.numericToAlpha2(g.id);
  if (a2 === undefined) console.warn('Kein ISO-Code für', g.id, g.properties.name);
  g.id = a2 || 'XX';
  g.properties = { n: g.properties.name };
}
writeFileSync(new URL('../public/data/world.json', import.meta.url), JSON.stringify(topo));
console.log('public/data/world.json geschrieben');
