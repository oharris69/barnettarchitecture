/*
 * faq — one row per item: question · answer. Native <details>/<summary> (keyboard and
 * no-JS-content friendly); the section head (H2 + links) is reabsorbed into the side rail.
 * scripts.js reads the same rows to emit FAQPage JSON-LD.
 */
import { reabsorbHead, textOf } from '../../scripts/utils.js';

export default function decorate(block) {
  const list = document.createElement('div');
  list.className = 'faq-list';
  [...block.children].forEach((row, i) => {
    const cells = [...row.children].filter((c) => textOf(c));
    if (!cells.length) return;
    const [qCell, ...aCells] = cells;
    const details = document.createElement('details');
    details.className = 'faq-item';
    if (i === 0) details.open = true;
    const summary = document.createElement('summary');
    const q = document.createElement('h3');
    q.className = 'faq-question';
    const src = qCell.querySelector('h1, h2, h3, h4, h5, h6, p');
    q.append(...(src || qCell).childNodes);
    summary.append(q);
    const answer = document.createElement('div');
    answer.className = 'faq-answer';
    aCells.forEach((c) => {
      if (c.children.length) answer.append(...c.childNodes);
      else {
        const p = document.createElement('p');
        p.append(...c.childNodes);
        answer.append(p);
      }
    });
    details.append(summary, answer);
    list.append(details);
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
