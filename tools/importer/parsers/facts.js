/* eslint-disable */
/* global WebImporter */

/**
 * facts — one row per fact: label · value (the value keeps its facet links, e.g. /projects?type=…).
 * Source: dl.factbar on project pages.
 */
export default function parse(element, { document }) {
  const text = (n) => (n ? n.textContent : '').replace(/\s+/g, ' ').trim();
  const rows = [];
  element.querySelectorAll(':scope > div').forEach((pair) => {
    const dt = pair.querySelector('dt');
    const dd = pair.querySelector('dd');
    if (!dt || !dd) return;
    const value = document.createElement('p');
    value.append(...[...dd.cloneNode(true).childNodes]);
    rows.push([text(dt), value]);
  });
  const table = WebImporter.DOMUtils.createTable([['Facts'], ...rows], document);
  element.replaceWith(table);
}
