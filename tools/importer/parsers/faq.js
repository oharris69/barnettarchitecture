/* eslint-disable */
/* global WebImporter */

/**
 * faq — one row per item: question · answer.
 * Source: .faq__list on /about/process.
 */
export default function parse(element, { document }) {
  const text = (n) => (n ? n.textContent : '').replace(/\s+/g, ' ').trim();
  const rows = [...element.querySelectorAll('.faq__item')].map((item) => {
    const q = item.querySelector('h3, h4');
    const a = item.querySelector('.faq__a');
    return [text(q), a ? [...a.children].map((c) => c.cloneNode(true)) : ''];
  });
  const table = WebImporter.DOMUtils.createTable([['FAQ'], ...rows], document);
  element.replaceWith(table);
}
