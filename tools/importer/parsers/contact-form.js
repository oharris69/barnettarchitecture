/* eslint-disable */
/* global WebImporter */

/**
 * contact-form — rows: field label · type (text/email/tel/select/textarea) · required (yes/no) ·
 * options (comma list, select only); last row: Submit · button label · mailto action.
 * The "(required)/(optional)" hint is dropped from the label (the block renders it from the
 * required cell); a select's empty-value prompt option is not an option. The form note that
 * follows the fields stays as default content after the block.
 * Source: form#enquiry on /contact.
 */
export default function parse(element, { document }) {
  const text = (n) => (n ? n.textContent : '').replace(/\s+/g, ' ').trim();
  const rows = [];
  element.querySelectorAll('.field').forEach((field) => {
    const label = field.querySelector('label');
    const control = field.querySelector('input, select, textarea');
    if (!label || !control) return;
    const labelText = [...label.childNodes].filter((n) => n.nodeType === 3)
      .map((n) => n.textContent).join('').replace(/\s+/g, ' ').replace(/\s*\((required|optional)\)\s*$/i, '').trim();
    let type = control.tagName === 'INPUT' ? (control.getAttribute('type') || 'text') : control.tagName.toLowerCase();
    if (!['text', 'email', 'tel', 'select', 'textarea'].includes(type)) type = 'text';
    const required = control.hasAttribute('required') ? 'yes' : 'no';
    const options = control.tagName === 'SELECT'
      ? [...control.querySelectorAll('option')].filter((o) => o.value).map(text).join(', ')
      : '';
    rows.push([labelText, type, required, options]);
  });
  const button = element.querySelector('button[type="submit"], button');
  rows.push(['Submit', text(button), element.getAttribute('action') || '']);

  const after = [...element.querySelectorAll('.enquiry-form__note')].map((n) => n.cloneNode(true));
  const table = WebImporter.DOMUtils.createTable([['Contact Form'], ...rows], document);
  element.replaceWith(table, ...after);
}
