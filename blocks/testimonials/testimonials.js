/*
 * testimonials — one row per testimonial: quote (paragraphs) ·
 * attribution (+ year/era if captured).
 * default: the single featured quote at headline scale.
 * ledger:  the long list, full text; who sticks beside the quote. A one-cell row with a short text
 *          ("2007–present") opens a group. The section head (H2 + intro) is reabsorbed beside it.
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

function whoLines(who) {
  // name · organisation(s) · place/year (last line when there are several)
  const lines = who.flatMap((p) => {
    if (p.tagName === 'P' && p.querySelector('br')) {
      const parts = [];
      let cur = document.createElement('span');
      [...p.childNodes].forEach((nd) => {
        if (nd.nodeName === 'BR') {
          parts.push(cur);
          cur = document.createElement('span');
        } else cur.append(nd);
      });
      parts.push(cur);
      return parts.filter((s) => textOf(s));
    }
    return [p];
  });
  return lines;
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
  whoLines(first.who).forEach((l, i) => {
    if (i) span.append(' · ');
    span.append(...l.childNodes);
  });
  first.extra.forEach((c) => span.append(' · ', ...c.childNodes));
  cap.append(span);
  fig.append(bq);
  if (textOf(span)) fig.append(cap);
  block.replaceChildren(fig);
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
      const g = document.createElement('h3');
      g.className = 'testimonials-group';
      g.append(...it.group.childNodes);
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
      const s = document.createElement('span');
      if (i === 0) s.className = 'testimonials-name';
      else if (i === lines.length - 1 && lines.length > 1) s.className = 'dim dim-stack';
      else s.className = 'testimonials-org';
      if (s.classList.contains('dim')) {
        const inner = document.createElement('span');
        inner.append(...l.childNodes);
        s.append(inner);
      } else s.append(...l.childNodes);
      cap.append(s);
    });
    it.extra.forEach((c) => {
      const s = document.createElement('span');
      s.className = 'dim dim-stack';
      const inner = document.createElement('span');
      inner.append(...c.childNodes);
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
