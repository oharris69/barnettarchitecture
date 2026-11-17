/*
 * process-steps — one row per phase: phase name · richtext.
 * A chain-dimension index of the phases (anchor links) above one ruled sheet per phase,
 * named, not numbered. The first paragraph of each phase reads as its lead; a paragraph that
 * starts "Deliverables" (label + text) becomes the phase's aside.
 */
import { slugify, textOf } from '../../scripts/utils.js';

export default function decorate(block) {
  const steps = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => textOf(c));
    if (!cells.length) return;
    const [nameCell, ...bodyCells] = cells;
    const name = textOf(nameCell);
    const taken = new Set(steps.map((s) => s.id));
    let id = slugify(name);
    while (document.getElementById(id) || taken.has(id)) id = `${id}-x`;
    steps.push({
      name, id, nameCell, bodyCells,
    });
  });

  const index = document.createElement('nav');
  index.className = 'process-steps-index';
  index.setAttribute('aria-label', 'Phases');
  const chain = document.createElement('ol');
  chain.className = 'process-steps-chain';
  index.append(chain);

  const list = document.createElement('ol');
  list.className = 'process-steps-list';

  steps.forEach((s) => {
    const cli = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'process-steps-chain-label';
    a.href = `#${s.id}`;
    a.textContent = s.name;
    cli.append(a);
    chain.append(cli);

    const li = document.createElement('li');
    li.className = 'process-steps-step';
    li.id = s.id;
    const h = document.createElement('h3');
    h.className = 'process-steps-name';
    const src = s.nameCell.querySelector('h1, h2, h3, h4, h5, h6, p');
    h.append(...(src || s.nameCell).childNodes);
    const body = document.createElement('div');
    body.className = 'process-steps-body';
    s.bodyCells.forEach((c) => {
      if (c.children.length) body.append(...c.childNodes);
      else {
        const p = document.createElement('p');
        p.append(...c.childNodes);
        body.append(p);
      }
    });
    const firstP = body.querySelector(':scope > p');
    if (firstP) firstP.classList.add('process-steps-lead');
    // "Deliverables" label paragraph (+ the paragraph after it) → aside
    [...body.querySelectorAll(':scope > p, :scope > h4, :scope > h5')].forEach((p) => {
      if (!/^deliverables:?$/i.test(textOf(p))) return;
      const aside = document.createElement('div');
      aside.className = 'process-steps-aside';
      const next = p.nextElementSibling;
      p.classList.add('label');
      p.before(aside);
      aside.append(p);
      if (next) aside.append(next);
    });
    // "term — definition" lists (<li><strong>Design-build</strong> An approach …</li>) read as a
    // definition list, styled as a ruled table
    body.querySelectorAll(':scope > ul').forEach((ul) => {
      const lis = [...ul.children];
      const termFirst = (item) => item.firstElementChild && item.firstElementChild.tagName === 'STRONG'
        && textOf(item).startsWith(textOf(item.firstElementChild));
      if (!lis.length || !lis.every(termFirst)) return;
      const dl = document.createElement('dl');
      lis.forEach((entry) => {
        const dt = document.createElement('dt');
        const strong = entry.firstElementChild;
        dt.append(...strong.childNodes);
        strong.remove();
        const dd = document.createElement('dd');
        dd.append(...entry.childNodes);
        if (dd.firstChild && dd.firstChild.nodeType === 3) {
          dd.firstChild.textContent = dd.firstChild.textContent.replace(/^[\s:–—-]+/, '');
        }
        dl.append(dt, dd);
      });
      ul.replaceWith(dl);
    });
    body.querySelectorAll('dl').forEach((dl) => dl.classList.add('process-steps-systems'));
    li.append(h, body);
    list.append(li);
  });

  block.replaceChildren(index, list);
}
