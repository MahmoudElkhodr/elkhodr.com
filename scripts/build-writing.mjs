// Build the writing archive and article pages with Node.js. No packages required.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = 'https://elkhodr.com';
const catalogue = JSON.parse(fs.readFileSync(path.join(root, 'content/writing.json'), 'utf8'));
const template = fs.readFileSync(path.join(root, 'templates/page.html'), 'utf8');
const assetVersion = createHash('sha256')
  .update(fs.readFileSync(path.join(root,'assets/writing.css')))
  .update(fs.readFileSync(path.join(root,'assets/writing.js')))
  .digest('hex').slice(0,12);
const checkOnly = process.argv.includes('--check');
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const localUrl = item => item.body ? `articles/${item.slug}/` : null;
const url = item => localUrl(item) || item.url;
const absoluteUrl = item => item.body ? `${site}/${localUrl(item)}` : item.url;
const jsonLd = value => `<script type="application/ld+json">${JSON.stringify(value).replaceAll('<', '\\u003c')}</script>`;
const external = (href, label, className = '') => `<a class="${className}" href="${escape(href)}" target="_blank" rel="noopener noreferrer">${escape(label)} <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>`;
const topicLabels = item => item.topics.map(escape).join(' · ');
const readLink = (item, prefix = '') => item.body
  ? `<a class="text-link" href="${prefix}${localUrl(item)}">Read article <span aria-hidden="true">→</span></a>`
  : external(item.url, `Read at ${item.publisher}`, 'text-link');
const originLabel = item => item.firstPublished ? `First published in ${item.firstPublished}` : item.origin === 'site' ? 'Published on elkhodr.com' : `Originally published on ${item.publisher}`;

