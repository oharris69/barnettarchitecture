/* eslint-disable */
/* global WebImporter */

/**
 * Home variant c (stardust/prototypes/index-c-proposed.html → /index-c). Runs before the shared
 * barnett transformers.
 * beforeTransform:
 *  - the opening (H1, line, CTAs) joins the timeline section, ahead of its H2 (one EDS section:
 *    the era-timeline block takes the whole head);
 *  - CTA rows → one paragraph per link; a .btn-primary becomes **bold** (decorateButtons → primary);
 *  - the Houzz band is Style `recognition`, the enquiry band is the inline Style `enquiry` section;
 *  - Robots noindex: the variant must not compete with /.
 * afterTransform: the principles row and the photography strip use their `row` variants.
 */
function ixcMeta(document, style) {
  return WebImporter.DOMUtils.createTable([['Section Metadata'], ['Style', style]], document);
}

export default function transform(hookName, element, payload) {
  const { document } = payload;
  const params = payload.params || {};

  if (hookName === 'beforeTransform') {
    if (params.headMeta) params.headMeta.robots = 'noindex';
    const main = element.querySelector('main') || element;

    const opening = main.querySelector(':scope > section[data-section="opening"]');
    const timeline = main.querySelector(':scope > section[data-section="timeline"]');
    if (opening && timeline) {
      const head = timeline.querySelector('.tl__head') || timeline.firstElementChild;
      const nodes = [...opening.querySelectorAll('.tlo__main > *')];
      nodes.forEach((n) => timeline.insertBefore(n, head));
      opening.remove();
    }

    main.querySelectorAll('p.tlo__actions, .enquiry__body > p').forEach((p) => {
      const links = [...p.querySelectorAll(':scope > a')];
      if (!links.length || p.textContent.replace(/\s+/g, '') !== links.map((a) => a.textContent).join('').replace(/\s+/g, '')) return;
      p.replaceWith(...links.map((a) => {
        const np = document.createElement('p');
        if (a.classList.contains('btn-primary')) {
          const strong = document.createElement('strong');
          strong.append(a);
          np.append(strong);
        } else np.append(a);
        return np;
      }));
    });

    [['recognition', 'recognition'], ['enquiry', 'enquiry']].forEach(([ds, style]) => {
      const s = main.querySelector(`:scope > section[data-section="${ds}"]`);
      if (s && !s.dataset.ixcStyled) {
        s.after(ixcMeta(document, style));
        s.dataset.ixcStyled = '1';
      }
    });
  }

  if (hookName === 'afterTransform' && element === document.body) {
    element.querySelectorAll('table').forEach((t) => {
      const th = t.querySelector('tr > th, tr > td');
      if (!th) return;
      const name = th.textContent.trim();
      if (name === 'Principles') th.textContent = 'Principles (row)';
      if (name === 'Collection Index') th.textContent = 'Collection Index (row)';
    });
  }
}
