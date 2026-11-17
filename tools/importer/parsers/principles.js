/* eslint-disable */
/* global WebImporter */

/**
 * principles — one row per principle: title · text.
 * Source: .principles__sheet (home, about).
 */
export default function parse(element, { document }) {
  const text = (n) => (n ? n.textContent : '').replace(/\s+/g, ' ').trim();
  const rows = [...element.querySelectorAll('.principle')].map((p) => {
    const h = p.querySelector('h3, h4');
    return [text(h), [...p.children].filter((c) => c !== h).map((c) => c.cloneNode(true))];
  });
  const table = WebImporter.DOMUtils.createTable([['Principles'], ...rows], document);
  element.replaceWith(table);
}
