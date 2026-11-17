/*
 * header — built from the authored /nav document:
 *   section 1: brand link ("Barnett Architecture" → /)
 *   section 2: list of links; nested lists are dropdowns
 *              (Projects › Residential …, Practice › About …)
 *   section 3: Contact CTA
 * A real <button> toggles the ≤640px menu; dropdowns are <details> disclosures (Esc closes, focus
 * leaving closes). aria-current: "page" on the exact page, "true" on its ancestors
 * (Photography is "true" under /photography/*).
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import {
  contentBase, linkPath, sitePath, localizeLinks, textOf,
} from '../../scripts/utils.js';

const MOBILE = window.matchMedia('(width <= 640px)');

function currentState(a, here) {
  const p = linkPath(a);
  if (!p) return null;
  if (p === here) return 'page';
  if (p !== '/' && here.startsWith(`${p}/`)) return 'true';
  return null;
}

function linkFrom(li) {
  // the item's own link: a direct <a>, or one inside a direct <p>
  return li.querySelector(':scope > a, :scope > p > a, :scope > strong > a, :scope > p > strong > a');
}

function labelFrom(li) {
  const own = [...li.childNodes].filter((n) => !(n.nodeType === 1 && /^(UL|OL)$/.test(n.tagName)));
  return own.map((n) => n.textContent).join(' ').replace(/\s+/g, ' ').trim();
}

function buildList(ul, here) {
  const out = document.createElement('ul');
  out.className = 'header-list';
  [...ul.children].forEach((li) => {
    const item = document.createElement('li');
    const sub = li.querySelector(':scope > ul, :scope > ol');
    const own = linkFrom(li);
    if (sub) {
      item.className = 'header-group';
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = own ? textOf(own) : labelFrom(li);
      const list = document.createElement('ul');
      list.className = 'header-sub';
      const kids = [...sub.querySelectorAll(':scope > li')].map((k) => k.querySelector('a')).filter(Boolean);
      // the parent's own page leads the dropdown when no child already links to it
      if (own && !kids.some((k) => linkPath(k) === linkPath(own))) {
        const a = own.cloneNode(true);
        a.textContent = `All ${textOf(own).toLowerCase()}`;
        kids.unshift(a);
      }
      let current = false;
      kids.forEach((k) => {
        const a = document.createElement('a');
        a.href = k.getAttribute('href');
        a.textContent = textOf(k);
        const st = currentState(a, here);
        if (st) {
          a.setAttribute('aria-current', st);
          current = true;
        }
        const kli = document.createElement('li');
        kli.append(a);
        list.append(kli);
      });
      if (own && currentState(own, here)) current = true;
      if (current) item.classList.add('is-current');
      details.append(summary, list);
      item.append(details);
    } else if (own) {
      const a = document.createElement('a');
      a.href = own.getAttribute('href');
      a.textContent = textOf(own);
      const st = currentState(a, here);
      if (st) a.setAttribute('aria-current', st);
      item.append(a);
    } else return;
    out.append(item);
  });
  return out;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : `${contentBase()}/nav`;
  const fragment = await loadFragment(navPath);
  const here = sitePath();
  const sections = fragment ? [...fragment.querySelectorAll(':scope > .section')] : [];

  const inner = document.createElement('div');
  inner.className = 'header-inner';

  // 1 — wordmark
  const brandSrc = sections[0] && sections[0].querySelector('a');
  const brand = document.createElement('a');
  brand.className = 'header-wordmark';
  brand.href = brandSrc ? brandSrc.getAttribute('href') : '/';
  brand.textContent = brandSrc ? textOf(brandSrc) : (textOf(sections[0]) || 'Barnett Architecture');
  if (linkPath(brand) === here) brand.setAttribute('aria-current', 'page');

  // 2 — nav list (+ 3 — Contact CTA as its last item, in the same keyboard sequence)
  const navSection = sections.find((s, i) => i > 0 && s.querySelector('ul')) || sections.find((s) => s.querySelector('ul'));
  const nav = document.createElement('nav');
  nav.id = 'header-nav';
  nav.className = 'header-nav';
  nav.setAttribute('aria-label', 'Main');
  const list = navSection ? buildList(navSection.querySelector('ul'), here) : document.createElement('ul');
  list.className = 'header-list';
  const ctaSection = sections.find((s, i) => i > 0 && s !== navSection && s.querySelector('a'));
  if (ctaSection) {
    ctaSection.querySelectorAll('a').forEach((src) => {
      const a = document.createElement('a');
      a.href = src.getAttribute('href');
      a.textContent = textOf(src);
      a.className = 'header-cta';
      const st = currentState(a, here);
      if (st) a.setAttribute('aria-current', st);
      const li = document.createElement('li');
      li.append(a);
      list.append(li);
    });
  }
  nav.append(list);

  // menu toggle (≤640px)
  const burger = document.createElement('button');
  burger.type = 'button';
  burger.className = 'header-burger';
  burger.setAttribute('aria-controls', nav.id);
  burger.setAttribute('aria-expanded', 'false');
  const icon = document.createElement('span');
  icon.className = 'header-burger-icon';
  icon.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span');
  label.className = 'header-burger-label';
  label.textContent = 'Menu';
  burger.append(icon, label);

  inner.append(brand, burger, nav);
  block.replaceChildren(inner);
  localizeLinks(block);

  const setOpen = (open) => {
    block.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  };
  burger.addEventListener('click', () => setOpen(!block.classList.contains('is-open')));
  MOBILE.addEventListener('change', () => setOpen(false));

  const groups = [...nav.querySelectorAll('details')];
  groups.forEach((d) => {
    d.addEventListener('toggle', () => {
      if (d.open) groups.forEach((o) => { if (o !== d) o.open = false; });
    });
    d.addEventListener('focusout', (e) => {
      if (!d.contains(e.relatedTarget)) d.open = false;
    });
  });
  document.addEventListener('click', (e) => {
    if (!block.contains(e.target)) groups.forEach((d) => { d.open = false; });
  });
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    groups.forEach((d) => {
      if (!d.open) return;
      if (d.contains(document.activeElement)) d.querySelector('summary').focus();
      d.open = false;
    });
    if (block.classList.contains('is-open')) {
      setOpen(false);
      burger.focus();
    }
  });
}