const ids = new Set();
const slugs = new Set();
for (const item of [...catalogue.articles, ...catalogue.coverage]) {
  if (!item.id || ids.has(item.id)) throw new Error(`Missing or duplicate id: ${item.id}`);
  ids.add(item.id);
  for (const key of ['title','summary','publisher','dateLabel','sortDate']) if (!item[key]) throw new Error(`${item.id}: missing ${key}`);
  if (item.videoId && !/^[A-Za-z0-9_-]{11}$/.test(item.videoId)) throw new Error(`${item.id}: invalid YouTube id`);
  if (!Array.isArray(item.topics) || !item.topics.length) throw new Error(`${item.id}: topics required`);
  if (item.kind !== undefined && item.kind !== 'research') throw new Error(`${item.id}: unknown kind`);
  if (item.firstPublished !== undefined && (typeof item.firstPublished !== 'string' || item.firstPublished.length > 120)) throw new Error(`${item.id}: invalid firstPublished`);
  if (item.featured !== undefined && (item.featured !== true || !/^https:\/\//.test(item.url || ''))) throw new Error(`${item.id}: featured must be true and the item needs an HTTPS url`);
  if (item.linkLabel !== undefined && (typeof item.linkLabel !== 'string' || item.linkLabel.length > 60)) throw new Error(`${item.id}: invalid linkLabel`);
  if (item.longSummary !== undefined) {
    const words = item.longSummary.trim().split(/\s+/).length;
    if (words < 30 || words > 250) throw new Error(`${item.id}: longSummary must be 30 to 250 words (found ${words})`);
    if (item.longSummary.includes('\u2014')) throw new Error(`${item.id}: longSummary must not contain em dashes`);
  }
  for (const link of item.related || []) {
    if (!link.label || !link.url) throw new Error(`${item.id}: related links need label and url`);
    if (!/^https:\/\//.test(link.url) && !/^(?:[a-z0-9-]+\.html|#broadcast-[a-z0-9-]+)$/.test(link.url)) throw new Error(`${item.id}: related link must be HTTPS, a site page or a broadcast anchor`);
  }
  for (const href of [item.url,item.originalUrl,item.mediumUrl,item.doi,...(item.coverage || []).map(x=>x.url)].filter(Boolean)) {
    if (new URL(href).protocol !== 'https:') throw new Error(`${item.id}: HTTPS URL required`);
  }
}
for (const item of catalogue.articles) {
  if (!['site','external'].includes(item.origin)) throw new Error(`${item.id}: invalid origin`);
  if (!item.body && !item.url) throw new Error(`${item.id}: article destination missing`);
  if (item.body && (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) || !/^\d{4}-\d{2}-\d{2}$/.test(item.date))) throw new Error(`${item.id}: valid slug and publication date required`);
  if (item.body && slugs.has(item.slug)) throw new Error(`${item.id}: duplicate article slug`);
  if (item.body) slugs.add(item.slug);
  if (item.body && item.origin === 'external' && !item.originalUrl) throw new Error(`${item.id}: republications need originalUrl`);
}
const articles = catalogue.articles.toSorted((a,b)=>b.sortDate.localeCompare(a.sortDate));
const coverage = catalogue.coverage.toSorted((a,b)=>b.sortDate.localeCompare(a.sortDate));
const broadcasts = catalogue.broadcasts || [];
for (const item of broadcasts) {
  if (!/^[a-z0-9-]+$/.test(item.id) || ids.has(item.id)) throw new Error('Invalid or duplicate broadcast id');
  ids.add(item.id);
  if (!['youtube','audio'].includes(item.type)) throw new Error('Unsupported broadcast type');
  if (item.type==='youtube' && !/^[A-Za-z0-9_-]{11}$/.test(item.videoId)) throw new Error('Invalid YouTube id');
  for (const href of [item.url,item.audioUrl].filter(Boolean)) if(new URL(href).protocol!=='https:') throw new Error('Broadcast URLs must use HTTPS');
}
for (const item of coverage) if(item.broadcastId && !broadcasts.some(b=>b.id===item.broadcastId)) throw new Error('Missing broadcast destination');
const outputs = new Map();
function renderPage(fields) {
  const replacements = {OG_IMAGE:`${site}/photo.png`, HOME:fields.ROOT || './', ...fields, WRITING_ASSET_VERSION:assetVersion};
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    if (!(key in replacements)) throw new Error(`Missing template field ${key}`);
    return replacements[key];
  });
}
function extraCoverage(item) {
  if (!item.coverage?.length) return '';
  return `<details class="further-coverage"><summary>Further coverage</summary><ul>${item.coverage.map(link=>`<li>${external(link.url,link.label)}</li>`).join('')}</ul>${item.coverageNote?`<p>${escape(item.coverageNote)}</p>`:''}</details>`;
}
const shortPublisher = item => item.publisher.split(/ [—·] /)[0];
const relatedLinks = item => (item.related || []).map(link => /^https:/.test(link.url)
  ? external(link.url, link.label, 'text-link')
  : `<a class="text-link" href="${escape(link.url)}">${escape(link.label)} <span aria-hidden="true">→</span></a>`).join('');
const primaryLink = item => item.body
  ? `<a class="text-link" href="${localUrl(item)}">Read the article <span aria-hidden="true">→</span></a>`
  : external(item.url, item.linkLabel || (item.kind === 'research' ? 'Read the paper' : `Read at ${shortPublisher(item)}`), 'text-link');
const kicker = item => item.kind === 'research' ? `Peer-reviewed paper · ${item.publisher}` : catalogue.articles.includes(item) ? originLabel(item) : item.publisher;
const itemTitle = item => item.body
  ? `<a href="${localUrl(item)}">${escape(item.title)}</a>`
  : `<a href="${escape(item.url)}" target="_blank" rel="noopener noreferrer">${escape(item.title)}<span class="sr-only"> (opens in a new tab)</span></a>`;
