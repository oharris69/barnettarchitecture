/*
 * era-timeline — the home's "decade by decade" timeline (home variant c).
 * Table (first row = block name), read top to bottom:
 *   quote row (optional, before the first era): quote paragraph(s) · attribution (a project link
 *       + place, e.g. "<a href=/projects/push-pull>Push-Pull</a> · Madison, WI")
 *   era row:     scale label ("1873", "1940s", "Undated", "New") · heading cell
 *                (<h3>Built 1873</h3>, optionally a fact line after it:
 *                "Era not stated in the project notes · 10 projects")
 *   project row: picture · title cell (<h4><a href=/projects/x>Name</a></h4>, or <p><a>…</a></p>;
 *                a further paragraph is a tag, e.g. "Design study") · facts (paragraphs: Type,
 *                Location[, Project 1998]) · quote (paragraph[s], verbatim from the project)
 *                The era's first project with a picture is the chapter (full-bleed frame), the
 *                next ones with pictures are plates; rows without a picture form the era's list.
 * Section head (default content before the block, same section): H1, intro line, CTA paragraphs,
 * then the timeline's H2 and its framing line. All authored nodes MOVE into the layout (EW1/EW8):
 * the scale labels move into the era scale (a sticky nav of anchors, aria-current = the era at
 * the reading line); the heading's last word ("1873") is set as the numeral in place.
 * First screen: the quote row is set just after the first chapter (moved, not copied), so the
 * opening, the era scale and the first photograph share the first viewport.
 * Motion: numerals settle ≤ 40px behind their frame on scroll (≥ 768px), none under reduced
 * motion. Only the first chapter photograph is eager (fetchpriority high).
 */
import {
  fontsBeforeReveal, imageSize, slugify, textOf, thumbPicture,
} from '../../scripts/utils.js';

const PARALLAX_MAX = 40;
const NATIVE_BELOW = 1400; // frames narrower than this show at their own width, never upscaled
const SCALE_SHARE = 0.78; // the measured (dated) run of the scale; off-scale stops share the rest

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

/* the authored block elements of a cell (paragraphs, headings); bare text is wrapped once */
function blocksOf(cell) {
  if (!cell) return [];
  const kids = [...cell.children].filter((c) => /^(P|H[1-6]|UL|OL|DIV)$/.test(c.tagName) && textOf(c));
  if (kids.length) return kids;
  if (!textOf(cell)) return [];
  const p = document.createElement('p');
  p.append(...cell.childNodes);
  return [p];
}

function parse(block) {
  const out = { quote: null, eras: [] };
  let era = null;
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const picCell = cells.find((c) => c.querySelector('img'));
    const rest = cells.filter((c) => c !== picCell && textOf(c));
    if (!picCell && rest.length >= 2 && rest[1].querySelector('h1, h2, h3, h4, h5, h6')
      && !rest[1].querySelector('a') && textOf(rest[0]).length <= 24) {
      era = {
        label: rest[0], head: rest[1], projects: [],
      };
      out.eras.push(era);
      return;
    }
    if (!era) {
      if (!picCell && rest.length) out.quote = { text: blocksOf(rest[0]), by: blocksOf(rest[1]) };
      return;
    }
    const [titleCell, factsCell, quoteCell] = rest;
    if (!titleCell) return;
    const titleBlocks = blocksOf(titleCell);
    const title = titleBlocks.find((b) => b.querySelector('a')) || titleBlocks[0];
    era.projects.push({
      picture: picCell ? (picCell.querySelector('picture') || picCell.querySelector('img')) : null,
      title,
      tags: titleBlocks.filter((b) => b !== title),
      link: title ? title.querySelector('a') : null,
      facts: blocksOf(factsCell),
      quote: blocksOf(quoteCell),
    });
  });
  return out;
}

const imgOf = (pic) => (pic && (pic.tagName === 'IMG' ? pic : pic.querySelector('img')));

/* the fact paragraphs, MOVED and set inline (" · " between, in CSS); a dim line adds a span */
function factsLine(facts, cls) {
  const line = el('div', cls);
  const host = /\bdim\b/.test(cls) ? el('span') : line;
  facts.forEach((p) => host.append(p));
  if (host !== line) line.append(host);
  return line;
}

function tagsEl(tags) {
  if (!tags.length) return null;
  const w = el('div', 'era-timeline-tags');
  tags.forEach((t) => {
    t.classList.add('era-timeline-tag', 'label');
    w.append(t);
  });
  return w;
}

