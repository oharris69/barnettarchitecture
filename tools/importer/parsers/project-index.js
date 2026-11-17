/* eslint-disable */
/* global WebImporter */

/**
 * project-index — default (ruled schedule rows) · filters (listing pages; facet chips, grid/list
 * toggle and URL state are rendered by the block from the rows) · related (project pages).
 * One row per project: picture · title link (H3) · facets cell = paragraphs
 * Sector | Type | Location | Approach, using the canonical facet labels of the migrated /projects
 * index (multi-valued types comma-separated, e.g. "Addition, Renovation"). A missing trailing
 * facet (no approach) is omitted.
 * Source: ul.schedule__list (featured / related) or the whole .index wrapper (listing).
 */

let piCatalogCache = null;

/** slug → { sector, type, location, approach } labels, from /projects (same origin, sync). */
function piProjectFacets(pageUrl) {
  if (piCatalogCache) return piCatalogCache;
  const out = {};
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${new URL(pageUrl).origin}/projects/index.html`, false);
    xhr.send(null);
    if (xhr.status === 200) {
      const doc = new DOMParser().parseFromString(xhr.responseText, 'text/html');
      const labels = {};
      doc.querySelectorAll('a.facet-chip[data-facet]').forEach((a) => {
        labels[a.dataset.facet] = labels[a.dataset.facet] || {};
        labels[a.dataset.facet][a.dataset.value] = [...a.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
      });
      const lab = (facet, v) => (v || '').split(/\s+/).filter(Boolean).map((s) => (labels[facet] || {})[s] || s).join(', ');
      doc.querySelectorAll('li.schedule__row[data-sector]').forEach((li) => {
        const a = li.querySelector('.schedule__title a');
        const m = a && /projects\/([^/?#]+)/.exec(a.getAttribute('href'));
        if (!m) return;
        out[m[1]] = [lab('sector', li.dataset.sector), lab('type', li.dataset.type), lab('location', li.dataset.location), lab('approach', li.dataset.approach)];
      });
    }
  } catch (e) {
    console.warn('project-index: project facets unavailable', e);
  }
  piCatalogCache = out;
  return out;
}

export default function parse(element, { document, url }) {
  const text = (n) => (n ? n.textContent : '').replace(/\s+/g, ' ').trim();
  const section = element.closest('section');
  const ds = section ? section.dataset.section : '';
  let name = 'Project Index';
  if (element.classList.contains('index') || element.querySelector('nav.filters')) name = 'Project Index (filters)';
  else if (ds === 'related-projects') name = 'Project Index (related)';

  const facetsBySlug = piProjectFacets(url || (document.location && document.location.href) || window.location.href);
  const rows = [];
  element.querySelectorAll('li.schedule__row').forEach((li) => {
    const a = li.querySelector('.schedule__title a');
    if (!a) return;
    const href = a.getAttribute('href');

    const img = li.querySelector('img');
    let pic = '';
    if (img) {
      pic = document.createElement('img');
      pic.setAttribute('src', img.getAttribute('data-best-src') || img.getAttribute('src'));
      pic.setAttribute('alt', img.getAttribute('alt') || '');
    }

    const h3 = document.createElement('h3');
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.textContent = text(a);
    h3.append(link);

    const m = /projects\/([^/?#]+)/.exec(href || '');
    let facets = m && facetsBySlug[m[1].replace(/\/index\.html$/, '')];
    if (!facets) facets = text(li.querySelector('.schedule__text .dim')).split(' · '); // the row's own dimension string
    while (facets.length && !facets[facets.length - 1]) facets = facets.slice(0, -1);
    const facetCell = facets.slice(0, 4).map((v) => {
      const p = document.createElement('p');
      p.textContent = v || '';
      return p;
    });

    rows.push([pic, h3, facetCell]);
  });

  const table = WebImporter.DOMUtils.createTable([[name], ...rows], document);
  element.replaceWith(table);
}
