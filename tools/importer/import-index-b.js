/* eslint-disable */
/* global WebImporter */
/**
 * Import script for the "index-b" template — home variant b, a design variant of the home served
 * at /index-b (Robots noindex; Template home). Source: stardust/prototypes/index-b-proposed.html
 * served by tools/importer/serve-prototypes.mjs (127.0.0.1:3120).
 * Block shapes: stardust/.work/eds/block-contract.md + project-stage (see parsers/project-stage.js).
 * Sections: index (H1 · line · CTAs · index label + project-stage) · practice (Style practice) ·
 * photography (darkroom, collection-index justified) · testimonial · enquiry (Style enquiry, inline)
 * + metadata in the same last section.
 */
import projectStageParser from './parsers/project-stage.js';
import collectionIndexParser from './parsers/collection-index.js';
import testimonialsParser from './parsers/testimonials.js';
import indexBTransformer from './transformers/barnett-index-b.js';
import cleanupTransformer from './transformers/barnett-cleanup.js';
import metadataTransformer from './transformers/barnett-metadata.js';
import sectionsTransformer from './transformers/barnett-sections.js';

const PAGE_TEMPLATE = {
  "name": "index-b",
  "description": "Home variant b (design variant at /index-b, noindex): sheet index beside a photo stage (project-stage), practice band (process chain + Houzz recognition), justified photography wall, featured testimonial, inline enquiry band.",
  "urls": [
    "http://127.0.0.1:3120/index-b-proposed.html"
  ],
  "blocks": [
    {
      "name": "project-stage",
      "instances": [
        "section[data-section=\"index\"] nav.ix__index"
      ]
    },
    {
      "name": "collection-index",
      "instances": [
        "section[data-section=\"photography\"] .photo-wall"
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
/** the home's served structured data (stardust/.work/eds/jsonld/index.json via serve-prototypes) */
const JSONLD_PATH = '/_jsonld/index.json';
/** source file → document path */
const PATHS = { '/index-b-proposed.html': '/index-b' };

const parsers = {
  'project-stage': projectStageParser,
  'collection-index': collectionIndexParser,
  'testimonials': testimonialsParser,
};

/*
 * barnett-metadata with the home template, then: Image as an <img> (the media bus ingests it) and
 * the served JSON-LD row (as every content page carries).
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
    xhr.open('GET', `${origin}${JSONLD_PATH}`, false);
    xhr.send(null);
    if (xhr.status === 200) {
      const json = JSON.stringify(JSON.parse(xhr.responseText));
      const tr = document.createElement('tr');
      const k = document.createElement('td');
      k.textContent = 'JSON-LD';
      const v = document.createElement('td');
      v.textContent = json;
      tr.append(k, v);
      (table.querySelector('tbody') || table).append(tr);
    }
  } catch (e) {
    console.warn('index-b: JSON-LD unavailable', e);
  }
}

// Late transformers change the DOM (section <hr> markers), so their beforeTransform runs after block discovery.
const sectionTransformers = [sectionsTransformer];
const lateTransformers = [...sectionTransformers];
// index-b runs first: its preprocess sets the stage-size image src before cleanup picks the best src
const transformers = [indexBTransformer, cleanupTransformer, metadataAsHome, ...lateTransformers];
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
