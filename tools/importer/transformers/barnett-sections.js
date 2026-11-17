/* eslint-disable */
/* global WebImporter */

/**
 * Section breaks + section styles.
 * Every `main > section[data-section]` of the migrated page is one EDS section: an <hr> goes before
 * each but the first. Elements the cleanup moved between sections (the project breadcrumb trail)
 * stay with the section before them.
 * Section Metadata (Style), appended right after the section element:
 *  - darkroom — photography ground (section.darkroom)
 *  - intro    — side-rail intro, small label + measured prose (section.intro / .prose / .services)
 *  - narrow   — 68ch measure for type-led text sections (section.opening / .schedule--text)
 */
function styleOf(section) {
  const c = section.classList;
  if (c.contains('darkroom')) return 'darkroom';
  if (c.contains('intro') || c.contains('prose') || c.contains('services')) return 'intro';
  if (c.contains('opening') || c.contains('schedule--text')) return 'narrow';
  return null;
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'beforeTransform') return;
  const { document } = payload;
  const main = element.querySelector('main') || element;
  const sections = [...main.querySelectorAll(':scope > section[data-section]')];
  sections.forEach((section, i) => {
    const style = styleOf(section);
    if (style) {
      const meta = WebImporter.DOMUtils.createTable([['Section Metadata'], ['Style', style]], document);
      section.after(meta);
    }
    if (i > 0) section.before(document.createElement('hr'));
  });
}
