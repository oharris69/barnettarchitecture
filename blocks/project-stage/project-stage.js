/*
 * project-stage — the home's sheet index beside a photo stage (home variant b).
 * Rows:
 *   project row: picture · title link (<p><a>) · facts cell = paragraphs Sector | Type | Location
 *   group row:   one cell holding a heading ("<h3><a href=/residential>Residential</a> · 22</h3>")
 *                — every project row after it belongs to that group.
 * Section head (default content before the block, same section): H1, intro line, CTA paragraphs,
 * then an optional H2 label ("Project index · 29 projects"). The opening nodes and the label MOVE
 * into the block's left column (EW1/EW8); nothing authored is rebuilt.
 * Behaviour: the first project's photograph is the stage (eager, fetchpriority high); the other
 * pictures stay lazy and hidden until chosen. ≥ 900px with a fine pointer: pointer, focus and
 * ↑ ↓ Home End pick the frame. Touch or < 900px: the name at the reading line under the sticky
 * stage picks it (neighbours prefetched). A swap waits for the frame to load and decode;
 * crossfade 300ms, instant under prefers-reduced-motion. The caption bar is presentational.
 */
import { fontsBeforeReveal, textOf, thumbPicture } from '../../scripts/utils.js';

const FADE_MS = 300;
/* arrival preview: the first group's next projects, one every AUTO_MS, then back to the first */
const AUTO_STEPS = 3;
const AUTO_MS = 2200;
const AUTO_PRELOAD_MS = 900;

function parse(block) {
  const groups = [];
  let group = null;
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const picCell = cells.find((c) => c.querySelector('img'));
    const rest = cells.filter((c) => c !== picCell && textOf(c));
    if (!picCell && rest.length === 1) {
      // a lone text cell opens a group
      const head = rest[0].querySelector('h1, h2, h3, h4, h5, h6, p') || rest[0];
      group = { head, items: [] };
      groups.push(group);
      return;
    }
    const titleCell = rest.find((c) => c.querySelector('a')) || rest[0];
    if (!titleCell) return;
    const factsCell = rest.find((c) => c !== titleCell) || null;
    if (!group) {
      group = { head: null, items: [] };
      groups.push(group);
    }
    let facts = factsCell ? [...factsCell.querySelectorAll(':scope > p')] : [];
    if (factsCell && !facts.length && textOf(factsCell)) {
      // a bare delimited line ("Residential | New home | Madison, WI"): kept as one paragraph
      const p = document.createElement('p');
      p.append(...factsCell.childNodes);
      facts = [p];
    }
    group.items.push({
      picture: picCell ? (picCell.querySelector('picture') || picCell.querySelector('img')) : null,
      title: titleCell.querySelector('p, h1, h2, h3, h4, h5, h6') || titleCell,
      link: titleCell.querySelector('a'),
      facts,
    });
  });
  return groups.filter((g) => g.items.length || g.head);
}

/*
 * sector | type | location [| tag …] → shown: type · location; the sector stays authored,
 * unprinted; a 4th+ paragraph ("Design study") is a quiet tag after the name
 */
function factsEl(item) {
  const shown = document.createElement('div');
  shown.className = 'project-stage-facts';
  const hidden = [];
  const tags = [];
  const { facts } = item;
  if (facts.length >= 3) {
    hidden.push(facts[0]);
    shown.append(facts[1], facts[2]);
    facts.slice(3).forEach((p) => (textOf(p) ? tags : hidden).push(p));
  } else shown.append(...facts);
  return { shown, hidden, tags };
}

function itemEl(item, index) {
  const li = document.createElement('li');
  li.className = 'project-stage-item';
  li.dataset.index = String(index);
  item.title.classList.add('project-stage-name');
  li.append(item.title);
  const { shown, hidden, tags } = factsEl(item);
  if (tags.length) {
    const wrap = document.createElement('div');
    wrap.className = 'project-stage-tags';
    tags.forEach((p) => p.classList.add('project-stage-tag', 'label'));
    wrap.append(...tags);
    li.append(wrap);
    li.classList.add('has-tag');
  }
  if (shown.children.length) li.append(shown);
  if (hidden.length) {
    const keep = document.createElement('div');
    keep.className = 'project-stage-meta';
    keep.hidden = true;
    keep.append(...hidden);
    li.append(keep);
  }
  return li;
}

