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

  // tools/importer/import-index-b.js
  var import_index_b_exports = {};
  __export(import_index_b_exports, {
    default: () => import_index_b_default
  });

  // tools/importer/parsers/project-stage.js
  var psCatalogCache = null;
  function psSectors(pageUrl) {
    if (psCatalogCache) return psCatalogCache;
    const out = {};
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${new URL(pageUrl).origin}/projects/index.html`, false);
      xhr.send(null);
      if (xhr.status === 200) {
        const doc = new DOMParser().parseFromString(xhr.responseText, "text/html");
        const labels = {};
        doc.querySelectorAll('a.facet-chip[data-facet="sector"]').forEach((a) => {
          labels[a.dataset.value] = [...a.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
        });
        doc.querySelectorAll("li.schedule__row[data-sector]").forEach((li) => {
          const a = li.querySelector(".schedule__title a");
          const m = a && /projects\/([^/?#]+)/.exec(a.getAttribute("href"));
          if (!m) return;
          out[m[1].replace(/\/index\.html$/, "")] = li.dataset.sector.split(/\s+/).filter(Boolean).map((s) => labels[s] || s).join(", ");
        });
      }
    } catch (e) {
      console.warn("project-stage: sectors unavailable", e);
    }
    psCatalogCache = out;
    return out;
  }
  function prepareStageImages(root) {
    root.querySelectorAll("li.ix__item[data-img]").forEach((li) => {
      const [u, ow, oh] = (li.getAttribute("data-img") || "").split("|");
      const img = li.querySelector("img");
      if (!u || !img) return;
      const w = Math.min(2400, Number(ow) || 2400);
      const h = Math.round(w * Number(oh) / Number(ow)) || Math.round(w / 1.5);
      const src = `https://static.wixstatic.com/media/${u}/v1/fill/w_${w},h_${h},al_c,q_85,enc_auto/${u}`;
      img.removeAttribute("srcset");
      img.removeAttribute("sizes");
      img.setAttribute("src", src);
      img.setAttribute("data-best-src", src);
      img.setAttribute("alt", li.getAttribute("data-alt") || "");
    });
  }
  function parse(element, { document, url }) {
    const text = (n) => (n ? n.textContent : "").replace(/\s+/g, " ").trim();
    const mk = (tag, kids) => {
      const e = document.createElement(tag);
      (Array.isArray(kids) ? kids : [kids]).filter((k) => k != null && k !== "").forEach((k) => e.append(typeof k === "string" ? document.createTextNode(k) : k));
      return e;
    };
    const link = (href, label2) => {
      const a = mk("a", label2);
      a.setAttribute("href", href);
      return a;
    };
    const sectors = psSectors(url || document.location && document.location.href || window.location.href);
    const rows = [];
    element.querySelectorAll(".ix__group").forEach((group) => {
      const gh = group.querySelector(".ix__group-h");
      const ga = gh && gh.querySelector("a");
      let groupName = "";
      if (gh) {
        groupName = ga ? text(ga) : text(gh);
        const rest = text(gh).slice(groupName.length).trim();
        const h3 = mk("h3", ga ? [link(ga.getAttribute("href"), groupName)] : [groupName]);
        if (rest) h3.append(document.createTextNode(` ${rest}`));
        rows.push([h3]);
      }
      group.querySelectorAll("li.ix__item").forEach((li) => {
        const a = li.querySelector("a");
        if (!a) return;
        const href = a.getAttribute("href");
        const name = text(li.querySelector(".ix__name")) || text(a);
        const img = li.querySelector("img");
        let pic = "";
        if (img) {
          pic = document.createElement("img");
          pic.setAttribute("src", img.getAttribute("data-best-src") || img.getAttribute("src"));
          pic.setAttribute("alt", img.getAttribute("alt") || "");
        }
        const m = /projects\/([^/?#]+)/.exec(href || "");
        const sector = m && sectors[m[1]] || groupName;
        const [type, location] = text(li.querySelector(".ix__facts")).split(" \xB7 ");
        const facts = [sector, type, location].filter((v) => v != null).map((v) => mk("p", v || ""));
        rows.push([pic, mk("p", link(href, name)), facts]);
      });
    });
    const out = [];
    const label = element.querySelector(".ix__label, .ix__head h2");
    if (label) out.push(mk("h2", text(label)));
    out.push(WebImporter.DOMUtils.createTable([["Project Stage"], ...rows], document));
    const section = element.closest("section");
    if (section) section.querySelectorAll(".ix__stage").forEach((n) => n.remove());
    element.replaceWith(...out);
  }

  // tools/importer/parsers/collection-index.js
  function parse2(element, { document }) {
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
  function parse3(element, { document }) {
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

  // tools/importer/transformers/barnett-index-b.js
  function ixbMeta(document, style) {
    return WebImporter.DOMUtils.createTable([["Section Metadata"], ["Style", style]], document);
  }
  function transform(hookName, element, payload) {
    const { document } = payload;
    const params = payload.params || {};
    if (hookName === "preprocess") {
      prepareStageImages(element);
    }
    if (hookName === "beforeTransform") {
      if (params.headMeta) params.headMeta.robots = "noindex";
      WebImporter.DOMUtils.remove(element, [".ix__stage", ".ix__hint", "a.ix__skip"]);
      element.querySelectorAll("p.ix__actions, .enquiry__body > p").forEach((p) => {
        const links = [...p.querySelectorAll(":scope > a")];
        if (!links.length || p.textContent.replace(/\s+/g, "") !== links.map((a) => a.textContent).join("").replace(/\s+/g, "")) return;
        const paras = links.map((a) => {
          const np = document.createElement("p");
          if (a.classList.contains("btn-primary")) {
            const strong = document.createElement("strong");
            strong.append(a);
            np.append(strong);
          } else np.append(a);
          return np;
        });
        p.replaceWith(...paras);
      });
      const main = element.querySelector("main") || element;
      const practice = main.querySelector(':scope > section[data-section="practice"]');
      if (practice && !practice.dataset.ixbStyled) {
        practice.classList.remove("prose", "intro", "services");
        practice.after(ixbMeta(document, "practice"));
        practice.dataset.ixbStyled = "1";
      }
      const enquiry = main.querySelector(':scope > section[data-section="enquiry"]');
      if (enquiry && !enquiry.dataset.ixbStyled) {
        enquiry.after(ixbMeta(document, "enquiry"));
        enquiry.dataset.ixbStyled = "1";
      }
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

  // tools/importer/import-index-b.js
  var PAGE_TEMPLATE = {
    "name": "index-b",
    "description": "Home variant b (design variant at /index-b, noindex): sheet index beside a photo stage (project-stage), practice band (process chain + Houzz recognition), justified photography wall, featured testimonial, inline enquiry band.",
    "urls": [
      "http://127.0.0.1:3120/index-b-proposed.html"
    ],
    "blocks": [
      {
        "name": "project-stage",
        "instances": [
          'section[data-section="index"] nav.ix__index'
        ]
      },
      {
        "name": "collection-index",
        "instances": [
          'section[data-section="photography"] .photo-wall'
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
  var JSONLD_PATH = "/_jsonld/index.json";
  var PATHS = { "/index-b-proposed.html": "/index-b" };
  var parsers = {
    "project-stage": parse,
    "collection-index": parse2,
    "testimonials": parse3
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
      xhr.open("GET", `${origin}${JSONLD_PATH}`, false);
      xhr.send(null);
      if (xhr.status === 200) {
        const json = JSON.stringify(JSON.parse(xhr.responseText));
        const tr = document.createElement("tr");
        const k = document.createElement("td");
        k.textContent = "JSON-LD";
        const v = document.createElement("td");
        v.textContent = json;
        tr.append(k, v);
        (table.querySelector("tbody") || table).append(tr);
      }
    } catch (e) {
      console.warn("index-b: JSON-LD unavailable", e);
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
  var import_index_b_default = {
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
  return __toCommonJS(import_index_b_exports);
})();
