// Kopiert D3 und topojson-client aus node_modules nach public/lib
import { copyFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
const require = createRequire(import.meta.url);
const pkg = name => dirname(require.resolve(name + '/package.json'));
const out = new URL('../public/lib/', import.meta.url).pathname;
copyFileSync(join(pkg('d3'), 'dist/d3.min.js'), join(out, 'd3.min.js'));
copyFileSync(join(pkg('topojson-client'), 'dist/topojson-client.min.js'), join(out, 'topojson-client.min.js'));
console.log('Bibliotheken nach public/lib kopiert');
