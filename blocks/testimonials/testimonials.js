/*
 * testimonials — one row per testimonial: quote (paragraphs) ·
 * attribution (+ year/era if captured).
 * default: the single featured quote at headline scale.
 * ledger:  the long list, full text; who sticks beside the quote. A one-cell row with a short text
 *          ("2007–present") opens a group. The section head (H2 + intro) is reabsorbed beside it.
 * Every authored paragraph (quote, attribution lines, group label) MOVES into the layout;
 * wrappers carry the classes (EW1/EW2).
 */
import { reabsorbHead, slugify, textOf } from '../../scripts/utils.js';

function paragraphs(cell) {
  if (!cell) return [];
  const kids = [...cell.children].filter((c) => textOf(c));
  if (kids.length) return kids;
  if (!textOf(cell)) return [];
  const p = document.createElement('p');
  p.append(...cell.childNodes);
  return [p];
}

function parse(block) {
  return [...block.children].map((row) => {
    const cells = [...row.children].filter((c) => textOf(c));
    if (!cells.length) return null;
    if (cells.length === 1 && textOf(cells[0]).length <= 40) return { group: cells[0] };
    return { quote: paragraphs(cells[0]), who: paragraphs(cells[1]), extra: cells.slice(2) };
  }).filter(Boolean);
}

/* the attribution paragraphs (name · organisation(s) · place/year), as authored elements */
function whoLines(who) {
  return who.filter((p) => textOf(p));
}

function featured(block, items) {
  const first = items.find((it) => it.quote);
  if (!first) return;
  const fig = document.createElement('figure');
  fig.className = 'testimonials-figure';
  const bq = document.createElement('blockquote');
  bq.append(...first.quote);
  const cap = document.createElement('figcaption');
  cap.className = 'dim dim-start';
  const span = document.createElement('span');
  // the authored attribution paragraphs MOVE in, set inline, " · " between (EW1)
  const parts = whoLines(first.who)
    .concat(first.extra.flatMap((c) => paragraphs(c)));
  parts.forEach((l, i) => {
    if (i) span.append(' · ');
    const w = document.createElement('span');
    w.className = 'testimonials-who-part';
    w.append(l);
    span.append(w);
  });
  cap.append(span);
  fig.append(bq);
  if (textOf(span)) fig.append(cap);
  block.replaceChildren(fig);
}

/* wrap an authored element in a generated wrapper that carries the layout class */
function wrapNode(node, className) {
  const w = document.createElement('span');
  w.className = className;
  w.append(node);
  return w;
}

function ledger(block, items) {
  const head = reabsorbHead(block, 'testimonials-head');
  const out = [];
  if (head) {
    const h = head.querySelector('h2, h3');
    const intro = document.createElement('div');
    intro.className = 'testimonials-intro';
    [...head.children].filter((c) => c !== h).forEach((c) => intro.append(c));
    if (intro.children.length) head.append(intro);
    out.push(head);
    const section = block.closest('.section');
    if (h && section && !section.id) section.id = slugify(textOf(h));
  }
  let list = null;
  let groupId = (block.closest('.section') || {}).id || 'testimonial';
  let n = 0;
  const newList = () => {
    list = document.createElement('ol');
    list.className = 'testimonials-list';
    out.push(list);
  };
  items.forEach((it) => {
    if (it.group) {
      // group label ("2007–present"): the authored heading, or its paragraph under a
      // heading-role wrapper — moved, never retagged (EW1)
      const g = document.createElement('div');
      g.className = 'testimonials-group';
      const h = it.group.querySelector('h1, h2, h3, h4, h5, h6');
      if (!h) {
        g.setAttribute('role', 'heading');
        g.setAttribute('aria-level', '3');
      }
      const src = h || it.group.querySelector('p');
      if (src) g.append(src);
      else g.append(...it.group.childNodes);
      groupId = slugify(textOf(g)) || groupId;
      g.id = groupId;
      out.push(g);
      newList();
      n = 0;
      return;
    }
    if (!list) newList();
    n += 1;
    const li = document.createElement('li');
    li.className = 'testimonials-entry';
    li.id = `${groupId}-${String(n).padStart(2, '0')}`;
    const fig = document.createElement('figure');
    fig.className = 'testimonials-ledger-figure';
    const bq = document.createElement('blockquote');
    bq.className = 'testimonials-quote';
    it.quote.forEach((p, i) => {
      if (i === 0) p.classList.add('testimonials-lead');
      bq.append(p);
    });
    const cap = document.createElement('figcaption');
    cap.className = 'testimonials-who';
    const lines = whoLines(it.who);
    lines.forEach((l, i) => {
      if (i === lines.length - 1 && lines.length > 1) {
        const s = document.createElement('span');
        s.className = 'dim dim-stack';
        s.append(wrapNode(l, 'testimonials-who-part'));
        cap.append(s);
      } else cap.append(wrapNode(l, i === 0 ? 'testimonials-name' : 'testimonials-org'));
    });
    it.extra.forEach((c) => {
      const s = document.createElement('span');
      s.className = 'dim dim-stack';
      const inner = document.createElement('span');
      inner.append(...paragraphs(c));
      s.append(inner);
      cap.append(s);
    });
    fig.append(bq, cap);
    li.append(fig);
    list.append(li);
  });
  block.replaceChildren(...out);
}

export default function decorate(block) {
  const items = parse(block);
  if (block.classList.contains('ledger')) ledger(block, items);
  else featured(block, items);
}
