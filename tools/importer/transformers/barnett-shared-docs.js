/* eslint-disable */
/* global WebImporter */

/**
 * Shared documents, written once from the home import (params.writeSharedDocs):
 *  /nav    — section 1: brand link · section 2: main list (Projects [Residential, Commercial…],
 *            Photography, Practice [About, Process, Todd Barnett, Testimonials]) · section 3: Contact.
 *            Labels/hrefs come from the migrated site header; the Projects children come from the
 *            Projects column of the migrated footer; "Practice" links to its first child (/about).
 *  /footer — section 1: wordmark + NAP · section 2: sitemap columns · section 3: © line,
 *            exactly as the migrated footer.
 * preprocess: built from the original DOM (the importer's body rebuild loses parts of the footer)
 * and kept as HTML in params; beforeTransform: emitted as extra documents via params.fragments.
 */

function sdText(el) {
  return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function sdNewPath(href, pageUrl) {
  if (!href || /^(mailto:|tel:|#|javascript:)/i.test(href)) return href;
  const page = new URL(pageUrl);
  const base = page.pathname === '/' ? `${page.origin}/index.html` : `${page.origin}${page.pathname.replace(/\/$/, '')}/index.html`;
  let u;
  try { u = new URL(href, base); } catch (e) { return href; }
  if (u.origin !== page.origin) return href;
  let p = u.pathname.replace(/index\.html$/, '').replace(/\.html$/, '');
  if (p.length > 1) p = p.replace(/\/$/, '');
  return `${p || '/'}${u.search}${u.hash}`;
}

function buildSharedDocs(document, pageUrl) {
  const header = document.querySelector('header.site-header');
  const footer = document.querySelector('footer.site-footer');
  if (!header || !footer) return null;
  const href = (a) => sdNewPath(a.getAttribute('href'), pageUrl);
  const mk = (tag, kids) => {
    const e = document.createElement(tag);
    (Array.isArray(kids) ? kids : [kids]).filter(Boolean).forEach((k) => e.append(typeof k === 'string' ? document.createTextNode(k) : k));
    return e;
  };
  const a = (h, label) => { const l = mk('a', label); l.setAttribute('href', h); return l; };

  const columns = [...footer.querySelectorAll('.site-footer__map > div')].map((col) => ({
    heading: sdText(col.querySelector('h2, h3, .label')),
    links: [...col.querySelectorAll('a')].map((l) => ({ href: href(l), label: sdText(l) })),
  }));

  /* nav */
  const nav = document.createElement('div');
  const brand = header.querySelector('.ds-wordmark');
  nav.append(mk('p', a(href(brand), sdText(brand))));
  nav.append(document.createElement('hr'));
  const list = document.createElement('ul');
  let contact = null;
  header.querySelectorAll('.ds-nav__list > li').forEach((li) => {
    const details = li.querySelector('details');
    if (details) {
      const subLinks = [...details.querySelectorAll('.ds-nav__sub a')];
      const item = mk('li', a(subLinks.length ? href(subLinks[0]) : '/', sdText(details.querySelector('summary'))));
      item.append(mk('ul', subLinks.map((l) => mk('li', a(href(l), sdText(l))))));
      list.append(item);
      return;
    }
    const link = li.querySelector('a');
    if (!link) return;
    if (href(link) === '/contact') { contact = link; return; }
    const item = mk('li', a(href(link), sdText(link)));
    if (sdText(link) === 'Projects') {
      const col = columns.find((c) => c.heading === 'Projects');
      const children = (col ? col.links : []).filter((l) => l.href !== href(link));
      if (children.length) item.append(mk('ul', children.map((l) => mk('li', a(l.href, l.label)))));
    }
    list.append(item);
  });
  nav.append(list);
  nav.append(document.createElement('hr'));
  if (contact) nav.append(mk('p', a(href(contact), sdText(contact))));

  /* footer */
  const foot = document.createElement('div');
  const fbrand = footer.querySelector('.ds-wordmark');
  if (fbrand) foot.append(mk('p', a(href(fbrand), sdText(fbrand))));
  const nap = footer.querySelector('address');
  if (nap) {
    const p = document.createElement('p');
    nap.childNodes.forEach((n) => {
      if (n.nodeName === 'BR') p.append(document.createElement('br'));
      else if (n.nodeName === 'A') p.append(a(href(n), sdText(n)));
      else if (n.nodeType === 3 && n.textContent.trim()) p.append(document.createTextNode(n.textContent.trim()));
    });
    foot.append(p);
  }
  foot.append(document.createElement('hr'));
  columns.forEach((c) => {
    foot.append(mk('h2', c.heading));
    foot.append(mk('ul', c.links.map((l) => mk('li', a(l.href, l.label)))));
  });
  foot.append(document.createElement('hr'));
  footer.querySelectorAll('.site-footer__legal > span').forEach((s) => foot.append(mk('p', sdText(s))));

  return { nav: nav.innerHTML, footer: foot.innerHTML };
}

export default function transform(hookName, element, payload) {
  const { document } = payload;
  const params = payload.params;
  if (!params || !params.writeSharedDocs) return;
  const pageUrl = params.originalURL || payload.url || window.location.href;

  if ((hookName === 'preprocess' || hookName === 'beforeTransform') && !params.sharedDocs) {
    params.sharedDocs = buildSharedDocs(document, pageUrl);
  }
  if (hookName === 'beforeTransform' && params.sharedDocs && Array.isArray(params.fragments) && !params.sharedDocsEmitted) {
    ['nav', 'footer'].forEach((name) => {
      const div = document.createElement('div');
      div.innerHTML = params.sharedDocs[name];
      params.fragments.push({ element: div, path: `/${name}` });
    });
    params.sharedDocsEmitted = true;
  }
}