function viewLink(project, cls) {
  if (!project.link) return null;
  const a = el('a', `link-arrow ${cls}`, 'View project');
  a.href = project.link.getAttribute('href');
  a.append(el('span', 'visually-hidden', `: ${textOf(project.title)}`));
  return a;
}

function quoteEl(paras, project, cls) {
  if (!paras.length) return null;
  const bq = el('blockquote', cls);
  if (project && project.link) bq.cite = project.link.href;
  bq.append(...paras);
  return bq;
}

/* the heading "Built in the 1940s": its last word becomes the numeral, in place (text unchanged) */
function numeralHead(h, label) {
  const want = textOf(label).toLowerCase();
  const last = [...h.childNodes].reverse().find((n) => n.nodeType === 3 && n.textContent.trim());
  if (!last || h.children.length) return null;
  const text = last.textContent;
  const m = /^(.*?)(\S+)(\s*)$/s.exec(text);
  if (!m || m[2].toLowerCase() !== want) return null;
  const lab = el('span', 'era-timeline-label');
  const num = el('span', 'era-timeline-num');
  const [, before, word, after] = m;
  const sp = document.createTextNode(before.endsWith(' ') ? ' ' : '');
  lab.textContent = before.trimEnd();
  num.textContent = word;
  const nodes = [];
  if (lab.textContent) nodes.push(lab, sp);
  nodes.push(num);
  if (after) nodes.push(document.createTextNode(after));
  last.replaceWith(...nodes);
  return num;
}

function frameEl(pic, lead) {
  const fig = el('figure', 'era-timeline-frame');
  fig.append(pic);
  const img = imgOf(pic);
  const { w } = imageSize(img);
  if (lead && w && w < NATIVE_BELOW) {
    fig.classList.add('is-native');
    fig.style.setProperty('--native', `${w}px`);
  }
  if (lead) thumbPicture(pic, { desktop: 1600, mobile: 1000 });
  else thumbPicture(pic, { desktop: 750, mobile: 600 });
  if (img) {
    img.loading = 'lazy';
    img.decoding = 'async';
  }
  return fig;
}

function plateEl(project) {
  const art = el('article', 'era-timeline-plate');
  if (project.picture) art.append(frameEl(project.picture, false));
  const head = el('div', 'era-timeline-plate-head');
  project.title.classList.add('era-timeline-title');
  head.append(project.title);
  const tags = tagsEl(project.tags);
  if (tags) head.append(tags);
  art.append(head);
  if (project.facts.length) art.append(factsLine(project.facts, 'era-timeline-facts dim dim-start'));
  const q = quoteEl(project.quote, project, 'era-timeline-plate-quote');
  if (q) art.append(q);
  const go = viewLink(project, 'era-timeline-go');
  if (go) art.append(go);
  return art;
}

function listEl(projects) {
  const ul = el('ul', 'era-timeline-list');
  projects.forEach((project) => {
    const li = el('li', 'era-timeline-list-item');
    const name = el('div', 'era-timeline-list-name');
    name.append(project.title);
    const tags = tagsEl(project.tags);
    if (tags) name.append(tags);
    li.append(name);
    if (project.facts.length) li.append(factsLine(project.facts, 'era-timeline-list-facts label'));
    // a quote authored on a list row stays authored, unprinted
    if (project.quote.length) {
      const keep = el('div', 'era-timeline-meta');
      keep.hidden = true;
      keep.append(...project.quote);
      li.append(keep);
    }
    ul.append(li);
  });
  return ul;
}

/* the section head before the block: opening (H1, line, CTAs) + intro (H2, framing line) */
function takeHead(block) {
  const wrapper = block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  if (!prev || !prev.classList.contains('default-content-wrapper')) return { opening: [], intro: [] };
  const kids = [...prev.children];
  const at = kids.findIndex((k) => k.tagName === 'H2');
  prev.remove();
  if (at < 0) return { opening: kids, intro: [] };
  return { opening: kids.slice(0, at), intro: kids.slice(at) };
}

function scaleX(eras) {
  const years = eras.map((e) => {
    const m = /^(\d{4})s?$/.exec(textOf(e.label));
    return m ? Number(m[1]) : null;
  });
  const dated = years.filter((y) => y !== null);
  const min = Math.min(...dated);
  const max = Math.max(1980, ...dated);
  const off = years.filter((y) => y === null).length;
  let k = 0;
  return years.map((y) => {
    if (y !== null) return dated.length > 1 ? ((y - min) / (max - min)) * SCALE_SHARE : 0;
    k += 1;
    return SCALE_SHARE + ((1 - SCALE_SHARE) * k) / off;
  });
}

