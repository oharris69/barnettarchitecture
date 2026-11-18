/*
 * Shared helpers for Barnett Architecture blocks (imported from /scripts/, never block-to-block).
 */

/**
 * The local preview (`aem up --html-folder content`) mounts pages under /content.
 * @returns {string} '/content' when the current page is served from the local html folder, else ''
 */
export function contentBase() {
  const { pathname } = window.location;
  return pathname === '/content' || pathname.startsWith('/content/') ? '/content' : '';
}

/**
 * Site path of the current page, independent of the local /content mount.
 * @returns {string} e.g. '/projects/willy-street' or '/'
 */
export function sitePath() {
  const base = contentBase();
  let p = window.location.pathname.slice(base.length) || '/';
  p = p.replace(/\.html$/, '').replace(/\/index$/, '/');
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p || '/';
}

/**
 * Site path of a link (same origin only), normalised like sitePath().
 * @param {HTMLAnchorElement} a
 * @returns {string|null}
 */
export function linkPath(a) {
  if (!a || !a.href) return null;
  try {
    const u = new URL(a.getAttribute('href'), window.location);
    if (u.origin !== window.location.origin && !/barnettarchitecture\.com$/.test(u.hostname)) return null;
    let p = u.pathname;
    if (p === '/content' || p.startsWith('/content/')) p = p.slice(8) || '/';
    p = p.replace(/\.html$/, '').replace(/\/index$/, '/');
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    return p || '/';
  } catch (e) {
    return null;
  }
}

/**
 * Locally, authored root-relative links (/projects/x) point outside the /content mount;
 * rewrite them so the preview is navigable. No-op on aem.page / aem.live.
 * @param {Element} root
 */
export function localizeLinks(root) {
  const base = contentBase();
  if (!base || !root) return;
  root.querySelectorAll('a[href^="/"]').forEach((a) => {
    const href = a.getAttribute('href');
    if (href.startsWith('//') || href.startsWith(`${base}/`) || href === base) return;
    a.setAttribute('href', `${base}${href === '/' ? '/index' : href}`);
  });
}

