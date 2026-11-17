/* eslint-disable */
/* global WebImporter */
/**
 * Import script for the "photo-hub" template (barnettarchitecture.com redesign, stardust/migrated → EDS).
 * Block shapes: stardust/.work/eds/block-contract.md. Generated shape per excat-import-script.
 */
import heroParser from './parsers/hero.js';
import collectionIndexParser from './parsers/collection-index.js';
import fragmentParser from './parsers/fragment.js';
import sharedDocsTransformer from './transformers/barnett-shared-docs.js';
import cleanupTransformer from './transformers/barnett-cleanup.js';
import metadataTransformer from './transformers/barnett-metadata.js';
import sectionsTransformer from './transformers/barnett-sections.js';

const PAGE_TEMPLATE = {
  "name": "photo-hub",
  "description": "Photography hub: hero, intro, selected works (darkroom), collections index by region / exhibit (darkroom), enquiry band.",
  "urls": [
    "http://127.0.0.1:3110/photography"
  ],
  "blocks": [
    {
      "name": "hero",
      "instances": [
        "main > section[data-section=\"hero\"]"
      ]
    },
    {
      "name": "collection-index",
      "instances": [
        "section[data-section=\"selected-works\"] .photo-wall",
        "section[data-section=\"collections\"] .wall"
      ]
    },
    {
      "name": "fragment",
      "instances": [
        "main > section[data-section=\"enquiry\"]"
      ]
    }
  ]
};

const parsers = {
  'hero': heroParser,
  'collection-index': collectionIndexParser,
  'fragment': fragmentParser,
};
// Late transformers change the DOM (section <hr> markers), so their beforeTransform runs after block discovery.
const sectionTransformers = [sectionsTransformer];
const fragmentTransformers = [];
const lateTransformers = [...sectionTransformers, ...fragmentTransformers];
// shared-docs reads the site header/footer before cleanup removes them
const transformers = [sharedDocsTransformer, cleanupTransformer, metadataTransformer, ...lateTransformers];
const earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
const CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));

function executeTransformers(hookName, element, payload, list = transformers) {
  const enhancedPayload = { ...payload, template: payload.params?.targets?.template || PAGE_TEMPLATE };
  list.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template, url) {
  const pageBlocks = [];
  const pageKey = (u) => {
    try { const { origin, pathname } = new URL(u); return `${origin}${pathname.replace(/\/$/, '')}`; }
    catch { return u; }
  };
  const key = pageKey(url);
  const claim = (blockDef, selector) => {
    let matches = [];
    try { matches = document.querySelectorAll(selector); } catch { return; }
    matches.forEach((element) => {
      if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
      pageBlocks.push({ name: blockDef.name, selector, element });
    });
  };
  template.blocks.forEach((blockDef) => {
    const entry = Object.entries(blockDef.pageInstances || {}).find(([u]) => pageKey(u) === key);
    (entry ? entry[1] : []).forEach((selector) => claim(blockDef, selector));
  });
  template.blocks.forEach((blockDef) => (blockDef.instances || []).forEach((selector) => claim(blockDef, selector)));
  return pageBlocks;
}

function markPageTargets(payload) {
  const { document, params } = payload;
  executeTransformers('beforeTransform', document.body, payload, earlyTransformers);
  const blocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
    element.setAttribute('data-excat-block', String(i));
    return { name, selector };
  });
  const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
    const target = (section.selector || []).map((s) => { try { return document.querySelector(s); } catch { return null; } }).find(Boolean);
    if (!target) return section;
    target.setAttribute('data-excat-section', String(i));
    return { ...section, selector: [`[data-excat-section="${i}"]`] };
  });
  params.targets = { blocks, template: { ...PAGE_TEMPLATE, sections } };
}

/** Document path from the contract's page path map: / → /index, /projects → /projects, … */
function documentPath(originalURL) {
  const raw = new URL(originalURL).pathname
    .replace(/\/index\.html?$/, '')
    .replace(/\.html?$/, '')
    .replace(/\/$/, '');
  return raw === '' ? '/index' : raw;
}

export default {
  preprocess: (payload) => {
    // transformers that must read the original DOM (srcset, head, site header/footer) before the
    // importer rebuilds the body for transform
    executeTransformers('preprocess', payload.document.body, payload, earlyTransformers);
    if (CATALOG) markPageTargets(payload);
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

    // metadata block is appended by barnett-metadata (afterTransform), not WebImporter.rules.createMetadata
    executeTransformers('afterTransform', main, payload);

    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    params.fragments.forEach(({ element }) => {
      executeTransformers('afterTransform', element, payload, earlyTransformers);
      WebImporter.rules.transformBackgroundImages(element, document);
      WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
    });

    const path = documentPath(params.originalURL);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }, ...params.fragments];
  },
};
