/* eslint-disable */
/* global WebImporter */

/**
 * gallery — default (project plates, alternating full/pair, nn / NN) · wall (photo collection,
 * justified rows, darkroom).
 * One row per photo: picture (+ caption cell only when the plate carries a real title, i.e. text
 * other than the "nn / NN" plate number).
 * Source: .gallery__seq (project pages) · .photo-wall in section[data-section="gallery"].
 */
export default function parse(element, { document }) {
  const text = (n) => (n ? n.textContent : '').replace(/\s+/g, ' ').trim();
  const wall = element.classList.contains('photo-wall');
  const rows = [];
  element.querySelectorAll('figure').forEach((fig) => {
    const img = fig.querySelector('img');
    if (!img) return;
    const pic = document.createElement('img');
    pic.setAttribute('src', img.getAttribute('data-best-src') || img.getAttribute('src'));
    pic.setAttribute('alt', img.getAttribute('alt') || '');
    const cap = fig.querySelector('figcaption');
    const title = cap
      ? [...cap.querySelectorAll(':scope > span')].filter((s) => !s.classList.contains('plate__no')).map(text).filter(Boolean).join(' ')
      : '';
    rows.push(title ? [pic, title] : [pic]);
  });
  const table = WebImporter.DOMUtils.createTable([[wall ? 'Gallery (wall)' : 'Gallery'], ...rows], document);
  element.replaceWith(table);
}
