/* eslint-disable */
/* global WebImporter */
/**
 * Import script for the "project" template (barnettarchitecture.com redesign, stardust/migrated → EDS).
 * Block shapes: stardust/.work/eds/block-contract.md. Generated shape per excat-import-script.
 */
import heroParser from './parsers/hero.js';
import breadcrumbsParser from './parsers/breadcrumbs.js';
import factsParser from './parsers/facts.js';
import bigIdeaParser from './parsers/big-idea.js';
import galleryParser from './parsers/gallery.js';
import pagerParser from './parsers/pager.js';
import projectIndexParser from './parsers/project-index.js';
import fragmentParser from './parsers/fragment.js';
import sharedDocsTransformer from './transformers/barnett-shared-docs.js';
import cleanupTransformer from './transformers/barnett-cleanup.js';
import metadataTransformer from './transformers/barnett-metadata.js';
import sectionsTransformer from './transformers/barnett-sections.js';

const PAGE_TEMPLATE = {
  "name": "project",
  "description": "Project page: project hero + breadcrumb, facts bar, big idea, photograph plates, prev/next pager, related projects, enquiry band.",
  "urls": [
    "http://127.0.0.1:3110/projects/40s-re-make",
    "http://127.0.0.1:3110/projects/50s-redoux",
    "http://127.0.0.1:3110/projects/70s-re-make",
    "http://127.0.0.1:3110/projects/channel-house",
    "http://127.0.0.1:3110/projects/condo-kitchen",
    "http://127.0.0.1:3110/projects/designcraft",
    "http://127.0.0.1:3110/projects/folded-roof",
    "http://127.0.0.1:3110/projects/folded-roof-patio",
    "http://127.0.0.1:3110/projects/green-ribbon",
    "http://127.0.0.1:3110/projects/hill-farm-swim-club",
    "http://127.0.0.1:3110/projects/island-kitchen",
    "http://127.0.0.1:3110/projects/meeting-house",
    "http://127.0.0.1:3110/projects/micro-house",
    "http://127.0.0.1:3110/projects/mid-century",
    "http://127.0.0.1:3110/projects/passive-light",
    "http://127.0.0.1:3110/projects/pond-house",
    "http://127.0.0.1:3110/projects/potter-studio",
    "http://127.0.0.1:3110/projects/push-pull",
    "http://127.0.0.1:3110/projects/ridgewood-swim-club",
    "http://127.0.0.1:3110/projects/ridgewood-swim-club-ii",
    "http://127.0.0.1:3110/projects/solar-court",
    "http://127.0.0.1:3110/projects/stone-and-siding",
    "http://127.0.0.1:3110/projects/synagogue-study",
    "http://127.0.0.1:3110/projects/three-gables",
    "http://127.0.0.1:3110/projects/tube",
    "http://127.0.0.1:3110/projects/tudor-extension",
    "http://127.0.0.1:3110/projects/two-flat",
    "http://127.0.0.1:3110/projects/wil-mar-center",
    "http://127.0.0.1:3110/projects/willy-street"
  ],
  "blocks": [
    {
      "name": "hero",
      "instances": [
        "main > section[data-section=\"hero\"]"
      ]
    },
    {
      "name": "breadcrumbs",
      "instances": [
        "main > nav.hero__crumbs"
      ]
    },
    {
      "name": "facts",
      "instances": [
        "section[data-section=\"facts\"] dl.factbar"
      ]
    },
    {
      "name": "big-idea",
      "instances": [
        "main > section[data-section=\"big-idea\"]"
      ]
    },
    {
      "name": "gallery",
      "instances": [
        "section[data-section=\"gallery\"] .gallery__seq"
      ]
    },
    {
      "name": "pager",
      "instances": [
        "section[data-section=\"project-pager\"] nav.pager"
      ]
    },
    {
      "name": "project-index",
      "instances": [
        "section[data-section=\"related-projects\"] ul.schedule__list"
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
  'breadcrumbs': breadcrumbsParser,
  'facts': factsParser,
  'big-idea': bigIdeaParser,
  'gallery': galleryParser,
  'pager': pagerParser,
  'project-index': projectIndexParser,
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
