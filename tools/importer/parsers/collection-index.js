/* eslint-disable */
/* global WebImporter */

/**
 * collection-index — default (cover + title + count) · selected (2-up selected works, lightbox) ·
 * strip (more collections, compact).
 * One row per collection: picture · title link · meta (`89 photographs · Region`, plus an exhibit
 * note as a further paragraph when the source has one).
 * Source: .wall (home teaser / photography hub collections), .photo-wall in selected-works,
 * ul.siblings (more collections on a collection page).
 * Group dividers inside a wall ("Regions", "Exhibits") split it into consecutive blocks with the
 * divider as default content between them; .exhibit-notes follow as default content.
 */
export default function parse(element, { document }) {
  const text = (n) => (n ? n.textContent : '').replace(/\s+/g, ' ').trim();
  const mk = (tag, kids) => {
    const e = document.createElement(tag);
    (Array.isArray(kids) ? kids : [kids]).filter((k) => k != null && k !== '').forEach((k) => e.append(typeof k === 'string' ? document.createTextNode(k) : k));
    return e;
  };
  const link = (href, label) => { const a = mk('a', label); a.setAttribute('href', href); return a; };

  const section = element.closest('section');
  const ds = section ? section.dataset.section : '';
  let name = 'Collection Index';
  if (ds === 'selected-works') name = 'Collection Index (selected)';
  else if (element.matches('ul.siblings')) name = 'Collection Index (strip)';

  // collection title → href from this page's links (selected works carry only a label)
  const hrefByTitle = {};
  document.querySelectorAll('a[href*="photography/"]').forEach((a) => {
    const t = text(a);
    if (t && !hrefByTitle[t]) hrefByTitle[t] = a.getAttribute('href');
  });

  const out = [];
  let rows = [];
  const flush = () => {
    if (rows.length) out.push(WebImporter.DOMUtils.createTable([[name], ...rows], document));
    rows = [];
  };

  const items = element.matches('ul.siblings') ? [...element.querySelectorAll(':scope > li')] : [...element.children];
  items.forEach((item) => {
    if (item.matches('.wall__divider')) {
      flush();
      out.push(mk(item.tagName === 'H3' ? 'h3' : 'p', text(item)));
      return;
    }
    if (item.matches('.exhibit-notes')) {
      flush();
      [...item.children].forEach((c) => out.push(c.tagName === 'A' ? mk('p', c.cloneNode(true)) : c.cloneNode(true)));
      return;
    }
    const img = item.querySelector('img');
    if (!img) return;
    const pic = document.createElement('img');
    pic.setAttribute('src', img.getAttribute('data-best-src') || img.getAttribute('src'));
    pic.setAttribute('alt', img.getAttribute('alt') || '');

    let title;
    const meta = [];
    if (name === 'Collection Index (selected)') {
      // caption "Iowa · Midwest" → title "Iowa" (linked to its collection) + meta "Midwest"
      const [t, ...rest] = text(item.querySelector('figcaption')).split(' · ');
      title = hrefByTitle[t] ? link(hrefByTitle[t], t) : t;
      if (rest.length) meta.push(mk('p', rest.join(' · ')));
    } else {
      const a = item.querySelector('.frame__title a, .sibling__title a');
      title = a ? link(a.getAttribute('href'), text(a)) : '';
      const kind = item.querySelector('.frame__kind, .sibling__count');
      if (kind) meta.push(mk('p', text(kind)));
      item.querySelectorAll('.frame__note').forEach((n) => meta.push(n.cloneNode(true)));
    }
    rows.push([pic, mk('p', title), meta]);
  });
  flush();
  element.replaceWith(...out);
}
