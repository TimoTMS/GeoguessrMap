# 🌍 GeoGuessr-Erkennungshilfen – interaktive Weltkarte

Interaktive Weltkarte mit Merkmalen, an denen man Länder in GeoGuessr erkennt: Fahrtrichtung, Schrift,
Straßenlinien, Kennzeichen, Leitpfosten, Strommasten u. v. m. Rein statisch (HTML/CSS/JS), kein Build nötig –
ideal für **Cloudflare Pages**.

## Funktionen
- **12 Kartenmodi**: Fahrtrichtung, Street-View-Abdeckung, Schrift, Sprache, Mittellinie, Randlinie,
  Kennzeichen, Einheit (mph/km/h), Stoppschild, Warnschild, Leitpfosten, Strommasten
- **Bildkatalog** (schematische SVG-Zeichnungen) – Bild anklicken → passende Länder werden hervorgehoben
- **Filter / Ausschlussverfahren**: mehrere Merkmale kombinieren → passende Länder
- **Länder-Infos**: Sprache, Sonderzeichen, Domain, Vorwahl, Tipps, Links (Plonk It, Maps, Wikipedia, Commons)
- Suche, Zoom, Legende ein-/ausblendbar, „nur Street-View-Länder“, Mobil-Layout, Direktlinks (`#m=plate`)

## Ordnerstruktur
```
geoguessr-karte/
├── public/                  ← das ist die Website (wird veröffentlicht)
│   ├── index.html
│   ├── _headers             Cache-Regeln für Cloudflare
│   ├── css/style.css
│   ├── js/
│   │   ├── data.js          Länderdaten  ← hier Inhalte ergänzen
│   │   ├── features.js      Kartenmodi, Farben, Bildkatalog (SVG)
│   │   └── app.js           Kartenlogik
│   ├── lib/                 D3 + topojson-client (lokal, kein CDN nötig)
│   ├── data/world.json      Weltkarte (Natural Earth 1:50m, ISO-Codes)
│   └── img/                 eigene Fotos (optional)
├── scripts/
│   ├── build-world.mjs      erzeugt data/world.json neu
│   └── update-libs.mjs      kopiert aktuelle Bibliotheken nach public/lib
├── package.json
├── wrangler.toml            Cloudflare-Pages-Konfiguration
├── LICENSE
└── THIRD_PARTY_NOTICES.md
```

## Lokal starten
```bash
npm run dev
```
oder ohne Node: `cd public && python3 -m http.server 8000` → http://localhost:8000

## Auf GitHub pushen
```bash
git remote add origin https://github.com/<DEIN-NAME>/geoguessr-karte.git
git push -u origin main
```

## Mit Cloudflare Pages veröffentlichen
**Über GitHub (empfohlen, automatische Updates bei jedem Push):**
Cloudflare Dashboard → *Workers & Pages* → *Create* → *Pages* → *Connect to Git* → Repo wählen →
- Framework preset: **None**
- Build command: **leer lassen**
- Build output directory: **`public`**

**Oder direkt per Wrangler:** `npm run deploy`

## Daten erweitern
- Neues Land / Tipp: `public/js/data.js` – Objekt mit ISO-Code als Schlüssel (Felder sind oben in der Datei erklärt)
- Neuer Pfosten/Mast im Katalog: `public/js/features.js` → `CATALOG.bollards.items` / `CATALOG.poles.items`,
  danach im Land `bollard: ['id']` bzw. `pole: ['id']` eintragen
- Eigene Fotos: siehe `public/img/README.txt`

## Hinweise
Vereinfachte Faustregeln, keine Garantie – die Meta ändert sich mit neuen Aufnahmen.
Recherche-Stand: Oktober 2026.
