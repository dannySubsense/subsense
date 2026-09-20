import { archive } from "./content/archive.js";
import { startRegistration } from "./interactions/registration.js";
import { startApparatus } from "./interactions/apparatus.js";

const main = document.querySelector("main");
const asset = (id) => archive.assets[id];
const entry = (id) => archive.entries.find((item) => item.id === id);
const link = (id) => `#entry/${id}`;
const esc = (value = "") => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
let sheetIndex = 0;
let sheetSound = false;
let sheetVolume = .5;
let stopSheets = () => {};
let stopProjectFlow = () => {};
let stopRegistration = () => {};
let stopApparatus = () => {};

function index() {
  return `<section class="threshold" id="index" aria-label="Subsense">
    <video class="sheets" muted playsinline preload="metadata" aria-hidden="true"></video><div class="threshold-shade"></div>
    <div class="registration-field" aria-hidden="true">${Array.from({length: 4}, () => '<span>+</span>').join('')}</div>
    <div class="visitor-targets" aria-hidden="true"></div>
    <div class="threshold-copy"><h1 class="index-title">Subsense</h1>
    <div class="project-emitter"><a class="enter" href="#archive">Passages <span>→</span></a><nav class="project-window" aria-label="Passages"><div class="project-strip">${archive.entries.map(item => `<a href="${link(item.id)}">${esc(item.title)}</a>`).join("")}</div></nav></div></div>
    <ol class="index-notations" start="0" aria-label="Fields of attention">${archive.site.indexWords.flat().map((word, i) => `<li><span class="notation-number" aria-hidden="true">[${String(i).padStart(2, '0')}]</span> ${esc(word)}</li>`).join('')}</ol>
    <div class="sheet-audio"><div class="audio-heading"><button class="sheet-sound" type="button" aria-pressed="${sheetSound}" aria-label="Texture audio">texture</button><output for="sheet-volume" class="volume-value">00</output></div>
    <div class="volume-ruler"><div class="ruler-ticks" aria-hidden="true">${Array.from({length: 21}, () => '<span></span>').join('')}</div><input id="sheet-volume" type="range" min="0" max="100" step="1" value="0" aria-label="Sheet audio volume" /></div></div></section>`;
}

function startProjectFlow() {
  const viewport = main.querySelector('.project-window');
  const strip = main.querySelector('.project-strip');
  const measure = () => {
    strip.style.setProperty('--travel', `${viewport.clientWidth}px`);
    strip.style.setProperty('--flow-duration', `${(strip.scrollWidth + viewport.clientWidth) / 65 / .97}s`);
  };
  const resize = new ResizeObserver(measure);
  const focus = (event) => {
    if (event.target.matches('a')) event.target.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  };
  viewport.addEventListener('focusin', focus);
  resize.observe(viewport);
  resize.observe(strip);
  measure();
  return () => { resize.disconnect(); viewport.removeEventListener('focusin', focus); };
}

function startSheets() {
  const video = main.querySelector('.sheets');
  const sound = main.querySelector('.sheet-sound');
  const volume = main.querySelector('#sheet-volume');
  const volumeValue = main.querySelector('.volume-value');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let playing = !motion.matches;
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const syncSound = () => {
    video.muted = !sheetSound;
    video.volume = sheetVolume;
    const level = sheetSound ? Math.round(sheetVolume * 100) : 0;
    volume.value = String(level);
    volume.setAttribute('aria-valuetext', level ? `${level} percent` : 'Muted');
    volumeValue.textContent = String(level).padStart(2, '0');
    sound.setAttribute('aria-pressed', String(sheetSound));
  };
  const play = () => video.play().catch(() => {
    if (controller.signal.aborted) return;
    // A browser may require a fresh gesture after navigation.
    if (sheetSound) { sheetSound = false; syncSound(); video.play().catch(() => {}); }
  });
  sound.addEventListener('click', () => {
    sheetSound = !sheetSound;
    syncSound();
    if (sheetSound) { playing = true; play(); }
  }, options);
  volume.addEventListener('input', () => {
    const level = Number(volume.value) / 100;
    sheetSound = level > 0;
    if (level > 0) sheetVolume = level;
    syncSound();
    if (sheetSound) { playing = true; play(); }
  }, options);
  function loadSheet() {
    const clip = archive.site.indexMedia[sheetIndex];
    video.src = clip.publicPath;
    syncSound();
    if (playing) play();
  }
  function advance() {
    sheetIndex = (sheetIndex + 1) % archive.site.indexMedia.length;
    loadSheet();
  }
  video.addEventListener('ended', advance, options);
  video.addEventListener('timeupdate', () => {
    const end = archive.site.indexMedia[sheetIndex].endTime;
    if (playing && end && video.currentTime >= end) advance();
  }, options);
  motion.addEventListener('change', () => {
    playing = !motion.matches;
    if (playing) play();
    else video.pause();
  }, options);
  loadSheet();
  return () => { controller.abort(); video.pause(); video.removeAttribute('src'); video.load(); };
}

