/*
 * Photo lightbox (canon module photo-lightbox): a native <dialog>, one per photo group.
 * Keyboard ←/→/Home/End/Esc, focus trapped while open and returned to the opener on close,
 * `#photo-N` deep links, "Photo n of N" announced, next photograph preloaded (only the next one),
 * swipe on touch. Without JS each frame is a plain link to the full-size file.
 */
import { loadCSS } from './aem.js';
import { imageAt } from './utils.js';

let cssLoaded;
const WIDTHS = [750, 1200, 1600, 2000, 2400];

function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === true) e.setAttribute(k, '');
    else if (v !== false && v != null) e.setAttribute(k, v);
  });
  e.append(...kids);
  return e;
}

function button(kind, label, glyph, glyphFirst) {
  const g = el('span', { 'aria-hidden': 'true' }, glyph);
  const l = el('span', { class: 'lightbox-btn-label' }, label);
  return el('button', { class: 'lightbox-btn', type: 'button', [`data-lb-${kind}`]: true }, ...(glyphFirst ? [g, l] : [l, g]));
}

/**
 * @param {Element} group element holding the frames
 * @param {HTMLAnchorElement[]} links one opener per photograph
 *   (href = full-size file, data-w / data-h)
 * @param {string} label dialog label, e.g. "Iowa"
 */
export default function bindLightbox(group, links, label) {
  const n = links.length;
  if (!n || !window.HTMLDialogElement) return;
  if (!cssLoaded) cssLoaded = loadCSS(`${window.hlx.codeBasePath}/styles/lightbox.css`);

  const title = el('p', { class: 'lightbox-title label' }, label || 'Photographs');
  const closeBtn = button('close', 'Close', '×');
  const prevBtn = button('prev', 'Previous', '←', true);
  const nextBtn = button('next', 'Next', '→');
  const frame = el('div', { class: 'lightbox-frame' });
  const cap = el('figcaption', { class: 'lightbox-caption', hidden: true });
  const stage = el('figure', { class: 'lightbox-stage' }, frame, cap);
  const count = el('p', { class: 'lightbox-count label', 'aria-live': 'polite' });
  const dlg = el(
    'dialog',
    { class: 'lightbox', 'aria-label': `${label || 'Photographs'} — photograph viewer` },
    el('div', { class: 'lightbox-bar' }, title, closeBtn),
    stage,
    el('div', { class: 'lightbox-bar' }, prevBtn, count, nextBtn),
  );
  document.body.append(dlg);

  const base = () => window.location.pathname + window.location.search;
  let img = null;
  let i = 0;
  let opener = null;
  let x0 = null;
  let popping = false;

  const thumb = (a) => a.querySelector('img');
  const drawnWidth = (a) => {
    const r = frame.getBoundingClientRect();
    const ratio = a.dataset.w / a.dataset.h;
    const css = Math.min(r.width || window.innerWidth, (r.height || window.innerHeight) * ratio);
    const px = Math.ceil(css * Math.min(window.devicePixelRatio || 1, 2));
    return WIDTHS.find((w) => w >= px) || WIDTHS[WIDTHS.length - 1];
  };
  const srcFor = (a) => imageAt(thumb(a), Math.min(drawnWidth(a), Number(a.dataset.w) || 2400));

  const show = (k) => {
    i = (k + n) % n;
    const a = links[i];
    const fig = a.closest('figure');
    const t = thumb(a);
    if (!img) {
      img = new Image();
      img.decoding = 'async';
      frame.append(img);
      img.addEventListener('error', () => {
        cap.hidden = false;
        cap.textContent = 'This photograph could not be loaded. Use Previous or Next to continue.';
      });
    }
    img.width = Number(a.dataset.w);
    img.height = Number(a.dataset.h);
    img.alt = t ? t.alt : '';
    img.style.setProperty('--ar', a.dataset.w / a.dataset.h);
    img.style.backgroundImage = t && t.currentSrc ? `url("${t.currentSrc}")` : 'none';
    img.src = srcFor(a);
    count.replaceChildren(
      el('span', { 'aria-hidden': 'true' }, `${i + 1} / ${n}`),
      el('span', { class: 'visually-hidden' }, `Photo ${i + 1} of ${n}`),
    );
    const text = fig && fig.querySelector('[data-lb-caption]');
    cap.replaceChildren();
    if (text) cap.append(text.cloneNode(true));
    cap.hidden = !text;
    if (fig && fig.id) window.history.replaceState({ lb: 1 }, '', `#${fig.id}`);
    // preload the next photograph only, at the width it will be drawn
    if (n > 1) {
      const pre = new Image();
      pre.src = srcFor(links[(i + 1) % n]);
    }
  };

  const open = (k, from) => {
    opener = from || links[k];
    if (!dlg.open) {
      dlg.showModal();
      if (!(window.history.state && window.history.state.lb)) {
        window.history.pushState({ lb: 1 }, '', window.location.href);
      }
    }
    show(k);
    nextBtn.focus();
  };

  const close = () => {
    if (window.history.state && window.history.state.lb) window.history.back();
    else dlg.close();
  };

  window.addEventListener('popstate', () => {
    if (dlg.open) {
      popping = true;
      dlg.close();
    }
  });
  dlg.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });
  dlg.addEventListener('close', () => {
    if (!popping && window.history.state && window.history.state.lb) {
      window.history.replaceState(null, '', base());
    }
    popping = false;
    if (img) img.removeAttribute('src');
    if (opener) opener.focus();
  });

  links.forEach((a, k) => {
    a.setAttribute('aria-haspopup', 'dialog');
    a.addEventListener('click', (e) => {
      if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      open(k, a);
    });
  });
  prevBtn.addEventListener('click', () => show(i - 1));
  nextBtn.addEventListener('click', () => show(i + 1));
  closeBtn.addEventListener('click', close);
  stage.addEventListener('click', (e) => {
    if (e.target === stage || e.target === frame) close();
  });

  dlg.addEventListener('keydown', (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (step) {
      e.preventDefault();
      show(i + step);
    } else if (e.key === 'Home') {
      e.preventDefault();
      show(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      show(n - 1);
    } else if (e.key === 'Tab') {
      const f = [...dlg.querySelectorAll('button, a[href]')].filter((x) => x.getClientRects().length);
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  dlg.addEventListener('pointerdown', (e) => {
    x0 = e.pointerType === 'mouse' ? null : e.clientX;
  });
  dlg.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 48) show(i + (dx < 0 ? 1 : -1));
  });

  const deep = () => {
    const m = window.location.hash.match(/^#photo-(\d+)$/);
    const k = m ? links.findIndex((a) => {
      const fig = a.closest('figure');
      return fig && fig.id === `photo-${m[1]}`;
    }) : -1;
    if (k >= 0 && !dlg.open) {
      window.history.replaceState(null, '', base());
      cssLoaded.then(() => open(k));
    }
  };
  window.addEventListener('hashchange', deep);
  deep();
}
