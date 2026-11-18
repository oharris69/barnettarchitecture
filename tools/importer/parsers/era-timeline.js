/* eslint-disable */
/* global WebImporter */

/**
 * era-timeline — home variant c: "decade by decade" (stardust/prototypes/index-c-proposed.html).
 * Source: section[data-section="timeline"] .tl__chapters (+ the section's Push-Pull quote figure and
 * the era scale, read for its labels; both leave the DOM). The H2 + framing line stay default content.
 * Output rows (see blocks/era-timeline/era-timeline.js):
 *   quote row:   <p>“…”</p> · <p><a href=/projects/push-pull>Push-Pull</a> · Madison, WI</p>
 *   era row:     scale label ("1873") · <h3>Built 1873</h3> [+ <p>fact line</p>]
 *   project row: picture · <h4><a href>Name</a></h4> [+ <p>tag</p>] · <p>Type</p><p>Location</p>… · <p>“quote”</p>
 *   list row:    (no picture) · <p><a href>Name</a></p> [+ <p>tag</p>] · facts paragraphs
 */
export default function parse(element, { document }) {
  const text = (n) => (n ? n.textContent : '').replace(/\s+/g, ' ').trim();
  const mk = (tag, kids) => {
    const e = document.createElement(tag);
    (Array.isArray(kids) ? kids : [kids]).filter((k) => k != null && k !== '').forEach((k) => e.append(typeof k === 'string' ? document.createTextNode(k) : k));
    return e;
  };
  const link = (href, label) => { const a = mk('a', label); a.setAttribute('href', href); return a; };
  const pic = (img) => {
    if (!img) return '';
    const i = document.createElement('img');
    i.setAttribute('src', img.getAttribute('data-best-src') || img.getAttribute('src'));
    i.setAttribute('alt', img.getAttribute('alt') || '');
    return i;
  };
  const facts = (s) => s.split(' · ').map((v) => v.trim()).filter(Boolean).map((v) => mk('p', v));
  const quotes = (root) => [...(root ? root.querySelectorAll('p') : [])].map((p) => mk('p', text(p)));
  /** name text without its tag */
  const nameOf = (n) => {
    if (!n) return '';
    const c = n.cloneNode(true);
    c.querySelectorAll('.tag').forEach((t) => t.remove());
    return text(c);
  };

  const section = element.closest('section') || document;
  const rows = [];

  // the timeline's opening sentence (Push-Pull)
  const fig = section.querySelector('figure.tlo__quote');
  if (fig) {
    const cap = fig.querySelector('figcaption');
    const by = mk('p', []);
    if (cap) {
      cap.childNodes.forEach((n) => {
        if (n.nodeName === 'A') by.append(link(n.getAttribute('href'), text(n)));
        else if (n.textContent) by.append(document.createTextNode(n.textContent.replace(/\s+/g, ' ')));
      });
    }
    rows.push([quotes(fig.querySelector('blockquote')), by]);
    fig.remove();
  }

  // era scale labels, by chapter id
  const labels = {};
  section.querySelectorAll('nav.tl-scale a[href^="#"]').forEach((a) => { labels[a.getAttribute('href').slice(1)] = text(a); });

  element.querySelectorAll(':scope > article.era').forEach((era) => {
    const h = era.querySelector('.era__head');
    const headCell = [mk('h3', text(h))];
    era.querySelectorAll('.era__top > p').forEach((p) => headCell.push(mk('p', text(p))));
    rows.push([labels[era.id] || text(era.querySelector('.era__num')) || text(h), headCell]);

    const lead = era.querySelector('.era__lead');
    if (lead) {
      const go = era.querySelector('.era__go');
      rows.push([
        pic(era.querySelector('.era__frame img')),
        [mk('h4', go ? link(go.getAttribute('href'), text(lead.querySelector('.era__title'))) : text(lead.querySelector('.era__title')))],
        facts(text(lead.querySelector('.era__facts'))),
        quotes(era.querySelector('.era__quote')),
      ]);
    }
    era.querySelectorAll('.plate').forEach((plate) => {
      const a = plate.querySelector('a.link-arrow');
      const title = [mk('h4', a ? link(a.getAttribute('href'), text(plate.querySelector('.plate__title'))) : text(plate.querySelector('.plate__title')))];
      plate.querySelectorAll('.plate__head .tag').forEach((t) => title.push(mk('p', text(t))));
      rows.push([
        pic(plate.querySelector('img')),
        title,
        facts(text(plate.querySelector('.dim'))),
        quotes(plate.querySelector('blockquote')),
      ]);
    });
    era.querySelectorAll('.tl-list li').forEach((li) => {
      const a = li.querySelector('a');
      if (!a) return;
      const title = [mk('p', link(a.getAttribute('href'), nameOf(li.querySelector('.tl-list__name')) || text(a)))];
      li.querySelectorAll('.tag').forEach((t) => title.push(mk('p', text(t))));
      rows.push(['', title, facts(text(li.querySelector('.tl-list__facts')))]);
    });
  });

  const table = WebImporter.DOMUtils.createTable([['Era Timeline'], ...rows], document);
  section.querySelectorAll('nav.tl-scale').forEach((n) => n.remove());
  element.replaceWith(table);
}
