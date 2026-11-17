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

  // tools/importer/import-gallery.js
  var import_gallery_exports = {};
  __export(import_gallery_exports, {
    default: () => import_gallery_default
  });

  // tools/importer/parsers/breadcrumbs.js
  function parse(element, { document }) {
    const text = (n) => (n ? n.textContent : "").replace(/\s+/g, " ").trim();
    const ul = document.createElement("ul");
    element.querySelectorAll("li").forEach((li) => {
      const item = document.createElement("li");
      const a = li.querySelector("a");
      if (a) {
        const link = document.createElement("a");
        link.setAttribute("href", a.getAttribute("href"));
        link.textContent = text(a);
        item.append(link);
      } else {
        item.textContent = text(li);
      }
      ul.append(item);
    });
    const table = WebImporter.DOMUtils.createTable([["Breadcrumbs"], [ul]], document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/gallery.js
  function parse2(element, { document }) {
    const text = (n) => (n ? n.textContent : "").replace(/\s+/g, " ").trim();
    const wall = element.classList.contains("photo-wall");
    const rows = [];
    element.querySelectorAll("figure").forEach((fig) => {
      const img = fig.querySelector("img");
      if (!img) return;
      const pic = document.createElement("img");
      pic.setAttribute("src", img.getAttribute("data-best-src") || img.getAttribute("src"));
      pic.setAttribute("alt", img.getAttribute("alt") || "");
      const cap = fig.querySelector("figcaption");
      const title = cap ? [...cap.querySelectorAll(":scope > span")].filter((s) => !s.classList.contains("plate__no")).map(text).filter(Boolean).join(" ") : "";
      rows.push(title ? [pic, title] : [pic]);
    });
    const table = WebImporter.DOMUtils.createTable([[wall ? "Gallery (wall)" : "Gallery"], ...rows], document);
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
    if (ds === "selected-works") name = "Collection Index (selected)";
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

  // tools/importer/parsers/fragment.js
  function parse4(element, { document, params }) {
    const text = (n) => (n ? n.textContent : "").replace(/\s+/g, " ").trim();
    const PATH = "/fragments/enquiry";
    const mkLink = (href, label) => {
      const a = document.createElement("a");
      a.setAttribute("href", href);
      a.textContent = label;
      return a;
    };
    if (params && params.writeEnquiryFragment && Array.isArray(params.fragments)) {
      const doc = document.createElement("div");
      const h = element.querySelector("h2");
      if (h) {
        const h2 = document.createElement("h2");
        h2.textContent = text(h);
        doc.append(h2);
      }
      const ul = element.querySelector("ul");
      if (ul) {
        const list = document.createElement("ul");
        ul.querySelectorAll("li").forEach((li) => {
          const item = document.createElement("li");
          const a = li.querySelector("a");
          if (a) item.append(mkLink(a.getAttribute("href"), text(a)));
          else item.textContent = text(li);
          list.append(item);
        });
        doc.append(list);
      }
      element.querySelectorAll(".enquiry__body > p").forEach((p) => {
        const np = document.createElement("p");
        np.textContent = text(p);
        doc.append(np);
      });
      params.fragments.push({ element: doc, path: PATH });
    }
    const table = WebImporter.DOMUtils.createTable([["Fragment"], [mkLink(PATH, PATH)]], document);
    element.replaceWith(table);
  }

  // tools/importer/transformers/barnett-shared-docs.js
  function sdText(el) {
    return (el ? el.textContent : "").replace(/\s+/g, " ").trim();
  }
  function sdNewPath(href, pageUrl) {
    if (!href || /^(mailto:|tel:|#|javascript:)/i.test(href)) return href;
    const page = new URL(pageUrl);
    const base = page.pathname === "/" ? `${page.origin}/index.html` : `${page.origin}${page.pathname.replace(/\/$/, "")}/index.html`;
    let u;
    try {
      u = new URL(href, base);
    } catch (e) {
      return href;
    }
    if (u.origin !== page.origin) return href;
    let p = u.pathname.replace(/index\.html$/, "").replace(/\.html$/, "");
    if (p.length > 1) p = p.replace(/\/$/, "");
    return `${p || "/"}${u.search}${u.hash}`;
  }
  function buildSharedDocs(document, pageUrl) {
    const header = document.querySelector("header.site-header");
    const footer = document.querySelector("footer.site-footer");
    if (!header || !footer) return null;
    const href = (a2) => sdNewPath(a2.getAttribute("href"), pageUrl);
    const mk = (tag, kids) => {
      const e = document.createElement(tag);
      (Array.isArray(kids) ? kids : [kids]).filter(Boolean).forEach((k) => e.append(typeof k === "string" ? document.createTextNode(k) : k));
      return e;
    };
    const a = (h, label) => {
      const l = mk("a", label);
      l.setAttribute("href", h);
      return l;
    };
    const columns = [...footer.querySelectorAll(".site-footer__map > div")].map((col) => ({
      heading: sdText(col.querySelector("h2, h3, .label")),
      links: [...col.querySelectorAll("a")].map((l) => ({ href: href(l), label: sdText(l) }))
    }));
    const nav = document.createElement("div");
    const brand = header.querySelector(".ds-wordmark");
    nav.append(mk("p", a(href(brand), sdText(brand))));
    nav.append(document.createElement("hr"));
    const list = document.createElement("ul");
    let contact = null;
    header.querySelectorAll(".ds-nav__list > li").forEach((li) => {
      const details = li.querySelector("details");
      if (details) {
        const subLinks = [...details.querySelectorAll(".ds-nav__sub a")];
        const item2 = mk("li", a(subLinks.length ? href(subLinks[0]) : "/", sdText(details.querySelector("summary"))));
        item2.append(mk("ul", subLinks.map((l) => mk("li", a(href(l), sdText(l))))));
        list.append(item2);
        return;
      }
      const link = li.querySelector("a");
      if (!link) return;
      if (href(link) === "/contact") {
        contact = link;
        return;
      }
      const item = mk("li", a(href(link), sdText(link)));
      if (sdText(link) === "Projects") {
        const col = columns.find((c) => c.heading === "Projects");
        const children = (col ? col.links : []).filter((l) => l.href !== href(link));
        if (children.length) item.append(mk("ul", children.map((l) => mk("li", a(l.href, l.label)))));
      }
      list.append(item);
    });
    nav.append(list);
    nav.append(document.createElement("hr"));
    if (contact) nav.append(mk("p", a(href(contact), sdText(contact))));
    const foot = document.createElement("div");
    const fbrand = footer.querySelector(".ds-wordmark");
    if (fbrand) foot.append(mk("p", a(href(fbrand), sdText(fbrand))));
    const nap = footer.querySelector("address");
    if (nap) {
      const p = document.createElement("p");
      nap.childNodes.forEach((n) => {
        if (n.nodeName === "BR") p.append(document.createElement("br"));
        else if (n.nodeName === "A") p.append(a(href(n), sdText(n)));
        else if (n.nodeType === 3 && n.textContent.trim()) p.append(document.createTextNode(n.textContent.trim()));
      });
      foot.append(p);
    }
    foot.append(document.createElement("hr"));
    columns.forEach((c) => {
      foot.append(mk("h2", c.heading));
      foot.append(mk("ul", c.links.map((l) => mk("li", a(l.href, l.label)))));
    });
    foot.append(document.createElement("hr"));
    footer.querySelectorAll(".site-footer__legal > span").forEach((s) => foot.append(mk("p", sdText(s))));
    return { nav: nav.innerHTML, footer: foot.innerHTML };
  }
  function transform(hookName, element, payload) {
    const { document } = payload;
    const params = payload.params;
    if (!params || !params.writeSharedDocs) return;
    const pageUrl = params.originalURL || payload.url || window.location.href;
    if ((hookName === "preprocess" || hookName === "beforeTransform") && !params.sharedDocs) {
      params.sharedDocs = buildSharedDocs(document, pageUrl);
    }
    if (hookName === "beforeTransform" && params.sharedDocs && Array.isArray(params.fragments) && !params.sharedDocsEmitted) {
      ["nav", "footer"].forEach((name) => {
        const div = document.createElement("div");
        div.innerHTML = params.sharedDocs[name];
        params.fragments.push({ element: div, path: `/${name}` });
      });
      params.sharedDocsEmitted = true;
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

  // tools/importer/import-gallery.js
  var PAGE_TEMPLATE = {
    "name": "gallery",
    "description": "Photo collection: darkroom head (breadcrumb, H1, facts, intro), justified photo wall, more-collections strip, enquiry band.",
    "urls": [
      "http://127.0.0.1:3110/photography/fields-of-vision-2024",
      "http://127.0.0.1:3110/photography/illinois",
      "http://127.0.0.1:3110/photography/iowa",
      "http://127.0.0.1:3110/photography/iowa-2022-exhibit",
      "http://127.0.0.1:3110/photography/mexico-faces",
      "http://127.0.0.1:3110/photography/mexico-places",
      "http://127.0.0.1:3110/photography/minnesota",
      "http://127.0.0.1:3110/photography/wisconsin"
    ],
    "blocks": [
      {
        "name": "breadcrumbs",
        "instances": [
          'section[data-section="gallery-head"] nav.crumbs'
        ]
      },
      {
        "name": "gallery",
        "instances": [
          'section[data-section="gallery"] .photo-wall'
        ]
      },
      {
        "name": "collection-index",
        "instances": [
          'section[data-section="more-collections"] ul.siblings'
        ]
      },
      {
        "name": "fragment",
        "instances": [
          'main > section[data-section="enquiry"]'
        ]
      }
    ]
  };
  var parsers = {
    "breadcrumbs": parse,
    "gallery": parse2,
    "collection-index": parse3,
    "fragment": parse4
  };
  var sectionTransformers = [transform4];
  var fragmentTransformers = [];
  var lateTransformers = [...sectionTransformers, ...fragmentTransformers];
  var transformers = [transform, transform2, transform3, ...lateTransformers];
  var earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
  var CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));
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
  function findBlocksOnPage(document, template, url) {
    const pageBlocks = [];
    const pageKey = (u) => {
      try {
        const { origin, pathname } = new URL(u);
        return `${origin}${pathname.replace(/\/$/, "")}`;
      } catch (e) {
        return u;
      }
    };
    const key = pageKey(url);
    const claim = (blockDef, selector) => {
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
    };
    template.blocks.forEach((blockDef) => {
      const entry = Object.entries(blockDef.pageInstances || {}).find(([u]) => pageKey(u) === key);
      (entry ? entry[1] : []).forEach((selector) => claim(blockDef, selector));
    });
    template.blocks.forEach((blockDef) => (blockDef.instances || []).forEach((selector) => claim(blockDef, selector)));
    return pageBlocks;
  }
  function markPageTargets(payload) {
    const { document, params } = payload;
    executeTransformers("beforeTransform", document.body, payload, earlyTransformers);
    const blocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
      element.setAttribute("data-excat-block", String(i));
      return { name, selector };
    });
    const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
      const target = (section.selector || []).map((s) => {
        try {
          return document.querySelector(s);
        } catch (e) {
          return null;
        }
      }).find(Boolean);
      if (!target) return section;
      target.setAttribute("data-excat-section", String(i));
      return __spreadProps(__spreadValues({}, section), { selector: [`[data-excat-section="${i}"]`] });
    });
    params.targets = { blocks, template: __spreadProps(__spreadValues({}, PAGE_TEMPLATE), { sections }) };
  }
  function documentPath(originalURL) {
    const raw = new URL(originalURL).pathname.replace(/\/index\.html?$/, "").replace(/\.html?$/, "").replace(/\/$/, "");
    return raw === "" ? "/index" : raw;
  }
  var import_gallery_default = {
    preprocess: (payload) => {
      executeTransformers("preprocess", payload.document.body, payload, earlyTransformers);
      if (CATALOG) markPageTargets(payload);
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
      params.fragments.forEach(({ element }) => {
        executeTransformers("afterTransform", element, payload, earlyTransformers);
        WebImporter.rules.transformBackgroundImages(element, document);
        WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
      });
      const path = documentPath(params.originalURL);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }, ...params.fragments];
    }
  };
  return __toCommonJS(import_gallery_exports);
})();
