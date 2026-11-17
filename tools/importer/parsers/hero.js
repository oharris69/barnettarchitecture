/* eslint-disable */
/* global WebImporter */

/**
 * hero — default (full-bleed photo, H1 + lede on scrim) · project (title below photo).
 * Source: main > section[data-section="hero"] (project-hero module).
 *
 * Table: 1 column.
 *   row 1: block name (+ variant)
 *   row 2: background image (picture; single src = data-best-src stashed by barnett-cleanup)
 *   row 3: title (H1), optional subheading/lede paragraph, optional label line
 */
export default function parse(element, { document }) {
  const name = element.classList.contains('hero--project') ? 'Hero (project)' : 'Hero';

  const img = element.querySelector('.hero__media img, img');
  let imageCell = '';
  if (img) {
    imageCell = document.createElement('img');
    imageCell.setAttribute('src', img.getAttribute('data-best-src') || img.getAttribute('src'));
    imageCell.setAttribute('alt', img.getAttribute('alt') || '');
  }

  const textCell = [];
  const h1 = element.querySelector('h1');
  if (h1) textCell.push(h1.cloneNode(true));
  const lede = element.querySelector('p.hero__who');
  if (lede) textCell.push(lede.cloneNode(true));
  const caption = element.querySelector('p.hero__caption');
  if (caption) {
    const label = document.createElement('p');
    const clone = caption.cloneNode(true);
    clone.querySelectorAll('span').forEach((s) => s.replaceWith(...s.childNodes));
    label.append(...clone.childNodes);
    textCell.push(label);
  }

  const cells = [
    [name],
    [imageCell],
    [textCell],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
