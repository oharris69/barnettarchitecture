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
