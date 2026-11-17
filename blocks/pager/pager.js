/*
 * pager — row 1: previous project link · row 2: next project link.
 * Any further text in a row (e.g. "Residential · New home · Madison, WI")
 * becomes its dimension line.
 */
import { dimLine, textOf } from '../../scripts/utils.js';

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
    const title = document.createElement('span');
    title.className = 'pager-title';
    title.append(...src.childNodes);
    const label = document.createElement('span');
    label.className = 'pager-dir label';
    label.textContent = dir === 'prev' ? '← Previous project' : 'Next project →';
    a.append(title, label);
    src.remove();
    const extra = textOf(row).replace(/^[\s·|–—-]+|[\s·|–—-]+$/g, '');
    if (extra) a.append(dimLine(extra, 'dim-stack', 'span'));
    nav.append(a);
  });
  const heading = document.createElement('h2');
  heading.className = 'visually-hidden';
  heading.textContent = 'More projects';
  block.replaceChildren(heading, nav);
}