function card(item) {
  return `<a class="archive-card" href="${link(item.id)}"><span>${esc(item.year || "")}</span><b>${esc(item.title)}</b><em>${item.type.map(esc).join(" / ")}</em></a>`;
}

function media(block) {
  const item = asset(block.asset);
  const cls = block.layout === "diagram" ? "diagram" : "image-field";
  return `<section class="${cls}"><figure class="${block.layout === "full" ? "full-figure" : ""}"><img src="${item.publicPath}" alt="${esc(item.alt)}" loading="lazy" /><figcaption>${esc(block.caption)}</figcaption></figure></section>`;
}

function apparatus(block) {
  const panels = [block.overview, ...block.states];
  return `<section class="apparatus" data-apparatus aria-labelledby="${block.id}-title">
    <header class="apparatus-heading"><div><h2 id="${block.id}-title">${esc(block.title)}</h2><p id="${block.id}-help"><span class="apparatus-pointer-help">Hover to trace. Select to stay.</span><span class="apparatus-touch-help">Select an element. Details appear below.</span></p></div><button class="apparatus-reset" type="button" aria-pressed="true">whole apparatus</button></header>
    <div class="apparatus-layout"><div class="apparatus-field"><div class="apparatus-nodes">${block.nodes.map((node, i) => `<button class="apparatus-node" type="button" data-node="${node.id}" data-detail="${node.detail}" aria-label="${esc(node.label)}" aria-controls="${block.id}-${node.detail}" aria-describedby="${block.id}-help" aria-pressed="false"><img src="${asset(node.asset).publicPath}" alt="" loading="lazy" /><span><small aria-hidden="true">[${String(i).padStart(2, '0')}]</small>${esc(node.label)}</span></button>`).join('')}</div><p class="apparatus-route">${esc(block.path)}</p></div>
    <div class="apparatus-inspector">${panels.map(panel => `<section id="${block.id}-${panel.id}" data-apparatus-panel="${panel.id}" data-nodes="${(panel.nodes || []).join(' ')}" ${panel.id !== 'overview' ? 'hidden' : ''} aria-labelledby="${block.id}-${panel.id}-title"><h3 id="${block.id}-${panel.id}-title">${esc(panel.title)}</h3><p>${esc(panel.text)}</p>${panel.media.map(detailMedia).join('')}</section>`).join('')}</div></div><p class="screen-reader-only" role="status" aria-live="polite"></p></section>`;
}

function detailMedia(media) {
  if (media.type === 'strip') return `<div class="gesture-strip">${media.assets.map((id, i) => `<figure><a href="${asset(id).publicPath}" target="_blank" rel="noopener" aria-label="Open ${esc(media.captions[i])} position at full size"><img src="${asset(id).publicPath}" alt="${esc(asset(id).alt)}" loading="lazy" /></a><figcaption>${esc(media.captions[i])}</figcaption></figure>`).join('')}</div>`;
  const item = asset(media.asset);
  return `<figure>${media.type === 'video' ? `<video controls playsinline preload="none" aria-label="${esc(media.caption)}" ${item.poster ? `poster="${asset(item.poster).publicPath}"` : ''}><source src="${item.publicPath}" type="video/mp4" /></video>` : `<a class="apparatus-enlarge" href="${item.publicPath}" target="_blank" rel="noopener" aria-label="Open ${esc(media.caption)} at full size"><img src="${item.publicPath}" alt="${esc(item.alt)}" loading="lazy" /></a>`}<figcaption>${esc(media.caption)}</figcaption></figure>`;
}

