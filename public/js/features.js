/* =====================================================================
   Merkmale (Kartenmodi) + Bildkatalog (schematische SVG-Zeichnungen)
   Die Zeichnungen sind vereinfachte Skizzen – für echte Fotos siehe
   Links im Info-Panel oder eigene Bilder unter /img/ (siehe README).
   ===================================================================== */

const GREY = '#3a4452';

const FEATURES = [
  { key: 'drive', label: 'Fahrtrichtung',
    get: c => c.d,
    values: { L: { label: 'Linksverkehr', color: '#e8613a' }, R: { label: 'Rechtsverkehr', color: '#8fb3dc' } } },
  { key: 'coverage', label: 'Street View',
    get: c => c.cov,
    values: { full: { label: 'Abgedeckt', color: '#4caf7a' }, partial: { label: 'Teilweise / eingeschränkt', color: '#e3c04a' },
              spots: { label: 'Nur Einzelorte / Trekker', color: '#b0703a' } } },
  { key: 'script', label: 'Schrift',
    get: c => c.script,
    values: {
      latin: { label: 'Lateinisch', color: '#8fb3dc' }, cyrillic: { label: 'Kyrillisch', color: '#e8613a' },
      latcyr: { label: 'Latein + Kyrillisch', color: '#f2a57f' }, greek: { label: 'Griechisch', color: '#3f7fd1' },
      arabic: { label: 'Arabisch', color: '#4caf7a' }, latarab: { label: 'Arabisch + Latein', color: '#9ed6b1' },
      hebrew: { label: 'Hebräisch', color: '#c9a0ff' }, georgian: { label: 'Georgisch', color: '#ff7eb6' },
      armenian: { label: 'Armenisch', color: '#ffb3d6' }, thai: { label: 'Thai', color: '#e3c04a' },
      lao: { label: 'Laotisch', color: '#c9a23a' }, khmer: { label: 'Khmer', color: '#a88420' },
      burmese: { label: 'Birmanisch', color: '#8a6d17' }, devanagari: { label: 'Devanagari', color: '#ff9d3d' },
      bengali: { label: 'Bengalisch', color: '#ffc78a' }, sinhala: { label: 'Singhalesisch', color: '#d9772b' },
      tibetan: { label: 'Tibetisch', color: '#9c5a1f' }, hangul: { label: 'Hangul', color: '#41c7c7' },
      japanese: { label: 'Japanisch', color: '#d64f6f' }, chinese: { label: 'Chinesisch', color: '#b02a3a' },
      ethiopic: { label: 'Äthiopisch', color: '#7e8f3a' }, thaana: { label: 'Thaana', color: '#6b6bd6' } } },
  { key: 'lang', label: 'Sprache',
    get: c => c.langfam,
    values: {
      en: { label: 'Englisch', color: '#8fb3dc' }, es: { label: 'Spanisch', color: '#e3c04a' }, pt: { label: 'Portugiesisch', color: '#4caf7a' },
      fr: { label: 'Französisch', color: '#3f7fd1' }, de: { label: 'Deutsch', color: '#e8613a' }, slav: { label: 'Slawisch / Kyrillisch', color: '#c9a0ff' },
      nord: { label: 'Nordisch / Baltisch', color: '#41c7c7' }, ar: { label: 'Arabisch', color: '#9ed6b1' },
      other_eu: { label: 'Andere europ./nahöstl.', color: '#f2a57f' }, asia: { label: 'Asiatische Sprachen', color: '#d64f6f' },
      other: { label: 'Sonstige', color: '#888' } } },
  { key: 'center', label: 'Mittellinie',
    get: c => c.center,
    values: { yellow: { label: 'Gelb', color: '#f2c94c' }, white: { label: 'Weiß', color: '#e6edf5' }, mixed: { label: 'Gemischt (gelb + weiß)', color: '#b8a560' } } },
  { key: 'edge', label: 'Randlinie',
    get: c => c.edge,
    values: { yellow: { label: 'Gelb (ganz/teilweise)', color: '#f2c94c' }, white: { label: 'Weiß', color: '#e6edf5' } } },
  { key: 'plate', label: 'Kennzeichen',
    get: c => c.plate,
    values: {
      strip: { label: 'Weiß mit blauem Streifen (EU u. a.)', color: '#3f7fd1' }, mercosur: { label: 'Mercosur (blauer Balken oben)', color: '#41c7c7' },
      yellowBoth: { label: 'Gelb vorne + hinten', color: '#f2c94c' }, yellowRear: { label: 'Vorne weiß, hinten gelb', color: '#e8913a' },
      black: { label: 'Schwarz', color: '#111' }, white: { label: 'Weiß (ohne Streifen)', color: '#e6edf5' },
      varies: { label: 'Variiert (Bundesstaat/Provinz)', color: '#9a7fd1' } } },
  { key: 'speed', label: 'Einheit',
    get: c => c.speed,
    values: { mph: { label: 'Meilen (mph)', color: '#e8613a' }, kmh: { label: 'Kilometer (km/h)', color: '#8fb3dc' } } },
  { key: 'stop', label: 'Stoppschild',
    get: c => c.stop,
    values: {
      STOP: { label: '"STOP"', color: '#d64f4f' }, ALTO: { label: '"ALTO"', color: '#e3c04a' }, PARE: { label: '"PARE"', color: '#4caf7a' },
      DUR: { label: '"DUR"', color: '#ff7eb6' }, local: { label: 'Landessprache (BERHENTI, قف, 停 …)', color: '#c9a0ff' },
      jp: { label: 'Dreieck "止まれ"', color: '#41c7c7' }, hand: { label: 'Hand-Symbol', color: '#3f7fd1' } } },
  { key: 'warn', label: 'Warnschild',
    get: c => c.warn,
    values: { triW: { label: 'Dreieck, weiß', color: '#e6edf5' }, triY: { label: 'Dreieck, gelb', color: '#f2c94c' }, diamond: { label: 'Gelbe Raute', color: '#e8913a' } } },
  { key: 'bollard', label: 'Leitpfosten', catalog: 'bollards',
    get: c => (c.bollard && c.bollard.length ? 'yes' : undefined),
    values: { yes: { label: 'Pfosten im Katalog – Bild anklicken zum Hervorheben', color: '#8fb3dc' } } },
  { key: 'pole', label: 'Strommasten', catalog: 'poles',
    get: c => (c.pole && c.pole.length ? 'yes' : undefined),
    values: { yes: { label: 'Masten im Katalog – Bild anklicken zum Hervorheben', color: '#8fb3dc' } } },
];

