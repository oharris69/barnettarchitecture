/*
 * gallery — one row per photo: picture (+ optional caption cell, only when a real title exists).
 * default: project plates — alternating full-bleed plates and salon-hung pairs, numbered nn / NN.
 * wall:    photo collection — justified native-ratio rows with salon-scale features (darkroom),
 *          rebalanced at runtime so the wall never ends on a lone frame.
 * Every frame opens the shared lightbox (scripts/lightbox.js); #photo-N deep-links a frame.
 */
import bindLightbox from '../../scripts/lightbox.js';
import {
  imageAspect, imageSize, imageAt, reabsorbHead,
} from '../../scripts/utils.js';

const pad = (n, w) => String(n).padStart(w, '0');

function collect(block) {
  return [...block.children].map((row) => {
    const img = row.querySelector('img');
    if (!img) return null;
    const picture = img.closest('picture') || img;
    const cells = [...row.children];
    const capCell = cells.find((c) => !c.contains(img) && c.textContent.trim());
    // a caption authored in the same cell as the image (after it)
    let capNodes = capCell ? [...capCell.childNodes] : [];
    if (!capCell) {
      const host = cells.find((c) => c.contains(img));
      const after = host ? [...host.querySelectorAll('p, span')].filter((e) => !e.querySelector('img') && e.textContent.trim()) : [];
      capNodes = after;
    }
    return {
      img, picture, capNodes, ar: imageAspect(img), size: imageSize(img),
    };
  }).filter(Boolean);
}

function opener(photo, cls) {
  const a = document.createElement('a');
  a.className = cls;
  a.href = imageAt(photo.img, Math.min(2400, photo.size.w));
  a.dataset.w = photo.size.w;
  a.dataset.h = photo.size.h;
  a.dataset.lb = '';
  a.append(photo.picture);
  return a;
}

function captionSpan(photo) {
  if (!photo.capNodes.length) return null;
  const span = document.createElement('span');
  span.className = 'gallery-caption';
  span.dataset.lbCaption = '';
  // the authored caption paragraphs MOVE in (set inline in CSS), a space between (EW1)
  photo.capNodes.forEach((nd, i) => {
    if (i && nd.nodeType === 1) span.append(' ');
    span.append(nd);
  });
  return span.textContent.trim() ? span : null;
}

/* ---- default: plates ---- */
const SPANS = {
  LL: [[1, 6], [7, 6]],
  PP: [[1, 5], [8, 5]],
  LP: [[1, 7], [8, 5]],
  PL: [[1, 5], [6, 7]],
};

function plate(photo, n, total, extra = {}) {
  const fig = document.createElement('figure');
  fig.id = `photo-${n}`;
  fig.className = 'gallery-plate';
  fig.style.setProperty('--ar', String(photo.ar));
  if (extra.at) {
    fig.style.setProperty('--at', extra.at);
    fig.style.setProperty('--span', extra.span);
  }
  const a = opener(photo, 'gallery-link');
  if (!extra.full) a.style.aspectRatio = String(photo.ar);
  photo.img.alt = photo.img.alt || `Photograph ${n} of ${total}`;
  photo.img.loading = 'lazy';
  const cap = document.createElement('figcaption');
  cap.className = 'dim dim-start';
  const no = document.createElement('span');
  no.className = 'gallery-no';
  no.setAttribute('aria-hidden', 'true');
  const w = Math.max(2, String(total).length);
  no.textContent = `${pad(n, w)} / ${pad(total, w)}`;
  cap.append(no);
  const c = captionSpan(photo);
  if (c) cap.append(c);
  fig.append(a, cap);
  return fig;
}

function buildPlates(photos) {
  const total = photos.length;
  const seq = document.createElement('div');
  seq.className = 'gallery-seq';
  const isL = (p) => p.ar >= 1.05;
  let i = 0;
  let wantFull = photos.length && isL(photos[0]);
  while (i < total) {
    const p = photos[i];
    const left = total - i;
    if ((wantFull && isL(p)) || (left === 1 && isL(p))) {
      const fig = plate(p, i + 1, total, { full: true });
      fig.classList.add('gallery-full');
      seq.append(fig);
      i += 1;
      wantFull = false;
    } else {
      const row = document.createElement('div');
      row.className = 'gallery-row';
      if (left === 1) {
        // lone leftover: solo, L 3/8 · P 4/6
        const [at, span] = isL(p) ? [3, 8] : [4, 6];
        row.append(plate(p, i + 1, total, { at, span }));
        i += 1;
      } else {
        const q = photos[i + 1];
        const key = `${isL(p) ? 'L' : 'P'}${isL(q) ? 'L' : 'P'}`;
        const [[a1, s1], [a2, s2]] = SPANS[key];
        row.append(
          plate(p, i + 1, total, { at: a1, span: s1 }),
          plate(q, i + 2, total, { at: a2, span: s2 }),
        );
        i += 2;
      }
      seq.append(row);
      wantFull = true;
    }
  }
  return seq;
}

