import { archive } from "./content/archive.js";

const main = document.querySelector("main");
const asset = (id) => archive.assets[id];
const entry = (id) => archive.entries.find((item) => item.id === id);
const link = (id) => `#entry/${id}`;
const esc = (value = "") => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function index() {
  return `<section class="threshold home-index" id="index" aria-label="Subsense project index">
    <video class="sheets" autoplay muted loop playsinline><source src="${archive.site.indexMedia.publicPath}" type="video/mp4" /></video><div class="threshold-shade"></div>
    <nav class="home-projects" aria-label="Projects">${archive.entries.map(item => `<a href="${link(item.id)}">${esc(item.title)}</a>`).join("")}</nav></section>`;
}

function card(item) {
  return `<a class="archive-card" href="${link(item.id)}"><span>${item.status}</span><b>${esc(item.title)}</b><em>${item.type.map(esc).join(" / ")}</em></a>`;
}

function media(block) {
  const item = asset(block.asset);
  const cls = block.layout === "diagram" ? "diagram" : "image-field";
  return `<section class="${cls}"><figure class="${block.layout === "full" ? "full-figure" : ""}"><img src="${item.publicPath}" alt="${esc(item.alt)}" /><figcaption>${esc(block.caption)} <span>Source: ${esc(item.sourcePath)}</span></figcaption></figure></section>`;
}

function block(block) {
  if (block.type === "media") return media(block);
  if (block.type === "mediaPair") return `<section class="image-field"><div class="side-by-side">${block.assets.map((id, i) => { const item = asset(id); return `<figure class="${i ? "offset" : ""}"><img src="${item.publicPath}" alt="${esc(item.alt)}" /><figcaption>${esc(block.captions[i])}<span>Source: ${esc(item.sourcePath)}</span></figcaption></figure>`; }).join("")}</div></section>`;
  if (block.type === "sequence") return `<section class="sequence"><p class="eyebrow">The apparatus is part of the composition</p><h2>${block.title}</h2><ol>${block.items.map(([title, text], i) => `<li><span>0${i + 1}</span><p><b>${esc(title)}</b><br />${esc(text)}</p></li>`).join("")}</ol></section>`;
  if (block.type === "video") { const item = asset(block.asset); return `<section class="process-film"><div><p class="eyebrow">Process record</p><h2>${esc(block.title)}</h2><p>${esc(block.body)}</p></div><video controls muted loop playsinline><source src="${item.publicPath}" type="video/mp4" />Your browser does not support this video.</video></section>`; }
  if (block.type === "quote") return `<section class="research"><p class="eyebrow">Research fragment</p><blockquote>${esc(block.text)}</blockquote><p class="citation">${esc(block.cite)}</p></section>`;
  return "";
}

function provenance(item) {
  return `<section class="provenance"><p class="eyebrow">Provenance / editorial status</p><p>${esc(item.provenance.editorialStatus)}</p><ul>${item.provenance.sourcePaths.map((path) => `<li>${esc(path)}</li>`).join("")}</ul></section>`;
}

function related(item) {
  const items = item.related.map(entry).filter(Boolean);
  return `<section class="archive" id="archive"><p class="eyebrow">Outward from this path</p><h2>Other signals<br />in the archive.</h2><div class="archive-links">${items.map((other, i) => `<a href="${link(other.id)}"><span>0${i + 1}</span><b>${esc(other.title)}</b><em>${other.tags.slice(0, 3).map(esc).join(" / ")}</em></a>`).join("")}</div></section>`;
}

function entryPage(item) {
  const tracer = item.id === "becoming-agential";
  return `<section class="project-intro"><div class="project-meta"><span>${item.year || "Undated"}</span><span>${item.type.map(esc).join(" / ")}</span><span>${item.status}</span></div><div class="project-heading"><p class="eyebrow">${tracer ? "A first path through the archive" : "Recovered archive record"}</p><h1>${esc(item.title).replace(" ", "<br /><i>")}${item.title.includes(" ") ? "</i>" : ""}</h1></div><div class="project-statement"><p>${esc(item.orientation)}</p>${item.statement ? `<p class="small">${esc(item.statement)}</p>` : ""}</div></section>${(item.blocks || []).map(block).join("")}${provenance(item)}${related(item)}`;
}

function render() {
  const route = location.hash.replace(/^#/, "") || "index";
  if (route === "main") {
    document.getElementById(route)?.scrollIntoView();
    return;
  }
  const [, id] = route.split("/");
  const current = route.startsWith("entry/") ? entry(id) : null;
  const isHome = !current && route !== "archive" && route !== "about";
  main.innerHTML = current ? entryPage(current) : route === "archive"
    ? `<section class="index-ledger" id="archive"><h1>Archive</h1>${archive.entries.map(card).join("")}</section>`
    : route === "about" ? `<section class="index-ledger"><h1>Danny Clarke / Subsense</h1></section>` : index();
  document.title = current ? `Subsense — ${current.title}` : "Subsense";
  document.querySelector("#masthead").classList.toggle("on-paper", !isHome);
  document.body.classList.toggle("home", isHome);
  document.querySelector("footer").hidden = isHome;
  main.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}
window.addEventListener("hashchange", render);
render();
