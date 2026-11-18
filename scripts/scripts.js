import {
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  buildBlock,
  getMetadata,
  toClassName,
  toCamelCase,
} from './aem.js';
import { sitePath, localizeLinks, textOf } from './utils.js';

if (window.trustedTypes && window.trustedTypes.createPolicy) {
  const innerTT = window.trustedTypes.createPolicy('tt-inner', {
    createHTML: (s) => s, // avoid stack overflow
  });

  window.trustedTypes.createPolicy('default', {
    createHTML: (input, type, sink) => {
      let processedInput = input;
      if (/srcdoc\s*=/i.test(processedInput)) {
        const doc = new DOMParser().parseFromString(innerTT.createHTML(processedInput), 'text/html');
        doc.querySelectorAll('iframe[srcdoc]').forEach((el) => el.removeAttribute('srcdoc'));
        processedInput = doc.body.innerHTML;
      }
      if (sink.includes('createContextualFragment') || sink.includes('Document write')) {
        const doc = new DOMParser().parseFromString(innerTT.createHTML(processedInput), 'text/html');
        doc.querySelectorAll('script').forEach((el) => el.remove());
        processedInput = doc.body.innerHTML;
      }
      return processedInput;
    },
    createScriptURL: (input) => input,
    createScript: (input) => input,
  });
}

const SITE = 'https://www.barnettarchitecture.com';

/**
 * Organization constant — DESIGN.json extensions.metadata.organization (+ stable @id).
 */
const ORGANIZATION = {
  '@type': ['ProfessionalService', 'LocalBusiness'],
  '@id': `${SITE}/#organization`,
  name: 'Barnett Architecture LLC',
  alternateName: 'Barnett Architecture',
  url: `${SITE}/`,
  description: 'A full-service, design-focused architectural practice in Madison, Wisconsin, established in 2007. Services range from hourly consultations to the full architectural process.',
  image: `${SITE}/icons/icon-512.png`,
  logo: `${SITE}/icons/icon-512.png`,
  foundingDate: '2007',
  founder: {
    '@type': 'Person', name: 'Todd Barnett', jobTitle: 'Architect', url: `${SITE}/about/todd-barnett`,
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '118 North Breese Terrace, Suite I',
    addressLocality: 'Madison',
    addressRegion: 'WI',
    postalCode: '53726-4133',
    addressCountry: 'US',
  },
  telephone: '+1-608-233-4538',
  email: 'todd@barnettarchitecture.com',
  areaServed: [
    'Madison', 'Middleton', 'Fitchburg', 'Sun Prairie', 'Verona', 'Waunakee', 'Monona',
    'Maple Bluff', 'McFarland', 'Cottage Grove', 'Oregon', 'Windsor', 'Belleville', 'Brooklyn',
  ].map((name) => ({ '@type': 'City', name: `${name}, WI` }))
    .concat([{ '@type': 'State', name: 'Wisconsin' }, { '@type': 'State', name: 'Illinois' }]),
  knowsAbout: [
    'residential architecture',
    'custom homes',
    'additions and renovations',
    'kitchen and bathroom remodeling',
    'accessory dwelling units',
    'historic building conservation',
    'green design',
    'energy-efficient homes',
    'universal design',
    'charrette design process',
  ],
  award: ['Best of Houzz 2014 — Service', 'Best of Houzz 2016 — Service', 'Best of Houzz 2018 — Service'],
  sameAs: ['https://www.houzz.com/professionals/architects-and-building-designers/barnett-architecture-llc-pfvwus-pf~914672624'],
};

const CRUMB_NAMES = {
  projects: 'Projects',
  residential: 'Residential',
  commercial: 'Commercial, community & recreation',
  photography: 'Photography',
  about: 'About',
  process: 'Process',
  'todd-barnett': 'Todd Barnett',
  testimonials: 'Testimonials',
  contact: 'Contact',
};

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Turns `/widgets/...` links into widget blocks.
 * @param {Element} main The container element
 */
