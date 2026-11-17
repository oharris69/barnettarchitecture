/*
 * footer — graphite NAP title block, built from the authored /footer document:
 *   section 1: wordmark link + address paragraph (name, street, city, tel, mailto)
 *   section 2: sitemap columns (heading + list, repeated)
 *   section 3: legal line(s) ("© 2026 Barnett Architecture LLC", "Madison, Wisconsin")
 * Decorated defensively: columns are found wherever a heading is followed by a list; the legal
 * line is any paragraph carrying ©.
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { contentBase, localizeLinks, textOf } from '../../scripts/utils.js';

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : `${contentBase()}/footer`;
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  const grid = document.createElement('div');
  grid.className = 'footer-grid';
  const id = document.createElement('div');
  id.className = 'footer-id';
  const map = document.createElement('nav');
  map.className = 'footer-map';
  map.setAttribute('aria-label', 'Site');
  const legal = document.createElement('p');
  legal.className = 'footer-legal';

  const used = new Set();
  // sitemap columns: heading + following list
  fragment.querySelectorAll('h2, h3, h4, h5, h6').forEach((h) => {
    const list = h.nextElementSibling;
    if (!list || !/^(UL|OL)$/.test(list.tagName)) return;
    const col = document.createElement('div');
    const title = document.createElement('h2');
    title.className = 'label';
    title.append(...h.childNodes);
    col.append(title, list);
    map.append(col);
    used.add(h);
  });
  // lists without a heading still become columns
  fragment.querySelectorAll('ul, ol').forEach((list) => {
    if (map.contains(list) || list.closest('li')) return;
    const col = document.createElement('div');
    col.append(list);
    map.append(col);
  });

  // legal: the © paragraph and its siblings in that section
  const copy = [...fragment.querySelectorAll('p')].find((p) => /©|&copy;|copyright/i.test(p.textContent));
  if (copy) {
    const host = copy.parentElement;
    [...host.querySelectorAll(':scope > p')].forEach((p) => {
      const span = document.createElement('span');
      span.append(...p.childNodes);
      legal.append(span);
      used.add(p);
      p.remove();
    });
  }

  // identity: wordmark (first link to the home page) + the address
  const paras = [...fragment.querySelectorAll('p')].filter((p) => !used.has(p) && !map.contains(p) && textOf(p));
  const brandP = paras.find((p) => {
    const a = p.querySelector('a');
    return a && textOf(p) === textOf(a) && /^(\/|\/content\/?|\/index)?$/.test(a.getAttribute('href') || '');
  });
  if (brandP) {
    const a = brandP.querySelector('a');
    a.className = 'footer-wordmark';
    id.append(a);
  }
  const address = document.createElement('address');
  paras.filter((p) => p !== brandP).forEach((p, i) => {
    if (i) address.append(document.createElement('br'));
    address.append(...p.childNodes);
  });
  if (textOf(address)) id.append(address);

  grid.append(id);
  if (map.children.length) grid.append(map);
  if (textOf(legal)) grid.append(legal);
  block.replaceChildren(grid);
  localizeLinks(block);
}
