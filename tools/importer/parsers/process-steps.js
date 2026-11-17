/* eslint-disable */
/* global WebImporter */

/**
 * process-steps — one row per phase: phase name · richtext.
 * Richtext keeps the phase's paragraphs; the "Deliverables" aside becomes a bold label paragraph +
 * its text; the delivery-systems <dl> becomes a list of "<strong>term</strong> definition" items.
 * Source: ol.steps__list on /about/process (the phase anchor index is dropped by barnett-cleanup;
 * the block can build it from the rows).
 */
export default function parse(element, { document }) {
  const text = (n) => (n ? n.textContent : '').replace(/\s+/g, ' ').trim();
  const rows = [...element.querySelectorAll(':scope > li')].map((li) => {
    const nameEl = li.querySelector('.step__name, h3');
    const body = li.querySelector('.step__body') || li;
    const rich = [];
    [...body.children].forEach((c) => {
      if (c === nameEl) return;
      if (c.matches('.step__aside')) {
        c.querySelectorAll('p').forEach((p) => {
          if (p.classList.contains('label')) {
            const lp = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = text(p);
            lp.append(strong);
            rich.push(lp);
          } else {
            rich.push(p.cloneNode(true));
          }
        });
      } else if (c.tagName === 'DL') {
        const ul = document.createElement('ul');
        c.querySelectorAll('dt').forEach((dt) => {
          const li2 = document.createElement('li');
          const strong = document.createElement('strong');
          strong.textContent = text(dt);
          li2.append(strong, document.createTextNode(` ${text(dt.nextElementSibling)}`));
          ul.append(li2);
        });
        rich.push(ul);
      } else {
        rich.push(c.cloneNode(true));
      }
    });
    return [text(nameEl), rich];
  });
  const table = WebImporter.DOMUtils.createTable([['Process Steps'], ...rows], document);
  element.replaceWith(table);
}