function buildWidgetAutoBlocks(main) {
  const widgetLinks = [...main.querySelectorAll('a[href*="/widgets/"]')];
  widgetLinks.forEach((link) => {
    if (link.closest('.widget')) return;
    const newLink = link.cloneNode(true);
    const widgetBlock = buildBlock('widget', { elems: [newLink] });
    const p = link.closest('p');
    if (
      p
      && p.querySelectorAll('a').length === 1
      && p.querySelector('a') === link
      && p.textContent.trim() === link.textContent.trim()
    ) {
      p.replaceWith(widgetBlock);
    } else {
      link.replaceWith(widgetBlock);
    }
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * Only fragment and widget links are auto-blocked: authored blocks are never rewritten.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter((f) => !f.closest('.fragment'));
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }
    buildWidgetAutoBlocks(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * section-metadata is rendered server-side on aem.page/live; the local html-folder preview
 * leaves the table in place. Apply it here (Style → classes, other keys → data-*), then drop it.
 * @param {Element} main
 */
function decorateSectionMetadata(main) {
  main.querySelectorAll(':scope > div > div.section-metadata').forEach((meta) => {
    const section = meta.parentElement;
    [...meta.children].forEach((row) => {
      const [k, v] = [...row.children].map((c) => textOf(c));
      if (!k) return;
      const key = toClassName(k);
      if (key === 'style') {
        (v || '').split(',').map((s) => toClassName(s)).filter(Boolean)
          .forEach((cls) => section.classList.add(cls));
      } else if (v) section.dataset[toCamelCase(key)] = v;
    });
    meta.remove();
  });
}

/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    a.title = a.title || a.textContent;
    const p = a.closest('p');
    const text = a.textContent.trim();

    // quick structural checks
    if (a.querySelector('img') || p.textContent.trim() !== text) return;

    // skip URL display links
    try {
      if (new URL(a.href).href === new URL(text, window.location).href) return;
    } catch { /* continue */ }

    // require authored formatting for buttonization
    const strong = a.closest('strong');
    const em = a.closest('em');
    if (!strong && !em) return;

    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) { // high-impact call-to-action
      a.classList.add('accent');
      const outer = strong.contains(em) ? strong : em;
      outer.replaceWith(a);
    } else if (strong) {
      a.classList.add('primary');
      strong.replaceWith(a);
    } else {
      a.classList.add('secondary');
      em.replaceWith(a);
    }
  });
}

/**
 * Editorial prose conventions on default content (project-owned, like decorateButtons):
 * - an H1 with a line break: thesis + who-line ("Projects meant to fit the client<br>Barnett …")
 * - a short "a · b" paragraph is a dimension-string label line
 * - a paragraph made only of links is a link row (→ arrows); before a project index, a primary CTA
 * - a list of bare links after a block (or of ?/# links) is a row of chips
 * - a paragraph holding several pictures is a notes wall
 * @param {Element} main
 */
