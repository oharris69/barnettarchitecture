/*
 * contact-form — rows: field label · type (text/email/tel/select/textarea) · required (yes/no) ·
 * options (comma list for select); last row: Submit · button label · mailto:address.
 * No backend yet: submitting validates, then composes a mailto: to the practice (interim tier).
 * The section head (H2 + lede) is reabsorbed into the side rail.
 */
import { reabsorbHead, slugify, textOf } from '../../scripts/utils.js';

const TYPES = ['text', 'email', 'tel', 'select', 'textarea'];
const AUTOCOMPLETE = {
  name: 'name', email: 'email', phone: 'tel', tel: 'tel', telephone: 'tel',
};
const MESSAGES = {
  email: 'Enter an email address, like name@example.com.',
  textarea: 'Write a short message about your project.',
};
const DEFAULT_TO = 'todd@barnettarchitecture.com';

export default function decorate(block) {
  const rows = [...block.children].map((r) => [...r.children].map((c) => textOf(c)));
  let submitLabel = 'Send by email';
  let to = DEFAULT_TO;
  const fields = [];
  [...block.children].forEach((row, i) => {
    const cells = rows[i];
    if (!cells.length || !cells[0]) return;
    if (/^submit$/i.test(cells[0])) {
      if (cells[1]) [, submitLabel] = cells;
      const mail = row.querySelector('a[href^="mailto:"]');
      const raw = mail ? mail.getAttribute('href') : (cells[2] || '');
      const m = raw.replace(/^mailto:/i, '').trim();
      if (/^[^@\s]+@[^@\s]+$/.test(m)) to = m;
      return;
    }
    const type = TYPES.includes((cells[1] || '').toLowerCase()) ? cells[1].toLowerCase() : 'text';
    // "Name (required)" — the block states required/optional itself
    const flag = (cells[0].match(/\((required|optional)\)\s*$/i) || [])[1];
    fields.push({
      label: cells[0].replace(/\s*\((required|optional)\)\s*$/i, ''),
      type,
      required: /^(yes|true|required|y)$/i.test(cells[2] || '') || (!cells[2] && /required/i.test(flag || '')),
      options: (cells[3] || '').split(',').map((o) => o.trim()).filter(Boolean),
    });
  });

  const form = document.createElement('form');
  form.noValidate = true;
  form.action = `mailto:${to}`;
  form.method = 'post';
  form.enctype = 'text/plain';
  const used = new Set();
  const controls = [];

  fields.forEach((f) => {
    let id = `cf-${slugify(f.label) || 'field'}`;
    while (used.has(id)) id = `${id}-x`;
    used.add(id);
    const wrap = document.createElement('div');
    wrap.className = 'contact-form-field';
    if (f.type === 'textarea' || f.type === 'select') wrap.classList.add('contact-form-wide');
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = `${f.label} `;
    const req = document.createElement('span');
    req.textContent = f.required ? '(required)' : '(optional)';
    label.append(req);
    let input;
    if (f.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 7;
    } else if (f.type === 'select') {
      input = document.createElement('select');
      const none = document.createElement('option');
      none.value = '';
      none.textContent = `Choose ${/^[aeiou]/i.test(f.label) ? 'an' : 'a'} ${f.label.toLowerCase()}`;
      input.append(none);
      f.options.forEach((o) => {
        const opt = document.createElement('option');
        opt.value = slugify(o);
        opt.textContent = o;
        input.append(opt);
      });
    } else {
      input = document.createElement('input');
      input.type = f.type;
      const key = slugify(f.label).split('-')[0];
      input.autocomplete = AUTOCOMPLETE[key] || (f.type === 'email' ? 'email' : 'off');
      if (f.type === 'tel') input.autocomplete = 'tel';
    }
    input.id = id;
    input.name = slugify(f.label) || id;
    if (f.required) input.required = true;
    const err = document.createElement('p');
    err.className = 'contact-form-error';
    err.id = `${id}-err`;
    err.setAttribute('aria-live', 'polite');
    input.setAttribute('aria-describedby', err.id);
    wrap.append(label, input, err);
    form.append(wrap);
    controls.push({ f, input, err });
  });

  // the interim-tier note: reuse the authored one when it follows the block, else state it
  const after = block.parentElement && block.parentElement.nextElementSibling;
  let note = after && after.classList.contains('default-content-wrapper')
    ? [...after.querySelectorAll(':scope > p')].find((p) => /email app/i.test(p.textContent))
    : null;
  if (note) {
    if (!after.querySelector(':scope > :not(p)') && after.children.length === 1) after.remove();
  } else {
    note = document.createElement('p');
    note.textContent = `“${submitLabel}” opens your email app with this message addressed to ${to}.`;
  }
  note.className = 'contact-form-note';
  note.id = `cf-note-${Math.random().toString(36).slice(2, 6)}`;
  form.setAttribute('aria-describedby', note.id);

  const actions = document.createElement('div');
  actions.className = 'contact-form-actions';
  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.className = 'button primary';
  btn.textContent = submitLabel;
  const status = document.createElement('p');
  status.className = 'contact-form-status';
  status.setAttribute('role', 'status');
  actions.append(btn, status);
  form.append(note, actions);

  const check = ({ f, input, err }) => {
    const bad = !input.checkValidity();
    input.setAttribute('aria-invalid', String(bad));
    err.textContent = bad ? (MESSAGES[f.type] || `Enter your ${f.label.toLowerCase()}.`) : '';
    return !bad;
  };
  controls.filter((c) => c.f.required || c.f.type === 'email').forEach((c) => {
    c.input.addEventListener('blur', () => {
      if (c.input.value || c.input.getAttribute('aria-invalid')) check(c);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = controls.filter((c) => (c.f.required || c.input.value) && !check(c));
    if (bad.length) {
      bad[0].input.focus();
      status.textContent = '';
      return;
    }
    const val = (c) => {
      if (c.f.type !== 'select') return c.input.value.trim();
      return c.input.selectedIndex > 0 ? c.input.options[c.input.selectedIndex].text : '';
    };
    const select = controls.find((c) => c.f.type === 'select');
    const loc = controls.find((c) => /location/i.test(c.f.label));
    const subject = ['Project enquiry', select ? val(select) : '', loc ? val(loc) : '']
      .filter(Boolean).join(' — ');
    const lines = [];
    controls.filter((c) => c.f.type !== 'textarea').forEach((c) => {
      const v = val(c);
      if (v) lines.push(`${c.f.label}: ${v}`);
    });
    controls.filter((c) => c.f.type === 'textarea').forEach((c) => {
      lines.push('', val(c));
    });
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    status.textContent = `Your email app should open with the message ready to send. If nothing opened, write to ${to}.`;
  });

  const head = reabsorbHead(block, 'contact-form-head');
  if (head) block.replaceChildren(head, form);
  else {
    block.classList.add('no-head');
    block.replaceChildren(form);
  }
}
