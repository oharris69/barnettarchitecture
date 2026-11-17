/*
 * collection-index — one row per collection: picture · title link ·
 * meta ("89 photographs · Region").
 * default:  the darkroom wall of covers (12-col spans by orientation); a row with text only
 *           ("Regions", "Exhibits") hangs a divider; extra cells become a note under the frame.
 * selected: 2-up selected works (justified lead wall); every frame opens the lightbox.
 * strip:    "More collections" — a compact horizontal strip.
 * Titles, meta lines, notes and dividers are the authored elements, MOVED into wrappers (EW1).
 */
import bindLightbox from '../../scripts/lightbox.js';
import {
  imageAspect, imageSize, imageAt, textOf, thumbPicture,
} from '../../scripts/utils.js';

function parse(block) {
  return [...block.children].map((row) => {
    const cells = [...row.children];
    const picCell = cells.find((c) => c.querySelector('img'));
    const rest = cells.filter((c) => c !== picCell && textOf(c));
    if (!picCell) {
      return rest.length ? { divider: rest[0] } : null;
    }
    const img = picCell.querySelector('img');
    const titleCell = rest.find((c) => c.querySelector('a')) || rest[0] || null;
    const others = rest.filter((c) => c !== titleCell);
    let meta = others[0] || null;
    const note = others.slice(1);
    // a meta cell with several paragraphs: the first is the meta line, the rest is a note
    if (meta) {
      const ps = [...meta.querySelectorAll(':scope > p')];
      if (ps.length > 1) {
        const m = document.createElement('div');
        m.append(ps[0]);
        const n = document.createElement('div');
        n.append(...meta.childNodes);
        note.unshift(n);
        meta = m;
      }
    }
    return {
      img,
      picture: img.closest('picture') || img,
      titleCell,
      link: titleCell ? titleCell.querySelector('a') : null,
      meta,
      note,
      ar: imageAspect(img),
    };
  }).filter(Boolean);
}

/*
 * A wrapper holding the cell's authored elements — MOVED, never re-created from their
 * childNodes/text (EW1). The wrapper carries the class; the paragraphs keep their identity.
 */
function inline(cell, tag = 'div') {
  const w = document.createElement(tag);
  if (!cell) return w;
  const blocks = [...cell.children].filter((c) => /^(P|H[1-6]|DIV)$/.test(c.tagName));
  if (blocks.length) w.append(...blocks);
  else w.append(...cell.childNodes);
  return w;
}

/* a divider ("Regions", "Exhibits"): the authored heading/paragraph inside a dim wrapper */
function divider(nodes) {
  const d = document.createElement('div');
  d.className = 'collection-index-divider dim dim-start';
  const span = document.createElement('span');
  span.append(...nodes);
  d.append(span);
  return d;
}

/* default: 12-col spans — portraits take 3 (4:5 frames), landscapes share the rest of the row */
function spansFor(row) {
  const portraits = row.filter((it) => it.ar < 0.95).length;
  const ls = row.filter((it) => it.ar >= 0.95);
  const free = 12 - portraits * 3;
  const shares = [];
  if (ls.length === 1) shares.push(free);
  else if (ls.length === 2) {
    const tilt = free === 12 ? 1 : 0; // a full row of two hangs 7 / 5, not 6 / 6
    shares.push(Math.ceil(free / 2) + tilt, Math.floor(free / 2) - tilt);
  } else ls.forEach(() => shares.push(Math.floor(free / ls.length)));
  let li = 0;
  return row.map((it) => {
    if (it.ar < 0.95) return 3;
    const s = shares[li];
    li += 1;
    return s;
  });
}

function chunk(group) {
  const sizes = {
    1: [1], 2: [2], 3: [3], 4: [2, 2], 5: [3, 2], 7: [3, 2, 2],
  };
  const rows = [];
  let i = 0;
  const plan = sizes[group.length] || [];
  if (plan.length) {
    plan.forEach((n) => {
      rows.push(group.slice(i, i + n));
      i += n;
    });
    return rows;
  }
  while (i < group.length) {
    const left = group.length - i;
    const n = left === 4 || left === 2 ? 2 : 3;
    rows.push(group.slice(i, i + n));
    i += n;
  }
  return rows;
}

