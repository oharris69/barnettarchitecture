/*
 * pager — row 1: previous project link · row 2: next project link.
 * Any further text in a row (e.g. "Residential · New home · Madison, WI")
 * becomes its dimension line.
 * Card-as-link (EW6): the authored title paragraph and meta paragraph MOVE into the card
 * <a>; the inner authored anchor is unwrapped after its href is read.
 */
export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.className = 'pager-nav';
  nav.setAttribute('aria-label', 'More projects');
  const rows = [...block.children].filter((r) => r.querySelector('a'));
  rows.slice(0, 2).forEach((row, i) => {
    const src = row.querySelector('a');
    const dir = i === 0 && rows.length > 1 ? 'prev' : 'next';
    const a = document.createElement('a');
    a.href = src.getAttribute('href');
    a.rel = dir;
    a.className = `pager-${dir}`;
    const title = document.createElement('div');
    title.className = 'pager-title';
    const titleP = src.closest('p, h1, h2, h3, h4, h5, h6');
    // the rest of the row (meta line), in authored order, before anything moves
    const extras = [...row.querySelectorAll(':scope > div > *')]
      .filter((el) => el !== titleP && el !== src && el.textContent.trim());
    title.append(titleP || src);
    src.replaceWith(...src.childNodes);
    const label = document.createElement('span');
    label.className = 'pager-dir label';
    label.textContent = dir === 'prev' ? '← Previous project' : 'Next project →';
    a.append(title, label);
    if (extras.length) {
      const dim = document.createElement('div');
      dim.className = 'dim dim-stack';
      const span = document.createElement('span');
      span.append(...extras);
      dim.append(span);
      a.append(dim);
    }
    nav.append(a);
  });
  const heading = document.createElement('h2');
  heading.className = 'visually-hidden';
  heading.textContent = 'More projects';
  block.replaceChildren(heading, nav);
}
