// Eleventy configuration for evgenyzborovsky.com.
//
// The posts in _posts/ were written for Jekyll + kramdown. This file keeps them
// working unchanged: same URLs, the same Liquid tags ({% highlight %},
// {% post_url %}, {% gist %}) and the kramdown features the posts rely on.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import markdownIt from "markdown-it";
import Prism from "prismjs";
import { POST_FILE, postUrlFromFile } from "./_config/post-url.js";

const require = createRequire(import.meta.url);
const loadLanguages = require("prismjs/components/index.js");
loadLanguages(["csharp", "markup", "json", "bash", "sql"]);

const POSTS_DIR = "_posts";

// --- Code highlighting -------------------------------------------------------

const LANG_ALIASES = { xml: "markup", html: "markup", cs: "csharp", "c#": "csharp", sh: "bash", shell: "bash" };

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Always starts with "<pre" on its own line so markdown-it treats the output
// as one raw HTML block, even when the code contains blank lines.
function codeBlock(code, lang = "") {
  const label = (lang || "").trim().toLowerCase();
  const prismLang = LANG_ALIASES[label] || label;
  const grammar = Prism.languages[prismLang];
  const body = grammar ? Prism.highlight(code, grammar, prismLang) : escapeHtml(code);
  const cls = grammar ? ` class="language-${prismLang}"` : "";
  const data = label ? ` data-lang="${escapeHtml(label)}"` : "";
  return `<pre class="code"${data}><code${cls}>${body}</code></pre>`;
}

// --- Markdown (kramdown-compatible where the posts need it) ------------------

// kramdown's automatic header ids: keep letters, digits, spaces and dashes,
// drop leading non-letters, spaces become dashes, lower case.
function kramdownId(text) {
  const id = text
    .replace(/[^a-zA-Z0-9 -]/g, "")
    .replace(/^[^a-zA-Z]+/, "")
    .replace(/ /g, "-")
    .toLowerCase();
  return id || "section";
}

function headerIds(md) {
  md.core.ruler.push("kramdown_header_ids", (state) => {
    const seen = new Map();
    for (let i = 0; i < state.tokens.length; i++) {
      const t = state.tokens[i];
      if (t.type !== "heading_open" || t.attrGet("id")) continue;
      const base = kramdownId(state.tokens[i + 1].children.map((c) => c.content).join(""));
      const n = seen.get(base) || 0;
      seen.set(base, n + 1);
      t.attrSet("id", n ? `${base}-${n}` : base);
    }
  });
}

// kramdown typographic symbols (markdown-it's own "replacements" rule also
// turns (c) into ©, which kramdown never did, so it is replaced by this one).
function kramdownTypography(md) {
  const rules = [
    [/---/g, "—"],
    [/--/g, "–"],
    [/\.\.\./g, "…"],
    [/<< /g, "« "],
    [/ >>/g, " »"],
  ];
  md.core.ruler.after("inline", "kramdown_typography", (state) => {
    for (const block of state.tokens) {
      if (block.type !== "inline") continue;
      let inLink = 0;
      for (const t of block.children) {
        if (t.type === "link_open") inLink++;
        if (t.type === "link_close") inLink--;
        if (t.type !== "text" || inLink) continue;
        for (const [re, sub] of rules) t.content = t.content.replace(re, sub);
      }
    }
  });
}

