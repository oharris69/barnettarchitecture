/* eslint-disable */
/* global WebImporter */
/**
 * Import script for the "index-c" template — home variant c ("decade by decade"), a design variant
 * of the home served at /index-c (Robots noindex; Template home). Source:
 * stardust/prototypes/index-c-proposed.html served by tools/importer/serve-prototypes.mjs (127.0.0.1:3120).
 * Block shapes: stardust/.work/eds/block-contract.md + era-timeline (see parsers/era-timeline.js).
 * Sections: timeline (H1 · line · CTAs · H2 · framing line + era-timeline) · recognition (Style
 * recognition) · principles (row) · photography (darkroom, collection-index row) · testimonial ·
 * enquiry (Style enquiry, inline) + metadata in the same last section.
 */
import eraTimelineParser from './parsers/era-timeline.js';
import principlesParser from './parsers/principles.js';
import collectionIndexParser from './parsers/collection-index.js';
import testimonialsParser from './parsers/testimonials.js';
import indexCTransformer from './transformers/barnett-index-c.js';
import cleanupTransformer from './transformers/barnett-cleanup.js';
import metadataTransformer from './transformers/barnett-metadata.js';
import sectionsTransformer from './transformers/barnett-sections.js';

const PAGE_TEMPLATE = {
  "name": "index-c",
  "description": "Home variant c (design variant at /index-c, noindex): opening + decade-by-decade era timeline (era-timeline: sticky era scale, chapters, plates, undated and new lists), Houzz recognition line, principles row, photography strip, featured testimonial, inline enquiry band.",
  "urls": [
    "http://127.0.0.1:3120/index-c-proposed.html"
  ],
  "blocks": [
    {
      "name": "era-timeline",
      "instances": [
        "section[data-section=\"timeline\"] .tl__chapters"
      ]
    },
    {
      "name": "principles",
      "instances": [
        "section[data-section=\"principles\"] .principles__sheet"
      ]
    },
    {
      "name": "collection-index",
      "instances": [
        "section[data-section=\"photography\"] .wall"
      ]
    },
    {
      "name": "testimonials",
      "instances": [
        "section[data-section=\"testimonial\"] figure.testimonial__figure"
      ]
    }
  ]
};

/** the page's metadata Template value: the variant renders with the home template */
const METADATA_TEMPLATE = 'home';
/** the home document whose served JSON-LD row is copied (content/index.plain.html via serve-prototypes) */
const JSONLD_DOC = '/_content/index.plain.html';
/** source file → document path */
const PATHS = { '/index-c-proposed.html': '/index-c' };

const parsers = {
  'era-timeline': eraTimelineParser,
  'principles': principlesParser,
  'collection-index': collectionIndexParser,
  'testimonials': testimonialsParser,
};

/*
 * barnett-metadata with the home template, then: Image as an <img> (the media bus ingests it) and
 * the served JSON-LD row, copied from the home document.
 */
function metadataAsHome(hookName, element, payload) {
  metadataTransformer(hookName, element, { ...payload, template: { ...(payload.template || {}), name: METADATA_TEMPLATE } });
  if (hookName !== 'afterTransform' || element !== payload.document.body) return;
  const { document } = payload;
  const tables = [...element.querySelectorAll('table')];
  const table = tables[tables.length - 1];
  if (!table) return;
  const rows = [...table.querySelectorAll('tr')];
  rows.forEach((tr) => {
    const [k, v] = tr.children;
    if (!k || !v || k.textContent.trim() !== 'Image') return;
    const src = v.textContent.trim();
    if (!/^https?:\/\//.test(src)) return;
    const img = document.createElement('img');
    img.setAttribute('src', src);
    img.setAttribute('alt', '');
    v.replaceChildren(img);
  });
  try {
    const xhr = new XMLHttpRequest();
    const origin = new URL(payload.params.originalURL || payload.url).origin;
    xhr.open('GET', `${origin}${JSONLD_DOC}`, false);
    xhr.send(null);
    const home = xhr.status === 200 ? new DOMParser().parseFromString(xhr.responseText, 'text/html') : null;
    const row = home && [...home.querySelectorAll('.metadata > div')].find((r) => r.children[0] && r.children[0].textContent.trim() === 'JSON-LD');
    if (row && row.children[1]) {
      const json = JSON.stringify(JSON.parse(row.children[1].textContent));
      const tr = document.createElement('tr');
      const k = document.createElement('td');
      k.textContent = 'JSON-LD';
      const v = document.createElement('td');
      v.textContent = json;
      tr.append(k, v);
      (table.querySelector('tbody') || table).append(tr);
    }
  } catch (e) {
    console.warn('index-c: JSON-LD unavailable', e);
  }
}

// Late transformers change the DOM (section <hr> markers), so their beforeTransform runs after block discovery.
const sectionTransformers = [sectionsTransformer];
const lateTransformers = [...sectionTransformers];
// index-c runs first: it reshapes sections before cleanup and block discovery
const transformers = [indexCTransformer, cleanupTransformer, metadataAsHome, ...lateTransformers];
const earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));

function executeTransformers(hookName, element, payload, list = transformers) {
  const enhancedPayload = { ...payload, template: payload.params?.targets?.template || PAGE_TEMPLATE };
  list.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => (blockDef.instances || []).forEach((selector) => {
    let matches = [];
    try { matches = document.querySelectorAll(selector); } catch { return; }
    matches.forEach((element) => {
      if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
      pageBlocks.push({ name: blockDef.name, selector, element });
    });
  }));
  return pageBlocks;
}

function markPageTargets(payload) {
  const { document, params } = payload;
  executeTransformers('beforeTransform', document.body, payload, earlyTransformers);
  const blocks = findBlocksOnPage(document, PAGE_TEMPLATE).map(({ name, selector, element }, i) => {
    element.setAttribute('data-excat-block', String(i));
    return { name, selector };
  });
  params.targets = { blocks, template: PAGE_TEMPLATE };
}

function documentPath(originalURL) {
  const { pathname } = new URL(originalURL);
  if (PATHS[pathname]) return PATHS[pathname];
  const raw = pathname.replace(/\/index\.html?$/, '').replace(/\.html?$/, '').replace(/\/$/, '');
  return raw === '' ? '/index' : raw;
}

export default {
  preprocess: (payload) => {
    executeTransformers('preprocess', payload.document.body, payload, earlyTransformers);
  },
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    params.fragments = [];

    if (!params.targets) markPageTargets(payload);
    const pageBlocks = params.targets.blocks
      .map((block, i) => ({ ...block, element: document.querySelector(`[data-excat-block="${i}"]`) }))
      .filter((block) => block.element);
    executeTransformers('beforeTransform', main, { ...payload, pageBlocks }, lateTransformers);

    pageBlocks.forEach((block) => {
      if (!main.contains(block.element)) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); }
      catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    // metadata block is appended by metadataAsHome (afterTransform), in the enquiry section
    executeTransformers('afterTransform', main, payload);

    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    return [{
      element: main,
      path: documentPath(params.originalURL),
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }];
  },
};
