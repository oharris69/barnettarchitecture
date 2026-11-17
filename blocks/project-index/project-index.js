/*
 * project-index — one row per project: picture · title link (H3 text) · facets cell
 * (Sector | Type | Location | Approach as 4 paragraphs; values comma-separated).
 * default: the ruled drawing schedule · related: 3 rows, compact
 * filters: facet chips built from the row data + list/grid toggle; URL state
 *          ?type=&location=&sector=&approach=&view=grid. Progressive: every project is listed
 *          before (and without) the filter script; chips are real links.
 * Rows without a picture render as a text schedule (title + note).
 */
import {
  FACETS, facetSlug, splitFacet, joinFacet, dimLine, textOf,
} from '../../scripts/utils.js';

const KEYS = ['sector', 'type', 'location', 'approach'];

function parseFacets(cell) {
  const out = {
    sector: [], type: [], location: [], approach: [],
  };
  if (!cell) return out;
  let parts = [...cell.querySelectorAll(':scope > p, :scope > div, :scope > li, :scope > ul > li')]
    .map((p) => textOf(p));
  if (!parts.length) parts = [textOf(cell)];
  if (parts.length === 1 && /\s[|·]\s/.test(parts[0])) parts = parts[0].split(/\s[|·]\s/);
  KEYS.forEach((k, i) => {
    out[k] = splitFacet(k, parts[i]);
  });
  return out;
}

function parseRow(row) {
  const cells = [...row.children];
  const picCell = cells.find((c) => c.querySelector('img'));
  const rest = cells.filter((c) => c !== picCell);
  const titleCell = rest.find((c) => c.querySelector('a')) || rest[0];
  const factsCell = rest.find((c) => c !== titleCell);
  const link = titleCell ? titleCell.querySelector('a') : null;
  if (!titleCell || !textOf(titleCell)) return null;
  const noteLike = factsCell && !picCell && textOf(factsCell).length > 90;
  return {
    picture: picCell ? (picCell.querySelector('picture') || picCell.querySelector('img')) : null,
    titleCell,
    link,
    facets: noteLike ? parseFacets(null) : parseFacets(factsCell),
    note: noteLike ? factsCell : null,
  };
}

function titleEl(item) {
  let h = item.titleCell.querySelector('h1, h2, h3, h4, h5, h6');
  if (h) {
    if (h.tagName !== 'H3') {
      const h3 = document.createElement('h3');
      h3.append(...h.childNodes);
      h = h3;
    }
  } else {
    h = document.createElement('h3');
    const p = item.titleCell.querySelector('p');
    h.append(...(p || item.titleCell).childNodes);
  }
  h.className = 'project-index-title';
  return h;
}

function dimText(item, variant, showSector) {
  const f = item.facets;
  const parts = [];
  if (variant === 'default') {
    if (f.sector.length) parts.push(f.sector.join(', '));
    if (f.type.length) parts.push(joinFacet(f.type, ', '));
    if (f.location.length) parts.push(f.location.join(', '));
    if (f.approach.length) parts.push(f.approach.join(', '));
  } else {
    if (showSector && f.sector.length) parts.push(f.sector.join(', '));
    if (f.type.length) parts.push(joinFacet(f.type, ' & '));
    if (f.location.length) parts.push(f.location.join(', '));
  }
  return parts.join(' · ');
}

function buildRow(item, variant, showSector) {
  const li = document.createElement('li');
  li.className = 'project-index-row';
  KEYS.forEach((k) => {
    li.dataset[k] = item.facets[k].map((v) => facetSlug(k, v)).join(' ');
  });
  const text = document.createElement('div');
  text.className = 'project-index-text';
  text.append(titleEl(item));
  const d = dimText(item, variant, showSector);
  if (d) text.append(dimLine(d));
  li.append(text);
  if (item.picture) {
    const media = document.createElement('div');
    media.className = 'project-index-media';
    media.append(item.picture);
    li.append(media);
  } else {
    li.classList.add('project-index-row-text');
    if (item.note) {
      const note = document.createElement('div');
      note.className = 'project-index-note';
      note.append(...item.note.childNodes);
      li.append(note);
    }
  }
  return li;
}

