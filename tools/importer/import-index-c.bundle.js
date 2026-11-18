/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-index-c.js
  var import_index_c_exports = {};
  __export(import_index_c_exports, {
    default: () => import_index_c_default
  });

  // tools/importer/parsers/era-timeline.js
  function parse(element, { document }) {
    const text = (n) => (n ? n.textContent : "").replace(/\s+/g, " ").trim();
    const mk = (tag, kids) => {
      const e = document.createElement(tag);
      (Array.isArray(kids) ? kids : [kids]).filter((k) => k != null && k !== "").forEach((k) => e.append(typeof k === "string" ? document.createTextNode(k) : k));
      return e;
    };
    const link = (href, label) => {
      const a = mk("a", label);
      a.setAttribute("href", href);
      return a;
    };
    const pic = (img) => {
      if (!img) return "";
      const i = document.createElement("img");
      i.setAttribute("src", img.getAttribute("data-best-src") || img.getAttribute("src"));
      i.setAttribute("alt", img.getAttribute("alt") || "");
      return i;
    };
    const facts = (s) => s.split(" \xB7 ").map((v) => v.trim()).filter(Boolean).map((v) => mk("p", v));
    const quotes = (root) => [...root ? root.querySelectorAll("p") : []].map((p) => mk("p", text(p)));
    const nameOf = (n) => {
      if (!n) return "";
      const c = n.cloneNode(true);
      c.querySelectorAll(".tag").forEach((t) => t.remove());
      return text(c);
    };
    const section = element.closest("section") || document;
    const rows = [];
    const fig = section.querySelector("figure.tlo__quote");
    if (fig) {
      const cap = fig.querySelector("figcaption");
      const by = mk("p", []);
      if (cap) {
        cap.childNodes.forEach((n) => {
          if (n.nodeName === "A") by.append(link(n.getAttribute("href"), text(n)));
          else if (n.textContent) by.append(document.createTextNode(n.textContent.replace(/\s+/g, " ")));
        });
      }
      rows.push([quotes(fig.querySelector("blockquote")), by]);
      fig.remove();
    }
    const labels = {};
    section.querySelectorAll('nav.tl-scale a[href^="#"]').forEach((a) => {
      labels[a.getAttribute("href").slice(1)] = text(a);
    });
    element.querySelectorAll(":scope > article.era").forEach((era) => {
      const h = era.querySelector(".era__head");
      const headCell = [mk("h3", text(h))];
      era.querySelectorAll(".era__top > p").forEach((p) => headCell.push(mk("p", text(p))));
      rows.push([labels[era.id] || text(era.querySelector(".era__num")) || text(h), headCell]);
      const lead = era.querySelector(".era__lead");
      if (lead) {
        const go = era.querySelector(".era__go");
        rows.push([
          pic(era.querySelector(".era__frame img")),
          [mk("h4", go ? link(go.getAttribute("href"), text(lead.querySelector(".era__title"))) : text(lead.querySelector(".era__title")))],
          facts(text(lead.querySelector(".era__facts"))),
          quotes(era.querySelector(".era__quote"))
        ]);
      }
      era.querySelectorAll(".plate").forEach((plate) => {
        const a = plate.querySelector("a.link-arrow");
        const title = [mk("h4", a ? link(a.getAttribute("href"), text(plate.querySelector(".plate__title"))) : text(plate.querySelector(".plate__title")))];
        plate.querySelectorAll(".plate__head .tag").forEach((t) => title.push(mk("p", text(t))));
        rows.push([
          pic(plate.querySelector("img")),
          title,
          facts(text(plate.querySelector(".dim"))),
          quotes(plate.querySelector("blockquote"))
        ]);
      });
      era.querySelectorAll(".tl-list li").forEach((li) => {
        const a = li.querySelector("a");
        if (!a) return;
        const title = [mk("p", link(a.getAttribute("href"), nameOf(li.querySelector(".tl-list__name")) || text(a)))];
        li.querySelectorAll(".tag").forEach((t) => title.push(mk("p", text(t))));
        rows.push(["", title, facts(text(li.querySelector(".tl-list__facts")))]);
      });
    });
    const table = WebImporter.DOMUtils.createTable([["Era Timeline"], ...rows], document);
    section.querySelectorAll("nav.tl-scale").forEach((n) => n.remove());
    element.replaceWith(table);
  }

  // tools/importer/parsers/principles.js
  function parse2(element, { document }) {
    const text = (n) => (n ? n.textContent : "").replace(/\s+/g, " ").trim();
    const rows = [...element.querySelectorAll(".principle")].map((p) => {
      const h = p.querySelector("h3, h4");
      return [text(h), [...p.children].filter((c) => c !== h).map((c) => c.cloneNode(true))];
    });
    const table = WebImporter.DOMUtils.createTable([["Principles"], ...rows], document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/collection-index.js
  function parse3(element, { document }) {
    const text = (n) => (n ? n.textContent : "").replace(/\s+/g, " ").trim();
    const mk = (tag, kids) => {
      const e = document.createElement(tag);
      (Array.isArray(kids) ? kids : [kids]).filter((k) => k != null && k !== "").forEach((k) => e.append(typeof k === "string" ? document.createTextNode(k) : k));
      return e;
    };
    const link = (href, label) => {
      const a = mk("a", label);
      a.setAttribute("href", href);
      return a;
    };
    const section = element.closest("section");
    const ds = section ? section.dataset.section : "";
    let name = "Collection Index";
    const justified = !!section && section.dataset.layout === "justified-wall" && ds === "photography";
    if (justified) name = "Collection Index (justified)";
    else if (ds === "selected-works") name = "Collection Index (selected)";
    else if (element.matches("ul.siblings")) name = "Collection Index (strip)";
    const hrefByTitle = {};
    document.querySelectorAll('a[href*="photography/"]').forEach((a) => {
      const t = text(a);
      if (t && !hrefByTitle[t]) hrefByTitle[t] = a.getAttribute("href");
    });
    const out = [];
    let rows = [];
    const flush = () => {
      if (rows.length) out.push(WebImporter.DOMUtils.createTable([[name], ...rows], document));
      rows = [];
    };
    const items = element.matches("ul.siblings") ? [...element.querySelectorAll(":scope > li")] : [...element.children];
    items.forEach((item) => {
      if (item.matches(".wall__divider")) {
        flush();
        out.push(mk(item.tagName === "H3" ? "h3" : "p", text(item)));
        return;
      }
      if (item.matches(".exhibit-notes")) {
        flush();
        [...item.children].forEach((c) => out.push(c.tagName === "A" ? mk("p", c.cloneNode(true)) : c.cloneNode(true)));
        return;
      }
      const img = item.querySelector("img");
      if (!img) return;
      const pic = document.createElement("img");
      pic.setAttribute("src", img.getAttribute("data-best-src") || img.getAttribute("src"));
      pic.setAttribute("alt", img.getAttribute("alt") || "");
      let title;
      const meta = [];
      if (name === "Collection Index (selected)") {
        const [t, ...rest] = text(item.querySelector("figcaption")).split(" \xB7 ");
        title = hrefByTitle[t] ? link(hrefByTitle[t], t) : t;
        if (rest.length) meta.push(mk("p", rest.join(" \xB7 ")));
      } else if (justified) {
        const a = item.querySelector("figcaption a");
        title = a ? link(a.getAttribute("href"), text(a)) : "";
        const kind = item.querySelector("figcaption .label");
        if (kind) meta.push(mk("p", text(kind)));
      } else {
        const a = item.querySelector(".frame__title a, .sibling__title a");
        title = a ? link(a.getAttribute("href"), text(a)) : "";
        const kind = item.querySelector(".frame__kind, .sibling__count");
        if (kind) meta.push(mk("p", text(kind)));
        item.querySelectorAll(".frame__note").forEach((n) => meta.push(n.cloneNode(true)));
      }
      rows.push([pic, mk("p", title), meta]);
    });
    flush();
    element.replaceWith(...out);
  }

  // tools/importer/parsers/testimonials.js
  function parse4(element, { document }) {
    const text = (n) => (n ? n.textContent : "").replace(/\s+/g, " ").trim();
    const para = (t) => {
      const p = document.createElement("p");
      p.textContent = t;
      return p;
    };
    const ledger = element.matches("ol.ledger__list");
    const figures = ledger ? [...element.querySelectorAll("figure.ledger__figure")] : [element];
    const rows = figures.map((fig) => {
      const quote = [...fig.querySelectorAll("blockquote p")].map((p) => p.cloneNode(true));
      const cap = fig.querySelector("figcaption");
      const attribution = [];
      if (cap) {
        const parts = [...cap.querySelectorAll(":scope > span")];
        if (parts.length) parts.forEach((s) => {
          const t = text(s);
          if (t) attribution.push(para(t));
        });
        else attribution.push(para(text(cap)));
      }
      return [quote, attribution];
    });
    const table = WebImporter.DOMUtils.createTable([[ledger ? "Testimonials (ledger)" : "Testimonials"], ...rows], document);
    element.replaceWith(table);
  }

  // tools/importer/transformers/barnett-index-c.js
  function ixcMeta(document, style) {
    return WebImporter.DOMUtils.createTable([["Section Metadata"], ["Style", style]], document);
  }
  function transform(hookName, element, payload) {
    const { document } = payload;
    const params = payload.params || {};
    if (hookName === "beforeTransform") {
      if (params.headMeta) params.headMeta.robots = "noindex";
      const main = element.querySelector("main") || element;
      const opening = main.querySelector(':scope > section[data-section="opening"]');
      const timeline = main.querySelector(':scope > section[data-section="timeline"]');
      if (opening && timeline) {
        const head = timeline.querySelector(".tl__head") || timeline.firstElementChild;
        const nodes = [...opening.querySelectorAll(".tlo__main > *")];
        nodes.forEach((n) => timeline.insertBefore(n, head));
        opening.remove();
      }
      main.querySelectorAll("p.tlo__actions, .enquiry__body > p").forEach((p) => {
        const links = [...p.querySelectorAll(":scope > a")];
        if (!links.length || p.textContent.replace(/\s+/g, "") !== links.map((a) => a.textContent).join("").replace(/\s+/g, "")) return;
        p.replaceWith(...links.map((a) => {
          const np = document.createElement("p");
          if (a.classList.contains("btn-primary")) {
            const strong = document.createElement("strong");
            strong.append(a);
            np.append(strong);
          } else np.append(a);
          return np;
        }));
      });
      [["recognition", "recognition"], ["enquiry", "enquiry"]].forEach(([ds, style]) => {
        const s = main.querySelector(`:scope > section[data-section="${ds}"]`);
        if (s && !s.dataset.ixcStyled) {
          s.after(ixcMeta(document, style));
          s.dataset.ixcStyled = "1";
        }
      });
    }
    if (hookName === "afterTransform" && element === document.body) {
      element.querySelectorAll("table").forEach((t) => {
        const th = t.querySelector("tr > th, tr > td");
        if (!th) return;
        const name = th.textContent.trim();
        if (name === "Principles") th.textContent = "Principles (row)";
        if (name === "Collection Index") th.textContent = "Collection Index (row)";
      });
    }
  }

  // tools/importer/transformers/barnett-cleanup.js
  function cleanupText(el) {
    return (el ? el.textContent : "").replace(/\s+/g, " ").trim();
  }
  function cleanupWixWidth(url) {
    const m = /\/w_(\d+),h_\d+/.exec(url || "");
    return m ? Number(m[1]) : 0;
  }
  function cleanupBestSrc(img) {
    const candidates = [];
    (img.getAttribute("srcset") || "").split(/,\s+/).map((s) => s.trim()).filter(Boolean).forEach((part) => {
      const [u, d] = part.split(/\s+/);
      candidates.push({ u, w: parseInt(d, 10) || cleanupWixWidth(u) });
    });
    const src = img.getAttribute("src");
    if (src) candidates.push({ u: src, w: cleanupWixWidth(src) });
    const a = img.closest("a[data-lb], a.plate__link, a.photo__open");
    if (a && a.getAttribute("href")) candidates.push({ u: a.getAttribute("href"), w: cleanupWixWidth(a.getAttribute("href")) });
    const wix = candidates.filter((c) => /static\.wixstatic\.com\/media\//.test(c.u));
    const pool = wix.length ? wix : candidates;
    pool.sort((x, y) => y.w - x.w);
    return pool.length ? pool[0].u : src;
  }
  function cleanupFileBase(pageUrl) {
    const u = new URL(pageUrl);
    let p = u.pathname;
    if (p === "/" || p === "") p = "/index.html";
    else if (/^\/404\/?$/.test(p)) p = "/404.html";
    else if (!/\.html?$/.test(p)) p = `${p.replace(/\/$/, "")}/index.html`;
    return `${u.origin}${p}`;
  }
  function cleanupNewPath(href, pageUrl) {
    if (!href || /^(mailto:|tel:|#|javascript:)/i.test(href)) return href;
    let u;
    try {
      u = new URL(href, cleanupFileBase(pageUrl));
    } catch (e) {
      return href;
    }
    if (u.origin !== new URL(pageUrl).origin) return href;
    let p = u.pathname.replace(/index\.html$/, "").replace(/\.html$/, "");
    if (p.length > 1) p = p.replace(/\/$/, "");
    return `${p || "/"}${u.search}${u.hash}`;
  }
  function transform2(hookName, element, payload) {
    const { document } = payload;
    const params = payload.params || {};
    const pageUrl = params.originalURL || payload.url || window.location.href;
    if (hookName === "preprocess") {
      element.querySelectorAll("img").forEach((img) => {
        const best = cleanupBestSrc(img);
        img.removeAttribute("srcset");
        img.removeAttribute("sizes");
        img.setAttribute("src", best);
        img.setAttribute("data-best-src", best);
      });
      element.querySelectorAll("figcaption > span:not([class])").forEach((s) => s.classList.add("plate__title"));
      element.querySelectorAll("label > span:not([class])").forEach((s) => s.classList.add("field__hint"));
    }
    if ((hookName === "preprocess" || hookName === "beforeTransform") && payload.params && !payload.params.headMeta && document.head) {
      const meta = (sel) => (document.head.querySelector(sel) || { getAttribute: () => "" }).getAttribute("content") || "";
      payload.params.headMeta = {
        title: cleanupText(document.head.querySelector("title")),
        description: meta('meta[name="description"]'),
        image: meta('meta[property="og:image"]'),
        robots: meta('meta[name="robots"]')
      };
    }
    if (hookName === "beforeTransform") {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        "a.skip-wall",
        "dialog",
        "script",
        "noscript",
        "style",
        "link",
        "nav.steps__index",
        "[hidden]",
        "header.site-header",
        "footer.site-footer"
      ]);
      element.querySelectorAll("h1").forEach((h1) => {
        const thesis = h1.querySelector(".hero__thesis, .opening__thesis");
        const who = h1.querySelector(".hero__who, .opening__who");
        if (thesis && who) {
          h1.replaceChildren(document.createTextNode(cleanupText(thesis)), document.createElement("br"), document.createTextNode(cleanupText(who)));
        } else {
          h1.replaceChildren(document.createTextNode(cleanupText(h1)));
        }
      });
      element.querySelectorAll(".visually-hidden").forEach((n) => n.remove());
      element.querySelectorAll("a[href]").forEach((a) => {
        a.setAttribute("href", cleanupNewPath(a.getAttribute("href"), pageUrl));
      });
      element.querySelectorAll("p.principles__links").forEach((p) => {
        p.replaceWith(...[...p.querySelectorAll("a")].map((a) => {
          const np = document.createElement("p");
          np.append(a);
          return np;
        }));
      });
      element.querySelectorAll("section.hero nav.hero__crumbs").forEach((nav) => {
        nav.closest("section").after(nav);
      });
    }
    if (hookName === "afterTransform") {
      element.querySelectorAll("address").forEach((n) => n.replaceWith(...n.childNodes));
      element.querySelectorAll("figure").forEach((fig) => {
        if (fig.closest("table")) return;
        fig.querySelectorAll("figcaption").forEach((cap) => {
          const p = document.createElement("p");
          p.append(...cap.childNodes);
          cap.replaceWith(p);
        });
        fig.replaceWith(...fig.childNodes);
      });
      element.querySelectorAll("div > a, section > a").forEach((a) => {
        if (a.closest("table")) return;
        const p = document.createElement("p");
        a.replaceWith(p);
        p.append(a);
      });
    }
  }

  // tools/importer/transformers/barnett-metadata.js
  var metaCatalogCache = null;
  function metaProjectFacets(pageUrl) {
    if (metaCatalogCache) return metaCatalogCache;
    const out = {};
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${new URL(pageUrl).origin}/projects/index.html`, false);
      xhr.send(null);
      if (xhr.status === 200) {
        const doc = new DOMParser().parseFromString(xhr.responseText, "text/html");
        const labels = {};
        doc.querySelectorAll("a.facet-chip[data-facet]").forEach((a) => {
          labels[a.dataset.facet] = labels[a.dataset.facet] || {};
          labels[a.dataset.facet][a.dataset.value] = [...a.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
        });
        const lab = (facet, v) => (v || "").split(/\s+/).filter(Boolean).map((s) => (labels[facet] || {})[s] || s).join(", ");
        doc.querySelectorAll("li.schedule__row[data-sector]").forEach((li) => {
          const a = li.querySelector(".schedule__title a");
          const m = a && /projects\/([^/?#]+)/.exec(a.getAttribute("href"));
          if (!m) return;
          out[m[1]] = {
            Sector: lab("sector", li.dataset.sector),
            Type: lab("type", li.dataset.type),
            Location: lab("location", li.dataset.location),
            Approach: lab("approach", li.dataset.approach)
          };
        });
      }
    } catch (e) {
      console.warn("metadata: project facets unavailable", e);
    }
    metaCatalogCache = out;
    return out;
  }
  function transform3(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const { document } = payload;
    const params = payload.params || {};
    if (element !== document.body) return;
    const head = params.headMeta || {};
    const template = payload.template && payload.template.name || "";
    const rows = [["Metadata"]];
    if (head.title) rows.push(["Title", head.title]);
    if (head.description) rows.push(["Description", head.description]);
    if (head.image) rows.push(["Image", head.image]);
    if (template) rows.push(["Template", template]);
    if (template === "project") {
      const pageUrl = params.originalURL || payload.url || window.location.href;
      const m = /\/projects\/([^/?#]+)/.exec(new URL(pageUrl).pathname);
      const facets = m && metaProjectFacets(pageUrl)[m[1]];
      if (facets) {
        ["Sector", "Type", "Location", "Approach"].forEach((k) => {
          if (facets[k]) rows.push([k, facets[k]]);
        });
      }
    }
    if (head.robots) rows.push(["Robots", head.robots]);
    element.append(WebImporter.DOMUtils.createTable(rows, document));
  }

  // tools/importer/transformers/barnett-sections.js
  function styleOf(section) {
    const c = section.classList;
    if (c.contains("darkroom")) return "darkroom";
    if (c.contains("intro") || c.contains("prose") || c.contains("services")) return "intro";
    if (c.contains("opening") || c.contains("schedule--text")) return "narrow";
    return null;
  }
  function transform4(hookName, element, payload) {
    if (hookName !== "beforeTransform") return;
    const { document } = payload;
    const main = element.querySelector("main") || element;
    const sections = [...main.querySelectorAll(":scope > section[data-section]")];
    sections.forEach((section, i) => {
      const style = styleOf(section);
      if (style) {
        const meta = WebImporter.DOMUtils.createTable([["Section Metadata"], ["Style", style]], document);
        section.after(meta);
      }
      if (i > 0) section.before(document.createElement("hr"));
    });
  }

  // tools/importer/import-index-c.js
  var PAGE_TEMPLATE = {
    "name": "index-c",
    "description": "Home variant c (design variant at /index-c, noindex): opening + decade-by-decade era timeline (era-timeline: sticky era scale, chapters, plates, undated and new lists), Houzz recognition line, principles row, photography strip, featured testimonial, inline enquiry band.",
    "urls": [
      "http://127.0.0.1:3120/index-c-proposed.html"
    ],
    "blocks": [
      {
        "name": "era-timeline",
        "instances": [
          'section[data-section="timeline"] .tl__chapters'
        ]
      },
      {
        "name": "principles",
        "instances": [
          'section[data-section="principles"] .principles__sheet'
        ]
      },
      {
        "name": "collection-index",
        "instances": [
          'section[data-section="photography"] .wall'
        ]
      },
      {
        "name": "testimonials",
        "instances": [
          'section[data-section="testimonial"] figure.testimonial__figure'
        ]
      }
    ]
  };
  var METADATA_TEMPLATE = "home";
  var JSONLD_DOC = "/_content/index.plain.html";
  var PATHS = { "/index-c-proposed.html": "/index-c" };
  var parsers = {
    "era-timeline": parse,
    "principles": parse2,
    "collection-index": parse3,
    "testimonials": parse4
  };
  function metadataAsHome(hookName, element, payload) {
    transform3(hookName, element, __spreadProps(__spreadValues({}, payload), { template: __spreadProps(__spreadValues({}, payload.template || {}), { name: METADATA_TEMPLATE }) }));
    if (hookName !== "afterTransform" || element !== payload.document.body) return;
    const { document } = payload;
    const tables = [...element.querySelectorAll("table")];
    const table = tables[tables.length - 1];
    if (!table) return;
    const rows = [...table.querySelectorAll("tr")];
    rows.forEach((tr) => {
      const [k, v] = tr.children;
      if (!k || !v || k.textContent.trim() !== "Image") return;
      const src = v.textContent.trim();
      if (!/^https?:\/\//.test(src)) return;
      const img = document.createElement("img");
      img.setAttribute("src", src);
      img.setAttribute("alt", "");
      v.replaceChildren(img);
    });
    try {
      const xhr = new XMLHttpRequest();
      const origin = new URL(payload.params.originalURL || payload.url).origin;
      xhr.open("GET", `${origin}${JSONLD_DOC}`, false);
      xhr.send(null);
      const home = xhr.status === 200 ? new DOMParser().parseFromString(xhr.responseText, "text/html") : null;
      const row = home && [...home.querySelectorAll(".metadata > div")].find((r) => r.children[0] && r.children[0].textContent.trim() === "JSON-LD");
      if (row && row.children[1]) {
        const json = JSON.stringify(JSON.parse(row.children[1].textContent));
        const tr = document.createElement("tr");
        const k = document.createElement("td");
        k.textContent = "JSON-LD";
        const v = document.createElement("td");
        v.textContent = json;
        tr.append(k, v);
        (table.querySelector("tbody") || table).append(tr);
      }
    } catch (e) {
      console.warn("index-c: JSON-LD unavailable", e);
    }
  }
  var sectionTransformers = [transform4];
  var lateTransformers = [...sectionTransformers];
  var transformers = [transform, transform2, metadataAsHome, ...lateTransformers];
  var earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
  function executeTransformers(hookName, element, payload, list = transformers) {
    var _a, _b;
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: ((_b = (_a = payload.params) == null ? void 0 : _a.targets) == null ? void 0 : _b.template) || PAGE_TEMPLATE });
    list.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => (blockDef.instances || []).forEach((selector) => {
      let matches = [];
      try {
        matches = document.querySelectorAll(selector);
      } catch (e) {
        return;
      }
      matches.forEach((element) => {
        if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    }));
    return pageBlocks;
  }
  function markPageTargets(payload) {
    const { document, params } = payload;
    executeTransformers("beforeTransform", document.body, payload, earlyTransformers);
    const blocks = findBlocksOnPage(document, PAGE_TEMPLATE).map(({ name, selector, element }, i) => {
      element.setAttribute("data-excat-block", String(i));
      return { name, selector };
    });
    params.targets = { blocks, template: PAGE_TEMPLATE };
  }
  function documentPath(originalURL) {
    const { pathname } = new URL(originalURL);
    if (PATHS[pathname]) return PATHS[pathname];
    const raw = pathname.replace(/\/index\.html?$/, "").replace(/\.html?$/, "").replace(/\/$/, "");
    return raw === "" ? "/index" : raw;
  }
  var import_index_c_default = {
    preprocess: (payload) => {
      executeTransformers("preprocess", payload.document.body, payload, earlyTransformers);
    },
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      params.fragments = [];
      if (!params.targets) markPageTargets(payload);
      const pageBlocks = params.targets.blocks.map((block, i) => __spreadProps(__spreadValues({}, block), { element: document.querySelector(`[data-excat-block="${i}"]`) })).filter((block) => block.element);
      executeTransformers("beforeTransform", main, __spreadProps(__spreadValues({}, payload), { pageBlocks }), lateTransformers);
      pageBlocks.forEach((block) => {
        if (!main.contains(block.element)) return;
        const parser = parsers[block.name];
        if (!parser) return;
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      return [{
        element: main,
        path: documentPath(params.originalURL),
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }];
    }
  };
  return __toCommonJS(import_index_c_exports);
})();
