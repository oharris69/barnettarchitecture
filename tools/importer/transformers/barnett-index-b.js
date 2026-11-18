/* eslint-disable */
/* global WebImporter */

/**
 * Home variant b (stardust/prototypes/index-b-proposed.html → /index-b). Runs before the shared
 * barnett transformers.
 * preprocess (original DOM): each index entry's picture gets its stage-size src from data-img.
 * beforeTransform:
 *  - drop the prototype's interaction chrome (hints, skip link, photo stage);
 *  - CTA rows → one paragraph per link; a .btn-primary becomes **bold** (decorateButtons → primary);
 *  - the practice band is Style `practice` (not the shared `intro`), the enquiry band is the inline
 *    Style `enquiry` section (heading, email/phone, Start a project, address);
 *  - Robots noindex: the variant must not compete with /.
 */
import { prepareStageImages } from '../parsers/project-stage.js';

function ixbMeta(document, style) {
  return WebImporter.DOMUtils.createTable([['Section Metadata'], ['Style', style]], document);
}

export default function transform(hookName, element, payload) {
  const { document } = payload;
  const params = payload.params || {};

  if (hookName === 'preprocess') {
    prepareStageImages(element);
  }

  if (hookName === 'beforeTransform') {
    if (params.headMeta) params.headMeta.robots = 'noindex';

    WebImporter.DOMUtils.remove(element, ['.ix__stage', '.ix__hint', 'a.ix__skip']);

    element.querySelectorAll('p.ix__actions, .enquiry__body > p').forEach((p) => {
      const links = [...p.querySelectorAll(':scope > a')];
      if (!links.length || p.textContent.replace(/\s+/g, '') !== links.map((a) => a.textContent).join('').replace(/\s+/g, '')) return;
      const paras = links.map((a) => {
        const np = document.createElement('p');
        if (a.classList.contains('btn-primary')) {
          const strong = document.createElement('strong');
          strong.append(a);
          np.append(strong);
        } else np.append(a);
        return np;
      });
      p.replaceWith(...paras);
    });

    const main = element.querySelector('main') || element;
    const practice = main.querySelector(':scope > section[data-section="practice"]');
    if (practice && !practice.dataset.ixbStyled) {
      practice.classList.remove('prose', 'intro', 'services'); // keep barnett-sections from tagging it `intro`
      practice.after(ixbMeta(document, 'practice'));
      practice.dataset.ixbStyled = '1';
    }
    const enquiry = main.querySelector(':scope > section[data-section="enquiry"]');
    if (enquiry && !enquiry.dataset.ixbStyled) {
      enquiry.after(ixbMeta(document, 'enquiry'));
      enquiry.dataset.ixbStyled = '1';
    }
  }
}