function frame(item, span) {
  const fig = document.createElement('figure');
  fig.className = `collection-index-frame span-${span}`;
  if (item.ar < 0.95) fig.classList.add('is-tall');
  const media = document.createElement('div');
  media.className = 'collection-index-img';
  media.append(item.picture);
  // frames up to 7 of 12 columns: 750 px; a full-row cover: 1500 px (500 on phones)
  thumbPicture(item.picture, { desktop: span >= 8 ? 1500 : 750, mobile: 500 });
  const cap = document.createElement('figcaption');
  const title = inline(item.titleCell);
  title.className = 'collection-index-title';
  cap.append(title);
  if (item.meta) {
    const meta = inline(item.meta);
    meta.className = 'collection-index-meta label';
    cap.append(meta);
  }
  fig.append(media, cap);
  item.note.forEach((n) => {
    const p = document.createElement('div');
    p.className = 'collection-index-note';
    p.append(...n.childNodes);
    fig.append(p);
  });
  return fig;
}

function buildWall(items) {
  const wall = document.createElement('div');
  wall.className = 'collection-index-wall';
  let group = [];
  const flush = () => {
    chunk(group).forEach((row) => {
      const spans = spansFor(row);
      row.forEach((it, k) => wall.append(frame(it, spans[k])));
    });
    group = [];
  };
  items.forEach((it) => {
    if (it.divider) {
      flush();
      const h = it.divider.querySelector('h1, h2, h3, h4, h5, h6');
      const d = divider(h ? [h] : [...it.divider.children]);
      if (!h) {
        d.setAttribute('role', 'heading');
        d.setAttribute('aria-level', '3');
      }
      wall.append(d);
    } else group.push(it);
  });
  flush();
  return wall;
}

function buildSelected(items) {
  const wall = document.createElement('div');
  wall.className = 'collection-index-selected';
  items.filter((it) => !it.divider).forEach((it, i) => {
    const fig = document.createElement('figure');
    fig.className = 'collection-index-photo';
    fig.id = `photo-${i + 1}`;
    fig.style.setProperty('--ar', it.ar.toFixed(4));
    const size = imageSize(it.img);
    const a = document.createElement('a');
    a.className = 'collection-index-open';
    a.href = imageAt(it.img, Math.min(2400, size.w));
    a.dataset.w = size.w;
    a.dataset.h = size.h;
    a.dataset.lb = '';
    a.append(it.picture);
    thumbPicture(it.picture, { desktop: 750, mobile: 500 });
    const cap = document.createElement('figcaption');
    const label = document.createElement('span');
    label.className = 'label';
    label.dataset.lbCaption = '';
    const t = inline(it.titleCell, 'span');
    t.className = 'collection-index-part';
    label.append(t);
    if (it.meta) {
      // meta often repeats the title ("Iowa · Midwest"): then it stays authored but unprinted
      const m = inline(it.meta, 'span');
      m.className = 'collection-index-part';
      if (textOf(m).startsWith(textOf(t))) m.hidden = true;
      else label.append(' · ');
      label.append(m);
    }
    cap.append(label);
    fig.append(a, cap);
    wall.append(fig);
  });
  return wall;
}

function buildStrip(items) {
  const ul = document.createElement('ul');
  ul.className = 'collection-index-strip';
  items.filter((it) => !it.divider).forEach((it) => {
    const li = document.createElement('li');
    const card = document.createElement('div');
    card.className = 'collection-index-card';
    const media = document.createElement('div');
    media.className = 'collection-index-img';
    media.append(it.picture);
    thumbPicture(it.picture, { desktop: 500, mobile: 500 });
    const title = inline(it.titleCell);
    title.className = 'collection-index-title';
    card.append(media, title);
    if (it.meta) {
      const meta = inline(it.meta);
      meta.className = 'collection-index-meta label';
      card.append(meta);
    }
    li.append(card);
    ul.append(li);
  });
  return ul;
}

export default function decorate(block) {
  const items = parse(block);
  if (block.classList.contains('selected')) {
    const wall = buildSelected(items);
    block.replaceChildren(wall);
    const h1 = document.querySelector('main h1');
    bindLightbox(wall, [...wall.querySelectorAll('a[data-lb]')], h1 ? textOf(h1) : 'Selected works');
    return;
  }
  if (block.classList.contains('strip')) {
    block.replaceChildren(buildStrip(items));
    return;
  }
  const wall = buildWall(items);
  // a group heading authored just above the block ("Regions", "Exhibits")
  // hangs as the wall's divider
  const prev = block.parentElement && block.parentElement.previousElementSibling;
  const last = prev && prev.classList.contains('default-content-wrapper') ? prev.lastElementChild : null;
  if (last && /^H[3-6]$/.test(last.tagName)) {
    // the authored heading MOVES in (it stays inline-editable as default content, EW8)
    const d = divider([last]);
    if (!prev.children.length) prev.remove();
    wall.prepend(d);
  }
  block.replaceChildren(wall);
}
