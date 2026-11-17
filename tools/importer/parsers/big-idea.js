/* eslint-disable */
/* global WebImporter */

/**
 * big-idea — row 1: lead sentence (p) · row 2: narrative paragraphs.
 * (Optional row 3 "client type" is not emitted: the client is a row of the facts block.)
 * Source: section[data-section="big-idea"]; its sr-only H2 is dropped by barnett-cleanup.
 */
export default function parse(element, { document }) {
  const lead = element.querySelector('.idea__lead');
  const body = element.querySelector('.idea__body');
  const rows = [];
  if (lead) rows.push([lead.cloneNode(true)]);
  if (body) rows.push([[...body.children].map((c) => c.cloneNode(true))]);
  const rest = [...element.children].filter((c) => c !== lead && c !== body).map((c) => c.cloneNode(true));
  const table = WebImporter.DOMUtils.createTable([['Big Idea'], ...rows], document);
  element.replaceWith(table, ...rest);
}
