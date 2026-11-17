/* eslint-disable */
/* global WebImporter */

/**
 * testimonials — default (single featured quote) · ledger (long list; one block per era section).
 * One row per testimonial: quote (paragraphs; no <blockquote> inside tables) · attribution
 * paragraphs (name · organisation · place / year, as captured).
 * Source: figure.testimonial__figure (home) · ol.ledger__list (testimonials page).
 */
export default function parse(element, { document }) {
  const text = (n) => (n ? n.textContent : '').replace(/\s+/g, ' ').trim();
  const para = (t) => { const p = document.createElement('p'); p.textContent = t; return p; };
  const ledger = element.matches('ol.ledger__list');
  const figures = ledger ? [...element.querySelectorAll('figure.ledger__figure')] : [element];
  const rows = figures.map((fig) => {
    const quote = [...fig.querySelectorAll('blockquote p')].map((p) => p.cloneNode(true));
    const cap = fig.querySelector('figcaption');
    const attribution = [];
    if (cap) {
      const parts = [...cap.querySelectorAll(':scope > span')];
      if (parts.length) parts.forEach((s) => { const t = text(s); if (t) attribution.push(para(t)); });
      else attribution.push(para(text(cap)));
    }
    return [quote, attribution];
  });
  const table = WebImporter.DOMUtils.createTable([[ledger ? 'Testimonials (ledger)' : 'Testimonials'], ...rows], document);
  element.replaceWith(table);
}
