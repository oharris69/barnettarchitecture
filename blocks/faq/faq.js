/*
 * faq — one row per item: question · answer. A disclosure list (EW7: the authored question
 * paragraph MOVES into a heading wrapper beside a chevron-only toggle button, never inside a
 * <button>/<summary>, so it stays inline-editable; the whole question row takes the click).
 * The section head (H2 + links) is reabsorbed into the side rail.
 * scripts.js reads the same rows to emit FAQPage JSON-LD.
 */
import { reabsorbHead, textOf } from '../../scripts/utils.js';

function setOpen(item, open) {
  item.classList.toggle('is-open', open);
  const btn = item.querySelector('.faq-toggle');
  const answer = item.querySelector('.faq-answer');
  if (btn) btn.setAttribute('aria-expanded', String(open));
  if (answer) answer.hidden = !open;
}

export default function decorate(block) {
  const list = document.createElement('div');
  list.className = 'faq-list';
  const uid = Math.random().toString(36).slice(2, 7);
  [...block.children].forEach((row, i) => {
    const cells = [...row.children].filter((c) => textOf(c));
    if (!cells.length) return;
    const [qCell, ...aCells] = cells;
    const id = `faq-${uid}-${i + 1}`;
    const item = document.createElement('div');
    item.className = 'faq-item';
    const head = document.createElement('div');
    head.className = 'faq-row';
    const q = document.createElement('div');
    q.className = 'faq-question';
    const authored = qCell.querySelector('h1, h2, h3, h4, h5, h6');
    if (!authored) {
      // the question is authored as a paragraph: the wrapper carries the heading semantics
      q.setAttribute('role', 'heading');
      q.setAttribute('aria-level', '3');
    }
    const src = authored || qCell.querySelector('p');
    if (src) q.append(src);
    else q.append(...qCell.childNodes);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'faq-toggle';
    btn.setAttribute('aria-controls', id);
    btn.setAttribute('aria-label', `Answer: ${textOf(q)}`);
    head.append(q, btn);
    const answer = document.createElement('div');
    answer.className = 'faq-answer';
    answer.id = id;
    aCells.forEach((c) => {
      if (c.children.length) answer.append(...c.childNodes);
      else {
        const p = document.createElement('p');
        p.append(...c.childNodes);
        answer.append(p);
      }
    });
    item.append(head, answer);
    setOpen(item, i === 0);
    head.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      setOpen(item, !item.classList.contains('is-open'));
    });
    list.append(item);
  });
  const head = reabsorbHead(block, 'faq-head');
  const section = block.closest('.section');
  if (section && !section.id) section.id = 'faq';
  if (head) block.replaceChildren(head, list);
  else {
    block.classList.add('no-head');
    block.replaceChildren(list);
  }
}
