/* eslint-disable */
/* global WebImporter */

/**
 * fragment — the enquiry band (section[data-section="enquiry"]) is shared site-wide, so every page
 * (except contact / 404, which have none) references it with a `fragment` block → /fragments/enquiry.
 * On the home import (params.writeEnquiryFragment) the band itself is also written as the
 * /fragments/enquiry document (heading, email + phone list, address line) via params.fragments.
 */
export default function parse(element, { document, params }) {
  const text = (n) => (n ? n.textContent : '').replace(/\s+/g, ' ').trim();
  const PATH = '/fragments/enquiry';
  const mkLink = (href, label) => { const a = document.createElement('a'); a.setAttribute('href', href); a.textContent = label; return a; };

  if (params && params.writeEnquiryFragment && Array.isArray(params.fragments)) {
    const doc = document.createElement('div');
    const h = element.querySelector('h2');
    if (h) { const h2 = document.createElement('h2'); h2.textContent = text(h); doc.append(h2); }
    const ul = element.querySelector('ul');
    if (ul) {
      const list = document.createElement('ul');
      ul.querySelectorAll('li').forEach((li) => {
        const item = document.createElement('li');
        const a = li.querySelector('a');
        if (a) item.append(mkLink(a.getAttribute('href'), text(a))); else item.textContent = text(li);
        list.append(item);
      });
      doc.append(list);
    }
    element.querySelectorAll('.enquiry__body > p').forEach((p) => {
      const np = document.createElement('p'); np.textContent = text(p); doc.append(np);
    });
    params.fragments.push({ element: doc, path: PATH });
  }

  const table = WebImporter.DOMUtils.createTable([['Fragment'], [mkLink(PATH, PATH)]], document);
  element.replaceWith(table);
}
