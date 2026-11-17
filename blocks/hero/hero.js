/*
 * hero — row 1: picture · row 2: H1, optional lede paragraph, optional label line.
 * default: full-bleed photograph, title on a scrim (body.hero-media → transparent header).
 * project: same frame, project name as the H1 at exhibit scale.
 */

const isLabelLine = (p) => {
  const t = p.textContent.replace(/\s+/g, ' ').trim();
  return t.length <= 90 && /\s[·/|]\s/.test(t);
};

export default function decorate(block) {
  const picture = block.querySelector('picture');
  const img = block.querySelector('img');
  const media = document.createElement('div');
  media.className = 'hero-media';
  if (picture || img) {
    media.append(picture || img);
    const im = media.querySelector('img');
    im.loading = 'eager';
    im.fetchPriority = 'high';
    im.decoding = 'async';
  }

  // everything authored besides the photograph, in order, whatever cell it sits in
  const nodes = [];
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    [...cell.children].forEach((child) => {
      if (child.matches('p') && !child.textContent.trim() && !child.querySelector('img')) return;
      nodes.push(child);
    });
    // bare text cell (single-line authoring) → paragraph
    if (!cell.children.length && cell.textContent.trim()) {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      nodes.push(p);
    }
  });

  let heading = nodes.find((n) => /^H[1-3]$/.test(n.tagName));
  if (!heading) {
    const first = nodes.find((n) => n.tagName === 'P');
    if (first) {
      heading = document.createElement('h1');
      heading.append(...first.childNodes);
      nodes.splice(nodes.indexOf(first), 1, heading);
    }
  }

  const content = document.createElement('div');
  content.className = 'hero-content';
  const title = document.createElement('div');
  title.className = 'hero-title';
  content.append(title);

  const rest = nodes.filter((n) => n !== heading);
  let caption = null;
  if (rest.length) {
    const last = rest[rest.length - 1];
    if (last.tagName === 'P' && (rest.length > 1 || isLabelLine(last))) caption = last;
  }
  if (heading) title.append(heading);
  rest.forEach((n) => {
    if (n === caption) return;
    if (n.tagName === 'P') n.classList.add('hero-lede');
    title.append(n);
  });
  if (caption) {
    caption.classList.remove('dim-start', 'link-row');
    caption.classList.add('hero-caption', 'dim', 'dim-stack');
    if (!(caption.children.length === 1 && caption.firstElementChild.tagName === 'SPAN')) {
      const span = document.createElement('span');
      span.append(...caption.childNodes);
      caption.append(span);
    }
    content.append(caption);
  }

  // a breadcrumbs block authored right after the hero hangs in the caption slot (project pages)
  const next = block.parentElement && block.parentElement.nextElementSibling;
  if (!caption && next && next.classList.contains('breadcrumbs-wrapper')) {
    next.classList.add('hero-caption', 'hero-crumbs', 'dim', 'dim-stack');
    content.append(next);
  }

  block.replaceChildren(media, content);
}
