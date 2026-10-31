/* =====================================================================
   GeoGuessr-Erkennungshilfen – Länderdaten
   ---------------------------------------------------------------------
   Schlüssel = ISO-3166 Alpha-2. Alles hier ist bewusst vereinfacht:
   Faustregeln, keine Gesetze. Felder, die fehlen, gelten als
   "nicht erfasst" und werden auf der Karte grau dargestellt.
   Stand der Recherche: Oktober 2026.
   ===================================================================== */

// ---------- Hilfsfunktion: Liste "AA BB CC" -> {AA:val, BB:val, ...}
function assign(list, value, target = {}) {
  list.trim().split(/\s+/).forEach(c => (target[c] = value));
  return target;
}

/* ---------------------------------------------------------------------
   1) Fahrtrichtung – für ALLE Länder (Standard: rechts)
   --------------------------------------------------------------------- */
const LEFT_HAND = `GB IE MT CY NCY IM JE GG
  JP IN PK BD NP BT LK MV TH MY SG ID BN TL HK MO
  AU NZ PG FJ SB WS TO KI TV NR CX CC NF
  ZA NA BW ZW ZM MZ MW LS SZ KE UG TZ MU SC
  GY SR JM BS BB TT AG DM GD KN LC VC FK VI VG KY AI MS TC BM`;

/* ---------------------------------------------------------------------
   2) Street-View-Abdeckung (offizielle Google-Abdeckung, ohne Gewähr)
   full    = landesweit / großflächig
   partial = nur Teile des Landes oder sehr dünn
   spots   = nur einzelne Orte, Trekker oder Fotosphären (in GeoGuessr kaum relevant)
   --------------------------------------------------------------------- */
const COVERAGE = {};
assign(`AD AL AT BE BA BG HR CY CZ DK EE FI FR DE GR HU IS IE IT XK LV LI LT LU MT MC ME
  NL MK NO PL PT RO RU SM RS SK SI ES SE CH TR UA GB FO IM JE GE
  JP TW HK MO TH MY SG ID PH KH LA VN MN KZ KG BD LK BT IN NP IL JO AE QA OM
  ZA BW LS SZ NA KE UG RW NG GH SN TN
  US CA MX GT CR PA DO PR BR AR CL UY PE CO EC BO PY CW VI FK
  AU NZ GU MP AS CX`, 'full', COVERAGE);
assign(`GL PS LB KR KW RE MG BY`, 'partial', COVERAGE);
assign(`CN EG PK IQ AM MA TZ BZ HT FJ VU NE ML ET UZ AQ`, 'spots', COVERAGE);

/* ---------------------------------------------------------------------
   3) Schrift (hauptsächlich sichtbare Schrift auf Schildern)
   --------------------------------------------------------------------- */
const SCRIPT = {};
assign(`RU UA BY BG MK MN KZ KG TJ`, 'cyrillic', SCRIPT);
assign(`RS BA`, 'latcyr', SCRIPT);
assign(`GR CY`, 'greek', SCRIPT);
assign(`SA YE OM AE QA BH KW IQ SY JO LB PS EG LY SD IR AF PK`, 'arabic', SCRIPT);
assign(`TN DZ MA MR`, 'latarab', SCRIPT);
assign(`IL`, 'hebrew', SCRIPT);
assign(`GE`, 'georgian', SCRIPT);
assign(`AM`, 'armenian', SCRIPT);
assign(`TH`, 'thai', SCRIPT);
assign(`LA`, 'lao', SCRIPT);
assign(`KH`, 'khmer', SCRIPT);
assign(`MM`, 'burmese', SCRIPT);
assign(`IN NP`, 'devanagari', SCRIPT);
assign(`BD`, 'bengali', SCRIPT);
assign(`LK`, 'sinhala', SCRIPT);
assign(`BT`, 'tibetan', SCRIPT);
assign(`KR KP`, 'hangul', SCRIPT);
assign(`JP`, 'japanese', SCRIPT);
assign(`CN TW HK MO`, 'chinese', SCRIPT);
assign(`ET ER`, 'ethiopic', SCRIPT);
assign(`MV`, 'thaana', SCRIPT);
// alles andere -> Latein (wird im Code als Standard gesetzt)

/* ---------------------------------------------------------------------
   4) Hauptsprache(n) auf Schildern (für Sprach-Modus)
   --------------------------------------------------------------------- */
const LANGFAM = {};
assign(`US GB IE AU NZ CA GH NG KE UG ZA BW NA LS SZ PH SG FK GU MP AS VI CX IM JE BM JM BS TT`, 'en', LANGFAM);
assign(`ES MX GT CR PA DO PR AR CL UY PE CO EC BO PY VE HN SV NI CU AD`, 'es', LANGFAM);
assign(`PT BR AO MZ TL`, 'pt', LANGFAM);
assign(`FR BE LU MC SN RE MG ML NE CI CM`, 'fr', LANGFAM);
assign(`DE AT CH LI`, 'de', LANGFAM);
assign(`RU UA BY BG RS MK ME BA HR SI PL CZ SK KZ KG MN`, 'slav', LANGFAM);
assign(`AE QA OM JO LB PS SA KW IQ EG TN MA DZ`, 'ar', LANGFAM);
assign(`NO SE DK IS FO FI EE LV LT`, 'nord', LANGFAM);
assign(`IT SM MT RO NL`, 'other_eu', LANGFAM);
assign(`HU GR AL XK TR GE CY IL`, 'other_eu', LANGFAM);
assign(`JP KR TW HK MO TH KH LA VN MY ID IN BD LK NP BT`, 'asia', LANGFAM);
assign(`RW`, 'other', LANGFAM);
// MN/KZ/KG haben eigene Sprachen, aber kyrillische Schilder -> 'slav' bewusst als "kyrillisch/slawisch"-Gruppe