const ownSite = item => item.origin === 'site';
const dateText = item => item.dateLabel === 'Date not stated' || ownSite(item) ? '' : escape(item.dateLabel);
const linksRow = item => `<div class="hub-links">${primaryLink(item)}${item.body && item.originalUrl ? external(item.originalUrl,'View original','text-link') : ''}${item.doi ? external(item.doi,'DOI','text-link') : ''}${relatedLinks(item)}</div>`;
function leadMarkup(item) {
  const media = item.image ? `<a class="hub-lead-media" href="${escape(url(item))}" tabindex="-1" aria-hidden="true"><img src="${escape(item.image)}" alt="" width="1200" height="630"></a>` : '';
  return `<section class="hub-lead${item.image ? '' : ' hub-lead-text'}" aria-label="Latest">${media}<div class="hub-lead-copy"><span class="hub-kicker"><b>Latest</b> · ${escape(item.dateLabel)}</span><h2>${itemTitle(item)}</h2><p>${escape(item.summary)}</p>${linksRow({ ...item, related: (item.related || []).slice(0, 2) })}${extraCoverage(item)}</div></section>`;
}
function entryMarkup(item) {
  const anchor = catalogue.articles.includes(item) ? `entry-${item.id}` : `media-${item.id}`;
  if (item.longSummary || item.body) {
    return `<article class="hub-entry" id="${escape(anchor)}"><time>${dateText(item)}</time><div><span class="hub-kicker"><b>${escape(kicker(item))}</b></span><h3>${itemTitle(item)}</h3><p>${escape(item.longSummary || item.summary)}</p>${linksRow(item)}${extraCoverage(item)}</div></article>`;
  }
  return `<article class="hub-compact" id="${escape(anchor)}"><time>${dateText(item)}</time><div><span class="hub-kicker"><b>${escape(kicker(item))}</b></span><h3>${itemTitle(item)}</h3><p>${escape(item.summary)}</p>${item.doi ? `<div class="hub-links">${external(item.doi,'DOI','text-link')}</div>` : ''}${extraCoverage(item)}</div></article>`;
}
const videoEmbed = (videoId, title) => `<div class="broadcast-video"><iframe src="https://www.youtube.com/embed/${videoId}?rel=0" title="${escape(title)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
const broadcastMarkup = broadcasts.map(item=>`<article class="broadcast-card broadcast-${item.type}" id="broadcast-${item.id}"><div class="broadcast-label">${escape(item.publisher)} · ${item.type==='audio'?'Radio interview':'TV interview'}</div>${item.type==='youtube'?`<div class="broadcast-video"><iframe src="https://www.youtube.com/embed/${item.videoId}?rel=0" title="${escape(item.publisher+': '+item.title)}" loading="eager" referrerpolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe></div>`:''}<h3>${escape(item.title)}</h3><p>${escape(item.summary)}</p><div class="broadcast-meta">${escape(item.dateLabel)} · ${escape(item.duration)}</div>${item.type==='audio'?`<audio controls preload="none" aria-label="${escape(item.publisher+': '+item.title)}"><source src="${escape(item.audioUrl)}" type="audio/mpeg">Your browser does not support audio playback.</audio><p class="audio-error" data-audio-error hidden>Audio unavailable here.${item.url?' Please use the original ABC player below.':''}</p>`:''}${item.url?external(item.url,item.type==='audio'?'Original interview on ABC':'Watch on YouTube','text-link'):''}</article>`).join('\n');
const BAND_AFTER = 2; // number of entries after the lead before the Watch & Listen band
const bandMarkup = `<section class="hub-band" aria-labelledby="broadcasts-title"><h2 class="hub-band-title" id="broadcasts-title">Watch &amp; listen</h2><div class="hub-band-grid">${broadcastMarkup}</div></section>`;
// Within each year, articles hosted on elkhodr.com follow the externally published items and show no date,
// so independent coverage leads the page and the lead story is never an own-site article.
const listed = [...articles, ...coverage].filter(item => !item.broadcastId).toSorted((a,b)=>
  b.sortDate.slice(0,4).localeCompare(a.sortDate.slice(0,4)) || Number(ownSite(a)) - Number(ownSite(b)) || b.sortDate.localeCompare(a.sortDate));
const [lead, ...rest] = listed;
// "Selected recent contributions": a curated, newest-first list of editorial venues, opened in a new tab beside the lead.
const featuredMarkup = (() => {
  const picks = listed.filter(item => item.featured).slice(0, 6);
  if (!picks.length) return '';
  return `<aside class="hub-featured" aria-labelledby="featured-title"><h2 id="featured-title">Selected recent contributions</h2><ul>${picks.map(item => `<li><a href="${escape(item.url)}" target="_blank" rel="noopener noreferrer"><span class="hub-featured-venue">${escape(item.publisher.replace(' \u2014 ', ' \u00b7 '))}</span><span class="hub-featured-title">${escape(item.title)}</span><span class="hub-featured-date">${escape(item.dateLabel)} <span aria-hidden="true">\u2197</span></span><span class="sr-only"> (opens in a new tab)</span></a></li>`).join('')}</ul></aside>`;
})();
let stream = '';
let lastYear = null;
let placed = false;
rest.forEach((item, index) => {
  const year = item.sortDate.slice(0,4);
  if (year !== lastYear) {
    const note = (catalogue.yearNotes || []).find(n => n.after === lastYear && n.before === year);
    if (note) stream += `<div class="hub-gap"><h2 class="hub-year">${escape(note.heading)}</h2><p>${escape(note.text)} <a class="text-link" href="${escape(note.url)}">${escape(note.linkLabel)} <span aria-hidden="true">→</span></a></p></div>`;
    stream += `<h2 class="hub-year" id="year-${year}">${year}</h2>`;
    lastYear = year;
  }
  stream += entryMarkup(item);
  if (index + 1 === BAND_AFTER) { stream += bandMarkup; placed = true; }
});
if (!placed) stream += bandMarkup;
const yearsShown = [...new Set(rest.map(item => item.sortDate.slice(0,4)))];
// The two oldest years share one pill (it jumps to the newer of them), so sparse early years take no room.
const yearPills = yearsShown.length > 2
  ? [...yearsShown.slice(0, -2).map(y => ({ to: y, label: y })), { to: yearsShown.at(-2), label: `${yearsShown.at(-2)}\u2013${yearsShown.at(-1)}` }]
  : yearsShown.map(y => ({ to: y, label: y }));
const yearStrip = `<nav class="hub-years" aria-label="Jump to a year"><span class="hub-years-label">Jump to</span>${yearPills.map(p => `<a href="#year-${p.to}">${p.label}</a>`).join('')}<a class="hub-years-extra" href="#broadcasts-title">Interviews</a></nav>`;
const hub = `<main id="main">
<header class="writing-intro w"><h1>Writing &amp; Media</h1><p>Articles, commentary and interviews on cybersecurity, privacy, blockchain and AI in education.</p></header>
<div class="hub w"><div class="hub-top">${leadMarkup(lead)}${featuredMarkup}</div>${yearStrip}${stream}</div>
<aside class="writing-contact w"><p>Looking for an expert perspective on technology, security or AI in education?</p><div class="writing-contact-links"><a class="text-link" href="contact.html">Get in touch <span aria-hidden="true">→</span></a><a class="text-link" href="feed.xml">RSS feed <span aria-hidden="true">↗</span></a></div></aside>
</main>`;
outputs.set('media.html', renderPage({TITLE:'Writing &amp; Media | Dr Mahmoud Elkhodr',DESCRIPTION:'Articles, explainers and commentary by Dr Mahmoud Elkhodr on cybersecurity, privacy, blockchain and AI in education, plus interviews and media coverage.',CANONICAL:`${site}/media.html`,OG_TYPE:'website',ROOT:'',HEAD:jsonLd({'@context':'https://schema.org','@type':'CollectionPage',name:'Writing & Media',url:`${site}/media.html`,mainEntity:{'@type':'ItemList',itemListElement:articles.map((item,i)=>({'@type':'ListItem',position:i+1,name:item.title,url:absoluteUrl(item)}))}}),BODY_CLASS:'writing-hub',CONTENT:hub}));

// Deliberately small Markdown surface: paragraphs, ## headings, links and emphasis.
// Raw HTML is escaped; protocols and heading identifiers are validated.
function inline(markdown) {
  return markdown.split(/(\[[^\]]+\]\(https:\/\/[^\s)]+\))/g).map(token=>{
    const link = token.match(/^\[([^\]]+)\]\((https:\/\/[^\s)]+)\)$/);
    if (link) return `<a href="${escape(link[2])}">${escape(link[1])}</a>`;
    return escape(token).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>');
  }).join('');
}
function renderMarkdown(markdown) {
  const headings = [];
  const used = new Set();
  const html = markdown.trim().split(/\r?\n\s*\r?\n/).map(block=>{
    const heading = block.match(/^## (.+)$/);
    if (heading) {
      const id = heading[1].toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      if (!id || used.has(id)) throw new Error('Article headings need unique identifiers');
      used.add(id); headings.push({id,title:heading[1]});
      return `<h2 id="${id}">${inline(heading[1])}</h2>`;
    }
    const figure = block.match(/^!\[([^\]]+)\]\((assets\/[A-Za-z0-9._\/-]+)(?: "([^"]+)")?\)$/);
    if (figure) {
      const [, alt, src, caption] = figure;
      if (!fs.existsSync(path.join(root, src))) throw new Error(`Missing article image ${src}`);
      return `<figure class="article-figure"><a href="../../${escape(src)}"><img src="../../${escape(src)}" alt="${escape(alt)}" loading="lazy"></a>${caption?`<figcaption>${inline(caption)}</figcaption>`:''}</figure>`;
    }
    if (/^(?:#|[-*] |\d+\. |>|```|!\[)/m.test(block)) throw new Error('Unsupported Markdown block; see WRITING.md');
    return `<p>${inline(block.replace(/\r?\n/g,' '))}</p>`;
  }).join('\n');
  return { html, headings };
}
for (const item of articles.filter(x=>x.body)) {
  const bodyPath = path.resolve(root, 'content', item.body);
  const bodyRoot = path.join(root,'content','articles') + path.sep;
  if (!bodyPath.startsWith(bodyRoot)) throw new Error('Article body must be inside content/articles');
  const markdown = fs.readFileSync(bodyPath, 'utf8');
  const {html,headings} = renderMarkdown(markdown);
  const minutes = Math.max(1,Math.ceil(markdown.split(/\s+/).length/220));
  const canonical = item.origin==='external'?item.originalUrl:absoluteUrl(item);
  const original = item.origin==='external'?`Originally published in ${escape(item.publisher)}. ${external(item.originalUrl,'Read the original')}.`:(item.firstPublished?`First published in ${escape(item.firstPublished)}.`:'First published on elkhodr.com.');
  const content = `<main id="main"><article class="longform"><header class="article-header w"><a class="back-link" href="../../media.html#articles"><span aria-hidden="true">←</span> Articles &amp; Commentary</a><div class="article-kicker"><span class="topic-label">${topicLabels(item)}</span><span class="publisher-label publisher-local">${item.origin==='site'?'Original article':'Republished article'}</span></div><h1>${escape(item.title)}</h1><p class="article-deck">${escape(item.summary)}</p><div class="article-byline"><img src="../../photo.png" width="48" height="48" alt=""><div><a href="../../">Dr Mahmoud Elkhodr</a><span>CQUniversity Australia</span></div></div><div class="article-date"><time datetime="${escape(item.date)}">${escape(item.dateLabel)}</time><span>${minutes} min read</span>${item.updated?`<span>Updated <time datetime="${escape(item.updated)}">${escape(item.updatedLabel || item.updated)}</time></span>`:''}</div></header>
<div class="article-layout w"><aside class="article-aside" aria-label="Article contents"><p>In this article</p><ul>${headings.map(h=>`<li><a href="#${h.id}">${escape(h.title)}</a></li>`).join('')}</ul><a class="aside-feed" href="../../feed.xml">Follow via RSS <span aria-hidden="true">↗</span></a></aside><div class="article-body">${html}<div class="article-endnote"><p>${original}${item.mediumUrl?' '+external(item.mediumUrl,'Also available on Medium'):''}</p><div class="article-share"><button type="button" data-copy-link data-url="${escape(absoluteUrl(item))}">Copy article link</button><a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteUrl(item))}" target="_blank" rel="noopener noreferrer">Share on LinkedIn <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a><span data-copy-status role="status" aria-live="polite"></span></div></div><div class="article-author"><h2>About the author</h2><p>Dr Mahmoud Elkhodr is a Senior Lecturer at CQUniversity Australia. His research and teaching span cybersecurity, privacy, blockchain, the Internet of Things and AI in education.</p><a class="text-link" href="../../media.html#articles">Explore more articles <span aria-hidden="true">→</span></a></div></div></div></article></main>`;
  outputs.set(`${localUrl(item)}index.html`,renderPage({TITLE:escape(item.title+' | Dr Mahmoud Elkhodr'),DESCRIPTION:escape(item.summary),CANONICAL:escape(canonical),OG_TYPE:'article',OG_IMAGE:escape(item.image?`${site}/${item.image}`:`${site}/photo.png`),ROOT:'../../',BODY_CLASS:'article-page',CONTENT:content,HEAD:`<meta property="article:published_time" content="${escape(item.date)}T09:00:00+11:00">\n${jsonLd({'@context':'https://schema.org','@type':'Article',headline:item.title,description:item.summary,datePublished:item.date,...(item.updated?{dateModified:item.updated}:{}),mainEntityOfPage:canonical,url:absoluteUrl(item),image:item.image?`${site}/${item.image}`:`${site}/photo.png`,inLanguage:'en-AU',author:{'@type':'Person',name:'Dr Mahmoud Elkhodr',url:site+'/'},publisher:{'@type':'Person',name:'Dr Mahmoud Elkhodr',url:site+'/'},keywords:item.topics.join(', ')})}`}));
}
const originals = articles.filter(x=>x.body && x.origin==='site');
outputs.set('feed.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Articles by Dr Mahmoud Elkhodr</title><link>${site}/media.html</link><description>Original writing on cybersecurity, privacy, blockchain and AI in education.</description><language>en-au</language><atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml"/>${originals.map(item=>`<item><title>${escape(item.title)}</title><link>${absoluteUrl(item)}</link><guid isPermaLink="true">${absoluteUrl(item)}</guid><description>${escape(item.summary)}</description><pubDate>${new Date(item.date+'T09:00:00+11:00').toUTCString()}</pubDate>${item.topics.map(t=>`<category>${escape(t)}</category>`).join('')}</item>`).join('')}</channel></rss>\n`);
const sitemapPath = path.join(root,'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath,'utf8').replace(/\s*<url><loc>https:\/\/elkhodr\.com\/articles\/[^<]+<\/loc>(?:<lastmod>[^<]+<\/lastmod>)?<\/url>/g,'');
sitemap = sitemap.replace('</urlset>',articles.filter(x=>x.body && x.origin==='site').map(item=>`  <url><loc>${absoluteUrl(item)}</loc><lastmod>${item.updated || item.date}</lastmod></url>\n`).join('')+'</urlset>');
outputs.set('sitemap.xml',sitemap);
// Home page: keep a one-line pointer to the newest entry between the markers in index.html.
{
  const home = fs.readFileSync(path.join(root,'index.html'),'utf8');
  const markup = `<p class="hero-latest"><span class="hero-latest-label">Latest</span> <a href="media.html">${escape(shortPublisher(lead))}: ${escape(lead.title)}</a></p>`;
  const next = home.replace(/<!-- latest:start -->[\s\S]*?<!-- latest:end -->/, `<!-- latest:start -->${markup}<!-- latest:end -->`);
  if (next === home && !home.includes(markup)) throw new Error('index.html is missing the latest:start and latest:end markers');
  outputs.set('index.html', next);
}
let stale = false;
for (const [relative,content] of outputs) {
  const target = path.join(root,relative);
  if (checkOnly) {
    if (!fs.existsSync(target) || fs.readFileSync(target,'utf8')!==content) { console.error(`Needs rebuild: ${relative}`); stale=true; }
  } else { fs.mkdirSync(path.dirname(target),{recursive:true}); fs.writeFileSync(target,content); }
}
if (stale) process.exitCode=1;
console.log(`${checkOnly?'Checked':'Built'} ${articles.length} article listings, ${coverage.length} media entries, ${articles.filter(x=>x.body).length} article pages, RSS and sitemap.`);
