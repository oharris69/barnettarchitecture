/* eslint-disable */
/* global WebImporter */

/**
 * pager — row 1: previous project link · row 2: next project link.
 * Each cell: the project link (title) + its dimension string as a second paragraph. The
 * "← Previous project" / "Next project →" direction labels are UI chrome rendered by the block.
 * Source: nav.pager on project pages.
 */
export default function parse(element, { document }) {
  const text = (n) => (n ? n.textContent : '').replace(/\s+/g, ' ').trim();
  const rows = [];
  ['prev', 'next'].forEach((rel) => {
    const a = element.querySelector(`a[rel="${rel}"]`);
    if (!a) return;
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.setAttribute('href', a.getAttribute('href'));
    link.textContent = text(a.querySelector('.pager__title')) || text(a);
    p.append(link);
    const cell = [p];
    const dims = text(a.querySelector(':scope > .dim'));
    if (dims) {
      const d = document.createElement('p');
      d.textContent = dims;
      cell.push(d);
    }
    rows.push([cell]);
  });
  const table = WebImporter.DOMUtils.createTable([['Pager'], ...rows], document);
  element.replaceWith(table);
}
