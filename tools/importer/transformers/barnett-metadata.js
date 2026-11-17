/* eslint-disable */
/* global WebImporter */

/**
 * Page `metadata` block (last in the document), per the block contract:
 *   Title · Description · Image (og:image URL) · Template · project facets
 *   (Sector / Type / Location / Approach — canonical facet labels read from the migrated /projects
 *   index, the same taxonomy the project-index rows use) · Robots (404 only).
 * Head values are captured by barnett-cleanup in preprocess. JSON-LD is not authored.
 */

let metaCatalogCache = null;

/** slug → { sector, type, location, approach } labels, from /projects (same origin, sync). */
function metaProjectFacets(pageUrl) {
  if (metaCatalogCache) return metaCatalogCache;
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
        out[m[1]] = {
          Sector: lab('sector', li.dataset.sector),
          Type: lab('type', li.dataset.type),
          Location: lab('location', li.dataset.location),
          Approach: lab('approach', li.dataset.approach),
        };
      });
    }
  } catch (e) {
    console.warn('metadata: project facets unavailable', e);
  }
  metaCatalogCache = out;
  return out;
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;
  const { document } = payload;
  const params = payload.params || {};
  if (element !== document.body) return; // the page only, never the extra documents
  const head = params.headMeta || {};
  const template = (payload.template && payload.template.name) || '';
  const rows = [['Metadata']];
  if (head.title) rows.push(['Title', head.title]);
  if (head.description) rows.push(['Description', head.description]);
  if (head.image) rows.push(['Image', head.image]);
  if (template) rows.push(['Template', template]);

  if (template === 'project') {
    const pageUrl = params.originalURL || payload.url || window.location.href;
    const m = /\/projects\/([^/?#]+)/.exec(new URL(pageUrl).pathname);
    const facets = m && metaProjectFacets(pageUrl)[m[1]];
    if (facets) {
      ['Sector', 'Type', 'Location', 'Approach'].forEach((k) => { if (facets[k]) rows.push([k, facets[k]]); });
    }
  }
  if (head.robots) rows.push(['Robots', head.robots]);

  element.append(WebImporter.DOMUtils.createTable(rows, document));
}