/* ---------- filters variant ---------- */
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function buildFilters(block, list, items, total) {
  const rows = [...list.children];
  const uid = `pi${Math.random().toString(36).slice(2, 7)}`;

  // facet values present in the rows, ordered by the taxonomy, then by first appearance
  const groups = KEYS.map((k) => {
    const seen = new Map();
    items.forEach((it) => it.facets[k].forEach((label) => {
      const slug = facetSlug(k, label);
      if (!seen.has(slug)) seen.set(slug, (FACETS[k].values[slug]) || label);
    }));
    const order = Object.keys(FACETS[k].values);
    const values = [...seen.entries()].sort((a, b) => {
      const ia = order.indexOf(a[0]);
      const ib = order.indexOf(b[0]);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    return { key: k, values };
  }).filter((g) => g.values.length > 1);

  const fold = el('details', 'project-index-fold');
  fold.open = true;
  const summary = el('summary', 'project-index-fold-summary', 'Filter projects');
  const nav = el('nav', 'project-index-filters');
  nav.setAttribute('aria-label', 'Filter projects');
  fold.append(summary, nav);

  const chips = [];
  groups.forEach((g) => {
    const group = el('div', 'project-index-group');
    group.setAttribute('role', 'group');
    const lid = `${uid}-${g.key}`;
    group.setAttribute('aria-labelledby', lid);
    const lab = el('p', 'project-index-group-label label', FACETS[g.key].label);
    lab.id = lid;
    const ul = el('ul', 'facets');
    g.values.forEach(([slug, label]) => {
      const a = el('a', 'facet-chip', label);
      a.dataset.facet = g.key;
      a.dataset.value = slug;
      a.href = `${window.location.pathname}?${g.key}=${encodeURIComponent(slug)}`;
      const n = el('span', 'facet-chip-n');
      n.setAttribute('aria-hidden', 'true');
      const sr = el('span', 'visually-hidden');
      sr.dataset.chipSr = '';
      a.append(n, sr);
      const li = el('li');
      li.append(a);
      ul.append(li);
      chips.push(a);
    });
    group.append(lab, ul);
    nav.append(group);
  });

  const main = el('div', 'project-index-main');
  const bar = el('div', 'project-index-bar');
  const status = el('div', 'project-index-status');
  const count = el('p', 'project-index-count', `${total} projects`);
  count.setAttribute('aria-live', 'polite');
  const clear = el('a', 'link-arrow project-index-clear', 'Clear filters');
  clear.href = window.location.pathname;
  clear.hidden = true;
  status.append(count, clear);
  const toggle = el('div', 'project-index-toggle');
  toggle.setAttribute('role', 'group');
  toggle.setAttribute('aria-label', 'View');
  ['list', 'grid'].forEach((v) => {
    const b = el('button', null, v === 'list' ? 'List' : 'Grid');
    b.type = 'button';
    b.dataset.viewSet = v;
    b.setAttribute('aria-pressed', String(v === 'list'));
    toggle.append(b);
  });
  bar.append(status, toggle);
  const empty = el('p', 'project-index-empty', 'No projects match these filters. ');
  empty.hidden = true;
  const showAll = el('a', 'project-index-clear', `Show all ${total} projects`);
  showAll.href = window.location.pathname;
  empty.append(showAll);
  main.append(bar, list, empty);

  const layout = el('div', 'project-index-layout');
  if (groups.length) layout.append(fold);
  else layout.classList.add('project-index-layout-solo');
  layout.append(main);
  block.replaceChildren(layout);

  /* state */
  const clears = [clear, showAll];
  const has = (it, k, v) => (it.dataset[k] || '').split(' ').includes(v);
  const valid = (k, v) => rows.some((it) => has(it, k, v));
  const read = () => {
    const u = new URLSearchParams(window.location.search);
    const s = {};
    KEYS.forEach((k) => {
      const v = u.get(k);
      if (v && valid(k, v)) s[k] = v;
    });
    s.view = u.get('view') === 'grid' ? 'grid' : 'list';
    return s;
  };
  const match = (it, s, skip) => KEYS.every((k) => k === skip || !s[k] || has(it, k, s[k]));
  const href = (s) => {
    const u = new URLSearchParams();
    KEYS.forEach((k) => {
      if (s[k]) u.set(k, s[k]);
    });
    if (s.view === 'grid') u.set('view', 'grid');
    const q = u.toString();
    return window.location.pathname + (q ? `?${q}` : '');
  };
  let S = read();
  const apply = () => {
    let n = 0;
    rows.forEach((it) => {
      const ok = match(it, S);
      it.hidden = !ok;
      if (ok) n += 1;
    });
    chips.forEach((c) => {
      const k = c.dataset.facet;
      const v = c.dataset.value;
      const on = S[k] === v;
      const cnt = rows.filter((it) => match(it, S, k) && has(it, k, v)).length;
      c.querySelector('.facet-chip-n').textContent = cnt;
      c.querySelector('[data-chip-sr]').textContent = on
        ? ', selected — activate to remove this filter'
        : `, ${cnt} ${cnt === 1 ? 'project' : 'projects'}`;
      if (on) c.setAttribute('aria-current', 'true');
      else c.removeAttribute('aria-current');
      if (!on && cnt === 0) c.setAttribute('aria-disabled', 'true');
      else c.removeAttribute('aria-disabled');
      c.href = href({ ...S, [k]: on ? null : v });
    });
    const filtered = KEYS.some((k) => S[k]);
    count.textContent = filtered ? `Showing ${n} of ${total} projects` : `${total} projects`;
    empty.hidden = n > 0;
    clears.forEach((a) => { a.href = href({ view: S.view }); });
    clear.hidden = !filtered;
    list.dataset.view = S.view;
    toggle.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.viewSet === S.view)));
  };
  const go = (s, push) => {
    S = s;
    try {
      window.history[push ? 'pushState' : 'replaceState'](null, '', href(S));
    } catch (e) { /* sandboxed */ }
    apply();
  };
  chips.forEach((c) => c.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    e.preventDefault();
    if (c.getAttribute('aria-disabled') === 'true') return;
    const k = c.dataset.facet;
    const v = c.dataset.value;
    go({ ...S, [k]: S[k] === v ? null : v }, true);
  }));
  clears.forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    go({ view: S.view }, true);
    (chips[0] || a).focus();
  }));
  toggle.addEventListener('click', (e) => {
    const b = e.target.closest('[data-view-set]');
    if (b) go({ ...S, view: b.dataset.viewSet }, false);
  });
  window.addEventListener('popstate', () => {
    S = read();
    apply();
  });
  if (window.matchMedia('(width <= 599px)').matches && !KEYS.some((k) => S[k])) fold.open = false;
  window.matchMedia('(width >= 600px)').addEventListener('change', (e) => {
    if (e.matches) fold.open = true;
  });
  apply();
}

export default function decorate(block) {
  const variant = ['filters', 'related'].find((v) => block.classList.contains(v)) || 'default';
  const items = [...block.children].map(parseRow).filter(Boolean);
  const sectors = new Set(items.flatMap((it) => it.facets.sector.map((s) => s.toLowerCase())));
  const showSector = sectors.size > 1 || variant === 'related';

  const list = document.createElement('ul');
  list.className = 'project-index-list';
  items.forEach((it) => list.append(buildRow(it, variant, showSector)));
  if (items.length && items.every((it) => !it.picture)) block.classList.add('text-only');

  // the index reaches the first viewport on listing pages: the first frame is the LCP candidate
  const section = block.closest('.section');
  const main = block.closest('main');
  const firstImg = list.querySelector('img');
  if (firstImg && main && [...main.children].indexOf(section) <= 1) {
    firstImg.loading = 'eager';
    firstImg.fetchPriority = 'high';
  }

  if (variant === 'filters') {
    list.dataset.view = 'list';
    buildFilters(block, list, items, items.length);
    return;
  }
  block.replaceChildren(list);
}
