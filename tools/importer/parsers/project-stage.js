/* eslint-disable */
/* global WebImporter */

/**
 * project-stage — home variant b: the sheet index beside a photo stage.
 * Source: section[data-section="index"] nav.ix__index (stardust/prototypes/index-b-proposed.html).
 * Output: the index label (H2 "Project index · 29 projects") as default content, then the block:
 *   group row:   one cell — <h3><a href="/residential">Residential</a> · 22</h3>
 *   project row: picture · <p><a href="/projects/x">Name</a></p> · facts = <p>Sector</p><p>Type</p><p>Location</p>
 * Type and Location are the entry's own facts (".ix__facts", "Type · Location"); Sector is the
 * canonical facet label from the migrated /projects index (same origin). The picture's single
 * src is set in preprocess from the entry's data-img (largest frame ≤ original width, ≤ 2400).
 * The opening (H1, line, CTAs) stays default content; hints, skip link and the stage are chrome.
 */

let psCatalogCache = null;

/** slug → sector label, from /projects (same origin, sync). */
function psSectors(pageUrl) {
  if (psCatalogCache) return psCatalogCache;
  const out = {};
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${new URL(pageUrl).origin}/projects/index.html`, false);
    xhr.send(null);
    if (xhr.status === 200) {
      const doc = new DOMParser().parseFromString(xhr.responseText, 'text/html');
      const labels = {};
      doc.querySelectorAll('a.facet-chip[data-facet="sector"]').forEach((a) => {
        labels[a.dataset.value] = [...a.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
      });
      doc.querySelectorAll('li.schedule__row[data-sector]').forEach((li) => {
        const a = li.querySelector('.schedule__title a');
        const m = a && /projects\/([^/?#]+)/.exec(a.getAttribute('href'));
        if (!m) return;
        out[m[1].replace(/\/index\.html$/, '')] = li.dataset.sector.split(/\s+/).filter(Boolean).map((s) => labels[s] || s).join(', ');
      });
    }
  } catch (e) {
    console.warn('project-stage: sectors unavailable', e);
  }
  psCatalogCache = out;
  return out;
}

/** preprocess (original DOM): each entry's picture gets its stage-size single src + verbatim alt */
export function prepareStageImages(root) {
  root.querySelectorAll('li.ix__item[data-img]').forEach((li) => {
    const [u, ow, oh] = (li.getAttribute('data-img') || '').split('|');
    const img = li.querySelector('img');
    if (!u || !img) return;
    const w = Math.min(2400, Number(ow) || 2400);
    const h = Math.round((w * Number(oh)) / Number(ow)) || Math.round(w / 1.5);
    const src = `https://static.wixstatic.com/media/${u}/v1/fill/w_${w},h_${h},al_c,q_85,enc_auto/${u}`;
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    img.setAttribute('src', src);
    img.setAttribute('data-best-src', src);
    img.setAttribute('alt', li.getAttribute('data-alt') || '');
  });
}

export default function parse(element, { document, url }) {
  const text = (n) => (n ? n.textContent : '').replace(/\s+/g, ' ').trim();
  const mk = (tag, kids) => {
    const e = document.createElement(tag);
    (Array.isArray(kids) ? kids : [kids]).filter((k) => k != null && k !== '').forEach((k) => e.append(typeof k === 'string' ? document.createTextNode(k) : k));
    return e;
  };
  const link = (href, label) => { const a = mk('a', label); a.setAttribute('href', href); return a; };
  const sectors = psSectors(url || (document.location && document.location.href) || window.location.href);

  const rows = [];
  element.querySelectorAll('.ix__group').forEach((group) => {
    const gh = group.querySelector('.ix__group-h');
    const ga = gh && gh.querySelector('a');
    let groupName = '';
    if (gh) {
      groupName = ga ? text(ga) : text(gh);
      const rest = text(gh).slice(groupName.length).trim(); // "· 22"
      const h3 = mk('h3', ga ? [link(ga.getAttribute('href'), groupName)] : [groupName]);
      if (rest) h3.append(document.createTextNode(` ${rest}`));
      rows.push([h3]);
    }
    group.querySelectorAll('li.ix__item').forEach((li) => {
      const a = li.querySelector('a');
      if (!a) return;
      const href = a.getAttribute('href');
      const name = text(li.querySelector('.ix__name')) || text(a);
      const img = li.querySelector('img');
      let pic = '';
      if (img) {
        pic = document.createElement('img');
        pic.setAttribute('src', img.getAttribute('data-best-src') || img.getAttribute('src'));
        pic.setAttribute('alt', img.getAttribute('alt') || '');
      }
      const m = /projects\/([^/?#]+)/.exec(href || '');
      const sector = (m && sectors[m[1]]) || groupName;
      const [type, location] = text(li.querySelector('.ix__facts')).split(' · ');
      const facts = [sector, type, location].filter((v) => v != null).map((v) => mk('p', v || ''));
      rows.push([pic, mk('p', link(href, name)), facts]);
    });
  });

  const out = [];
  const label = element.querySelector('.ix__label, .ix__head h2');
  if (label) out.push(mk('h2', text(label)));
  out.push(WebImporter.DOMUtils.createTable([['Project Stage'], ...rows], document));

  // chrome of the static prototype: the stage (duplicates the first entry) goes with the index
  const section = element.closest('section');
  if (section) section.querySelectorAll('.ix__stage').forEach((n) => n.remove());
  element.replaceWith(...out);
}