function block(block) {
  if (block.type === "apparatus") return apparatus(block);
  if (block.type === "text") return `<section class="entry-text"><h2>${esc(block.title)}</h2><div>${block.paragraphs.map(text => `<p>${esc(text)}</p>`).join("")}</div></section>`;
  if (block.type === "media") return media(block);
  if (block.type === "mediaPair") return `<section class="image-field"><div class="side-by-side">${block.assets.map((id, i) => { const item = asset(id); return `<figure class="${i ? "offset" : ""}"><img src="${item.publicPath}" alt="${esc(item.alt)}" /><figcaption>${esc(block.captions[i])}</figcaption></figure>`; }).join("")}</div></section>`;
  if (block.type === "sequence") return `<section class="sequence"><p class="eyebrow">The apparatus is part of the composition</p><h2>${block.title}</h2><ol>${block.items.map(([title, text], i) => `<li><span>0${i + 1}</span><p><b>${esc(title)}</b><br />${esc(text)}</p></li>`).join("")}</ol></section>`;
  if (block.type === "video") { const item = asset(block.asset); return `<section class="process-film ${block.layout === "wide" ? "film-wide" : ""}"><div><h2>${esc(block.title)}</h2><p>${esc(block.body)}</p></div><figure><video controls playsinline preload="none" aria-label="${esc(block.title)}" ${item.poster ? `poster="${asset(item.poster).publicPath}"` : ""}><source src="${item.publicPath}" type="video/mp4" />Your browser does not support this video.</video>${block.caption ? `<figcaption>${esc(block.caption)}</figcaption>` : ""}</figure></section>`; }
  if (block.type === "quote") return `<section class="research"><p class="eyebrow">Research fragment</p><blockquote>${esc(block.text)}</blockquote><p class="citation">${esc(block.cite)}</p></section>`;
  return "";
}

function related(item) {
  const items = item.related.map(entry).filter(Boolean);
  if (!items.length) return `<nav class="entry-return"><a href="#archive">All projects →</a></nav>`;
  return `<section class="archive" id="archive"><h2>Elsewhere</h2><div class="archive-links">${items.map((other, i) => `<a href="${link(other.id)}"><span>0${i + 1}</span><b>${esc(other.title)}</b><em>${esc(item.connections?.[other.id] || other.tags.slice(0, 3).join(" / "))}</em></a>`).join("")}</div><a class="all-projects" href="#archive">All projects →</a></section>`;
}

function entryPage(item) {
  if (item.cover) {
    const cover = asset(item.cover);
    return `<article class="composed-entry"><header class="entry-heading"><h1>${esc(item.title)}</h1><p>${esc(item.subtitle || "")}<span>${esc(item.year || "")}</span></p></header><figure class="entry-cover"><img src="${cover.publicPath}" alt="${esc(cover.alt)}" fetchpriority="high" /></figure>${(item.blocks || []).map(block).join("")}${related(item)}</article>`;
  }
  return `<section class="project-intro"><div class="project-meta">${item.year ? `<span>${esc(item.year)}</span>` : ""}<span>${item.type.map(esc).join(" / ")}</span></div><div class="project-heading"><h1>${esc(item.title).replace(" ", "<br /><i>")}${item.title.includes(" ") ? "</i>" : ""}</h1></div><div class="project-statement"><p>${esc(item.orientation)}</p>${item.statement ? `<p class="small">${esc(item.statement)}</p>` : ""}</div></section>${(item.blocks || []).map(block).join("")}${related(item)}`;
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
  stopSheets();
  stopProjectFlow();
  stopRegistration();
  stopApparatus();
  main.innerHTML = current ? entryPage(current) : route === "archive"
    ? `<section class="index-ledger" id="archive"><h1>Archive</h1>${archive.entries.map(card).join("")}</section>`
    : route === "about" ? `<section class="index-ledger"><h1>Danny Clarke / Subsense</h1></section>` : index();
  document.title = current ? `Subsense — ${current.title}` : "Subsense";
  document.querySelector("#masthead").classList.toggle("on-paper", !isHome);
  document.body.classList.toggle("home", isHome);
  document.querySelector("footer").hidden = isHome;
  stopSheets = isHome ? startSheets() : () => {};
  stopProjectFlow = isHome ? startProjectFlow() : () => {};
  stopRegistration = isHome ? startRegistration(main.querySelector('.threshold')) : () => {};
  stopApparatus = current ? startApparatus(main) : () => {};
  main.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}
window.addEventListener("hashchange", render);
render();