function decorateProse(main) {
  main.querySelectorAll('h1').forEach((h1) => {
    const br = h1.querySelector(':scope > br');
    if (!br || h1.querySelector('.h1-who')) return;
    const thesis = document.createElement('span');
    thesis.className = 'h1-thesis';
    const who = document.createElement('span');
    who.className = 'h1-who';
    let node = h1.firstChild;
    while (node && node !== br) {
      const next = node.nextSibling;
      thesis.append(node);
      node = next;
    }
    node = br.nextSibling;
    while (node) {
      const next = node.nextSibling;
      who.append(node);
      node = next;
    }
    const sep = document.createElement('span');
    sep.className = 'visually-hidden';
    sep.textContent = ' — ';
    br.replaceWith(thesis, sep, who);
    if (!textOf(who)) who.remove();
  });

  const wrappers = main.querySelectorAll('.default-content-wrapper');
  wrappers.forEach((wrapper) => {
    const nextBlock = wrapper.nextElementSibling;
    const prevBlock = wrapper.previousElementSibling;
    wrapper.querySelectorAll(':scope > p, :scope > ul > li > p').forEach((p) => {
      if (p.classList.contains('button-wrapper') || p.querySelector('picture, img')) return;
      const t = textOf(p);
      const links = [...p.querySelectorAll(':scope > a')];
      if (links.length && !textOf(p).replace(links.map((a) => textOf(a)).join(''), '').replace(/[\s·|]/g, '')) {
        p.classList.add('link-row');
        const primary = links.length === 1 && nextBlock && nextBlock.classList.contains('project-index-wrapper');
        links.forEach((a) => {
          if (/^(mailto|tel):/.test(a.getAttribute('href') || '')) return;
          if (primary) {
            p.classList.add('button-wrapper');
            a.classList.add('button', 'primary');
          } else a.classList.add('link-arrow');
        });
        return;
      }
      if (t.length <= 64 && /\s·\s/.test(t) && !/[.!?]$/.test(t)) {
        const span = document.createElement('span');
        span.append(...p.childNodes);
        p.append(span);
        p.classList.add('dim', 'dim-start');
      }
    });

    wrapper.querySelectorAll(':scope > ul').forEach((ul) => {
      const items = [...ul.children];
      const bare = items.length && items.every((li) => {
        const a = li.querySelector(':scope > a');
        return a && li.children.length === 1 && textOf(li) === textOf(a);
      });
      if (!bare) return;
      const hrefs = items.map((li) => li.querySelector('a').getAttribute('href') || '');
      const afterBlock = prevBlock && !prevBlock.classList.contains('default-content-wrapper') && ul === wrapper.firstElementChild;
      if (!afterBlock && !hrefs.every((h) => /[?#]/.test(h))) return;
      if (hrefs.every((h) => /^(mailto|tel):/.test(h))) return;
      ul.classList.add('facets');
      items.forEach((li) => li.querySelector('a').classList.add('facet-chip'));
    });

    wrapper.querySelectorAll(':scope > p').forEach((p) => {
      if (p.querySelectorAll('picture, img:not(picture img)').length > 1) p.classList.add('notes');
    });
  });
}

/**
 * intro section style: split the default content into a side rail (leading headings + their label
 * lines) and a reading body. Nodes are moved, never rebuilt.
 * @param {Element} main
 */
function decorateIntros(main) {
  main.querySelectorAll(':scope > .section.intro > .default-content-wrapper').forEach((wrapper) => {
    if (wrapper.querySelector(':scope > .intro-rail')) return;
    const kids = [...wrapper.children];
    const rail = document.createElement('div');
    rail.className = 'intro-rail';
    const body = document.createElement('div');
    body.className = 'intro-body';
    let i = 0;
    while (i < kids.length && /^H[1-6]$/.test(kids[i].tagName)) {
      rail.append(kids[i]);
      i += 1;
    }
    while (i < kids.length && kids[i].classList.contains('dim')) {
      rail.append(kids[i]);
      i += 1;
    }
    const rest = kids.slice(i);
    // a trailing ordered list of short stages becomes a full-width chain dimension
    const last = rest[rest.length - 1];
    let chain = null;
    if (last && last.tagName === 'OL' && [...last.children].every((li) => textOf(li).length <= 40)) {
      chain = last;
      rest.pop();
      chain.classList.add('chain');
    }
    body.append(...rest);
    wrapper.append(rail, body);
    if (chain) wrapper.append(chain);
  });
}

/**
 * practice section style (home variant b): a side rail (leading heading + the dimension-string
 * fact lines — paragraphs holding " · "), a reading body, and from the first H3 on a process row
 * (H3 · ordered list as a chain dimension · link). Nodes are moved, never rebuilt.
 * @param {Element} main
 */
function decoratePractice(main) {
  main.querySelectorAll(':scope > .section.practice > .default-content-wrapper').forEach((wrapper) => {
    if (wrapper.querySelector(':scope > .practice-rail')) return;
    const kids = [...wrapper.children];
    const mk = (cls) => {
      const d = document.createElement('div');
      d.className = cls;
      return d;
    };
    const rail = mk('practice-rail');
    const body = mk('practice-body');
    const process = mk('practice-process');
    let i = 0;
    while (i < kids.length && /^H[12]$/.test(kids[i].tagName)) {
      rail.append(kids[i]);
      i += 1;
    }
    while (i < kids.length && kids[i].tagName === 'P' && /\s·\s/.test(textOf(kids[i]))) {
      const p = kids[i];
      if (!p.classList.contains('dim')) {
        // a long fact line (recognition): stacked dimension string, sentence case
        const span = document.createElement('span');
        span.append(...p.childNodes);
        p.append(span);
        p.classList.add('dim', 'dim-stack', 'practice-note');
      }
      rail.append(p);
      i += 1;
    }
    while (i < kids.length && kids[i].tagName !== 'H3') {
      body.append(kids[i]);
      i += 1;
    }
    kids.slice(i).forEach((n) => {
      if (n.tagName === 'OL') n.classList.add('chain');
      process.append(n);
    });
    wrapper.append(rail, body);
    if (process.children.length) wrapper.append(process);
  });
}

/**
 * recognition section style (home variant c): a band of fact lines — each paragraph becomes a
 * stacked dimension string. The paragraph keeps its identity; its children move into the span.
 * @param {Element} main
 */
function decorateRecognition(main) {
  main.querySelectorAll(':scope > .section.recognition > .default-content-wrapper > p:not(.dim)').forEach((p) => {
    const span = document.createElement('span');
    span.append(...p.childNodes);
    p.append(span);
    p.classList.add('dim', 'dim-stack');
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateIcons(main);
  decorateSectionMetadata(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateButtons(main);
  decorateProse(main);
  decorateIntros(main);
  decoratePractice(main);
  decorateRecognition(main);
  localizeLinks(main);
}

/* ---------------- JSON-LD ---------------- */

/**
 * Absolute, canonical image URL for structured data: same-origin paths (aem.page / aem.live /
 * localhost previews) are re-based on SITE (the local /content mount dropped), external hosts
 * are kept; query strings and fragments are stripped either way.
 */
const abs = (src) => {
  if (!src) return '';
  try {
    const u = new URL(src, window.location);
    u.search = '';
    u.hash = '';
    if (u.origin !== window.location.origin) return u.href;
    const path = u.pathname.replace(/^\/content(?=\/)/, '');
    return `${SITE}${path}`;
  } catch (e) {
    return src;
  }
};

const pageUrl = () => `${SITE}${sitePath() === '/' ? '/' : sitePath()}`;

function pageName() {
  const h1 = document.querySelector('main h1');
  if (h1) {
    // the thesis only: text before the first line break (or the .h1-thesis span once decorated)
    const thesis = h1.querySelector('.h1-thesis');
    let t = thesis ? textOf(thesis) : '';
    if (!t) {
      const parts = [];
      [...h1.childNodes].some((n) => {
        if (n.nodeName === 'BR') return true;
        parts.push(n.textContent);
        return false;
      });
      t = parts.join('').replace(/\s+/g, ' ').trim();
    }
    if (t) return t;
  }
  return document.title.replace(/\s*\|\s*Barnett Architecture\s*$/, '').trim();
}

function breadcrumbList() {
  const parts = sitePath().split('/').filter(Boolean);
  const items = [{
    '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/`,
  }];
  parts.forEach((seg, i) => {
    const last = i === parts.length - 1;
    const name = last ? pageName() : (CRUMB_NAMES[seg] || seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
    items.push({
      '@type': 'ListItem', position: i + 2, name, item: `${SITE}/${parts.slice(0, i + 1).join('/')}`,
    });
  });
  return { '@type': 'BreadcrumbList', '@id': `${pageUrl()}#breadcrumb`, itemListElement: items };
}

/** raw block rows (read before the blocks decorate) */
const rawRows = (block) => [...block.children].map((r) => [...r.children]);

function imagesIn(selector) {
  return [...document.querySelectorAll(`main ${selector} img`)]
    .map((img) => ({ url: abs(img.getAttribute('src')), alt: img.getAttribute('alt') || '' }))
    .filter((i) => i.url);
}

function itemList(block) {
  if (!block) return null;
  const items = rawRows(block).map((cells) => {
    const a = cells.map((c) => c.querySelector('a')).find(Boolean);
    if (!a) return null;
    const href = a.getAttribute('href') || '';
    const path = href.replace(/^https?:\/\/[^/]+/, '').replace(/^\/content(?=\/)/, '').replace(/#.*$/, '');
    return { name: textOf(a), url: `${SITE}${path}` };
  }).filter(Boolean);
  if (!items.length) return null;
  return {
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name, url: it.url,
    })),
  };
}

function buildJsonLd(main) {
  const template = toClassName(getMetadata('template'));
  const url = pageUrl();
  const name = pageName();
  const description = getMetadata('description');
  const graph = [
    ORGANIZATION,
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: `${SITE}/`,
      name: 'Barnett Architecture',
      inLanguage: 'en-US',
      publisher: { '@id': ORGANIZATION['@id'] },
    },
  ];
  if (sitePath() !== '/') graph.push(breadcrumbList());

  const split = (k) => (getMetadata(k) || '').split(',').map((s) => s.trim()).filter(Boolean);

  if (template === 'project') {
    const images = imagesIn('.hero').concat(imagesIn('.gallery'));
    const work = {
      '@type': 'CreativeWork',
      '@id': `${url}#project`,
      name,
      url,
      description,
      creator: { '@id': ORGANIZATION['@id'] },
      isPartOf: { '@id': `${SITE}/#website` },
      image: [...new Set(images.map((i) => i.url))],
    };
    const sector = split('sector');
    const type = split('type');
    const approach = split('approach');
    const location = split('location').join(', ');
    if (sector.length) work.genre = sector.join(', ');
    if (type.length || approach.length) work.keywords = type.concat(approach).join(', ');
    if (location) work.locationCreated = { '@type': 'Place', name: location };
    graph.push(work);
  } else if (template === 'gallery') {
    const images = imagesIn('.gallery');
    graph.push({
      '@type': 'ImageGallery',
      '@id': `${url}#gallery`,
      name,
      url,
      description,
      author: ORGANIZATION.founder,
      isPartOf: { '@id': `${SITE}/#website` },
      numberOfItems: images.length,
      image: images.map((i) => ({
        '@type': 'ImageObject', contentUrl: i.url, name: i.alt || name, creator: ORGANIZATION.founder,
      })),
    });
  } else if (template === 'listing' || template === 'photo-hub') {
    const list = template === 'listing'
      ? itemList(main.querySelector('.project-index'))
      : itemList(main.querySelector('.collection-index:not(.selected):not(.strip)'))
        || itemList(main.querySelector('.collection-index'));
    let items = list;
    if (template === 'photo-hub') {
      // grouped collections (Regions, Exhibits) are separate blocks: one list
      const all = [...main.querySelectorAll('.collection-index:not(.selected):not(.strip)')]
        .map(itemList).filter(Boolean).flatMap((l) => l.itemListElement);
      if (all.length) {
        items = {
          '@type': 'ItemList',
          numberOfItems: all.length,
          itemListElement: all.map((it, i) => ({ ...it, position: i + 1 })),
        };
      }
    }
    const page = {
      '@type': 'CollectionPage',
      '@id': `${url}#collection`,
      name,
      url,
      description,
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@id': ORGANIZATION['@id'] },
    };
    if (items) page.mainEntity = items;
    graph.push(page);
  } else if (template === 'contact') {
    graph.push({
      '@type': 'ContactPage',
      '@id': `${url}#contact`,
      name,
      url,
      description,
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@id': ORGANIZATION['@id'] },
      mainEntity: { '@id': ORGANIZATION['@id'] },
    });
  }

  const faq = main.querySelector('.faq');
  if (faq) {
    const qa = rawRows(faq).map((cells) => {
      const [q, ...a] = cells.filter((c) => textOf(c));
      if (!q || !a.length) return null;
      return {
        '@type': 'Question',
        name: textOf(q),
        acceptedAnswer: { '@type': 'Answer', text: a.map((c) => textOf(c)).join(' ') },
      };
    }).filter(Boolean);
    if (qa.length) {
      graph.push({
        '@type': 'FAQPage', '@id': `${url}#faq`, url, mainEntity: qa,
      });
    }
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  document.head.append(script);
}

/* ---------------- motion ---------------- */

/**
 * Editorial motion: one opacity reveal per section. Sections already in (or above) the viewport
 * are never hidden; without JS or under prefers-reduced-motion nothing is touched.
 * @param {Element} main
 */
function initReveal(main) {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const seen = new WeakSet();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const s = e.target;
      if (!seen.has(s)) {
        seen.add(s);
        if (e.isIntersecting || e.boundingClientRect.top < window.innerHeight) {
          io.unobserve(s);
          return;
        }
        s.classList.add('reveal');
        return;
      }
      if (e.isIntersecting) {
        s.classList.add('is-revealed');
        io.unobserve(s);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  main.querySelectorAll(':scope > .section').forEach((s, i) => {
    if (i > 0) io.observe(s);
  });
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  // structured data served from the page metadata ("JSON-LD" row) wins: no client copy
  const servedJsonLd = !!document.head.querySelector('script[type="application/ld+json"]');
  if (main) {
    // JSON-LD reads the authored block tables before they are decorated
    try {
      decorateSectionMetadata(main);
      if (!servedJsonLd) buildJsonLd(main);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('JSON-LD failed', e);
    }
    decorateMain(main);
    // a full-bleed hero first: the header floats transparent over it
    const first = main.querySelector('.section .block');
    if (first && first.classList.contains('hero')) document.body.classList.add('hero-media');
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('body > header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('body > footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
  initReveal(main);
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  import('./consent-check.js');
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