/* ---------------------------------------------------------------------
   SVG-Helfer
   --------------------------------------------------------------------- */
const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
const ground = (w, h) => `<rect x="0" y="${h - 10}" width="${w}" height="10" fill="#4a5a3a"/>`;

// Leitpfosten: Grundform + Elemente
function bollardSVG({ post = '#f4f4f4', top = null, diag = null, refl = [], shape = 'rect', bands = [] }) {
  let s = '';
  const x = 30, w = 40, y = 20, h = 130;
  if (shape === 'round') s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="${post}" stroke="#222" stroke-width="1.5"/>`;
  else if (shape === 'wedge') s += `<path d="M${x} ${y + 12} L${x + w} ${y} L${x + w} ${y + h} L${x} ${y + h} Z" fill="${post}" stroke="#222" stroke-width="1.5"/>`;
  else if (shape === 'flat') s += `<rect x="${x + 8}" y="${y}" width="${w - 16}" height="${h}" fill="${post}" stroke="#222" stroke-width="1.5"/>`;
  else s += `<path d="M${x} ${y + 8} Q${x + w / 2} ${y - 4} ${x + w} ${y + 8} L${x + w} ${y + h} L${x} ${y + h} Z" fill="${post}" stroke="#222" stroke-width="1.5"/>`;
  if (top) s += `<rect x="${shape === 'flat' ? x + 8 : x}" y="${y}" width="${shape === 'flat' ? w - 16 : w}" height="${top.h || 30}" fill="${top.color}" ${shape === 'round' ? 'rx="18"' : ''}/>`;
  if (diag) s += `<path d="M${x} ${y + 20} L${x + w} ${y + 6} L${x + w} ${y + 6 + diag.h} L${x} ${y + 20 + diag.h} Z" fill="${diag.color}"/>`;
  bands.forEach(b => (s += `<rect x="${x}" y="${b.y}" width="${w}" height="${b.h}" fill="${b.color}"/>`));
  refl.forEach(r => {
    if (r.circle) s += `<circle cx="${r.x}" cy="${r.y}" r="${r.r || 5}" fill="${r.color}" stroke="#333" stroke-width=".8"/>`;
    else s += `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="1.5" fill="${r.color}" stroke="#333" stroke-width=".8"/>`;
  });
  return svg(100, 160, s + ground(100, 160));
}

// Strommast-Zeichnungen
const wires = (y1, y2) => `<path d="M0 ${y1} Q50 ${y1 + 8} 100 ${y2}" stroke="#222" stroke-width="1" fill="none"/>`;
const POLE_SVG = {
  concrete_holes: svg(100, 160, `${wires(28, 30)}${wires(36, 38)}<rect x="40" y="18" width="20" height="132" fill="#b9b4a8" stroke="#555"/>` +
    Array.from({ length: 12 }, (_, i) => `<ellipse cx="50" cy="${30 + i * 10}" rx="5" ry="3.5" fill="#33302a"/>`).join('') + ground(100, 160)),
  concrete_holes_high: svg(100, 160, `${wires(28, 30)}${wires(36, 38)}<rect x="40" y="18" width="20" height="132" fill="#b9b4a8" stroke="#555"/>` +
    Array.from({ length: 9 }, (_, i) => `<ellipse cx="50" cy="${30 + i * 10}" rx="5" ry="3.5" fill="#33302a"/>`).join('') +
    `<text x="64" y="138" font-size="8" fill="#ddd">≈50 cm</text>` + ground(100, 160)),
  white_base: svg(100, 160, `${wires(28, 30)}<rect x="42" y="18" width="16" height="132" fill="#9e9a92" stroke="#555"/><rect x="42" y="115" width="16" height="35" fill="#f4f4f4"/>` +
    `<rect x="30" y="26" width="40" height="5" fill="#666"/>` + ground(100, 160)),
  concrete_ladder: svg(100, 160, `${wires(28, 30)}<path d="M42 18 L58 18 L60 150 L40 150 Z" fill="#c5c0b4" stroke="#555"/>` +
    Array.from({ length: 6 }, (_, i) => `<rect x="45" y="${60 + i * 14}" width="10" height="7" fill="#2d2a25"/>`).join('') +
    `<rect x="28" y="24" width="44" height="5" fill="#777"/>` + ground(100, 160)),
  wood_eu: svg(100, 160, `${wires(30, 32)}${wires(40, 42)}<rect x="45" y="16" width="10" height="134" fill="#7a5a3a" stroke="#4a3520"/><rect x="30" y="28" width="40" height="5" fill="#5c4128"/>` +
    `<circle cx="33" cy="26" r="3" fill="#ddd"/><circle cx="67" cy="26" r="3" fill="#ddd"/>` + ground(100, 160)),
  wood_nordic: svg(100, 160, `${wires(30, 32)}<path d="M38 150 L48 18 L52 18 L62 150" stroke="#6b4f33" stroke-width="7" fill="none"/>` +
    `<rect x="28" y="26" width="44" height="5" fill="#5c4128"/><circle cx="31" cy="24" r="3" fill="#ddd"/><circle cx="50" cy="22" r="3" fill="#ddd"/><circle cx="69" cy="24" r="3" fill="#ddd"/>` + ground(100, 160)),
  wood_na: svg(100, 160, `${wires(26, 28)}${wires(60, 62)}<rect x="45" y="12" width="10" height="138" fill="#6b4f33"/><rect x="26" y="22" width="48" height="5" fill="#5c4128"/>` +
    `<rect x="56" y="40" width="14" height="22" rx="4" fill="#8a9099" stroke="#444"/>` + ground(100, 160)),
  wood_south: svg(100, 160, `${wires(28, 30)}<rect x="46" y="14" width="8" height="136" fill="#7a5a3a"/><path d="M30 30 L50 24 L70 30" stroke="#555" stroke-width="3" fill="none"/>` + ground(100, 160)),
  stobie: svg(100, 160, `${wires(26, 28)}<path d="M41 14 L59 14 L61 150 L39 150 Z" fill="#a8a59f" stroke="#555"/><rect x="41" y="14" width="3" height="136" fill="#555"/><rect x="56" y="14" width="3" height="136" fill="#555"/>` +
    `<rect x="28" y="22" width="44" height="5" fill="#777"/>` + ground(100, 160)),
  jp: svg(100, 160, `${wires(24, 26)}${wires(34, 36)}<rect x="44" y="12" width="12" height="138" fill="#b8b4ac" stroke="#666"/>` +
    `<line x1="50" y1="40" x2="88" y2="150" stroke="#333" stroke-width="1.5"/>` +
    `<g transform="rotate(-19 80 128)">` + Array.from({ length: 6 }, (_, i) => `<rect x="76" y="${105 + i * 7}" width="8" height="7" fill="${i % 2 ? '#111' : '#f2c94c'}"/>`).join('') + `</g>` +
    `<rect x="40" y="70" width="20" height="26" fill="#f4f4f4" stroke="#666"/><text x="50" y="86" font-size="7" text-anchor="middle">東京</text>` + ground(100, 160)),
  th: svg(100, 160, `${wires(20, 24)}${wires(26, 30)}${wires(32, 36)}${wires(38, 40)}${wires(44, 46)}<rect x="42" y="12" width="16" height="138" fill="#bdb8ae" stroke="#666"/>` +
    Array.from({ length: 10 }, (_, i) => `<rect x="48" y="${50 + i * 9}" width="4" height="5" fill="#333"/>`).join('') + ground(100, 160)),
  br: svg(100, 160, `${wires(26, 28)}<path d="M42 14 L58 14 L60 150 L40 150 Z" fill="#c5c0b4" stroke="#555"/>` +
    Array.from({ length: 7 }, (_, i) => `<rect x="44" y="${92 + i * 8}" width="12" height="5" fill="#2d2a25"/>`).join('') +
    `<rect x="30" y="22" width="40" height="5" fill="#777"/>` + ground(100, 160)),
  mx: svg(100, 160, `${wires(26, 28)}<path d="M43 14 L57 14 L59 150 L41 150 Z" fill="#cfcac0" stroke="#555"/><line x1="46" y1="14" x2="45" y2="150" stroke="#999"/><line x1="54" y1="14" x2="55" y2="150" stroke="#999"/>` +
    `<rect x="30" y="22" width="40" height="5" fill="#777"/><text x="50" y="125" font-size="7" text-anchor="middle" fill="#333">8-eckig</text>` + ground(100, 160)),
  ar: svg(100, 160, `${wires(26, 28)}<path d="M36 150 L48 18 M64 150 L52 18" stroke="#6b4f33" stroke-width="7" fill="none"/><rect x="36" y="80" width="28" height="4" fill="#5c4128"/>` +
    `<rect x="30" y="24" width="40" height="5" fill="#5c4128"/>` + ground(100, 160)),
};

// Kennzeichen
function plateSVG(bg, text, opt = {}) {
  let s = `<rect x="4" y="4" width="152" height="36" rx="4" fill="${bg}" stroke="#222" stroke-width="2"/>`;
  if (opt.strip) s += `<rect x="6" y="6" width="16" height="32" fill="#1f4ea8"/><text x="14" y="34" font-size="8" fill="#fff" text-anchor="middle">${opt.strip}</text>` +
    `<circle cx="14" cy="15" r="4" fill="none" stroke="#f2c94c" stroke-dasharray="1.5 1.5"/>`;
  if (opt.top) s += `<rect x="6" y="6" width="148" height="8" fill="#1f4ea8"/><text x="80" y="13" font-size="6" fill="#fff" text-anchor="middle">${opt.top}</text>`;
  s += `<text x="${opt.strip ? 88 : 80}" y="${opt.top ? 35 : 31}" font-size="${opt.top ? 18 : 20}" font-family="monospace" font-weight="bold" text-anchor="middle" fill="${opt.fg || '#111'}">${text}</text>`;
  return svg(160, 44, s);
}
const PLATE_SVG = {
  strip: plateSVG('#f8f8f8', 'B AB 1234', { strip: 'D' }),
  mercosur: plateSVG('#f8f8f8', 'ABC1D23', { top: 'BRASIL' }),
  yellowBoth: plateSVG('#f2c94c', 'AB-123-C'),
  yellowRear: plateSVG('#f8f8f8', 'AB12 CDE') + plateSVG('#f2c94c', 'AB12 CDE'),
  black: plateSVG('#151515', 'WXY 1234', { fg: '#f4f4f4' }),
  white: plateSVG('#f8f8f8', 'A 123 BC'),
  varies: plateSVG('#e9eef5', 'CALIFORNIA', { fg: '#1f3c88' }),
};

// Stoppschilder
const octagon = (txt, size = 22, fill = '#c8102e') => svg(100, 100,
  `<polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" fill="${fill}" stroke="#fff" stroke-width="4"/>` +
  `<text x="50" y="${50 + size / 3}" font-size="${size}" font-weight="bold" fill="#fff" text-anchor="middle" font-family="Arial">${txt}</text>`);
