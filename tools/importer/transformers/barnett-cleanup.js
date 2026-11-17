/* eslint-disable */
/* global WebImporter */

/**
 * Cleanup for the stardust/migrated static site (barnettarchitecture.com redesign).
 *
 * preprocess (original DOM — the importer rebuilds the body before transform and drops srcset):
 *  - set each image's single src (also kept in data-best-src): the widest candidate the page offers
 *    (srcset / src / lightbox href), which the migration already capped at the original's width;
 *  - capture head facts (title, description, og:image, robots) for the metadata transformer.
 * beforeTransform (before block discovery):
 *  - drop site chrome and build-only markup: skip links, site header/footer (nav/footer are their own
 *    documents), the lightbox <dialog>, scripts, JSON-LD, styles, [hidden] UI, the "skip the wall"
 *    link, the process phase anchor index (the process-steps block renders it from its rows);
 *  - H1s split into thesis + who spans become "thesis<br>who" (one H1, both lines);
 *  - remaining .visually-hidden helpers (sr-only headings, "(external site)") are removed;
 *  - every internal link is rewritten to the new site path (/projects/willy-street — no host, no
 *    index.html); the project hero breadcrumb trail moves after the hero so it is its own block.
 * afterTransform: unwrap default-content figure/address wrappers and wrap bare links in <p>.
 */

function cleanupText(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function cleanupWixWidth(url) {
  const m = /\/w_(\d+),h_\d+/.exec(url || '');
  return m ? Number(m[1]) : 0;
}

function cleanupBestSrc(img) {
  const candidates = [];
  // candidates are separated by ", " — Wix URLs themselves contain bare commas (w_800,h_533,…)
  (img.getAttribute('srcset') || '').split(/,\s+/).map((s) => s.trim()).filter(Boolean).forEach((part) => {
    const [u, d] = part.split(/\s+/);
    candidates.push({ u, w: parseInt(d, 10) || cleanupWixWidth(u) });
  });
  const src = img.getAttribute('src');
  if (src) candidates.push({ u: src, w: cleanupWixWidth(src) });
  const a = img.closest('a[data-lb], a.plate__link, a.photo__open');
  if (a && a.getAttribute('href')) candidates.push({ u: a.getAttribute('href'), w: cleanupWixWidth(a.getAttribute('href')) });
  const wix = candidates.filter((c) => /static\.wixstatic\.com\/media\//.test(c.u));
  const pool = wix.length ? wix : candidates;
  pool.sort((x, y) => y.w - x.w);
  return pool.length ? pool[0].u : src;
}

/** URL of the migrated *file* the page was served from, so relative links resolve as authored. */
function cleanupFileBase(pageUrl) {
  const u = new URL(pageUrl);
  let p = u.pathname;
  if (p === '/' || p === '') p = '/index.html';
  else if (/^\/404\/?$/.test(p)) p = '/404.html';
  else if (!/\.html?$/.test(p)) p = `${p.replace(/\/$/, '')}/index.html`;
  return `${u.origin}${p}`;
}

/** Migrated relative href → new site path (`/projects/willy-street`, no index.html, no host). */
function cleanupNewPath(href, pageUrl) {
  if (!href || /^(mailto:|tel:|#|javascript:)/i.test(href)) return href;
  let u;
  try { u = new URL(href, cleanupFileBase(pageUrl)); } catch (e) { return href; }
  if (u.origin !== new URL(pageUrl).origin) return href; // external
  let p = u.pathname.replace(/index\.html$/, '').replace(/\.html$/, '');
  if (p.length > 1) p = p.replace(/\/$/, '');
  return `${p || '/'}${u.search}${u.hash}`;
}

export default function transform(hookName, element, payload) {
  const { document } = payload;
  const params = payload.params || {};
  const pageUrl = params.originalURL || payload.url || window.location.href;

  if (hookName === 'preprocess') {
    // only src survives the rebuild, so the pick becomes the src itself (srcset/sizes dropped)
    element.querySelectorAll('img').forEach((img) => {
      const best = cleanupBestSrc(img);
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
      img.setAttribute('src', best);
      img.setAttribute('data-best-src', best);
    });
    // the rebuild unwraps class-less spans: keep the ones parsers need apart
    element.querySelectorAll('figcaption > span:not([class])').forEach((s) => s.classList.add('plate__title'));
    element.querySelectorAll('label > span:not([class])').forEach((s) => s.classList.add('field__hint'));
  }

  if ((hookName === 'preprocess' || hookName === 'beforeTransform') && payload.params && !payload.params.headMeta && document.head) {
    const meta = (sel) => (document.head.querySelector(sel) || { getAttribute: () => '' }).getAttribute('content') || '';
    payload.params.headMeta = {
      title: cleanupText(document.head.querySelector('title')),
      description: meta('meta[name="description"]'),
      image: meta('meta[property="og:image"]'),
      robots: meta('meta[name="robots"]'),
    };
  }

  if (hookName === 'beforeTransform') {
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      'a.skip-wall',
      'dialog',
      'script',
      'noscript',
      'style',
      'link',
      'nav.steps__index',
      '[hidden]',
      'header.site-header',
      'footer.site-footer',
    ]);

    element.querySelectorAll('h1').forEach((h1) => {
      const thesis = h1.querySelector('.hero__thesis, .opening__thesis');
      const who = h1.querySelector('.hero__who, .opening__who');
      if (thesis && who) {
        h1.replaceChildren(document.createTextNode(cleanupText(thesis)), document.createElement('br'), document.createTextNode(cleanupText(who)));
      } else {
        h1.replaceChildren(document.createTextNode(cleanupText(h1)));
      }
    });

    element.querySelectorAll('.visually-hidden').forEach((n) => n.remove());

    element.querySelectorAll('a[href]').forEach((a) => {
      a.setAttribute('href', cleanupNewPath(a.getAttribute('href'), pageUrl));
    });

    // paired arrow links ("About the practice" + "The design process") → one paragraph each
    element.querySelectorAll('p.principles__links').forEach((p) => {
      p.replaceWith(...[...p.querySelectorAll('a')].map((a) => {
        const np = document.createElement('p');
        np.append(a);
        return np;
      }));
    });

    element.querySelectorAll('section.hero nav.hero__crumbs').forEach((nav) => {
      nav.closest('section').after(nav);
    });
  }

  if (hookName === 'afterTransform') {
    element.querySelectorAll('address').forEach((n) => n.replaceWith(...n.childNodes));
    element.querySelectorAll('figure').forEach((fig) => {
      if (fig.closest('table')) return;
      fig.querySelectorAll('figcaption').forEach((cap) => {
        const p = document.createElement('p');
        p.append(...cap.childNodes);
        cap.replaceWith(p);
      });
      fig.replaceWith(...fig.childNodes);
    });
    element.querySelectorAll('div > a, section > a').forEach((a) => {
      if (a.closest('table')) return;
      const p = document.createElement('p');
      a.replaceWith(p);
      p.append(a);
    });
  }
}