/* ---------------------------------------------------------------------
   5) Detaildaten pro Land
   d      : Fahrtrichtung (wird automatisch gesetzt)
   lang   : Sprache(n)
   chars  : Sonderzeichen, an denen man die Sprache erkennt
   center : Mittellinie  'white' | 'yellow' | 'mixed'
   edge   : Randlinie    'white' | 'yellow' | 'none'
   plate  : Kennzeichen  'strip' | 'mercosur' | 'yellowBoth' | 'yellowRear' | 'black' | 'white' | 'varies'
   speed  : 'kmh' | 'mph'
   stop   : 'STOP' | 'ALTO' | 'PARE' | 'local' | 'jp' | 'hand' | 'DUR'
   warn   : Warnschild 'triW' (Dreieck weiß) | 'triY' (Dreieck gelb) | 'diamond' (gelbe Raute)
   tld    : Domain     phone : Vorwahl
   bollard: IDs aus CATALOG.bollards
   pole   : IDs aus CATALOG.poles
   tips   : freie Hinweise
   --------------------------------------------------------------------- */
const C = {
  // =========================== EUROPA ===========================
  DE: { lang: 'Deutsch', chars: 'ä ö ü ß', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.de', phone: '+49',
        bollard: ['de'], pole: ['wood_eu'],
        tips: ['Gelbe Ortsschilder (Ortstafel) mit schwarzer Schrift', 'Leitpfosten: schwarzer schräger Streifen, vorn weißer Rechteck-Reflektor, hinten zwei runde', 'Kaum Freileitungen in Dörfern – Kabel liegen meist unterirdisch', 'Viele Straßen in Deutschland nur mit veralteten/verpixelten Aufnahmen (Rückzug 2011), neue Aufnahmen seit 2022/23'] },
  AT: { lang: 'Deutsch', chars: 'ä ö ü ß', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.at', phone: '+43',
        bollard: ['at'], pole: ['wood_eu'],
        tips: ['Leitpfosten mit schwarzer Kappe und dunkelrotem/schwarzem Reflektor', 'Kennzeichen: weiß mit rot-weiß-rotem Rand oben/unten'] },
  CH: { lang: 'Deutsch, Französisch, Italienisch', chars: 'ä ö ü (kein ß!)', center: 'white', edge: 'white', plate: 'white', stop: 'STOP', warn: 'triW', tld: '.ch', phone: '+41',
        bollard: ['ch'], pole: ['wood_eu'],
        tips: ['Kennzeichen ohne EU-Streifen, vorne schmal mit Kantonswappen hinten', 'Gelbe Wanderwegweiser, gelbe Mittel-/Zick-Zack-Linien bei Bushaltestellen', 'Schweizerdeutsch schreibt "ss" statt "ß"'] },
  LI: { lang: 'Deutsch', chars: 'ä ö ü', center: 'white', edge: 'white', plate: 'black', stop: 'STOP', warn: 'triW', tld: '.li', phone: '+423',
        bollard: ['ch'], tips: ['Schwarze Kennzeichen mit weißer Schrift (FL)', 'Ähnelt stark der Schweiz'] },
  FR: { lang: 'Französisch', chars: 'é è ê à ç œ', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.fr', phone: '+33',
        bollard: ['fr'], pole: ['concrete_ladder'],
        tips: ['Kennzeichen hat rechts zusätzlich einen blauen Streifen (Regionswappen + Dept.-Nr.)', 'Randlinien oft lang gestrichelt; Leitpfosten weiß mit schwarzem Band', 'Ortsschilder weiß mit rotem Rand', 'Betonmasten mit kurzen "Leiter"-Aussparungen'] },
  BE: { lang: 'Niederländisch, Französisch', chars: 'Mischung NL/FR', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.be', phone: '+32',
        bollard: [], pole: ['concrete_ladder'],
        tips: ['Kennzeichen weiß mit ROTER Schrift', 'Viele Betonstraßen mit Fugen', 'Gelb-schwarze Leitpfosten selten, eher Reflektoren an Leitplanken'] },
  NL: { lang: 'Niederländisch', chars: 'ij, aa, ee, oo', center: 'white', edge: 'white', plate: 'yellowBoth', stop: 'STOP', warn: 'triW', tld: '.nl', phone: '+31',
        bollard: ['nl'], tips: ['Gelbe Kennzeichen vorne und hinten', 'Rote Radwege (Asphalt), sehr flach, Klinkerhäuser', 'Grüne Hektometerpfähle (Autobahn) / Haaientanden (Haifischzähne) an Kreuzungen'] },
  LU: { lang: 'Französisch, Deutsch, Luxemburgisch', chars: 'é ä ë', center: 'white', edge: 'white', plate: 'yellowBoth', stop: 'STOP', warn: 'triW', tld: '.lu', phone: '+352',
        tips: ['Gelbe Kennzeichen wie NL, aber mit EU-Streifen und kürzer', 'Straßenschilder französisch, Ortsnamen oft zweisprachig'] },
  GB: { lang: 'Englisch (Wales: Walisisch)', chars: 'Walisisch: ll, dd, w, y', center: 'white', edge: 'white', plate: 'yellowRear', speed: 'mph', stop: 'STOP', warn: 'triW', tld: '.uk', phone: '+44',
        bollard: ['gb'], pole: ['wood_eu'],
        tips: ['Vorne weiß, hinten gelb', 'Doppelte gelbe Randlinien = Halteverbot (keine echte Randlinie)', 'Geschwindigkeit in mph', 'Linksverkehr'] },
  IE: { lang: 'Englisch, Irisch', chars: 'á é í ó ú (Irisch)', center: 'white', edge: 'yellow', plate: 'strip', stop: 'STOP', warn: 'diamond', tld: '.ie', phone: '+353',
        pole: ['wood_eu'], tips: ['GELBE (oft gestrichelte) Randlinien – wichtigster Unterschied zu UK', 'Gelbe Rauten-Warnschilder wie in Amerika', 'Kennzeichen weiß vorne & hinten (Format 191-D-12345)', 'km/h statt mph'] },
  IM: { lang: 'Englisch', center: 'white', edge: 'white', plate: 'yellowRear', speed: 'mph', stop: 'STOP', warn: 'triW', tld: '.im', phone: '+44', tips: ['Isle of Man – Kennzeichen mit "MN"/"MAN"'] },
  JE: { lang: 'Englisch, Französisch', center: 'white', edge: 'white', plate: 'yellowRear', speed: 'mph', stop: 'STOP', warn: 'triW', tld: '.je', phone: '+44', tips: ['Kennzeichen "J 12345"', 'Gelbe Linien an Kreuzungen'] },
  IT: { lang: 'Italienisch', chars: 'à è ì ò ù, Wörter enden oft auf Vokal', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.it', phone: '+39',
        bollard: ['it'], tips: ['Kennzeichen mit blauem Streifen links UND rechts', 'Leitpfosten: schwarzer schräger Streifen + roter Reflektor (wie Albanien)'] },
  SM: { lang: 'Italienisch', center: 'white', edge: 'white', stop: 'STOP', warn: 'triW', tld: '.sm', phone: '+378', bollard: ['it'], tips: ['Wie Italien, sehr hügelig'] },
  MT: { lang: 'Maltesisch, Englisch', chars: 'ħ ġ ż ċ', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.mt', phone: '+356', tips: ['Linksverkehr in Europa', 'Sandfarbene Kalksteinhäuser'] },
  ES: { lang: 'Spanisch, Katalanisch, Baskisch, Galicisch', chars: 'ñ á é í ó ú ¿ ¡', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.es', phone: '+34',
        bollard: ['es'], tips: ['Leitpfosten keilförmig, vorn oranger/gelber Reflektor, hinten zwei runde', 'Kennzeichen: 4 Ziffern + 3 Buchstaben, keine Regionsangabe'] },
  AD: { lang: 'Katalanisch', chars: 'l·l, ç', center: 'white', edge: 'white', stop: 'STOP', warn: 'triW', tld: '.ad', phone: '+376', tips: ['Gebirge, kaum Fläche'] },
  PT: { lang: 'Portugiesisch', chars: 'ã õ ç', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.pt', phone: '+351',
        bollard: ['pt'], pole: ['concrete_ladder'], tips: ['Kennzeichen mit gelbem Streifen rechts (Jahr/Monat)', 'Leitpfosten weiß mit rotem Reflektor', 'Eukalyptus, orange Dächer'] },
  GR: { lang: 'Griechisch', chars: 'Griechisches Alphabet (λ Σ Ω)', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triY', tld: '.gr', phone: '+30',
        bollard: ['gr'], tips: ['Schilder zweisprachig Griechisch/Latein', 'Gelbe Warnschilder (Dreieck)', 'Kleine Kapellen (Kandylakia) am Straßenrand'] },
  CY: { lang: 'Griechisch, Türkisch', chars: 'Griechisch', center: 'white', plate: 'yellowRear', stop: 'STOP', warn: 'triW', tld: '.cy', phone: '+357',
        tips: ['Linksverkehr, Kennzeichen wie UK (vorne weiß, hinten gelb)', 'Nordzypern nicht abgedeckt', 'Neu in Street View seit Nov. 2025'] },
  PL: { lang: 'Polnisch', chars: 'ł ą ę ś ć ź ż ń', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triY', tld: '.pl', phone: '+48',
        bollard: ['pl'], pole: ['concrete_holes_high'], tips: ['Gelbe Warnschilder (Dreieck)', 'Betonmasten mit Löchern, die ca. 50 cm über dem Boden enden', 'Kennzeichen mit Kürzel der Woiwodschaft (z. B. W=Warschau)'] },
  CZ: { lang: 'Tschechisch', chars: 'ř ě ů č š ž', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.cz', phone: '+420',
        bollard: ['cz'], tips: ['Leitpfosten: schwarzer Streifen mit zwei orangen Reflektoren (wie Slowakei)', '"ř" und "ů" gibt es nur im Tschechischen'] },
  SK: { lang: 'Slowakisch', chars: 'ä ľ ĺ ŕ ô', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.sk', phone: '+421',
        bollard: ['cz'], tips: ['Fast identische Pfosten wie Tschechien', 'Slowakisch hat ä, ľ, ĺ, ô – Tschechisch nicht'] },
  HU: { lang: 'Ungarisch', chars: 'ő ű (doppelter Akut) – nur Ungarisch', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.hu', phone: '+36',
        bollard: ['hu'], pole: ['concrete_holes'], tips: ['"Lochmasten": dünne Betonmasten mit Löchern bis zum Boden'] },
  SI: { lang: 'Slowenisch', chars: 'č š ž (kein ć)', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.si', phone: '+386',
        bollard: ['si'], tips: ['Pfosten wie Österreich, aber Reflektor hellrot', 'Kennzeichen mit Wappen der Region in der Mitte'] },
  HR: { lang: 'Kroatisch', chars: 'č ć š ž đ', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.hr', phone: '+385',
        bollard: ['hu'], tips: ['Pfosten ähnlich Ungarn (rotes Rechteck)', 'Kennzeichen mit kroatischem Schachbrettwappen'] },
  RS: { lang: 'Serbisch (Kyrillisch + Latein)', chars: 'ћ ђ љ њ џ / ć đ', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triY', tld: '.rs', phone: '+381',
        bollard: ['rs'], tips: ['Roter Reflektor am Pfosten seitlich versetzt (links) – nicht mittig', 'Schilder in Kyrillisch und Latein', 'Gelbe Warnschilder'] },
  BA: { lang: 'Bosnisch, Kroatisch, Serbisch', chars: 'Latein + Kyrillisch', center: 'white', edge: 'white', plate: 'white', stop: 'STOP', warn: 'triY', tld: '.ba', phone: '+387',
        bollard: ['si'], tips: ['Seit Nov. 2025 offiziell in Street View', 'Kennzeichen ohne Ortskennung (Buchstaben-Zahlen gemischt, z. B. A12-K-345)', 'Moscheen und orthodoxe Kirchen gemischt'] },
  ME: { lang: 'Montenegrinisch', chars: 'ś ź (selten)', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triY', tld: '.me', phone: '+382',
        bollard: ['si'], tips: ['Pfosten wie Slowenien (Reflektor mittig hellrot)', 'Gelbe Warnschilder'] },
  AL: { lang: 'Albanisch', chars: 'ë ç', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triY', tld: '.al', phone: '+355',
        bollard: ['it'], tips: ['Pfosten identisch zu Italien', 'Viele Bunker, Mercedes-Autos', '"ë" sehr häufig'] },
  XK: { lang: 'Albanisch, Serbisch', chars: 'ë ç', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triY', tld: '.xk', phone: '+383',
        tips: ['Seit 2025/26 offiziell in Street View', 'Kennzeichen mit "RKS"'] },
  MK: { lang: 'Mazedonisch', chars: 'ѓ ќ ѕ (nur Mazedonisch)', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triY', tld: '.mk', phone: '+389',
        bollard: ['hu'], tips: ['Kyrillisch mit ѓ ќ ѕ – unterscheidet von Bulgarisch', 'Gelbe Warnschilder'] },
  BG: { lang: 'Bulgarisch', chars: 'ъ щ (häufig)', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.bg', phone: '+359',
        bollard: ['hu'], tips: ['Kyrillisch, oft auch lateinisch transkribiert', 'Pfosten selten, wenn dann wie Ungarn/Kroatien'] },
  RO: { lang: 'Rumänisch', chars: 'ă â î ș ț', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.ro', phone: '+40',
        pole: ['concrete_holes', 'white_base'], tips: ['Breite "Lochmasten", oft unten weiß gestrichen', 'Kaum Leitpfosten', 'Kennzeichen mit Kreiskürzel (B, CJ, …)'] },
  UA: { lang: 'Ukrainisch', chars: 'і ї є ґ (nicht im Russischen)', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.ua', phone: '+380',
        bollard: ['ua'], pole: ['white_base'], tips: ['Breites rotes Rechteck auf Pfosten, oft verwittert', 'Kennzeichen mit Flagge + "UA"', 'Masten/Bäume unten weiß gestrichen'] },
  RU: { lang: 'Russisch', chars: 'ы э ъ (nicht im Ukrainischen)', center: 'white', edge: 'white', plate: 'white', stop: 'STOP', warn: 'triW', tld: '.ru', phone: '+7',
        bollard: ['ru'], pole: ['white_base'], tips: ['Kennzeichen mit Regionsnummer + Flagge rechts', 'Sehr viel alte (Gen 3) Abdeckung', 'Pfosten sehr unterschiedlich'] },
  BY: { lang: 'Belarussisch, Russisch', chars: 'ў і', center: 'white', edge: 'white', stop: 'STOP', warn: 'triW', tld: '.by', phone: '+375', tips: ['Kaum offizielle Abdeckung'] },
  EE: { lang: 'Estnisch', chars: 'õ ä ö ü', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.ee', phone: '+372',
        bollard: ['ee'], tips: ['"õ" ist typisch Estnisch', 'Runde Pfosten: vorn Rechteck, hinten zwei runde Reflektoren'] },
  LV: { lang: 'Lettisch', chars: 'ā ē ī ū ķ ļ ņ ģ', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.lv', phone: '+371',
        bollard: ['lv'], tips: ['Viele Makronen (ā ē ī ū)', 'Flache dünne Pfosten mit Reflektor im schrägen schwarzen Rahmen'] },
  LT: { lang: 'Litauisch', chars: 'ą č ę ė į š ų ū ž', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.lt', phone: '+370',
        bollard: ['lt'], tips: ['"ė" typisch Litauisch', 'Keilförmige Pfosten, vorn orange Reflektoren'] },
  FI: { lang: 'Finnisch, Schwedisch', chars: 'ä ö, viele Doppelvokale (aa, ii)', center: 'yellow', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triY', tld: '.fi', phone: '+358',
        bollard: ['fi'], pole: ['wood_nordic'], tips: ['Gelbe Mittellinie', 'Zylindrische (runde) schwarze Leitpfosten', 'Gelbe Warnschilder', 'Zweisprachige Ortsschilder an der Küste'] },
  SE: { lang: 'Schwedisch', chars: 'å ä ö', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triY', tld: '.se', phone: '+46',
        bollard: ['se'], pole: ['wood_nordic'], tips: ['WEISSE Mittellinie (vs. Norwegen/Finnland gelb)', 'Gelbe Warnschilder', 'Rote Holzhäuser (Falunrot)'] },
  NO: { lang: 'Norwegisch', chars: 'æ ø å', center: 'yellow', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triY', tld: '.no', phone: '+47',
        bollard: ['no'], pole: ['wood_nordic'], tips: ['Gelbe Mittellinie', 'Schwarze Pfosten mit kurzem gelbem Reflektor', 'Gelbe Warnschilder'] },
  DK: { lang: 'Dänisch', chars: 'æ ø å', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.dk', phone: '+45',
        bollard: ['dk'], tips: ['Kennzeichen mit rotem Rand', 'Pfosten mit gelbem Abschnitt vorne', 'Sehr flach, rote Ziegelhäuser'] },
  IS: { lang: 'Isländisch', chars: 'þ ð æ', center: 'white', edge: 'white', plate: 'white', stop: 'STOP', warn: 'triY', tld: '.is', phone: '+354',
        bollard: ['is'], tips: ['Gelbe Pfosten mit weißem Reflektor', 'Keine Bäume, Lavafelder', 'þ und ð gibt es nur hier (und ð auf den Färöern)'] },
  FO: { lang: 'Färöisch', chars: 'ð ø á', center: 'white', edge: 'white', stop: 'STOP', warn: 'triW', tld: '.fo', phone: '+298', tips: ['Grasdächer, steile grüne Hänge, viele Tunnel'] },
  TR: { lang: 'Türkisch', chars: 'ı ğ ş ç ö ü', center: 'white', edge: 'white', plate: 'strip', stop: 'DUR', warn: 'triW', tld: '.tr', phone: '+90',
        bollard: ['tr'], tips: ['Stoppschild sagt "DUR"', 'Punktloses "ı" und "ğ"', 'Kennzeichen beginnt mit 2-stelliger Provinznummer'] },
  GE: { lang: 'Georgisch', chars: 'Georgische Schrift (ა ბ გ – runde Buchstaben)', center: 'white', edge: 'white', stop: 'STOP', warn: 'triW', tld: '.ge', phone: '+995',
        tips: ['Neu in Street View (2026)', 'Schilder Georgisch + Latein', 'Viele Kühe auf der Straße'] },
  MC: { lang: 'Französisch', center: 'white', edge: 'white', stop: 'STOP', warn: 'triW', tld: '.mc', phone: '+377', tips: ['Winzig, Hochhäuser am Meer'] },

  // =========================== ASIEN ===========================
  JP: { lang: 'Japanisch', chars: 'Kanji + Hiragana + Katakana', center: 'mixed', edge: 'white', plate: 'white', stop: 'jp', warn: 'diamond', tld: '.jp', phone: '+81',
        bollard: ['jp'], pole: ['jp'], tips: ['Linksverkehr', 'Stoppschild = rotes umgedrehtes Dreieck "止まれ"', 'Kennzeichen weiß (Kei-Cars: gelb)', 'Gelb-schwarz gestreifte Schutzhülle an Masten-Abspannseilen'] },
  KR: { lang: 'Koreanisch', chars: 'Hangul (Kreise und Striche: 은 한 국)', center: 'yellow', edge: 'white', plate: 'white', stop: 'local', warn: 'triY', tld: '.kr', phone: '+82',
        tips: ['Street View nur eingeschränkt verfügbar, in GeoGuessr praktisch nicht spielbar', 'Doppelte gelbe Mittellinie'] },
  TW: { lang: 'Chinesisch (traditionell)', chars: 'Traditionelle Zeichen', center: 'mixed', edge: 'white', plate: 'white', stop: 'local', warn: 'triW', tld: '.tw', phone: '+886',
        tips: ['Stoppschild "停"', 'Viele Roller, Betonhäuser mit Fliesen', 'Rechtsverkehr (anders als HK/MO/JP)'] },
  HK: { lang: 'Chinesisch, Englisch', chars: 'Traditionelle Zeichen + Englisch', center: 'white', edge: 'yellow', plate: 'yellowRear', stop: 'STOP', warn: 'triW', tld: '.hk', phone: '+852',
        tips: ['Linksverkehr, britisch geprägte Schilder', 'Kennzeichen vorne weiß, hinten gelb'] },
  MO: { lang: 'Chinesisch, Portugiesisch', chars: 'Zeichen + Portugiesisch', center: 'white', plate: 'black', stop: 'STOP', warn: 'triW', tld: '.mo', phone: '+853',
        tips: ['Linksverkehr', 'Schwarze Kennzeichen', 'Portugiesische Straßenschilder (Azulejo-Stil)'] },
  TH: { lang: 'Thai', chars: 'Thai-Schrift (Schleifen, keine Wortabstände)', center: 'mixed', edge: 'white', plate: 'white', stop: 'local', warn: 'diamond', tld: '.th', phone: '+66',
        bollard: ['th'], pole: ['th'], tips: ['Linksverkehr', 'Weiße Kennzeichen mit schwarzer Thai-Schrift', 'Quadratische Betonmasten mit Löchern', 'Pfosten schwarz-weiß gestrichen (Beton)'] },
  LA: { lang: 'Laotisch', chars: 'Laotische Schrift (runder als Thai)', center: 'mixed', edge: 'white', plate: 'yellowBoth', stop: 'STOP', tld: '.la', phone: '+856',
        tips: ['Rechtsverkehr (vs. Thailand links)', 'Private Autos mit gelben Kennzeichen'] },
  KH: { lang: 'Khmer', chars: 'Khmer-Schrift (verschnörkelt, "hängend")', center: 'mixed', edge: 'white', stop: 'STOP', warn: 'diamond', tld: '.kh', phone: '+855',
        tips: ['Rechtsverkehr', 'Rote Erde, Palmen, Stelzenhäuser'] },
  VN: { lang: 'Vietnamesisch', chars: 'ư ơ đ + viele Tonzeichen (ế ộ)', center: 'mixed', edge: 'white', plate: 'white', stop: 'STOP', warn: 'triY', tld: '.vn', phone: '+84',
        tips: ['Seit 2025 wieder in Street View', 'Lateinschrift mit sehr vielen Diakritika', 'Gelbe Warndreiecke, schmale "Röhrenhäuser"'] },
  MY: { lang: 'Malaiisch', chars: 'Latein, kein Akzent (z. B. "jalan", "berhenti")', center: 'white', edge: 'yellow', plate: 'black', stop: 'local', warn: 'diamond', tld: '.my', phone: '+60',
        bollard: ['my'], tips: ['Gelbe Randlinien', 'Schwarze Kennzeichen', 'Stoppschild "BERHENTI"', 'Linksverkehr'] },
  SG: { lang: 'Englisch, Malaiisch, Chinesisch, Tamil', center: 'white', edge: 'white', plate: 'black', stop: 'STOP', warn: 'triW', tld: '.sg', phone: '+65',
        tips: ['Linksverkehr, Stadtstaat', 'Kennzeichen schwarz ODER weiß vorne/gelb hinten'] },
  ID: { lang: 'Indonesisch', chars: 'Latein ("jalan", "dilarang")', center: 'white', edge: 'white', plate: 'black', stop: 'STOP', warn: 'diamond', tld: '.id', phone: '+62',
        bollard: ['id'], tips: ['Linksverkehr', 'Kennzeichen schwarz (seit 2022 Umstellung auf weiß)', 'Gelb-schwarz gestreifte Pfosten mit rotem Rechteck'] },
  PH: { lang: 'Englisch, Filipino', chars: 'Latein ("ng", "mga")', center: 'mixed', edge: 'white', plate: 'white', stop: 'STOP', warn: 'diamond', tld: '.ph', phone: '+63',
        tips: ['Rechtsverkehr (einziges Land in der Region neben VN/KH/LA)', 'Jeepneys und Tricycles', 'Betonstraßen mit Fugen sehr häufig'] },
  MN: { lang: 'Mongolisch', chars: 'Kyrillisch mit ө ү', center: 'white', edge: 'white', plate: 'white', stop: 'STOP', warn: 'triW', tld: '.mn', phone: '+976',
        tips: ['Weite Steppe ohne Bäume, Jurten', 'Kyrillisch mit ө und ү'] },
  KZ: { lang: 'Kasachisch, Russisch', chars: 'ә ғ қ ң ө ұ ү һ і', center: 'white', edge: 'white', plate: 'white', stop: 'STOP', warn: 'triW', tld: '.kz', phone: '+7',
        tips: ['Kyrillisch mit Zusatzbuchstaben (ә қ ұ)', 'Sehr flach und weit'] },
  KG: { lang: 'Kirgisisch, Russisch', chars: 'ң ө ү', center: 'white', edge: 'white', plate: 'white', stop: 'STOP', warn: 'triW', tld: '.kg', phone: '+996',
        tips: ['Berge, kyrillisch mit ң ө ү'] },
  IN: { lang: 'Hindi, Englisch u. v. m.', chars: 'Devanagari, regional Tamil, Telugu, Kannada …', center: 'mixed', edge: 'white', plate: 'white', stop: 'STOP', warn: 'triW', tld: '.in', phone: '+91',
        tips: ['Linksverkehr', 'Abdeckung oft von Drittanbieter-Kameras; viele Rikschas', 'Kennzeichen privat weiß, gewerblich gelb'] },
  BD: { lang: 'Bengalisch', chars: 'Bengalische Schrift (Querbalken oben)', center: 'white', edge: 'white', stop: 'STOP', warn: 'triW', tld: '.bd', phone: '+880',
        tips: ['Linksverkehr, sehr dicht besiedelt, Rikschas'] },
  LK: { lang: 'Singhalesisch, Tamil', chars: 'Singhalesisch (sehr rund)', center: 'white', edge: 'white', stop: 'STOP', warn: 'diamond', tld: '.lk', phone: '+94',
        tips: ['Linksverkehr', 'Gelbe Rauten-Warnschilder', 'Schilder dreisprachig Singhalesisch/Tamil/Englisch'] },
  NP: { lang: 'Nepali', chars: 'Devanagari', center: 'white', edge: 'white', stop: 'STOP', warn: 'triW', tld: '.np', phone: '+977',
        tips: ['Seit 2025 in Street View', 'Linksverkehr, Gebirge'] },
  BT: { lang: 'Dzongkha, Englisch', chars: 'Tibetische Schrift', center: 'white', edge: 'white', stop: 'STOP', warn: 'triW', tld: '.bt', phone: '+975',
        tips: ['Linksverkehr, Gebirge, Gebetsfahnen'] },
  IL: { lang: 'Hebräisch, Arabisch, Englisch', chars: 'Hebräisch (eckig, rechts→links)', center: 'white', edge: 'white', plate: 'yellowBoth', stop: 'hand', warn: 'triW', tld: '.il', phone: '+972',
        tips: ['Gelbe Kennzeichen', 'Stoppschild mit Hand-Symbol', 'Bordsteine schwarz-weiß / rot-weiß gestrichen'] },
  PS: { lang: 'Arabisch', center: 'white', edge: 'white', stop: 'STOP', warn: 'triW', tld: '.ps', phone: '+970', tips: ['Nur Teile des Westjordanlands'] },
  JO: { lang: 'Arabisch', chars: 'Arabisch + Englisch', center: 'white', edge: 'white', plate: 'white', stop: 'local', warn: 'triW', tld: '.jo', phone: '+962',
        tips: ['Wüste, sandfarbene Kalksteinhäuser'] },
  LB: { lang: 'Arabisch, Französisch', center: 'white', edge: 'white', stop: 'local', warn: 'triW', tld: '.lb', phone: '+961', tips: ['Nur Teile abgedeckt'] },
  AE: { lang: 'Arabisch, Englisch', chars: 'Arabisch + Englisch', center: 'white', edge: 'yellow', plate: 'white', stop: 'local', warn: 'triW', tld: '.ae', phone: '+971',
        tips: ['Gelbe Randlinie links (Mittelstreifen-Seite)', 'Mehrspurige Highways, Wüste'] },
  QA: { lang: 'Arabisch, Englisch', center: 'white', edge: 'yellow', plate: 'white', stop: 'local', warn: 'triW', tld: '.qa', phone: '+974',
        tips: ['Sehr flach, moderne Straßen'] },
  OM: { lang: 'Arabisch, Englisch', center: 'white', edge: 'yellow', stop: 'local', warn: 'triW', tld: '.om', phone: '+968',
        tips: ['Felsige Berge, weiße Häuser'] },
  KW: { lang: 'Arabisch', center: 'white', edge: 'yellow', stop: 'local', warn: 'triW', tld: '.kw', phone: '+965', tips: ['Abdeckung angekündigt/eingeschränkt'] },

  // =========================== AFRIKA ===========================
  ZA: { lang: 'Englisch, Afrikaans u. a.', chars: 'Afrikaans: "straat", "ê"', center: 'white', edge: 'yellow', plate: 'varies', stop: 'STOP', warn: 'triW', tld: '.za', phone: '+27',
        bollard: ['za'], pole: ['wood_south'], tips: ['Gelbe Randlinien', 'Kennzeichen je Provinz verschieden (GP, WC, …)', 'Linksverkehr'] },
  BW: { lang: 'Englisch, Setswana', center: 'white', edge: 'yellow', plate: 'yellowRear', stop: 'STOP', warn: 'triW', tld: '.bw', phone: '+267',
        tips: ['Sehr flach, Buschland, Linksverkehr', 'Gelbe Randlinien'] },
  NA: { lang: 'Englisch, Afrikaans', center: 'white', edge: 'yellow', plate: 'white', stop: 'STOP', warn: 'triW', tld: '.na', phone: '+264',
        tips: ['Seit 2025 in Street View', 'Wüste, Schotterpisten, Linksverkehr'] },
  LS: { lang: 'Sesotho, Englisch', center: 'white', edge: 'yellow', stop: 'STOP', warn: 'triW', tld: '.ls', phone: '+266',
        tips: ['Hochland, Rundhütten, Linksverkehr'] },
  SZ: { lang: 'Swati, Englisch', center: 'white', edge: 'yellow', stop: 'STOP', warn: 'triW', tld: '.sz', phone: '+268',
        tips: ['Hügelig, Linksverkehr, gelbe Randlinien'] },
  KE: { lang: 'Englisch, Swahili', chars: 'Swahili: "barabara", "ya"', center: 'white', plate: 'yellowRear', stop: 'STOP', warn: 'triW', tld: '.ke', phone: '+254',
        tips: ['Google-Auto mit Schnorchel (Snorkel) sichtbar', 'Rote Erde, Linksverkehr', 'Kennzeichen vorne weiß, hinten gelb'] },
  UG: { lang: 'Englisch', center: 'white', plate: 'yellowRear', stop: 'STOP', warn: 'triW', tld: '.ug', phone: '+256',
        tips: ['Linksverkehr, rote Erde, viele Boda-Bodas (Motorräder)'] },
  RW: { lang: 'Kinyarwanda, Französisch, Englisch', center: 'white', edge: 'white', stop: 'STOP', warn: 'triW', tld: '.rw', phone: '+250',
        tips: ['Rechtsverkehr (vs. Kenia/Uganda links)', 'Sehr hügelig, sauber'] },
  NG: { lang: 'Englisch', center: 'white', edge: 'white', plate: 'white', stop: 'STOP', warn: 'triW', tld: '.ng', phone: '+234',
        tips: ['Rechtsverkehr, Abdeckung v. a. Städte'] },
  GH: { lang: 'Englisch', stop: 'STOP', warn: 'triW', tld: '.gh', phone: '+233',
        tips: ['Rechtsverkehr, rote Erde', 'Neue Aufnahmen 2026'] },
  SN: { lang: 'Französisch', center: 'white', edge: 'white', stop: 'STOP', warn: 'triW', tld: '.sn', phone: '+221',
        tips: ['Sandig, Baobabs, französische Schilder'] },
  TN: { lang: 'Arabisch, Französisch', chars: 'Arabisch + Französisch', center: 'white', edge: 'white', plate: 'black', stop: 'STOP', warn: 'triW', tld: '.tn', phone: '+216',
        tips: ['Schwarze Kennzeichen mit arabischer Schrift', 'Weiße Häuser mit blauen Türen/Fenstern'] },
  MG: { lang: 'Malagasy, Französisch', center: 'white', edge: 'white', stop: 'STOP', warn: 'triW', tld: '.mg', phone: '+261', tips: ['Nur wenig Abdeckung'] },

  // =========================== AMERIKA ===========================
  US: { lang: 'Englisch (teils Spanisch)', center: 'yellow', edge: 'white', plate: 'varies', speed: 'mph', stop: 'STOP', warn: 'diamond', tld: '.us/.com', phone: '+1',
        bollard: ['us'], pole: ['wood_na'], tips: ['Gelbe Mittellinie, weiße Randlinie', 'Viele Bundesstaaten ohne Front-Kennzeichen', 'mph, Meilenangaben'] },
  CA: { lang: 'Englisch, Französisch (Québec)', chars: 'Québec: é è à', center: 'yellow', edge: 'white', plate: 'varies', stop: 'STOP', warn: 'diamond', tld: '.ca', phone: '+1',
        pole: ['wood_na'], tips: ['Wie USA, aber km/h', 'Québec: Stoppschild "ARRÊT"', 'Einige Provinzen ohne Front-Kennzeichen'] },
  MX: { lang: 'Spanisch', chars: 'ñ á', center: 'yellow', edge: 'white', plate: 'varies', stop: 'ALTO', warn: 'diamond', tld: '.mx', phone: '+52',
        bollard: ['mx'], pole: ['mx'], tips: ['Stoppschild "ALTO"', 'Achteckige Betonmasten', 'Topes (Bodenschwellen)'] },
  GT: { lang: 'Spanisch', center: 'yellow', edge: 'white', plate: 'white', stop: 'ALTO', warn: 'diamond', tld: '.gt', phone: '+502',
        tips: ['Vulkane, sehr grün', 'Kennzeichen beginnen mit "P"'] },
  CR: { lang: 'Spanisch', center: 'yellow', edge: 'white', plate: 'white', stop: 'ALTO', warn: 'diamond', tld: '.cr', phone: '+506',
        tips: ['Seit Aug. 2025 in Street View', 'Regenwald, Wellblechdächer'] },
  PA: { lang: 'Spanisch', center: 'yellow', edge: 'white', stop: 'ALTO', warn: 'diamond', tld: '.pa', phone: '+507', tips: ['Tropisch, Kanalzone'] },
  DO: { lang: 'Spanisch', center: 'yellow', edge: 'white', plate: 'white', stop: 'PARE', warn: 'diamond', tld: '.do', phone: '+1',
        tips: ['Karibik, bunte Häuser, viele Motoconchos'] },
  PR: { lang: 'Spanisch, Englisch', center: 'yellow', edge: 'white', plate: 'white', speed: 'mph', stop: 'PARE', warn: 'diamond', tld: '.pr', phone: '+1',
        tips: ['US-Territorium: Schilder spanisch, Tempo in mph, Distanzen in km'] },
  CW: { lang: 'Papiamentu, Niederländisch', center: 'white', edge: 'white', stop: 'STOP', warn: 'triW', tld: '.cw', phone: '+599', tips: ['Trocken, Kakteen, bunte Kolonialhäuser'] },
  BR: { lang: 'Portugiesisch', chars: 'ã õ ç', center: 'yellow', edge: 'white', plate: 'mercosur', stop: 'PARE', warn: 'diamond', tld: '.br', phone: '+55',
        pole: ['br'], tips: ['Portugiesisch (ã, ç) – sonst überall Spanisch in Südamerika', 'Masten mit leiterartigem Unterteil', 'Blaue km-Marker'] },
  AR: { lang: 'Spanisch', chars: 'ñ á', center: 'mixed', edge: 'white', plate: 'mercosur', stop: 'PARE', warn: 'diamond', tld: '.ar', phone: '+54',
        bollard: ['cl'], pole: ['ar'], tips: ['Doppel-/A-Masten aus Holz', 'Weite Pampa, Gen-4 Auto oft mit sichtbarer Antenne'] },
  CL: { lang: 'Spanisch', chars: 'ñ á', center: 'mixed', edge: 'white', plate: 'white', stop: 'PARE', warn: 'diamond', tld: '.cl', phone: '+56',
        bollard: ['cl'], tips: ['Pfosten weiß mit orangem Reflektor', 'Sehr lang gestreckt – Anden immer im Osten'] },
  UY: { lang: 'Spanisch', center: 'yellow', edge: 'white', plate: 'mercosur', stop: 'PARE', warn: 'diamond', tld: '.uy', phone: '+598',
        tips: ['Flach, Eukalyptus'] },
  PE: { lang: 'Spanisch, Quechua', center: 'yellow', edge: 'white', plate: 'white', stop: 'PARE', warn: 'diamond', tld: '.pe', phone: '+51',
        tips: ['Wüste an der Küste, Anden', 'Kennzeichen mit blauem Streifen oben "PERÚ"'] },
  CO: { lang: 'Spanisch', center: 'yellow', edge: 'white', plate: 'yellowBoth', stop: 'PARE', warn: 'diamond', tld: '.co', phone: '+57',
        tips: ['Gelbe Kennzeichen', 'Sehr bergig, grün'] },
  EC: { lang: 'Spanisch', center: 'yellow', edge: 'white', plate: 'white', stop: 'PARE', warn: 'diamond', tld: '.ec', phone: '+593',
        bollard: ['ec'], tips: ['Runde Pfosten mit zwei roten Streifen', 'Anden + Küste'] },
  BO: { lang: 'Spanisch', center: 'yellow', edge: 'white', plate: 'mercosur', stop: 'PARE', warn: 'diamond', tld: '.bo', phone: '+591',
        tips: ['Altiplano, kahl und hoch', 'Abdeckung dünn'] },
  PY: { lang: 'Spanisch, Guaraní', center: 'yellow', edge: 'white', plate: 'mercosur', stop: 'PARE', warn: 'diamond', tld: '.py', phone: '+595',
        tips: ['Seit Nov. 2025 in Street View', 'Rote Erde, flach'] },
  FK: { lang: 'Englisch', center: 'white', edge: 'white', speed: 'mph', stop: 'STOP', warn: 'triW', tld: '.fk', phone: '+500', tips: ['Linksverkehr, kahl, Schotterwege'] },
  GL: { lang: 'Grönländisch, Dänisch', center: 'white', edge: 'white', stop: 'STOP', tld: '.gl', phone: '+299', tips: ['Nur einige Orte'] },
  VI: { lang: 'Englisch', center: 'yellow', edge: 'white', speed: 'mph', stop: 'STOP', warn: 'diamond', tld: '.vi', phone: '+1', tips: ['US-Territorium mit LINKSverkehr'] },

  // =========================== OZEANIEN ===========================
  AU: { lang: 'Englisch', center: 'white', edge: 'white', plate: 'varies', stop: 'STOP', warn: 'diamond', tld: '.au', phone: '+61',
        bollard: ['au'], pole: ['stobie', 'wood_south'], tips: ['Weiße Pfosten mit rotem Reflektor vorn', 'Stobie-Masten (Stahl+Beton) in Südaustralien', 'Rote Erde im Outback', 'Linksverkehr'] },
  NZ: { lang: 'Englisch, Māori', chars: 'Māori: ā ē ō, "wh", "ng"', center: 'mixed', edge: 'white', plate: 'white', stop: 'STOP', warn: 'diamond', tld: '.nz', phone: '+64',
        bollard: ['nz'], tips: ['Pfosten mit rotem Band oben', 'Gelbe Überholverbotslinien', 'Linksverkehr'] },
  GU: { lang: 'Englisch', center: 'yellow', edge: 'white', speed: 'mph', stop: 'STOP', warn: 'diamond', tld: '.gu', phone: '+1', tips: ['US-Territorium'] },
  MP: { lang: 'Englisch', center: 'yellow', edge: 'white', speed: 'mph', stop: 'STOP', warn: 'diamond', tld: '.mp', phone: '+1', tips: ['US-Territorium'] },
  AS: { lang: 'Englisch, Samoanisch', center: 'yellow', edge: 'white', speed: 'mph', stop: 'STOP', warn: 'diamond', tld: '.as', phone: '+1', tips: ['US-Territorium'] },
  CX: { lang: 'Englisch', center: 'white', edge: 'white', stop: 'STOP', tld: '.cx', phone: '+61', tips: ['Australisches Territorium, Regenwald'] },
};

/* Länder, die so klein sind, dass sie zusätzlich als Punkt angezeigt werden */
const SMALL = {
  AD: [1.52, 42.51], MC: [7.42, 43.74], SM: [12.46, 43.94], LI: [9.55, 47.16], MT: [14.4, 35.9],
  SG: [103.82, 1.35], HK: [114.17, 22.32], MO: [113.54, 22.19], GI: [-5.35, 36.14], CW: [-68.99, 12.17],
  GU: [144.79, 13.44], MP: [145.67, 15.18], AS: [-170.7, -14.3], VI: [-64.9, 18.34], PR: [-66.5, 18.22],
  FO: [-6.9, 62.0], IM: [-4.55, 54.23], JE: [-2.13, 49.21], CX: [105.69, -10.45], LU: [6.13, 49.82],
  BT: [90.4, 27.5], QA: [51.2, 25.3], RE: [55.5, -21.1], FK: [-59.5, -51.8], LS: [28.2, -29.6], SZ: [31.5, -26.5],
};
// Gibraltar fehlt als Fläche in der Karte – Daten nachtragen:
C.GI = { lang: 'Englisch, Spanisch', center: 'white', edge: 'white', plate: 'yellowRear', stop: 'STOP', warn: 'triW', tld: '.gi', phone: '+350', tips: ['Rechtsverkehr trotz britischer Schilder'] };
COVERAGE.GI = 'full';
C.RE = { lang: 'Französisch', center: 'white', edge: 'white', plate: 'strip', stop: 'STOP', warn: 'triW', tld: '.re', phone: '+262', tips: ['Französisches Übersee-Département: EU-Kennzeichen, französische Schilder, tropische Vulkaninsel'] };
COVERAGE.RE = 'full';