const STOP_SVG = {
  STOP: octagon('STOP'), ALTO: octagon('ALTO'), PARE: octagon('PARE'), DUR: octagon('DUR'),
  local: octagon('BERHENTI', 13),
  jp: svg(100, 100, `<polygon points="4,8 96,8 50,94" fill="#c8102e" stroke="#fff" stroke-width="4"/><text x="50" y="38" font-size="15" font-weight="bold" fill="#fff" text-anchor="middle">止まれ</text>`),
  hand: svg(100, 100, `<polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" fill="#c8102e" stroke="#fff" stroke-width="4"/>` +
    `<path d="M38 72 L36 44 Q36 40 40 40 L41 58 L42 32 Q42 28 46 28 L47 56 L48 26 Q48 22 52 22 L53 56 L55 30 Q55 26 59 26 L59 60 L64 50 Q67 46 70 50 L60 74 Q56 80 48 80 Z" fill="#fff"/>`),
};
const WARN_SVG = {
  triW: svg(100, 100, `<polygon points="50,6 96,92 4,92" fill="#fff" stroke="#c8102e" stroke-width="8" stroke-linejoin="round"/><text x="50" y="80" font-size="40" font-weight="bold" text-anchor="middle">!</text>`),
  triY: svg(100, 100, `<polygon points="50,6 96,92 4,92" fill="#f2c94c" stroke="#c8102e" stroke-width="8" stroke-linejoin="round"/><text x="50" y="80" font-size="40" font-weight="bold" text-anchor="middle">!</text>`),
  diamond: svg(100, 100, `<polygon points="50,3 97,50 50,97 3,50" fill="#f2c94c" stroke="#111" stroke-width="4"/><text x="50" y="66" font-size="40" font-weight="bold" text-anchor="middle">!</text>`),
};
const LINE_SVG = {
  center_yellow: svg(160, 90, `<rect width="160" height="90" fill="#555"/><rect x="0" y="40" width="160" height="3" fill="#f2c94c"/><rect x="0" y="46" width="160" height="3" fill="#f2c94c"/><rect y="6" width="160" height="2" fill="#eee"/><rect y="82" width="160" height="2" fill="#eee"/>`),
  center_white: svg(160, 90, `<rect width="160" height="90" fill="#555"/>` + Array.from({ length: 5 }, (_, i) => `<rect x="${i * 36}" y="43" width="22" height="3" fill="#eee"/>`).join('') + `<rect y="6" width="160" height="2" fill="#eee"/><rect y="82" width="160" height="2" fill="#eee"/>`),
  center_mixed: svg(160, 90, `<rect width="160" height="90" fill="#555"/>` + Array.from({ length: 5 }, (_, i) => `<rect x="${i * 36}" y="40" width="22" height="3" fill="#eee"/>`).join('') + `<rect x="0" y="47" width="160" height="3" fill="#f2c94c"/><rect y="6" width="160" height="2" fill="#eee"/><rect y="82" width="160" height="2" fill="#eee"/>`),
  edge_yellow: svg(160, 90, `<rect width="160" height="90" fill="#555"/>` + Array.from({ length: 5 }, (_, i) => `<rect x="${i * 36}" y="43" width="22" height="3" fill="#eee"/>`).join('') + `<rect y="6" width="160" height="3" fill="#f2c94c"/><rect y="81" width="160" height="3" fill="#f2c94c"/>`),
  edge_white: svg(160, 90, `<rect width="160" height="90" fill="#555"/>` + Array.from({ length: 5 }, (_, i) => `<rect x="${i * 36}" y="43" width="22" height="3" fill="#eee"/>`).join('') + `<rect y="6" width="160" height="3" fill="#eee"/><rect y="81" width="160" height="3" fill="#eee"/>`),
};