/* ---- wall: justified rows ---- */
function buildWall(photos) {
  const total = photos.length;
  const wall = document.createElement('div');
  wall.className = 'gallery-wall';
  if (total <= 4) wall.classList.add('gallery-wall-lead');
  photos.forEach((p, i) => {
    const n = i + 1;
    const fig = document.createElement('figure');
    fig.id = `photo-${n}`;
    fig.className = 'gallery-photo';
    // salon features: 16-cycle positions 0 and 9 (landscape frames), never in the closing rows
    if (total > 4 && (i % 16 === 0 || i % 16 === 9) && p.ar >= 1.2 && i <= total - 6) {
      fig.classList.add('gallery-feature');
    }
    fig.style.setProperty('--ar', p.ar.toFixed(4));
    p.img.alt = p.img.alt || `Photograph ${n} of ${total}`;
    if (i < 2) {
      p.img.loading = 'eager';
      if (i === 0) p.img.fetchPriority = 'high';
    } else p.img.loading = 'lazy';
    fig.append(opener(p, 'gallery-open'));
    const c = captionSpan(p);
    if (c) {
      const cap = document.createElement('figcaption');
      c.classList.add('gallery-title');
      cap.append(c);
      fig.append(cap);
    }
    wall.append(fig);
  });
  return wall;
}

/* runtime rebalance: a zero-height line break pulls a frame down,
   so the wall never ends on a lone frame */
function rowsOf(wall) {
  const out = [];
  let bottom = null;
  [...wall.children].forEach((el) => {
    if (!el.classList.contains('gallery-photo')) return;
    const b = Math.round(el.offsetTop + el.offsetHeight);
    if (bottom === null || Math.abs(b - bottom) > 2) {
      out.push([el]);
      bottom = b;
    } else out[out.length - 1].push(el);
  });
  return out;
}

function balance(wall) {
  wall.querySelectorAll('.gallery-break').forEach((b) => b.remove());
  wall.querySelectorAll('.gallery-closing').forEach((el) => el.classList.remove('gallery-closing'));
  const r = rowsOf(wall);
  if (r.length < 2 || r[r.length - 1].length !== 1) return;
  if (window.innerWidth < 600 && r[r.length - 1][0].classList.contains('gallery-feature')) return;
  const ph = [...wall.querySelectorAll('.gallery-photo')];
  const lone = (rows) => rows.filter((x) => x.length === 1).length;
  const base = lone(r);
  const was = new Set(r.filter((x) => x.length === 1).map((x) => x[0]));
  for (let k = ph.length - 2; k >= Math.max(1, ph.length - 14); k -= 1) {
    const br = document.createElement('span');
    br.className = 'gallery-break';
    br.setAttribute('aria-hidden', 'true');
    ph[k].before(br);
    const next = rowsOf(wall);
    const fresh = next.filter((x) => x.length === 1 && !was.has(x[0]));
    if (next[next.length - 1].length >= 2 && lone(next) <= base
      && fresh.every((x) => x[0].classList.contains('gallery-feature'))) return;
    br.remove();
  }
  r[r.length - 1][0].classList.add('gallery-closing');
}

function watchBalance(wall) {
  if (!('ResizeObserver' in window) || wall.classList.contains('gallery-wall-lead')) return;
  let raf = 0;
  let seen = -1;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      // width-only: inserting a break changes the wall's height, which must not re-trigger a pass
      if (seen === wall.clientWidth) return;
      seen = wall.clientWidth;
      balance(wall);
    });
  });
  ro.observe(wall);
}

function pageLabel() {
  const h1 = document.querySelector('main h1');
  return h1 ? h1.textContent.replace(/\s+/g, ' ').trim() : document.title.split('|')[0].trim();
}

export default function decorate(block) {
  const photos = collect(block);
  const total = photos.length;
  const isWall = block.classList.contains('wall');
  const label = pageLabel();

  if (isWall) {
    const wall = buildWall(photos);
    const frag = [];
    const section = block.closest('.section');
    const after = section && section.nextElementSibling;
    if (after && total > 12) {
      if (!after.id) after.id = 'more';
      const skip = document.createElement('a');
      skip.className = 'gallery-skip';
      skip.href = `#${after.id}`;
      skip.textContent = `Skip the ${total} photographs`;
      frag.push(skip);
    }
    block.setAttribute('aria-label', `${label} — ${total} photographs`);
    block.setAttribute('role', 'region');
    block.replaceChildren(...frag, wall);
    bindLightbox(wall, [...wall.querySelectorAll('a[data-lb]')], label);
    watchBalance(wall);
    return;
  }

  const seq = buildPlates(photos);
  // section head (H2 "Photographs") is reabsorbed so the count can sit on its baseline
  const head = reabsorbHead(block, 'gallery-head') || document.createElement('div');
  head.className = 'gallery-head';
  // an authored count ("9 photographs") is kept; otherwise the block states it
  let count = [...head.querySelectorAll('p')].find((p) => /^\d+\s+photographs?$/i.test(p.textContent.trim()));
  if (!count) {
    count = document.createElement('p');
    count.textContent = `${total} photograph${total === 1 ? '' : 's'}`;
    head.append(count);
  }
  count.className = 'gallery-count label';
  const section = block.closest('.section');
  if (section && !section.id) section.id = 'photographs';
  block.replaceChildren(head, seq);
  bindLightbox(seq, [...seq.querySelectorAll('a[data-lb]')], label);
}