export default async function decorate(block) {
  const { quote, eras } = parse(block);
  const { opening, intro } = takeHead(block);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* opening + timeline head */
  const top = el('div', 'era-timeline-top');
  if (opening.length) {
    const open = el('div', 'era-timeline-opening');
    const actions = el('div', 'era-timeline-actions');
    opening.forEach((n) => {
      if (n.tagName === 'P' && (n.classList.contains('button-wrapper') || n.classList.contains('link-row'))) {
        actions.append(n);
        if (!actions.parentElement) open.append(actions);
      } else {
        if (n.tagName === 'H1') n.classList.add('era-timeline-h1');
        open.append(n);
      }
    });
    top.append(open);
  }
  const head = el('div', 'era-timeline-head');
  if (intro.length) {
    const i = el('div', 'era-timeline-intro');
    i.append(...intro);
    head.append(i);
  }
  let introQuote = null;
  if (quote && quote.text.length) {
    const fig = el('figure', 'era-timeline-intro-quote');
    introQuote = fig;
    const bq = el('blockquote');
    bq.append(...quote.text);
    const by = quote.by.find((p) => p.querySelector('a'));
    if (by) bq.cite = by.querySelector('a').href;
    fig.append(bq);
    if (quote.by.length) {
      const cap = el('figcaption', 'label');
      cap.append(...quote.by);
      fig.append(cap);
    }
  }

  /* era scale: the authored labels MOVE into the anchors */
  const xs = scaleX(eras);
  const nav = el('nav', 'era-timeline-scale');
  nav.setAttribute('aria-label', 'Eras');
  const bar = el('div', 'era-timeline-scale-bar');
  const ol = el('ol', 'era-timeline-scale-list');
  const fill = el('span', 'era-timeline-scale-fill');
  fill.setAttribute('aria-hidden', 'true');
  bar.append(ol, fill);
  nav.append(bar);

  const chapters = el('div', 'era-timeline-chapters');
  const used = new Set();
  let flip = 0;
  let firstFrame = null;
  const numerals = [];
  const items = eras.map((era, i) => {
    let id = `era-${slugify(textOf(era.label)) || i + 1}`;
    while (used.has(id) || document.getElementById(id)) id = `${id}-${i + 1}`;
    used.add(id);

    const art = el('article', 'era-timeline-era');
    art.id = id;
    const h = era.head.querySelector('h1, h2, h3, h4, h5, h6');
    const extras = blocksOf(era.head).filter((n) => n !== h);
    const topRow = el('div', 'era-timeline-era-top');
    if (h) {
      h.classList.add('era-timeline-era-h');
      if (!h.id) h.id = `${id}-h`;
      art.setAttribute('aria-labelledby', h.id);
      const num = numeralHead(h, era.label);
      if (num) {
        numerals.push({ num, art });
        if (!/\d/.test(num.textContent)) h.classList.add('is-word');
      }
      topRow.append(h);
    }
    extras.forEach((n) => {
      if (n.tagName === 'P' && !n.classList.contains('dim')) {
        const span = el('span');
        span.append(...n.childNodes);
        n.append(span);
        n.classList.add('dim', 'dim-start');
      }
      n.classList.add('era-timeline-era-note');
      topRow.append(n);
    });
    art.append(topRow);

    const withPic = era.projects.filter((p) => p.picture);
    const lead = withPic[0] || null;
    const plates = withPic.slice(1);
    const listed = era.projects.filter((p) => !p.picture);
    if (lead) {
      if (flip % 2) art.classList.add('is-flip');
      flip += 1;
      const leadEl = el('div', 'era-timeline-lead');
      lead.title.classList.add('era-timeline-title');
      leadEl.append(lead.title);
      const tags = tagsEl(lead.tags);
      if (tags) leadEl.append(tags);
      if (lead.facts.length) leadEl.append(factsLine(lead.facts, 'era-timeline-facts label'));
      topRow.append(leadEl);
      const frame = frameEl(lead.picture, true);
      if (!firstFrame) firstFrame = frame;
      art.append(frame);
      const text = el('div', 'era-timeline-text');
      const q = quoteEl(lead.quote, lead, 'era-timeline-quote');
      if (q) text.append(q);
      const go = viewLink(lead, 'era-timeline-go');
      if (go) text.append(go);
      art.append(text);
    } else art.classList.add('is-list');
    if (plates.length) {
      const wrap = el('div', 'era-timeline-plates');
      plates.forEach((p) => wrap.append(plateEl(p)));
      art.append(wrap);
    }
    if (listed.length) art.append(listEl(listed));
    chapters.append(art);

    const li = el('li');
    li.style.setProperty('--x', xs[i].toFixed(4));
    const a = el('a');
    a.href = `#${id}`;
    const labels = blocksOf(era.label);
    labels.forEach((p) => p.classList.add('era-timeline-scale-label'));
    a.append(...labels);
    const headText = h ? textOf(h) : '';
    if (headText && !headText.toLowerCase().includes(textOf(era.label).toLowerCase())) {
      a.append(el('span', 'visually-hidden', `: ${headText}`));
    }
    li.append(a);
    ol.append(li);
    // a jump lands on painted frames: the target chapter's photographs start loading first
    a.addEventListener('click', () => art.querySelectorAll('img[loading="lazy"]').forEach((im) => { im.loading = 'eager'; }));
    return {
      a, art, x: xs[i],
    };
  });

  // the timeline's opening sentence follows the first chapter
  if (introQuote) {
    const after = el('div', 'era-timeline-after');
    after.append(introQuote);
    if (chapters.firstElementChild) chapters.firstElementChild.after(after);
    else head.append(introQuote);
  }

  block.replaceChildren(top, head, nav, chapters);
  if (!opening.length) top.remove();

  // the first chapter photograph is the LCP candidate
  const lcp = imgOf(firstFrame && firstFrame.querySelector('picture, img'));
  if (lcp) {
    lcp.loading = 'eager';
    lcp.fetchPriority = 'high';
  }
  // the opening wraps in the brand faces from the first paint (no swap shift)
  await fontsBeforeReveal();

  /* aria-current + progress: the era at the reading line just under the scale (read-only) */
  let cur = -2;
  const setCurrent = (i) => {
    if (i === cur) return;
    cur = i;
    items.forEach((it, k) => {
      if (k === i) it.a.setAttribute('aria-current', 'location');
      else it.a.removeAttribute('aria-current');
    });
    if (i >= 0 && ol.scrollWidth > ol.clientWidth + 1) {
      const { a } = items[i];
      const left = a.parentElement.offsetLeft - (ol.clientWidth - a.parentElement.offsetWidth) / 2;
      ol.scrollTo({ left: Math.max(0, left), behavior: reduced.matches ? 'auto' : 'smooth' });
    }
  };
  let raf = 0;
  const update = () => {
    raf = 0;
    const line = nav.getBoundingClientRect().bottom + window.innerHeight * 0.2;
    let i = -1;
    items.forEach((it, k) => { if (it.art.getBoundingClientRect().top <= line) i = k; });
    let p = 0;
    if (i >= 0) {
      const t = items[i].art.getBoundingClientRect().top;
      const next = items[i + 1];
      const span = next ? next.art.getBoundingClientRect().top - t : items[i].art.offsetHeight;
      const f = Math.min(1, Math.max(0, (line - t) / Math.max(1, span)));
      p = items[i].x + ((next ? next.x : 1) - items[i].x) * f;
      if (chapters.getBoundingClientRect().bottom < line) i = -1; // past the timeline
    }
    nav.style.setProperty('--p', p.toFixed(4));
    setCurrent(i);
  };

  /* numerals settle behind their frame's top edge (≤ 40px), scroll-driven, near-viewport only */
  const near = new Set();
  const settle = () => {
    if (reduced.matches || window.innerWidth <= 767) {
      numerals.forEach(({ num }) => { num.style.transform = ''; });
      return;
    }
    const vh = window.innerHeight;
    numerals.forEach(({ num, art }) => {
      if (!near.has(art)) return;
      const frame = art.querySelector('.era-timeline-frame');
      if (!frame) return;
      const t = frame.getBoundingClientRect().top;
      const k = Math.min(1, Math.max(0, (vh * 0.62 - t) / (vh * 0.5)));
      num.style.transform = `translateY(${(k * PARALLAX_MAX).toFixed(1)}px)`;
    });
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? near.add(e.target) : near.delete(e.target)));
      settle();
    }, { rootMargin: '50% 0px' });
    numerals.forEach(({ art }) => io.observe(art));
  }
  const queue = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      update();
      settle();
    });
  };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  reduced.addEventListener('change', queue);
  // the section is still hidden while it loads: measure again once it lays out (and on reflow)
  if ('ResizeObserver' in window) new ResizeObserver(queue).observe(chapters);
  window.addEventListener('load', queue, { once: true });
  queue();
}
