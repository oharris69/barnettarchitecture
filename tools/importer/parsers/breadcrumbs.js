/* eslint-disable */
/* global WebImporter */

/**
 * breadcrumbs — one row with the trail links (the current page, when the source shows it, as text).
 * Source: nav.hero__crumbs (project pages; moved out of the hero by barnett-cleanup) and
 * nav.crumbs (photography collections).
 */
export default function parse(element, { document }) {
  const text = (n) => (n ? n.textContent : '').replace(/\s+/g, ' ').trim();
  const ul = document.createElement('ul');
  element.querySelectorAll('li').forEach((li) => {
    const item = document.createElement('li');
    const a = li.querySelector('a');
    if (a) {
      const link = document.createElement('a');
      link.setAttribute('href', a.getAttribute('href'));
      link.textContent = text(a);
      item.append(link);
    } else {
      item.textContent = text(li);
    }
    ul.append(item);
  });
  const table = WebImporter.DOMUtils.createTable([['Breadcrumbs'], [ul]], document);
  element.replaceWith(table);
}