/* group heading: the authored element MOVES in as a dimension string; the count stays inline */
function groupHead(head) {
  head.classList.add('project-stage-group-h', 'dim', 'dim-start');
  const span = document.createElement('span');
  span.append(...head.childNodes);
  // " · 22" after the link: kept on one line
  const tail = [...span.childNodes].filter((n) => n.nodeType === 3 && /·/.test(n.textContent));
  tail.forEach((n) => {
    const nw = document.createElement('span');
    nw.className = 'project-stage-count';
    n.replaceWith(nw);
    nw.append(n);
  });
  head.append(span);
  return head;
}

/* the section head before the block: opening (H1, line, CTAs) + an optional trailing H2 label */
function takeHead(block) {
  const wrapper = block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  if (!prev || !prev.classList.contains('default-content-wrapper')) return { opening: [], label: null };
  const kids = [...prev.children];
  const last = kids[kids.length - 1];
  const label = last && /^H[2-6]$/.test(last.tagName) && kids.length > 1 ? kids.pop() : null;
  prev.remove();
  return { opening: kids, label };
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

export default async function decorate(block) {
  const groups = parse(block);
  const { opening, label } = takeHead(block);
  const uid = `project-stage-${document.querySelectorAll('.project-stage-index').length + 1}`;

  const body = el('div', 'project-stage-body');
  if (opening.length) {
    const open = el('div', 'project-stage-opening');
    const actions = el('div', 'project-stage-actions');
    opening.forEach((n) => {
      const isAction = n.tagName === 'P' && (n.classList.contains('button-wrapper') || n.classList.contains('link-row'));
      if (isAction) actions.append(n);
      else {
        if (actions.children.length && !actions.parentElement) open.append(actions);
        open.append(n);
      }
      if (n.tagName === 'H1') n.classList.add('project-stage-title');
    });
    if (actions.children.length && !actions.parentElement) open.append(actions);
    body.append(open);
  }

  const nav = el('nav', 'project-stage-index');
  const head = el('div', 'project-stage-head');
  if (label) {
    label.classList.add('project-stage-label', 'label');
    label.id = label.id || `${uid}-label`;
    nav.setAttribute('aria-labelledby', label.id);
    head.append(label);
  } else nav.setAttribute('aria-label', 'Project index');
  const hintHover = el('p', 'project-stage-hint project-stage-hint-hover', 'Point to a name or use ↑ ↓ to see its photograph');
  const hintScroll = el('p', 'project-stage-hint project-stage-hint-scroll', 'Scroll the names to see each project');
  const skip = el('a', 'project-stage-skip', 'Skip the project index');
  head.append(hintHover, hintScroll, skip);
  nav.append(head);

  const groupsEl = el('div', 'project-stage-groups');
  const items = [];
  groups.forEach((g) => {
    const gEl = el('div', 'project-stage-group');
    if (g.head) gEl.append(groupHead(g.head));
    const ul = el('ul', 'project-stage-list');
    g.items.forEach((it) => {
      const li = itemEl(it, items.length);
      items.push({ ...it, li });
      ul.append(li);
    });
    gEl.append(ul);
    groupsEl.append(gEl);
  });
  nav.append(groupsEl);
  body.append(nav);

  /* the stage: every authored picture MOVES into the frame stack (hidden, lazy) */
  const stage = el('div', 'project-stage-stage');
  const frames = el('div', 'project-stage-frames');
  const pics = items.map((it, i) => {
    if (!it.picture) return null;
    const pic = it.picture;
    pic.classList.add('project-stage-frame');
    pic.dataset.index = String(i);
    thumbPicture(pic, { desktop: 1600, mobile: 1000 });
    const img = pic.tagName === 'IMG' ? pic : pic.querySelector('img');
    if (img) {
      img.loading = i === 0 ? 'eager' : 'lazy';
      if (i === 0) img.fetchPriority = 'high';
      img.decoding = 'async';
    }
    frames.append(pic);
    return pic;
  });
  const caption = el('p', 'project-stage-caption');
  const capTitle = el('span', 'project-stage-cap-title');
  const capFacts = el('span', 'project-stage-cap-facts label');
  const capTag = el('span', 'project-stage-cap-tag label');
  capTag.hidden = true;
  const capGo = el('a', 'project-stage-cap-go link-arrow', 'View project');
  const capHidden = el('span', 'visually-hidden');
  capGo.append(capHidden);
  // title · tag · facts share one line (a box of its own below 900px, so every project's caption
  // has the same height and a swap never moves the list); ≥ 900px the box is display: contents
  const capLine = el('span', 'project-stage-cap-line');
  capLine.append(capTitle, capTag, capFacts);
  caption.append(capLine, capGo);
  stage.append(frames, caption);

  block.replaceChildren(body, stage);
  // the opening and the caption wrap in the brand faces from the first paint (no swap shift)
  await fontsBeforeReveal();

  // the skip link lands on the section after this one
  const section = block.closest('.section');
  const next = section && section.nextElementSibling;
  if (next) {
    if (!next.id) next.id = `${uid}-end`;
    skip.href = `#${next.id}`;
    if (!next.hasAttribute('tabindex')) next.setAttribute('tabindex', '-1');
  } else skip.remove();

  if (!items.length) return;

  const links = items.map((it) => it.link || it.li.querySelector('a'));
  const split = window.matchMedia('(min-width: 900px)');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointerMode = () => split.matches && fine.matches;
  const imgOf = (pic) => (pic && (pic.tagName === 'IMG' ? pic : pic.querySelector('img')));

  let want = -1;
  let front = -1;
  let z = 1;
  let timer = 0;
  let sweep = 0;

  function setCaption(i) {
    const it = items[i];
    capTitle.textContent = textOf(it.title);
    const shown = it.li.querySelector('.project-stage-facts');
    capFacts.textContent = shown ? [...shown.children].map((p) => textOf(p)).filter(Boolean).join(' · ') : '';
    const tags = [...it.li.querySelectorAll('.project-stage-tag')].map((p) => textOf(p)).filter(Boolean);
    capTag.textContent = tags.join(' · ');
    capTag.hidden = !tags.length;
    if (links[i]) capGo.href = links[i].getAttribute('href');
    capHidden.textContent = `: ${textOf(it.title)}`;
  }

  function reveal(i) {
    const pic = pics[i];
    if (!pic || want !== i) return;
    z += 1;
    pic.style.zIndex = String(z);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (want !== i) return;
      pic.classList.add('is-on');
      front = i;
      setCaption(i);
      clearTimeout(sweep);
      sweep = setTimeout(() => {
        pics.forEach((p, k) => {
          if (p && k !== front) p.classList.remove('is-on', 'is-shown');
        });
      }, reduced.matches ? 0 : FADE_MS + 60);
    }));
  }

  function prefetch(i) {
    const img = imgOf(pics[i]);
    if (img && img.loading !== 'eager') img.loading = 'eager';
  }

  function show(i, auto = false) {
    if (i < 0 || i >= items.length || i === want) return;
    want = i;
    items.forEach((it, k) => it.li.classList.toggle('is-active', k === i));
    const pic = pics[i];
    const img = imgOf(pic);
    if (!pic || !img) {
      setCaption(i);
      return;
    }
    pic.classList.add('is-shown');
    img.loading = 'eager';
    const ready = () => (img.decode ? img.decode() : Promise.resolve())
      .catch(() => {})
      .then(() => reveal(i));
    if (img.complete && img.naturalWidth) ready();
    else {
      img.addEventListener('load', ready, { once: true });
      // a frame that fails keeps the previous one; the link still works
      img.addEventListener('error', () => { if (want === i) setCaption(i); }, { once: true });
    }
    if (!pointerMode() && !auto) {
      prefetch(i + 1);
      prefetch(i - 1);
    }
  }

  // initial frame: the first project, visible at once (the LCP candidate)
  want = 0;
  items[0].li.classList.add('is-active');
  if (pics[0]) pics[0].classList.add('is-shown', 'is-on');
  front = 0;
  setCaption(0);
  block.classList.add('is-ready');

  const indexOf = (target) => {
    const li = target && target.closest ? target.closest('.project-stage-item') : null;
    return li ? Number(li.dataset.index) : -1;
  };
  const later = (i, ms) => {
    clearTimeout(timer);
    timer = setTimeout(() => show(i), ms);
  };

  groupsEl.addEventListener('pointerover', (e) => {
    if (!pointerMode() || e.pointerType === 'touch') return;
    const i = indexOf(e.target);
    if (i >= 0) later(i, 70);
  });
  // debounced: tabbing past a name does not start its download
  groupsEl.addEventListener('focusin', (e) => {
    const i = indexOf(e.target);
    if (i >= 0) later(i, 90);
  });
  // ↑ ↓ Home End move along every name (one list across the groups)
  groupsEl.addEventListener('keydown', (e) => {
    const i = links.indexOf(document.activeElement);
    if (i < 0) return;
    const to = {
      ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: links.length - 1,
    }[e.key];
    if (to === undefined || to < 0 || to >= links.length || !links[to]) return;
    e.preventDefault();
    links[to].focus();
  });

  // touch / narrow: the reading line sits 15% below the sticky stage (≥ 900px touch: 40% down)
  let raf = 0;
  const read = () => {
    raf = 0;
    if (pointerMode()) return;
    const fa = document.activeElement;
    if (fa && links.includes(fa)) return; // keyboard focus picks the frame
    const r = block.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    let line = window.innerHeight * 0.4;
    if (!split.matches) {
      const sb = stage.getBoundingClientRect().bottom;
      line = sb + (window.innerHeight - sb) * 0.15;
    }
    let pick = -1;
    for (let k = 0; k < items.length; k += 1) {
      if (items[k].li.getBoundingClientRect().top <= line) pick = k;
      else break;
    }
    show(Math.max(pick, 0));
  };
  window.addEventListener('scroll', () => {
    if (!raf) raf = requestAnimationFrame(read);
  }, { passive: true });
  split.addEventListener('change', read);

  /*
   * Arrival preview: once the stage is in view, the first group's next projects take the stage in
   * turn, then the first one returns and it stops. Any interaction, or the tab going hidden,
   * stops it for good. Off under reduced motion. Each frame is requested just before its turn.
   * Nothing is announced (the caption is not a live region).
   */
  const firstGroup = groups[0] ? groups[0].items.length : 0;
  const steps = [];
  for (let k = 1; k <= Math.min(AUTO_STEPS, firstGroup - 1); k += 1) steps.push(k);
  if (!steps.length || reduced.matches || document.hidden) return;
  steps.push(0);

  const autoTimers = [];
  let autoDone = false;
  let io = null;
  const STOP_ON = [
    [window, 'keydown'], [window, 'wheel'], [window, 'touchstart'], [window, 'scroll'],
    [window, 'pointerdown'], [document, 'focusin'], [block, 'pointermove'],
  ];
  const opts = { capture: true, passive: true };
  let onHidden = null;
  const stopAuto = () => {
    if (autoDone) return;
    autoDone = true;
    autoTimers.forEach((t) => clearTimeout(t));
    if (io) io.disconnect();
    STOP_ON.forEach(([target, type]) => target.removeEventListener(type, stopAuto, opts));
    document.removeEventListener('visibilitychange', onHidden);
  };
  onHidden = () => {
    if (document.hidden) stopAuto();
  };
  STOP_ON.forEach(([target, type]) => target.addEventListener(type, stopAuto, opts));
  document.addEventListener('visibilitychange', onHidden);
  reduced.addEventListener('change', stopAuto);

  const run = () => {
    if (autoDone) return;
    steps.forEach((k, n) => {
      const at = AUTO_MS * (n + 1);
      // the next frame only, shortly before its turn (no burst of downloads)
      const pre = Math.max(0, at - AUTO_PRELOAD_MS);
      autoTimers.push(setTimeout(() => { if (!autoDone) prefetch(k); }, pre));
      autoTimers.push(setTimeout(() => {
        if (autoDone) return;
        show(k, true);
        if (n === steps.length - 1) stopAuto();
      }, at));
    });
  };
  const start = () => {
    const first = imgOf(pics[0]);
    // the first photograph (the LCP) settles before anything else is requested
    if (first && !(first.complete && first.naturalWidth)) {
      first.addEventListener('load', run, { once: true });
    } else run();
  };
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      io = null;
      start();
    }, { threshold: 0.5 });
    io.observe(frames);
  }
}
