/*
 * Fragment Block
 * Include content on a page as a fragment.
 * https://www.aem.live/developer/block-collection/fragment
 */

// eslint-disable-next-line import/no-cycle
import {
  decorateMain,
} from '../../scripts/scripts.js';

import {
  loadSections,
} from '../../scripts/aem.js';
import { contentBase } from '../../scripts/utils.js';

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {HTMLElement} The root element of the fragment
 */
export async function loadFragment(path) {
  if (path && path.startsWith('/') && !path.startsWith('//')) {
    // local preview mounts content under /content (aem up --html-folder content)
    const base = contentBase();
    const src = base && !path.startsWith(`${base}/`) ? `${base}${path}` : path;
    const resp = await fetch(`${src}.plain.html`);
    if (resp.ok) {
      const main = document.createElement('main');
      main.innerHTML = await resp.text();
      // a document-level metadata table (e.g. Robots: noindex on /nav, /footer, /fragments/*)
      // is page config, never fragment content — the html-folder preview leaves it in place
      main.querySelectorAll(':scope > div > .metadata').forEach((meta) => {
        const section = meta.parentElement;
        meta.remove();
        if (!section.children.length && !section.textContent.trim()) section.remove();
      });

      // reset base path for media to fragment base
      const resetAttributeBase = (tag, attr) => {
        main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((elem) => {
          elem[attr] = new URL(elem.getAttribute(attr), new URL(path, window.location)).href;
        });
      };
      resetAttributeBase('img', 'src');
      resetAttributeBase('source', 'srcset');

      decorateMain(main);
      // tag the fragment's sections (e.g. .fragment-enquiry) so styles.css can paint them
      const name = path.split('/').filter(Boolean).pop();
      main.querySelectorAll(':scope > .section').forEach((s) => s.classList.add('fragment-section', `fragment-${name}`));
      await loadSections(main);
      return main;
    }
  }
  return null;
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();
  const fragment = await loadFragment(path);
  if (!fragment) return;

  const wrapper = block.closest('.fragment-wrapper');
  const section = wrapper.closest('.section');

  if (section && section.children.length === 1) {
    // fragment is the ONLY child of its section; replace the whole section
    section.replaceWith(...fragment.childNodes);
  } else {
    // fragment shares section with other children; flatten children into it
    fragment.querySelectorAll(':scope > .section').forEach((fragSection) => {
      [...fragSection.childNodes].forEach((child) => wrapper.before(child));
    });
    wrapper.remove();
  }
}
