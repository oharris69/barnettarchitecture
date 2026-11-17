/*
 * breadcrumbs — one row with the trail links (Home / Photography / Iowa).
 * The last crumb is the current page (aria-current="page"), whether authored as text or a link.
 */
import { linkPath, sitePath, textOf } from '../../scripts/utils.js';

export default function decorate(block) {
  const links = [...block.querySelectorAll('a')];
  const items = [];
  links.forEach((a) => items.push(a));
  // trailing plain text after the last link (e.g. "Home / Photography / Iowa" with Iowa unlinked)
  const full = textOf(block);
  const tail = links.length ? full.split(textOf(links[links.length - 1])).pop() : full;
  const tailText = tail.replace(/^[\s/›>»|·]+/, '').trim();
  const here = sitePath();

  const nav = document.createElement('nav');
  nav.className = 'breadcrumbs-nav label';
  nav.setAttribute('aria-label', 'Breadcrumb');
  const ol = document.createElement('ol');
  items.forEach((a, i) => {
    const li = document.createElement('li');
    const isLast = i === items.length - 1 && !tailText;
    if (isLast && linkPath(a) === here) {
      const span = document.createElement('span');
      span.setAttribute('aria-current', 'page');
      span.append(...a.childNodes);
      li.append(span);
    } else {
      li.append(a);
    }
    ol.append(li);
  });
  if (tailText) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.setAttribute('aria-current', 'page');
    span.textContent = tailText;
    li.append(span);
    ol.append(li);
  }
  nav.append(ol);
  block.replaceChildren(nav);
}
