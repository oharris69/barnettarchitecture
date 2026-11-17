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
    // the authored phase name MOVES into a heading wrapper (a paragraph gets role=heading)
    const h = document.createElement('div');
    h.className = 'process-steps-name';
    const authored = s.nameCell.querySelector('h1, h2, h3, h4, h5, h6');
    if (!authored) {
      h.setAttribute('role', 'heading');
      h.setAttribute('aria-level', '3');
    }
    const src = authored || s.nameCell.querySelector('p');
    if (src) h.append(src);
    else h.append(...s.nameCell.childNodes);
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
    // definition table: the authored <ul> stays (one editable unit); inside each item the term
    // and its definition are wrapped in spans in place — textContent unchanged (EW1)
    body.querySelectorAll(':scope > ul').forEach((ul) => {
      const lis = [...ul.children];
      const termFirst = (item) => item.firstElementChild && item.firstElementChild.tagName === 'STRONG'
        && textOf(item).startsWith(textOf(item.firstElementChild));
      if (!lis.length || !lis.every(termFirst)) return;
      lis.forEach((entry) => {
        const strong = entry.firstElementChild;
        const term = document.createElement('span');
        term.className = 'process-steps-term';
        const def = document.createElement('span');
        def.className = 'process-steps-def';
        const rest = [...entry.childNodes].filter((n) => n !== strong);
        // a leading ": " / " — " between term and definition is kept, unprinted
        const lead = rest[0];
        if (lead && lead.nodeType === 3) {
          const m = lead.textContent.match(/^[\s:–—-]+/);
          if (m) {
            const sep = document.createElement('span');
            sep.className = 'process-steps-sep';
            const [gap] = m;
            sep.textContent = gap;
            lead.textContent = lead.textContent.slice(gap.length);
            term.append(strong, sep);
          } else term.append(strong);
        } else term.append(strong);
        def.append(...rest);
        entry.replaceChildren(term, def);
      });
      ul.classList.add('process-steps-systems');
    });
    li.append(h, body);
    list.append(li);
  });

  block.replaceChildren(index, list);
}