/** @param {string} s */
export function slugify(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Intrinsic aspect ratio (w / h) of an authored image:
 * attributes, then the Wix URL, then natural size.
 */
export function imageAspect(img) {
  if (!img) return 1.5;
  const w = parseInt(img.getAttribute('width'), 10);
  const h = parseInt(img.getAttribute('height'), 10);
  if (w > 0 && h > 0) return w / h;
  const m = (img.getAttribute('src') || '').match(/[/,]w_(\d+),h_(\d+)/);
  if (m) return Number(m[1]) / Number(m[2]);
  if (img.naturalWidth && img.naturalHeight) return img.naturalWidth / img.naturalHeight;
  return 1.5;
}

/** Intrinsic pixel size of an authored image, best effort. */
export function imageSize(img) {
  const w = parseInt(img.getAttribute('width'), 10);
  const h = parseInt(img.getAttribute('height'), 10);
  if (w > 0 && h > 0) return { w, h };
  const m = (img.getAttribute('src') || '').match(/[/,]w_(\d+),h_(\d+)/);
  if (m) return { w: Number(m[1]), h: Number(m[2]) };
  const ar = imageAspect(img);
  return { w: 2400, h: Math.round(2400 / ar) };
}

/**
 * URL of an authored image at (about) the given width.
 * EDS media (`media_<hash>.jpg?width=…`) takes a width param; Wix fill URLs are scaled in place.
 * @param {HTMLImageElement} img
 * @param {number} width
 */
export function imageAt(img, width) {
  const src = img.currentSrc || img.getAttribute('src') || '';
  try {
    const u = new URL(src, window.location);
    if (/\/media_[0-9a-f]+/.test(u.pathname)) {
      u.searchParams.set('width', String(width));
      if (!u.searchParams.has('optimize')) u.searchParams.set('optimize', 'medium');
      u.searchParams.set('format', 'webply');
      return u.href;
    }
    const raw = img.getAttribute('src') || src;
    const m = raw.match(/\/v1\/fill\/w_(\d+),h_(\d+)/);
    if (m) {
      const ow = Number(m[1]);
      const oh = Number(m[2]);
      const w = Math.min(ow, width);
      const h = Math.round((oh * w) / ow);
      return raw.replace(/\/v1\/fill\/w_\d+,h_\d+/, `/v1/fill/w_${w},h_${h}`);
    }
    return raw;
  } catch (e) {
    return src;
  }
}

/**
 * Thumbnail sizing, in place: the authored <picture> keeps its identity (it is MOVED by the
 * blocks, never rebuilt) — only the requested widths change. EDS media (`media_<hash>`):
 * <source media=…> → `desktop`, the other sources and the <img> → `mobile`.
 * Wix fill URLs (local content): a desktop <source> + a mobile <img>. Always lazy unless a
 * block already made the image eager.
 * @param {Element} el <picture> or <img>
 * @param {{desktop?: number, mobile?: number}} widths
 */
export function thumbPicture(el, { desktop = 750, mobile = 500 } = {}) {
  if (!el) return;
  const img = el.tagName === 'IMG' ? el : el.querySelector('img');
  if (!img) return;
  const pic = img.closest('picture');
  if (img.loading !== 'eager') img.loading = 'lazy';
  const media = (src, w) => {
    try {
      const u = new URL(src, window.location);
      if (!/\/media_[0-9a-f]+/.test(u.pathname)) return null;
      u.searchParams.set('width', String(w));
      return u.href;
    } catch (e) {
      return null;
    }
  };
  const src = img.getAttribute('src') || '';
  if (media(src, mobile)) {
    if (pic) {
      const sources = [...pic.querySelectorAll(':scope > source')];
      sources.forEach((s) => {
        const next = media(s.getAttribute('srcset') || '', s.media ? desktop : mobile);
        if (next) s.setAttribute('srcset', next);
      });
      // AVIF first (the pipeline lists WebP first, so browsers never pick the smaller AVIF);
      // a WebP source with no AVIF twin for the same media query gets one
      const isAvif = (s) => s.type === 'image/avif';
      sources.filter((s) => s.type === 'image/webp').forEach((s) => {
        if (sources.some((o) => isAvif(o) && o.media === s.media)) return;
        const u = new URL(s.getAttribute('srcset'), window.location);
        if (!u.searchParams.has('format')) return;
        u.searchParams.set('format', 'avif');
        const twin = document.createElement('source');
        twin.type = 'image/avif';
        twin.srcset = u.href;
        if (s.media) twin.media = s.media;
        sources.push(twin);
      });
      const rank = (s) => (s.media ? 0 : 2) + (isAvif(s) ? 0 : 1);
      sources.sort((a, b) => rank(a) - rank(b)).forEach((s) => img.before(s));
    }
    img.setAttribute('src', media(src, mobile));
    return;
  }
  if (!/\/v1\/fill\/w_\d+,h_\d+/.test(src)) return;
  const at = (w) => imageAt({ getAttribute: (a) => img.getAttribute(a), currentSrc: '' }, w);
  if (pic && !pic.querySelector('source')) {
    const s = document.createElement('source');
    s.media = '(min-width: 600px)';
    s.srcset = at(desktop);
    pic.prepend(s);
    img.setAttribute('src', at(mobile));
  } else img.setAttribute('src', at(desktop));
}

/**
 * Section head reabsorption: when a block's section starts with default content
 * (eyebrow / H2 / lede),
 * MOVE those nodes into the block (they stay inline-editable) and drop the emptied wrapper.
 * @param {Element} block
 * @returns {HTMLDivElement|null} the head container, or null when there was no head
 */
export function reabsorbHead(block, className) {
  const wrapper = block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  if (!prev || !prev.classList.contains('default-content-wrapper')) return null;
  const head = document.createElement('div');
  head.className = className;
  head.append(...prev.childNodes);
  prev.remove();
  return head;
}

/**
 * Block rows → arrays of cells.
 * @param {Element} block
 * @returns {HTMLElement[][]}
 */
export function rowsOf(block) {
  return [...block.children].map((row) => [...row.children]);
}

/** Visible text of a cell, whitespace-collapsed. */
export function textOf(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

/**
 * Taxonomy (stardust/taxonomy.json): facet label → URL slug. Unknown labels fall back to slugify().
 */
export const FACETS = {
  sector: {
    label: 'Sector',
    values: {
      residential: 'Residential',
      commercial: 'Commercial',
      community: 'Community & Faith',
      recreation: 'Recreation',
    },
  },
  type: {
    label: 'Project type',
    values: {
      'new-home': 'New home',
      addition: 'Addition',
      renovation: 'Renovation',
      kitchen: 'Kitchen',
      outdoor: 'Outdoor living',
      'multi-unit': 'Multi-unit',
      'master-plan': 'Master plan & study',
    },
  },
  location: {
    label: 'Location',
    values: {
      'madison-wi': 'Madison, WI',
      'middleton-wi': 'Middleton, WI',
      'mequon-wi': 'Mequon, WI',
      wisconsin: 'Wisconsin',
      'highland-park-il': 'Highland Park, IL',
      'downers-grove-il': 'Downers Grove, IL',
      'westchester-ny': 'Westchester County, NY',
    },
  },
  approach: {
    label: 'Approach',
    values: {
      'green-design': 'Green design',
      'universal-design': 'Universal design',
      'historic-context': 'Historic context',
    },
  },
};

/**
 * @param {string} facet sector|type|location|approach
 * @param {string} label human label
 * @returns {string} slug
 */
export function facetSlug(facet, label) {
  const f = FACETS[facet];
  const want = (label || '').trim().toLowerCase();
  if (f) {
    const hit = Object.entries(f.values)
      .find(([slug, l]) => l.toLowerCase() === want || slug === want);
    if (hit) return hit[0];
    // tolerant match: "Master plan" → master-plan, "Outdoor" → outdoor,
    // "Westchester, NY" → westchester-ny
    const s = slugify(label);
    const near = Object.keys(f.values).find((slug) => s.startsWith(slug) || slug.startsWith(s));
    if (near) return near;
  }
  return slugify(label);
}

/**
 * Split a facet value list:
 * "New home, Addition" | "Addition & renovation" → ['New home', 'Addition'].
 * Location values carry their own comma ("Madison, WI") and are never split.
 */
export function splitFacet(facet, text) {
  const t = (text || '').replace(/\s+/g, ' ').trim();
  if (!t || t === '-' || t === '—') return [];
  if (facet === 'location') return [t];
  const known = Object.values((FACETS[facet] || {}).values || {}).map((l) => l.toLowerCase());
  return t.split(/\s*[,;]\s*/)
    .flatMap((piece) => (known.includes(piece.toLowerCase()) ? [piece] : piece.split(/\s+[&+]\s+/)))
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => v.charAt(0).toUpperCase() + v.slice(1));
}

/**
 * Join facet values for a dimension line: ['Addition', 'Renovation'] → 'Addition & renovation'.
 */
export function joinFacet(values, sep = ' & ') {
  return values.map((v, i) => (i ? v.charAt(0).toLowerCase() + v.slice(1) : v)).join(sep);
}

/**
 * What an authored video link points at (video block + JSON-LD share it).
 * YouTube (watch, youtu.be, embed, shorts, live) → youtube-nocookie; Vimeo (incl. unlisted hash)
 * → player.vimeo.com; anything else with a .mp4/.webm/.mov path (DA media, any https host) → file.
 * @param {string} href
 * @returns {{kind: 'youtube'|'vimeo'|'file', url: string, id?: string,
 *   embed?: string, player?: string}|null} embed = canonical embed URL (structured data),
 *   player = the iframe src (privacy host, autoplay after the click)
 */
export function videoSource(href) {
  if (!href) return null;
  let u;
  try {
    u = new URL(href.trim(), window.location);
  } catch (e) {
    return null;
  }
  const host = u.hostname.replace(/^(www|m)\./, '');
  const parts = u.pathname.split('/').filter(Boolean);
  let id = '';
  if (host === 'youtu.be') [id] = parts;
  else if (/^youtube(-nocookie)?\.com$/.test(host)) {
    id = u.searchParams.get('v') || (['embed', 'shorts', 'live', 'v'].includes(parts[0]) ? parts[1] : '');
  }
  if (id && /^[\w-]{6,}$/.test(id)) {
    const t = parseInt(u.searchParams.get('t') || u.searchParams.get('start') || '', 10);
    const start = t > 0 ? `&start=${t}` : '';
    return {
      kind: 'youtube',
      id,
      url: u.href,
      embed: `https://www.youtube.com/embed/${id}`,
      player: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1${start}`,
    };
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const nums = parts.filter((p) => /^\d+$/.test(p));
    [id] = nums;
    if (id) {
      // unlisted: vimeo.com/<id>/<hash> or ?h=<hash>
      const after = parts[parts.indexOf(id) + 1];
      const hash = u.searchParams.get('h') || (after && /^[0-9a-f]{6,}$/i.test(after) ? after : '');
      const h = hash ? `&h=${hash}` : '';
      return {
        kind: 'vimeo',
        id,
        url: u.href,
        embed: `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ''}`,
        player: `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1${h}`,
      };
    }
  }
  if (/^https?:$/.test(u.protocol) && /\.(mp4|m4v|webm|mov)$/i.test(u.pathname)) {
    return { kind: 'file', url: u.href };
  }
  return null;
}

/** Build a dimension-string element (`.dim`) holding text (or nodes). */
export function dimLine(content, variant = 'dim-stack', tag = 'p') {
  const el = document.createElement(tag);
  el.className = `dim ${variant}`;
  const span = document.createElement('span');
  if (typeof content === 'string') span.textContent = content;
  else span.append(...[].concat(content));
  el.append(span);
  return el;
}