// kramdown accepts pipe tables without a "---|---" separator row; markdown-it
// needs one. Add it to such tables (outside code and blockquotes).
function addTableSeparators(content) {
  const lines = content.split("\n");
  let inCode = false;
  const isRow = (l) => /\S\s*\|\s*\S/.test(l) && !/^\s*>/.test(l) && !/^( {4}|\t)/.test(l);
  const cells = (l) => l.replace(/^\s*\||\|\s*$/g, "").split("|").length;
  for (let i = 0; i < lines.length - 1; i++) {
    const l = lines[i];
    if (/\{%\s*highlight\b|^\s*```/.test(l)) inCode = !/\{%\s*endhighlight\s*%\}/.test(l) && !(inCode && /^\s*```/.test(l));
    else if (/\{%\s*endhighlight\s*%\}/.test(l)) inCode = false;
    if (inCode) continue;
    const prevBlank = i === 0 || lines[i - 1].trim() === "";
    const next = lines[i + 1];
    if (prevBlank && isRow(l) && isRow(next) && !/^[\s|:-]+$/.test(next) && cells(l) === cells(next) && cells(l) > 1) {
      lines.splice(i + 1, 0, Array(cells(l)).fill("---").join(" | "));
      i++;
    }
  }
  return lines.join("\n");
}

// Raw HTML is allowed in posts, but only real HTML elements. Anything else
// that looks like a tag (e.g. <GoogleServicesJson Include="..." />) is text
// the author meant to show, so it is escaped instead of swallowed.
const HTML_TAGS = new Set(("a abbr address area article aside audio b bdi bdo blockquote br button canvas caption cite code col colgroup " +
  "data dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hr i iframe img input ins " +
  "kbd label legend li link main mark meta nav noscript ol optgroup option output p picture pre q s samp script section select small source span " +
  "strong style sub summary sup table tbody td template textarea tfoot th thead time tr track u ul var video wbr center font strike tt").split(" "));

function safeHtml(md) {
  for (const rule of ["html_inline", "html_block"]) {
    const original = md.renderer.rules[rule];
    md.renderer.rules[rule] = (tokens, idx, options, env, self) => {
      const content = tokens[idx].content;
      const m = /^\s*<\/?([A-Za-z][A-Za-z0-9-]*)/.exec(content);
      if (m && !HTML_TAGS.has(m[1].toLowerCase())) return escapeHtml(content);
      return original(tokens, idx, options, env, self);
    };
  }
}

const md = markdownIt({ html: true, typographer: true, highlight: (code, lang) => codeBlock(code, lang) })
  .disable("replacements")
  .use(headerIds)
  .use(kramdownTypography)
  .use(safeHtml);

// --- Helpers -----------------------------------------------------------------

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const pad = (n) => String(n).padStart(2, "0");

function formatDate(value, format = "long") {
  const d = value instanceof Date ? value : new Date(value);
  const y = d.getUTCFullYear(), m = d.getUTCMonth(), day = d.getUTCDate();
  switch (format) {
    case "iso": return `${y}-${pad(m + 1)}-${pad(day)}`;
    case "rfc3339": return d.toISOString().replace(/\.\d{3}Z$/, "Z");
    case "month": return `${MONTHS[m]} ${y}`;
    case "short": return `${MONTHS[m].slice(0, 3)} ${day}, ${y}`;
    case "year": return String(y);
    default: return `${MONTHS[m]} ${day}, ${y}`;
  }
}

// Jekyll's slugize: lower case, every run of non-alphanumerics becomes "-".
const slugize = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const decode = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
// Block-level tags become a space, inline tags (links, code, emphasis) vanish.
const stripHtml = (html) =>
  decode(String(html).replace(/<\/?(?:p|li|ul|ol|h[1-6]|pre|div|tr|td|th|table|blockquote|br|hr|figure)\b[^>]*>/gi, " ").replace(/<[^>]*>/g, ""))
    .replace(/\s+/g, " ")
    .trim();

// Plain-text summary for meta descriptions and the feed: the first block of
// Markdown that reads as a sentence (screenshot tables and headings skipped).
function excerptText(raw) {
  const blocks = String(raw || "").trim().split(/\n\s*\n/);
  let fallback = "";
  for (const block of blocks.slice(0, 8)) {
    if (/^\s*(\{%|#|\||!\[)/.test(block)) continue;
    const text = stripHtml(md.render(block.replace(/\{%[\s\S]*?%\}/g, " ").replace(/\{\{[\s\S]*?\}\}/g, " ")));
    if (!fallback) fallback = text;
    if (text.split(" ").length >= 12) return text;
  }
  return fallback;
}

const wordCount = (html) => stripHtml(html).split(" ").filter(Boolean).length;

// --- Config ------------------------------------------------------------------

export default function (eleventyConfig) {
  eleventyConfig.setLibrary("md", md);

  // Files that are copied as they are.
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");

  // kramdown block attribute used on 3 ordered lists: {:start="4"}.
  // markdown-it already starts a list at its first number, so drop the marker.
  eleventyConfig.addPreprocessor("kramdown-compat", "md", (data, content) =>
    addTableSeparators(content.replace(/^\{:start="\d+"\}[ \t]*\r?\n/gm, ""))
  );

  // Every post's URL by file name, for {% post_url %}. Also checks that the
  // date in the front matter agrees with the file name, as the URL uses it.
  const postUrls = new Map();
  for (const file of fs.readdirSync(POSTS_DIR)) {
    if (!POST_FILE.test(file)) continue;
    postUrls.set(file.replace(/\.md$/, ""), postUrlFromFile(file));
    const fm = /^date:\s*"?(\d{4}-\d{2}-\d{2})/m.exec(fs.readFileSync(path.join(POSTS_DIR, file), "utf8"));
    if (fm && !file.startsWith(fm[1])) throw new Error(`${file}: front matter date ${fm[1]} differs from file name`);
  }

  eleventyConfig.addLiquidTag("post_url", () => ({
    parse(tagToken) {
      this.name = tagToken.args.trim().replace(/\.md$/, "");
    },
    render() {
      const url = postUrls.get(this.name);
      if (!url) throw new Error(`{% post_url %}: no post named ${this.name}`);
      return url;
    },
  }));

  eleventyConfig.addLiquidTag("gist", () => ({
    parse(tagToken) {
      this.id = tagToken.args.trim();
      if (!/^[A-Za-z0-9_\-\/]+$/.test(this.id)) throw new Error(`{% gist %}: unexpected id ${this.id}`);
    },
    render() {
      return `\n<div class="gist-embed"><script src="https://gist.github.com/${this.id}.js"></script>` +
        `<noscript><a href="https://gist.github.com/${this.id}">View this code on GitHub Gist</a></noscript></div>\n`;
    },
  }));

  eleventyConfig.addLiquidTag("highlight", (liquid) => ({
    parse(tagToken, remainTokens) {
      this.lang = tagToken.args.trim().split(/\s+/)[0] || "";
      this.templates = [];
      const stream = liquid.parser
        .parseStream(remainTokens)
        .on("tag:endhighlight", () => stream.stop())
        .on("template", (tpl) => this.templates.push(tpl))
        .on("end", () => {
          throw new Error("{% highlight %} is not closed");
        });
      stream.start();
    },
    *render(ctx) {
      const code = yield liquid.renderer.renderTemplates(this.templates, ctx);
      return `\n${codeBlock(String(code).trim(), this.lang)}\n`;
    },
  }));

  // Collections
  eleventyConfig.addCollection("postsDesc", (api) => api.getFilteredByTag("posts").slice().reverse());

  eleventyConfig.addCollection("categoryList", (api) => {
    const byName = new Map();
    for (const post of api.getFilteredByTag("posts").slice().reverse()) {
      for (const name of post.data.categories || []) {
        if (!byName.has(name)) byName.set(name, []);
        byName.get(name).push(post);
      }
    }
    const used = new Set();
    return [...byName.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, posts]) => {
        let slug = slugize(name) || "category";
        while (used.has(slug)) slug += "-";
        used.add(slug);
        return { name, slug, posts };
      });
  });

  eleventyConfig.addCollection("postsByYear", (api) => {
    const years = new Map();
    for (const post of api.getFilteredByTag("posts").slice().reverse()) {
      const y = post.date.getUTCFullYear();
      if (!years.has(y)) years.set(y, []);
      years.get(y).push(post);
    }
    return [...years.entries()].map(([year, posts]) => ({ year, posts }));
  });

  // Filters
  eleventyConfig.addFilter("date_fmt", formatDate);
  eleventyConfig.addFilter("excerpt_text", excerptText);
  eleventyConfig.addFilter("strip_tags", stripHtml);
  eleventyConfig.addFilter("read_minutes", (html) => Math.max(1, Math.round(wordCount(html) / 220)));
  eleventyConfig.addFilter("category_slug", (name, list) => {
    const hit = (list || []).find((c) => c.name === name);
    return hit ? hit.slug : slugize(name);
  });
  eleventyConfig.addFilter("absolute_urls", (html, base) =>
    String(html).replace(/(\s(?:href|src))="\/(?!\/)/g, `$1="${base}/`)
  );
  eleventyConfig.addFilter("xml_escape", (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
  );

  return {
    dir: { input: ".", includes: "_includes", layouts: "_layouts", data: "_data", output: "_site" },
    templateFormats: ["md", "html", "liquid"],
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",
  };
}
