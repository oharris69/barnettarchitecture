/*
 * breadcrumbs — one row with the trail, authored as a list of links (Home / Photography / Iowa).
 * The authored <ul> MOVES into the <nav> (one editable unit, EW1/EW5); the last crumb is the
 * current page (aria-current="page"), whether authored as text or a link.
 * Fallback: a trail authored as one paragraph of links is rebuilt as an <ol> (EW5 — a
 * paragraph rendered as N items cannot stay editable; author a list).
 */
import { linkPath, sitePath, textOf } from '../../scripts/utils.js';

function markCurrent(li, here) {
  const a = li.querySelector('a');
  if (!a) {
    // the list item's own text, wrapped in place (the authored <ul> keeps its identity)
    const span = document.createElement('span');
    span.setAttribute('aria-current', 'page');
    span.append(...li.childNodes);
    li.append(span);
    return;
  }
  if (linkPath(a) !== here) return;
  const span = document.createElement('span');
  span.setAttribute('aria-current', 'page');
  a.replaceWith(span);
  span.append(...a.childNodes);
}

export default function decorate(block) {
  const here = sitePath();
  const nav = document.createElement('nav');
  nav.className = 'breadcrumbs-nav label';
  nav.setAttribute('aria-label', 'Breadcrumb');

  const list = block.querySelector('ul, ol');
  if (list) {
    const items = [...list.children].filter((li) => textOf(li));
    if (items.length) markCurrent(items[items.length - 1], here);
    nav.append(list);
    block.replaceChildren(nav);
    return;
  }

  const links = [...block.querySelectorAll('a')];
  // trailing plain text after the last link (e.g. "Home / Photography / Iowa" with Iowa unlinked)
  const full = textOf(block);
  const tail = links.length ? full.split(textOf(links[links.length - 1])).pop() : full;
  const tailText = tail.replace(/^[\s/›>»|·]+/, '').trim();
  const ol = document.createElement('ol');
  links.forEach((a, i) => {
    const li = document.createElement('li');
    li.append(a);
    ol.append(li);
    if (i === links.length - 1 && !tailText) markCurrent(li, here);
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