/* ---------------------------------------------------------------------
   Bildkatalog
   Jede Gruppe hat Items. Länderzuordnung:
     - bollards/poles: über C[land].bollard / .pole
     - feature-Gruppen: über das Merkmal (feature + value)
   --------------------------------------------------------------------- */
const W = '#f4f4f4', B = '#151515', R = '#d1202f', DR = '#7a1420', O = '#f08a1c', Y = '#f2c94c';
const CATALOG = {
  bollards: {
    title: 'Leitpfosten', items: [
      { id: 'de', name: 'Deutschland', svg: bollardSVG({ diag: { color: B, h: 26 }, refl: [{ x: 47, y: 30, w: 7, h: 18, color: W }] }),
        desc: 'Weiß, schräger schwarzer Streifen. Vorn ein weißer, senkrechter Rechteck-Reflektor, hinten zwei runde weiße Reflektoren.' },
      { id: 'at', name: 'Österreich', svg: bollardSVG({ top: { color: B, h: 34 }, refl: [{ x: 44, y: 26, w: 12, h: 20, color: DR }] }),
        desc: 'Weiß mit schwarzer Kappe. Vorn dunkler (dunkelroter/fast schwarzer) Reflektor. Hellrot kommt auch vor, ist aber typischer für Slowenien.' },
      { id: 'si', name: 'Slowenien / Montenegro / Bosnien', svg: bollardSVG({ top: { color: B, h: 34 }, refl: [{ x: 44, y: 26, w: 12, h: 20, color: '#ff3b3b' }] }),
        desc: 'Wie Österreich, aber der Reflektor ist hellrot und sitzt mittig.' },
      { id: 'rs', name: 'Serbien', svg: bollardSVG({ top: { color: B, h: 34 }, refl: [{ x: 33, y: 26, w: 10, h: 20, color: '#ff3b3b' }] }),
        desc: 'Ähnlich Slowenien, aber das rote Rechteck sitzt seitlich versetzt (links).' },
      { id: 'hu', name: 'Ungarn / Kroatien / Bulgarien / N.-Mazedonien', svg: bollardSVG({ bands: [{ y: 28, h: 26, color: B }], refl: [{ x: 43, y: 32, w: 14, h: 18, color: R }] }),
        desc: 'Weißer Pfosten, schwarzes Band, rotes Rechteck vorn.' },
      { id: 'ua', name: 'Ukraine', svg: bollardSVG({ bands: [{ y: 28, h: 26, color: B }], refl: [{ x: 35, y: 32, w: 30, h: 16, color: R }] }),
        desc: 'Ähnlich Ungarn, aber das rote Rechteck ist deutlich breiter; oft verwittert.' },
      { id: 'it', name: 'Italien / Albanien', svg: bollardSVG({ shape: 'flat', diag: { color: B, h: 30 }, refl: [{ x: 45, y: 32, w: 10, h: 14, color: R }] }),
        desc: 'Eckiger weißer Pfosten mit schwarzem Diagonalstreifen, roter Reflektor vorn. Albanien identisch.' },
      { id: 'fr', name: 'Frankreich', svg: bollardSVG({ diag: { color: B, h: 26 }, refl: [{ x: 44, y: 30, w: 12, h: 14, color: O }] }),
        desc: 'Weiß mit schwarzem Band und gelb-orangem Rechteck-Reflektor vorn, hinten weiß. (Quellen widersprechen sich teils – rot kommt ebenfalls vor.)' },
      { id: 'es', name: 'Spanien', svg: bollardSVG({ shape: 'wedge', diag: { color: B, h: 22 }, refl: [{ x: 44, y: 28, w: 12, h: 14, color: O }] }),
        desc: 'Keilförmig, schwarzes Band, oranger/gelber Reflektor vorn, hinten zwei runde weiße Reflektoren.' },
      { id: 'pt', name: 'Portugal', svg: bollardSVG({ refl: [{ x: 44, y: 30, w: 12, h: 18, color: R }], top: { color: R, h: 6 } }),
        desc: 'Weiß mit rotem Reflektor (meist ohne schwarzes Band).' },
      { id: 'pl', name: 'Polen', svg: bollardSVG({ bands: [{ y: 26, h: 22, color: R }] }),
        desc: 'Weiß mit großem roten Reflektor, der um den Pfosten herumläuft; hinten weißer Reflektor.' },
      { id: 'cz', name: 'Tschechien / Slowakei', svg: bollardSVG({ diag: { color: B, h: 28 }, refl: [{ x: 38, y: 30, w: 8, h: 12, color: O }, { x: 54, y: 27, w: 8, h: 12, color: O }] }),
        desc: 'Weiß mit schwarzem Streifen und zwei orangen Reflektoren ("geteilter Reflektor").' },
      { id: 'gr', name: 'Griechenland', svg: bollardSVG({ shape: 'wedge', bands: [{ y: 28, h: 24, color: B }], refl: [{ x: 44, y: 31, w: 12, h: 16, color: R }] }),
        desc: 'Keilförmig mit rechteckigem Reflektor: vorn rot, hinten weiß.' },
      { id: 'tr', name: 'Türkei', svg: bollardSVG({ refl: [{ x: 40, y: 28, w: 20, h: 20, color: R }] }),
        desc: 'Weiß mit dickem roten Rechteck – ähnlich Australien/Niederlande, aber breiter.' },
      { id: 'nl', name: 'Niederlande', svg: bollardSVG({ refl: [{ x: 45, y: 30, w: 10, h: 18, color: R }] }),
        desc: 'Weiß mit schmalem roten Reflektor vorn. Besser: grüne Hektometerschilder & rote Radwege beachten.' },
      { id: 'dk', name: 'Dänemark', svg: bollardSVG({ refl: [{ x: 40, y: 26, w: 20, h: 30, color: Y }] }),
        desc: 'Weiß mit großem gelben Abschnitt vorn, der hinten fehlt.' },
      { id: 'no', name: 'Norwegen', svg: bollardSVG({ post: B, refl: [{ x: 45, y: 30, w: 10, h: 12, color: Y }] }),
        desc: 'Schwarzer Pfosten mit kurzem gelben Reflektor.' },
      { id: 'se', name: 'Schweden', svg: bollardSVG({ post: B, bands: [{ y: 60, h: 90, color: W }], refl: [{ x: 45, y: 28, w: 10, h: 22, color: '#bbb' }] }),
        desc: 'Schwarz-weiß mit grauem/weißem Reflektor; Formen variieren (Keil, rund, dünn gebogen).' },
      { id: 'fi', name: 'Finnland', svg: bollardSVG({ post: B, shape: 'round', refl: [{ x: 45, y: 32, w: 10, h: 20, color: '#eee' }] }),
        desc: 'Wirkt von vorn zylindrisch (rund) – einzigartig im Norden.' },
      { id: 'is', name: 'Island', svg: bollardSVG({ post: Y, refl: [{ x: 45, y: 28, w: 10, h: 18, color: W }] }),
        desc: 'Gelber Pfosten mit weißem Reflektor.' },
      { id: 'ee', name: 'Estland', svg: bollardSVG({ shape: 'round', top: { color: B, h: 30 }, refl: [{ x: 45, y: 28, w: 10, h: 16, color: W }] }),
        desc: 'Zylindrisch, vorn rechteckiger, hinten zwei runde Reflektoren.' },
      { id: 'lv', name: 'Lettland', svg: bollardSVG({ shape: 'flat', diag: { color: B, h: 30 }, refl: [{ x: 46, y: 26, w: 8, h: 20, color: Y }] }),
        desc: 'Dünn und flach, weißer oder gelber senkrechter Reflektor in schrägem schwarzen Rahmen; hinten zwei runde.' },
      { id: 'lt', name: 'Litauen', svg: bollardSVG({ shape: 'wedge', bands: [{ y: 28, h: 24, color: B }], refl: [{ x: 44, y: 31, w: 12, h: 16, color: O }] }),
        desc: 'Keilförmig, orange Rechteck-Reflektoren vorn, weiße hinten.' },
      { id: 'ch', name: 'Schweiz / Liechtenstein', svg: bollardSVG({ diag: { color: B, h: 26 }, refl: [{ x: 45, y: 29, w: 10, h: 16, color: O }] }),
        desc: 'Weiß mit schwarzem Band und orange-gelbem Reflektor (ähnlich Frankreich).' },
      { id: 'gb', name: 'Großbritannien', svg: bollardSVG({ refl: [{ x: 45, y: 30, w: 10, h: 12, color: R }] }),
        desc: 'Leitpfosten eher selten; wenn, dann weiß mit rotem (links) bzw. weißem Reflektor. Besser: Katzenaugen in der Fahrbahn.' },
      { id: 'ru', name: 'Russland', svg: bollardSVG({ bands: [{ y: 24, h: 10, color: B }, { y: 48, h: 10, color: B }], refl: [{ x: 45, y: 36, w: 10, h: 10, color: R }] }),
        desc: 'Sehr uneinheitlich, oft weiß mit schwarzen Streifen. Lieber auf Kennzeichen achten.' },
      { id: 'au', name: 'Australien', svg: bollardSVG({ refl: [{ x: 45, y: 26, w: 10, h: 22, color: R }] }),
        desc: 'Weiß, vorn roter Reflektor, hinten grau/weiß.' },
      { id: 'nz', name: 'Neuseeland', svg: bollardSVG({ shape: 'flat', bands: [{ y: 24, h: 24, color: R }] }),
        desc: 'Flach, weiß mit rotem Band oben (dicker als in Australien).' },
      { id: 'za', name: 'Südafrika', svg: bollardSVG({ shape: 'flat', bands: [{ y: 24, h: 12, color: R }, { y: 48, h: 12, color: R }, { y: 72, h: 12, color: R }] }),
        desc: 'Schmale rot-weiße Pfosten/Chevrons sind sehr häufig.' },
      { id: 'mx', name: 'Mexiko', svg: bollardSVG({ shape: 'round', bands: [{ y: 128, h: 22, color: B }], top: { color: Y, h: 14 } }),
        desc: 'Weiß, "zigarettenförmig" aus Beton, schwarz am Fuß, oft gelber Abschnitt oben/hinten.' },
      { id: 'cl', name: 'Chile / Argentinien', svg: bollardSVG({ refl: [{ x: 44, y: 28, w: 12, h: 18, color: O }] }),
        desc: '"Spanischer Stil": weiß mit orangem Reflektor vorn.' },
      { id: 'ec', name: 'Ecuador', svg: bollardSVG({ shape: 'round', bands: [{ y: 32, h: 10, color: R }, { y: 50, h: 10, color: R }] }),
        desc: 'Runde Pfosten mit zwei roten Streifen.' },
      { id: 'us', name: 'USA', svg: bollardSVG({ shape: 'flat', post: '#e6e6e6', refl: [{ x: 45, y: 26, w: 10, h: 14, color: W }] }),
        desc: 'Flexible Leitpfosten (weiß/grau, teils grün) mit weißem oder gelbem Reflektor. Sehr variabel.' },
      { id: 'jp', name: 'Japan', svg: bollardSVG({ shape: 'flat', bands: [{ y: 30, h: 12, color: Y }, { y: 54, h: 12, color: Y }, { y: 78, h: 12, color: Y }], refl: [{ circle: true, x: 50, y: 14, r: 9, color: O }] }),
        desc: 'Sehr vielfältig: gelb-weiß gestreifte dünne Stangen, runde "Lollipop"-Reflektoren oben.' },
      { id: 'th', name: 'Thailand', svg: bollardSVG({ shape: 'flat', top: { color: B, h: 50 } }),
        desc: 'Quadratische Betonpfosten, schwarz-weiß gestrichen (unten weiß, oben schwarz oder gestreift).' },
      { id: 'my', name: 'Malaysia', svg: bollardSVG({ bands: [{ y: 46, h: 20, color: B }, { y: 90, h: 20, color: B }], refl: [{ x: 45, y: 26, w: 10, h: 14, color: R }] }),
        desc: 'Weiß, in mehrere Abschnitte unterteilt, teils mit rotem Rechteck-Reflektor.' },
      { id: 'id', name: 'Indonesien', svg: bollardSVG({ post: Y, bands: [{ y: 60, h: 14, color: B }, { y: 88, h: 14, color: B }, { y: 116, h: 14, color: B }], refl: [{ x: 44, y: 28, w: 12, h: 18, color: R }] }),
        desc: 'Gelb-schwarz gestreift mit rotem Rechteck oben.' },
    ] },
  poles: {
    title: 'Strommasten', items: [
      { id: 'concrete_holes', name: '"Lochmasten" bis zum Boden', svg: POLE_SVG.concrete_holes,
        desc: 'Betonmasten mit großen Löchern bis ganz unten: Ungarn (dünner) und Rumänien (breiter, oft weißer Fuß).' },
      { id: 'concrete_holes_high', name: 'Lochmasten, Löcher enden über dem Boden', svg: POLE_SVG.concrete_holes_high,
        desc: 'Polen: Löcher hören ca. 50 cm über dem Boden auf.' },
      { id: 'white_base', name: 'Betonmast mit weißem Fuß', svg: POLE_SVG.white_base,
        desc: 'Unten weiß gestrichen – typisch Ukraine, Rumänien, Russland (auch Bäume/Bordsteine).' },
      { id: 'concrete_ladder', name: 'Betonmast mit Leiter-Aussparungen', svg: POLE_SVG.concrete_ladder,
        desc: 'Frankreich (sehr häufig), auch Belgien und Portugal.' },
      { id: 'wood_eu', name: 'Holzmast (Westeuropa)', svg: POLE_SVG.wood_eu,
        desc: 'Einfacher Holzmast mit Querträger – UK, Irland, Deutschland (ländlich), Österreich, Schweiz.' },
      { id: 'wood_nordic', name: 'Holz-A-Mast (Skandinavien)', svg: POLE_SVG.wood_nordic,
        desc: 'Holzmasten, oft als A-Konstruktion mit drei Isolatoren – Norwegen, Schweden, Finnland.' },
      { id: 'wood_na', name: 'Holzmast mit Trafo-Zylinder', svg: POLE_SVG.wood_na,
        desc: 'Hohe Holzmasten mit grauen Zylinder-Transformatoren – USA, Kanada.' },
      { id: 'wood_south', name: 'Holzmast (Südl. Afrika/Australien)', svg: POLE_SVG.wood_south,
        desc: 'Schlanke Holzmasten, oft mit kurzem Querträger.' },
      { id: 'stobie', name: 'Stobie-Mast', svg: POLE_SVG.stobie,
        desc: 'Zwei Stahlträger mit Beton dazwischen – fast nur Südaustralien (Adelaide).' },
      { id: 'jp', name: 'Japan', svg: POLE_SVG.jp,
        desc: 'Betonmasten mit vielen Schildern; Abspannseile mit gelb-schwarzer Schutzhülle.' },
      { id: 'th', name: 'Thailand', svg: POLE_SVG.th,
        desc: 'Quadratische Betonmasten mit kleinen Löchern und SEHR vielen Kabeln.' },
      { id: 'br', name: 'Brasilien', svg: POLE_SVG.br,
        desc: 'Betonmast, unterer Teil leiterartig durchbrochen.' },
      { id: 'mx', name: 'Mexiko', svg: POLE_SVG.mx,
        desc: 'Achteckige Betonmasten.' },
      { id: 'ar', name: 'Argentinien', svg: POLE_SVG.ar,
        desc: 'Doppelte bzw. A-förmige Holzmasten – in Südamerika fast nur Argentinien.' },
    ] },
  plates: { title: 'Kennzeichen', feature: 'plate', svgs: PLATE_SVG },
  stop: { title: 'Stoppschilder', feature: 'stop', svgs: STOP_SVG },
  warn: { title: 'Warnschilder', feature: 'warn', svgs: WARN_SVG },
  lines: { title: 'Straßenlinien', items: [
    { id: 'center_yellow', name: 'Gelbe Mittellinie', svg: LINE_SVG.center_yellow, feature: 'center', value: 'yellow',
      desc: 'Ganz Amerika (außer Chile teils), Norwegen, Finnland, Südkorea.' },
    { id: 'center_white', name: 'Weiße Mittellinie', svg: LINE_SVG.center_white, feature: 'center', value: 'white', desc: 'Fast ganz Europa, Afrika, Australien.' },
    { id: 'center_mixed', name: 'Gemischt', svg: LINE_SVG.center_mixed, feature: 'center', value: 'mixed', desc: 'Weiß + Gelb (z. B. Überholverbot) – Japan, NZ, Thailand …' },
    { id: 'edge_yellow', name: 'Gelbe Randlinie', svg: LINE_SVG.edge_yellow, feature: 'edge', value: 'yellow', desc: 'Irland, Südliches Afrika, Malaysia, Golfstaaten (meist links), Hongkong.' },
    { id: 'edge_white', name: 'Weiße Randlinie', svg: LINE_SVG.edge_white, feature: 'edge', value: 'white', desc: 'Standard in den meisten Ländern.' },
  ] },
};

// Feature-Gruppen automatisch in Items umwandeln
['plates', 'stop', 'warn'].forEach(k => {
  const g = CATALOG[k];
  const f = FEATURES.find(x => x.key === g.feature);
  g.items = Object.entries(f.values).map(([v, def]) => ({ id: v, name: def.label, svg: g.svgs[v], feature: g.feature, value: v, desc: '' }));
});
