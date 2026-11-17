/*
 * big-idea — row 1: lead sentence · row 2: narrative paragraphs ·
 * optional row 3: client type label.
 * Defensive: a single-row block uses its first paragraph as the lead and the rest as narrative.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const cellNodes = (row) => (row ? [...row.children].flatMap((c) => {
    if (c.children.length) return [...c.children];
    if (!c.textContent.trim()) return [];
    const p = document.createElement('p');
    p.append(...c.childNodes);
    return [p];
  }) : []);

  let leadNodes = cellNodes(rows[0]);
  let bodyNodes = cellNodes(rows[1]);
  const labelNodes = rows.slice(2).flatMap(cellNodes);
  if (!bodyNodes.length && leadNodes.length > 1) {
    bodyNodes = leadNodes.slice(1);
    leadNodes = leadNodes.slice(0, 1);
  }

  const heading = document.createElement('h2');
  heading.className = 'visually-hidden';
  heading.textContent = 'About the project';

  const lead = document.createElement('div');
  lead.className = 'big-idea-lead';
  lead.append(...leadNodes);

  const body = document.createElement('div');
  body.className = 'big-idea-body';
  body.append(...bodyNodes);

  const out = [heading, lead, body];
  if (labelNodes.length) {
    const label = document.createElement('div');
    label.className = 'big-idea-client dim dim-start';
    const span = document.createElement('span');
    labelNodes.forEach((n) => span.append(...n.childNodes));
    label.append(span);
    body.prepend(label);
  }
  block.replaceChildren(...out);
}
