/*
 * facts — one row per fact: label · value (value may link to /projects?type=… etc.).
 * Renders the chain-dimension facts bar: one hairline, a tick at every fact boundary.
 */
export default function decorate(block) {
  const dl = document.createElement('dl');
  dl.className = 'facts-bar';
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;
    const [labelCell, ...valueCells] = cells;
    const label = labelCell.textContent.replace(/\s+/g, ' ').trim();
    const valueNodes = valueCells.flatMap((c) => [...c.childNodes]);
    const hasValue = valueNodes.some((nd) => (nd.textContent || '').trim());
    if (!label && !hasValue) return;
    const item = document.createElement('div');
    const dt = document.createElement('dt');
    dt.className = 'label';
    dt.append(...labelCell.childNodes);
    const dd = document.createElement('dd');
    // the authored value paragraphs MOVE into the <dd> (EW1); dd carries the type
    dd.append(...valueNodes);
    if (!hasValue) {
      // label-only row: show it as a value under an empty label (authors sometimes omit a cell)
      dd.append(...dt.childNodes);
    }
    item.append(dt, dd);
    dl.append(item);
  });

  const heading = document.createElement('h2');
  heading.className = 'visually-hidden';
  heading.textContent = 'Project facts';
  block.replaceChildren(heading, dl);
}
