/* =====================================================================
   GeoGuessr-Karte – Anwendungslogik (D3 + TopoJSON, keine Build-Tools)
   ===================================================================== */
(async function () {
  const $ = s => document.querySelector(s);
  const deName = new Intl.DisplayNames(['de'], { type: 'region' });
  const flag = cc => (/^[A-Z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc].map(c => 127397 + c.charCodeAt(0))) : '🏳️');
  const MPH_EXTRA = ['LR', 'MM', 'BS', 'BZ'];
  const leftSet = new Set(LEFT_HAND.trim().split(/\s+/));

  // ---------- Daten laden
  const topo = await (await fetch('data/world.json')).json();
  const geo = topojson.feature(topo, topo.objects.countries);
  geo.features = geo.features.filter(f => f.id !== 'AQ' && f.id !== 'XX');

  // ---------- Länder-Datensätze zusammenbauen
  const DB = {};
  const name = cc => {
    if (cc === 'NCY') return 'Nordzypern';
    try { return deName.of(cc) || cc; } catch { return cc; }
  };
  function record(cc, fallbackName) {
    if (DB[cc]) return DB[cc];
    const base = C[cc] || {};
    const r = Object.assign({}, base);
    r.cc = cc;
    r.name = name(cc) === cc && fallbackName ? fallbackName : name(cc);
    r.d = leftSet.has(cc) ? 'L' : 'R';
    r.cov = COVERAGE[cc];
    r.script = SCRIPT[cc] || 'latin';
    r.langfam = LANGFAM[cc];
    r.speed = base.speed || (MPH_EXTRA.includes(cc) ? 'mph' : 'kmh');
    DB[cc] = r;
    return r;
  }
  geo.features.forEach(f => record(f.id, f.properties.n));
  Object.keys(SMALL).forEach(cc => record(cc));
  Object.keys(C).forEach(cc => record(cc));

  // ---------- Zustand
  const state = {
    feature: 'drive',
    hiddenValues: new Set(),
    highlight: null,     // { label, set:Set(cc) }
    selected: null,
    onlyCovered: false,
    catGroup: 'bollards',
    catItem: null,
    filters: {},
  };
  const hash = new URLSearchParams(location.hash.slice(1));
  if (hash.get('m') && FEATURES.some(f => f.key === hash.get('m'))) state.feature = hash.get('m');

  const feat = () => FEATURES.find(f => f.key === state.feature);

  // ---------- Karte
  const svgEl = d3.select('#map');
  const g = svgEl.append('g');
  const projection = d3.geoNaturalEarth1();
  const path = d3.geoPath(projection);
  const gratPath = g.append('path').attr('class', 'graticule');
  const countries = g.append('g').selectAll('path')
    .data(geo.features).join('path')
    .attr('class', 'country');
  const smalls = g.append('g').selectAll('circle')
    .data(Object.entries(SMALL).filter(([cc]) => DB[cc]))
    .join('circle').attr('class', 'small');

  function layout() {
    const box = $('.mapwrap').getBoundingClientRect();
    svgEl.attr('viewBox', `0 0 ${box.width} ${box.height}`);
    projection.fitExtent([[8, 8], [box.width - 8, box.height - 8]], { type: 'Sphere' });
    gratPath.attr('d', path(d3.geoGraticule10()));
    countries.attr('d', path);
    smalls.attr('cx', d => projection(d[1])[0]).attr('cy', d => projection(d[1])[1]);
    applyZoomScale(d3.zoomTransform(svgEl.node()).k);
  }

  const zoom = d3.zoom().scaleExtent([1, 40]).on('zoom', ev => {
    g.attr('transform', ev.transform);
    applyZoomScale(ev.transform.k);
  });
  svgEl.call(zoom).on('dblclick.zoom', null);
  function applyZoomScale(k) {
    countries.style('stroke-width', d => (d.id === state.selected ? 1.8 : 0.5) / k);
    smalls.attr('r', 3.2 / Math.sqrt(k)).style('stroke-width', 0.8 / k);
  }
  $('#zoomIn').onclick = () => svgEl.transition().call(zoom.scaleBy, 1.6);
  $('#zoomOut').onclick = () => svgEl.transition().call(zoom.scaleBy, 1 / 1.6);
  $('#zoomReset').onclick = () => svgEl.transition().call(zoom.transform, d3.zoomIdentity);

  function zoomTo(cc) {
    const f = geo.features.find(x => x.id === cc);
    const box = $('.mapwrap').getBoundingClientRect();
    let cx, cy, k;
    if (f) {
      // größtes Polygon nehmen (sonst springt z. B. Frankreich wegen Übersee-Gebieten weg)
      let target = f;
      if (f.geometry.type === 'MultiPolygon') {
        const polys = f.geometry.coordinates.map(c => ({ type: 'Feature', geometry: { type: 'Polygon', coordinates: c } }));
        target = polys.sort((a, b) => path.area(b) - path.area(a))[0];
      }
      const [[x0, y0], [x1, y1]] = path.bounds(target);
      cx = (x0 + x1) / 2; cy = (y0 + y1) / 2;
      k = Math.min(30, 0.7 / Math.max((x1 - x0) / box.width, (y1 - y0) / box.height));
    } else if (SMALL[cc]) {
      [cx, cy] = projection(SMALL[cc]); k = 20;
    } else return;
    k = Math.max(1, k);
    svgEl.transition().duration(700).call(zoom.transform,
      d3.zoomIdentity.translate(box.width / 2, box.height / 2).scale(k).translate(-cx, -cy));
  }

  // ---------- Färbung
  const NODATA = GREY;
  function colorFor(cc) {
    const r = DB[cc];
    if (!r) return NODATA;
    if (state.onlyCovered && !r.cov) return '#262d36';
    if (state.highlight) return state.highlight.set.has(cc) ? '#e8613a' : '#323b47';
    const f = feat();
    const v = f.get(r);
    if (v === undefined || !f.values[v] || state.hiddenValues.has(v)) return NODATA;
    return f.values[v].color;
  }
  function paint() {
    countries.attr('fill', d => colorFor(d.id)).classed('selected', d => d.id === state.selected);
    smalls.attr('fill', d => colorFor(d[0])).classed('selected', d => d[0] === state.selected);
    applyZoomScale(d3.zoomTransform(svgEl.node()).k);
    renderLegend();
    renderHighlightBar();
  }

  // ---------- Chips
  const chips = d3.select('#chips').selectAll('button').data(FEATURES).join('button')
    .text(d => d.label)
    .on('click', (ev, d) => {
      state.feature = d.key; state.hiddenValues.clear(); state.highlight = null; state.catItem = null;
      history.replaceState(null, '', '#m=' + d.key);
      if (d.catalog) { state.catGroup = d.catalog; showTab('catalog'); renderCatalog(); }
      updateChips(); paint();
    });
  function updateChips() { chips.classed('active', d => d.key === state.feature); }

  // ---------- Legende
  function renderLegend() {
    const f = feat();
    const counts = {};
    Object.values(DB).forEach(r => {
      if (state.onlyCovered && !r.cov) return;
      const v = f.get(r); if (v !== undefined) counts[v] = (counts[v] || 0) + 1;
    });
    const items = Object.entries(f.values).map(([v, d]) => ({ v, ...d, n: counts[v] || 0 }));
    const leg = d3.select('#legend');
    leg.selectAll('*').remove();
    items.forEach(it => {
      leg.append('span').classed('off', state.hiddenValues.has(it.v))
        .attr('title', 'Klicken zum Ein-/Ausblenden')
        .html(`<i style="background:${it.color}"></i>${it.label} <b>${it.n}</b>`)
        .on('click', () => {
          state.hiddenValues.has(it.v) ? state.hiddenValues.delete(it.v) : state.hiddenValues.add(it.v);
          paint();
        });
    });
    leg.append('span').html(`<i style="background:${NODATA}"></i><b>nicht erfasst</b>`);
  }

  // ---------- Hervorhebung (aus Katalog/Filter)
  function renderHighlightBar() {
    const bar = $('#highlightBar');
    if (!state.highlight) { bar.hidden = true; return; }
    bar.hidden = false;
    bar.innerHTML = `<span>Hervorgehoben: <b>${state.highlight.label}</b> (${state.highlight.set.size} Länder)</span><button class="btn">Aufheben</button>`;
    bar.querySelector('button').onclick = () => {
      state.highlight = null; state.catItem = null; renderCatalog(); paint();
    };
  }

  // ---------- Tooltip
  const tip = $('#tooltip');
  function showTip(ev, cc) {
    const r = DB[cc]; if (!r) return;
    const f = feat(); const v = f.get(r);
    const box = $('.mapwrap').getBoundingClientRect();
    tip.hidden = false;
    tip.innerHTML = `<b>${flag(cc)} ${r.name}</b>${f.label}: ${v !== undefined && f.values[v] ? f.values[v].label : '<span class="muted">nicht erfasst</span>'}` +
      (r.cov ? '' : '<br><span class="muted">keine Street-View-Abdeckung</span>');
    let x = ev.clientX - box.left + 14, y = ev.clientY - box.top + 14;
    if (x > box.width - 270) x -= 290;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  }
  countries.on('mousemove', (ev, d) => showTip(ev, d.id)).on('mouseleave', () => (tip.hidden = true))
    .on('click', (ev, d) => select(d.id));
  smalls.on('mousemove', (ev, d) => showTip(ev, d[0])).on('mouseleave', () => (tip.hidden = true))
    .on('click', (ev, d) => select(d[0]));

  // ---------- Tabs
  function showTab(t) {
    document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === t));
    document.querySelectorAll('.tab').forEach(el => el.classList.toggle('active', el.id === 'tab-' + t));
  }
  document.querySelectorAll('.tabs button').forEach(b => (b.onclick = () => showTab(b.dataset.tab)));

  // ---------- Info-Panel
  function valueRow(f, r) {
    const v = f.get(r);
    if (f.catalog) return '';
    const txt = v !== undefined && f.values[v]
      ? `<i class="sw" style="background:${f.values[v].color}"></i>${f.values[v].label}` : '<span class="muted">–</span>';
    return `<tr><td>${f.label}</td><td>${txt}</td></tr>`;
  }
  function catThumbs(group, ids) {
    if (!ids || !ids.length) return '';
    const items = CATALOG[group].items.filter(i => ids.includes(i.id));
    return `<h3>${CATALOG[group].title}</h3><div class="thumbs">` +
      items.map(i => `<div class="thumb" data-g="${group}" data-i="${i.id}">${i.svg}<div>${i.name}</div></div>`).join('') + '</div>';
  }
  function select(cc) {
    state.selected = cc;
    const r = DB[cc];
    const q = encodeURIComponent(r.name);
    const en = (() => { try { return new Intl.DisplayNames(['en'], { type: 'region' }).of(cc); } catch { return r.name; } })();
    const covLabel = r.cov ? FEATURES[1].values[r.cov] : null;
    $('#info').innerHTML = `
      <h2>${flag(cc)} ${r.name}</h2>
      <span class="cov" style="background:${covLabel ? covLabel.color : '#555'};${covLabel ? '' : 'color:#ddd'}">${covLabel ? 'Street View: ' + covLabel.label : 'Keine Street-View-Abdeckung'}</span>
      <table>
        ${FEATURES.filter(f => f.key !== 'coverage').map(f => valueRow(f, r)).join('')}
        ${r.lang ? `<tr><td>Sprache(n)</td><td>${r.lang}</td></tr>` : ''}
        ${r.chars ? `<tr><td>Erkennungs-Zeichen</td><td>${r.chars}</td></tr>` : ''}
        ${r.tld ? `<tr><td>Domain</td><td>${r.tld}</td></tr>` : ''}
        ${r.phone ? `<tr><td>Vorwahl</td><td>${r.phone}</td></tr>` : ''}
      </table>
      ${r.tips && r.tips.length ? `<h3>Tipps</h3><ul>${r.tips.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}
      ${catThumbs('bollards', r.bollard)}
      ${catThumbs('poles', r.pole)}
      ${r.photos ? `<h3>Eigene Fotos</h3><div class="thumbs">${r.photos.map(p => `<a href="${p}" target="_blank"><img src="${p}" style="width:92px;border-radius:6px"></a>`).join('')}</div>` : ''}
      <h3>Weiterführend</h3>
      <div class="links">
        <a href="https://www.google.com/search?q=plonkit+${encodeURIComponent(en)}" target="_blank" rel="noopener">Plonk It Guide</a>
        <a href="https://www.google.com/maps/search/${q}" target="_blank" rel="noopener">Google Maps</a>
        <a href="https://de.wikipedia.org/wiki/${q}" target="_blank" rel="noopener">Wikipedia</a>
        <a href="https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(en + ' road')}&title=Special:MediaSearch&type=image" target="_blank" rel="noopener">Fotos (Commons)</a>
      </div>`;
    $('#info').querySelectorAll('.thumb').forEach(el => (el.onclick = () => {
      state.catGroup = el.dataset.g; showTab('catalog'); pickCatItem(el.dataset.i);
    }));
    showTab('info');
    paint();
  }

  // ---------- Katalog
  const catKeys = Object.keys(CATALOG);
  function countriesOf(group, item) {
    const set = new Set();
    Object.values(DB).forEach(r => {
      if (item.feature) { const f = FEATURES.find(x => x.key === item.feature); if (f.get(r) === item.value) set.add(r.cc); }
      else if (group === 'bollards' && r.bollard && r.bollard.includes(item.id)) set.add(r.cc);
      else if (group === 'poles' && r.pole && r.pole.includes(item.id)) set.add(r.cc);
    });
    return set;
  }
  function renderCatalog() {
    d3.select('#catTabs').selectAll('button').data(catKeys).join('button')
      .text(k => CATALOG[k].title).classed('active', k => k === state.catGroup)
      .on('click', (ev, k) => { state.catGroup = k; state.catItem = null; state.highlight = null; renderCatalog(); paint(); });
    const grp = CATALOG[state.catGroup];
    const el = $('#catalog');
    el.innerHTML = '';
    grp.items.forEach(item => {
      const set = countriesOf(state.catGroup, item);
      const card = document.createElement('div');
      card.className = 'card' + (state.catItem === item.id ? ' active' : '');
      const img = item.photo ? `<img src="${item.photo}" alt="${item.name}">` : item.svg;
      card.innerHTML = `<div class="img">${img}</div><div class="nm">${item.name}</div><div class="cnt">${set.size} Länder</div>`;
      card.onclick = () => pickCatItem(state.catItem === item.id ? null : item.id);
      el.appendChild(card);
      if (state.catItem === item.id) {
        const det = document.createElement('div');
        det.className = 'catdetail';
        const list = [...set].map(cc => DB[cc]).sort((a, b) => a.name.localeCompare(b.name, 'de'));
        det.innerHTML = `<b>${item.name}</b>${item.desc ? `<div>${item.desc}</div>` : ''}
          <div class="countries">${list.length ? list.map(r => `<a data-cc="${r.cc}">${flag(r.cc)} ${r.name}</a>`).join(', ') : 'Keine Länder zugeordnet.'}</div>`;
        det.querySelectorAll('a').forEach(a => (a.onclick = () => { select(a.dataset.cc); zoomTo(a.dataset.cc); }));
        el.appendChild(det);
      }
    });
  }
  function pickCatItem(id) {
    state.catItem = id;
    const grp = CATALOG[state.catGroup];
    const item = grp.items.find(i => i.id === id);
    state.highlight = item ? { label: `${grp.title}: ${item.name}`, set: countriesOf(state.catGroup, item) } : null;
    renderCatalog(); paint();
    const active = document.querySelector('.card.active');
    if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  // ---------- Filter / Ausschlussverfahren
  const filterFeatures = FEATURES.filter(f => !f.catalog);
  function renderFilters() {
    const wrap = $('#filters');
    wrap.innerHTML = '';
    filterFeatures.forEach(f => {
      const lab = document.createElement('label');
      lab.textContent = f.label;
      const sel = document.createElement('select');
      sel.innerHTML = `<option value="">egal</option>` + Object.entries(f.values).map(([v, d]) => `<option value="${v}">${d.label}</option>`).join('');
      sel.value = state.filters[f.key] || '';
      sel.onchange = () => { if (sel.value) state.filters[f.key] = sel.value; else delete state.filters[f.key]; applyFilter(); };
      lab.appendChild(sel); wrap.appendChild(lab);
    });
    // Katalog-Filter (Pfosten/Masten)
    [['bollards', 'Leitpfosten', 'bollard'], ['poles', 'Strommast', 'pole']].forEach(([grp, label, key]) => {
      const lab = document.createElement('label');
      lab.textContent = label;
      const sel = document.createElement('select');
      sel.innerHTML = `<option value="">egal</option>` + CATALOG[grp].items.map(i => `<option value="${i.id}">${i.name}</option>`).join('');
      sel.value = state.filters['_' + key] || '';
      sel.onchange = () => { if (sel.value) state.filters['_' + key] = sel.value; else delete state.filters['_' + key]; applyFilter(); };
      lab.appendChild(sel); wrap.appendChild(lab);
    });
  }
  function applyFilter() {
    const active = Object.entries(state.filters);
    const res = $('#filterResult');
    if (!active.length) { state.highlight = null; res.innerHTML = ''; paint(); return; }
    const set = new Set();
    Object.values(DB).forEach(r => {
      if (state.onlyCovered && !r.cov) return;
      const ok = active.every(([k, v]) => {
        if (k === '_bollard') return r.bollard && r.bollard.includes(v);
        if (k === '_pole') return r.pole && r.pole.includes(v);
        return FEATURES.find(f => f.key === k).get(r) === v;
      });
      if (ok) set.add(r.cc);
    });
    state.highlight = { label: 'Filter', set };
    const list = [...set].map(cc => DB[cc]).sort((a, b) => (!!b.cov - !!a.cov) || a.name.localeCompare(b.name, 'de'));
    res.innerHTML = `<b>${list.length} passende Länder</b><br>` +
      list.map(r => `<a data-cc="${r.cc}" title="${r.cov ? 'Street View vorhanden' : 'keine Abdeckung'}">${flag(r.cc)} ${r.name}${r.cov ? '' : ' <span class="muted">(kein SV)</span>'}</a>`).join('');
    res.querySelectorAll('a').forEach(a => (a.onclick = () => { zoomTo(a.dataset.cc); select(a.dataset.cc); showTab('filter'); }));
    paint();
  }
  $('#filterReset').onclick = () => { state.filters = {}; renderFilters(); applyFilter(); };

  // ---------- Suche
  const allNames = Object.values(DB).filter(r => r.cc !== 'XX').sort((a, b) => a.name.localeCompare(b.name, 'de'));
  $('#countrylist').innerHTML = allNames.map(r => `<option value="${r.name}">`).join('');
  $('#search').addEventListener('change', e => {
    const v = e.target.value.trim().toLowerCase();
    if (!v) return;
    const r = allNames.find(x => x.name.toLowerCase() === v) || allNames.find(x => x.name.toLowerCase().startsWith(v));
    if (r) { select(r.cc); zoomTo(r.cc); e.target.value = ''; }
  });

  $('#onlyCovered').onchange = e => { state.onlyCovered = e.target.checked; if (Object.keys(state.filters).length) applyFilter(); else paint(); };

  // ---------- Start
  window.addEventListener('resize', () => { layout(); svgEl.call(zoom.transform, d3.zoomIdentity); });
  layout();
  updateChips();
  renderCatalog();
  renderFilters();
  if (feat().catalog) { state.catGroup = feat().catalog; showTab('catalog'); renderCatalog(); }
  paint();
})();
