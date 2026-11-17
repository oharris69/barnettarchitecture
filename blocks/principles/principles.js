/*
 * principles — one row per principle: title · text. A 2×2 hairline sheet; the section head
 * (H2 + links) is reabsorbed into the side rail beside it.
 * The authored title (a heading, or a paragraph wrapped as role=heading level 3) and text
 * paragraphs MOVE into the sheet — never rebuilt (EW1).
 */
import { reabsorbHead, textOf } from '../../scripts/utils.js';

export default function decorate(block) {
  const sheet = document.createElement('div');
  sheet.className = 'principles-sheet';
  [...block.children].forEach((row) => {
    const cells = [...row.children].filter((c) => textOf(c));
    if (!cells.length) return;
    const item = document.createElement('div');
    item.className = 'principles-item';
    const [titleCell, ...rest] = cells;
    const title = document.createElement('div');
    title.className = 'principles-title';
    const h = titleCell.querySelector('h1, h2, h3, h4, h5, h6');
    if (!h) {
      title.setAttribute('role', 'heading');
      title.setAttribute('aria-level', '3');
    }
    const src = h || titleCell.querySelector('p');
    if (src) title.append(src);
    else title.append(...titleCell.childNodes);
    item.append(title);
    rest.forEach((c) => {
      if (c.children.length) item.append(...c.childNodes);
      else {
        const p = document.createElement('p');
        p.append(...c.childNodes);
        item.append(p);
      }
    });
    sheet.append(item);
  });
  const head = reabsorbHead(block, 'principles-head');
  if (head) {
    head.querySelectorAll('a.button').forEach((a) => a.classList.add('principles-link'));
    block.replaceChildren(head, sheet);
  } else {
    block.classList.add('no-head');
    block.replaceChildren(sheet);
  }
}
