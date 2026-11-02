// Build the writing archive and article pages with Node.js. No packages required.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = 'https://elkhodr.com';
const catalogue = JSON.parse(fs.readFileSync(path.join(root, 'content/writing.json'), 'utf8'));
const template = fs.readFileSync(path.join(root, 'templates/page.html'), 'utf8');
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
const originLabel = item => item.origin === 'site' ? 'Published on elkhodr.com' : `Originally published in ${item.publisher}`;

const ids = new Set();
const slugs = new Set();
for (const item of [...catalogue.articles, ...catalogue.coverage]) {
  if (!item.id || ids.has(item.id)) throw new Error(`Missing or duplicate id: ${item.id}`);
  ids.add(item.id);
  for (const key of ['title','summary','publisher','dateLabel','sortDate']) if (!item[key]) throw new Error(`${item.id}: missing ${key}`);
  if (!Array.isArray(item.topics) || !item.topics.length) throw new Error(`${item.id}: topics required`);
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
const outputs = new Map();
function renderPage(fields) {
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    if (!(key in fields)) throw new Error(`Missing template field ${key}`);
    return fields[key];
  });
}
function extraCoverage(item) {
  if (!item.coverage?.length) return '';
  return `<details class="further-coverage"><summary>Further coverage</summary><ul>${item.coverage.map(link=>`<li>${external(link.url,link.label)}</li>`).join('')}</ul>${item.coverageNote?`<p>${escape(item.coverageNote)}</p>`:''}</details>`;
}
function articleRow(item) {
  return `<article class="article-row" data-article data-origin="${item.origin}" data-topics="${escape(JSON.stringify(item.topics))}">
  <div class="article-row-meta"><span class="topic-label">${topicLabels(item)}</span><span>${escape(item.dateLabel)}</span></div>
  <div class="article-row-copy"><h3><a href="${escape(url(item))}"${item.body?'':' target="_blank" rel="noopener noreferrer"'}>${escape(item.title)}${item.body?'':'<span class="sr-only"> (opens in a new tab)</span>'}</a></h3><p>${escape(item.summary)}</p>
  <div class="article-row-footer"><span class="publisher-label${item.origin==='site'?' publisher-local':''}">${escape(originLabel(item))}</span>${readLink(item)}${item.body && item.originalUrl?external(item.originalUrl,'View original','text-link'):''}${item.doi?external(item.doi,'DOI','text-link'):''}</div>${extraCoverage(item)}</div>
</article>`;
}
const lead = articles.find(x=>x.featured) || articles[0];
const secondaryArticle = articles.find(x=>x.id!==lead.id);
const secondaryMedia = coverage[0];
const featuredSmall = (item, type) => `<article class="feature-secondary"><span class="eyebrow">${type}</span><p class="feature-source">${escape(item.publisher)} · ${escape(item.dateLabel)}</p><h3><a href="${escape(url(item))}"${item.body?'':' target="_blank" rel="noopener noreferrer"'}>${escape(item.title)}${item.body?'':'<span class="sr-only"> (opens in a new tab)</span>'}</a></h3>${readLink(item)}</article>`;
const topics = [...new Set(articles.flatMap(item=>item.topics))].sort();
const mediaMarkup = coverage.map(item=>`<article class="coverage-item"><div class="coverage-meta"><span>${escape(item.publisher)}</span><span>${escape(item.dateLabel)}</span></div><h3>${external(item.url,item.title)}</h3><p>${escape(item.summary)}</p>${extraCoverage(item)}</article>`).join('\n');
const hub = `<main id="main">
<header class="writing-intro w"><span class="eyebrow">Ideas, explainers & public engagement</span><h1>Writing &amp; Media</h1><p>My articles on cybersecurity, privacy, blockchain and AI in education, alongside interviews and coverage of my work.</p><div class="section-jumps"><a href="#articles">Articles &amp; Commentary <span aria-hidden="true">↓</span></a><a href="#coverage">In the Media <span aria-hidden="true">↓</span></a><a href="feed.xml" class="feed-link">RSS feed <span aria-hidden="true">↗</span></a></div></header>
<section class="featured-section w" aria-labelledby="featured-title"><div class="section-caption"><h2 id="featured-title">Featured</h2><span>Selected writing &amp; coverage</span></div><div class="featured-layout"><article class="feature-lead"><div><span class="feature-badge">${lead.origin==='site'?'Original article':escape(lead.publisher)}</span><p class="feature-source">${topicLabels(lead)} · ${escape(lead.dateLabel)}</p><h3><a href="${escape(url(lead))}"${lead.body?'':' target="_blank" rel="noopener noreferrer"'}>${escape(lead.title)}</a></h3><p class="feature-summary">${escape(lead.summary)}</p></div>${readLink(lead)}</article><div class="featured-side">${secondaryArticle?featuredSmall(secondaryArticle,'Article'):''}${secondaryMedia?featuredSmall(secondaryMedia,'In the media'):''}</div></div></section>
<section class="articles-section w" id="articles" aria-labelledby="articles-title"><div class="section-heading"><div><span class="eyebrow">Writing by Mahmoud Elkhodr</span><h2 id="articles-title">Articles &amp; Commentary</h2><p>Original articles on this site and writing published elsewhere. Each entry identifies its original publisher.</p></div></div>
<div class="archive-tools" data-archive-tools hidden><div class="archive-tabs" role="group" aria-label="Filter articles by original publication"><button type="button" data-origin-filter="all" aria-pressed="true">All articles</button><button type="button" data-origin-filter="site" aria-pressed="false">First published here</button><button type="button" data-origin-filter="external" aria-pressed="false">Published elsewhere</button></div><div class="archive-fields"><div class="search-field"><label for="article-search">Search articles</label><input type="search" id="article-search" placeholder="Search a title, topic or publisher" autocomplete="off" aria-controls="article-list"></div><div class="topic-field"><label for="article-topic">Topic</label><select id="article-topic" aria-controls="article-list"><option value="all">All topics</option>${topics.map(topic=>`<option value="${escape(topic)}">${escape(topic)}</option>`).join('')}</select></div><button type="button" class="reset-filters" data-reset>Reset filters</button></div><p class="result-count" data-result-count role="status" aria-live="polite" aria-atomic="true"></p></div>
<div class="article-list" id="article-list">${articles.map(articleRow).join('\n')}</div><div class="archive-empty" data-empty hidden><h3>No articles found</h3><p>Try another search or choose a different topic.</p><button type="button" class="outline-button" data-reset>Show all articles</button></div><button type="button" class="outline-button load-more" data-load-more hidden>Show more articles</button>
</section>
<section class="media-section" id="coverage" aria-labelledby="coverage-title"><div class="w"><div class="section-heading"><div><span class="eyebrow">Interviews, mentions &amp; reporting</span><h2 id="coverage-title">In the Media</h2><p>Broadcast appearances, expert commentary and reporting about my research and teaching.</p></div></div><div class="coverage-list">${mediaMarkup}</div></div></section>
<aside class="writing-contact w"><p>Looking for an expert perspective on technology, security or AI in education?</p><a class="text-link" href="contact.html">Get in touch <span aria-hidden="true">→</span></a></aside>
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
    if (/^(?:#|[-*] |\d+\. |>|```)/m.test(block)) throw new Error('Unsupported Markdown block; see WRITING.md');
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
  const original = item.origin==='external'?`Originally published in ${escape(item.publisher)}. ${external(item.originalUrl,'Read the original')}.`:'First published on elkhodr.com.';
  const content = `<main id="main"><article class="longform"><header class="article-header w"><a class="back-link" href="../../media.html#articles"><span aria-hidden="true">←</span> Articles &amp; Commentary</a><div class="article-kicker"><span class="topic-label">${topicLabels(item)}</span><span class="publisher-label publisher-local">${item.origin==='site'?'Original article':'Republished article'}</span></div><h1>${escape(item.title)}</h1><p class="article-deck">${escape(item.summary)}</p><div class="article-byline"><img src="../../photo.png" width="48" height="48" alt=""><div><a href="../../index.html">Dr Mahmoud Elkhodr</a><span>CQUniversity Australia</span></div></div><div class="article-date"><time datetime="${escape(item.date)}">${escape(item.dateLabel)}</time><span>${minutes} min read</span>${item.updated?`<span>Updated <time datetime="${escape(item.updated)}">${escape(item.updatedLabel || item.updated)}</time></span>`:''}</div></header>
<div class="article-layout w"><aside class="article-aside" aria-label="Article contents"><p>In this article</p><ul>${headings.map(h=>`<li><a href="#${h.id}">${escape(h.title)}</a></li>`).join('')}</ul><a class="aside-feed" href="../../feed.xml">Follow via RSS <span aria-hidden="true">↗</span></a></aside><div class="article-body">${html}<div class="article-endnote"><p>${original}${item.mediumUrl?' '+external(item.mediumUrl,'Also available on Medium'):''}</p><div class="article-share"><button type="button" data-copy-link data-url="${escape(absoluteUrl(item))}">Copy article link</button><a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteUrl(item))}" target="_blank" rel="noopener noreferrer">Share on LinkedIn <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a><span data-copy-status role="status" aria-live="polite"></span></div></div><div class="article-author"><h2>About the author</h2><p>Dr Mahmoud Elkhodr is a Senior Lecturer at CQUniversity Australia. His research and teaching span cybersecurity, privacy, blockchain, the Internet of Things and AI in education.</p><a class="text-link" href="../../media.html#articles">Explore more articles <span aria-hidden="true">→</span></a></div></div></div></article></main>`;
  outputs.set(`${localUrl(item)}index.html`,renderPage({TITLE:escape(item.title+' | Dr Mahmoud Elkhodr'),DESCRIPTION:escape(item.summary),CANONICAL:escape(canonical),OG_TYPE:'article',ROOT:'../../',BODY_CLASS:'article-page',CONTENT:content,HEAD:`<meta property="article:published_time" content="${escape(item.date)}T09:00:00+11:00">\n${jsonLd({'@context':'https://schema.org','@type':'Article',headline:item.title,description:item.summary,datePublished:item.date,...(item.updated?{dateModified:item.updated}:{}),mainEntityOfPage:canonical,url:absoluteUrl(item),image:`${site}/photo.png`,inLanguage:'en-AU',author:{'@type':'Person',name:'Dr Mahmoud Elkhodr',url:site+'/'},publisher:{'@type':'Person',name:'Dr Mahmoud Elkhodr',url:site+'/'},keywords:item.topics.join(', ')})}`}));
}
const originals = articles.filter(x=>x.body && x.origin==='site');
outputs.set('feed.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Articles by Dr Mahmoud Elkhodr</title><link>${site}/media.html</link><description>Original writing on cybersecurity, privacy, blockchain and AI in education.</description><language>en-au</language><atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml"/>${originals.map(item=>`<item><title>${escape(item.title)}</title><link>${absoluteUrl(item)}</link><guid isPermaLink="true">${absoluteUrl(item)}</guid><description>${escape(item.summary)}</description><pubDate>${new Date(item.date+'T09:00:00+11:00').toUTCString()}</pubDate>${item.topics.map(t=>`<category>${escape(t)}</category>`).join('')}</item>`).join('')}</channel></rss>\n`);
const sitemapPath = path.join(root,'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath,'utf8').replace(/\s*<url><loc>https:\/\/elkhodr\.com\/articles\/[^<]+<\/loc>(?:<lastmod>[^<]+<\/lastmod>)?<\/url>/g,'');
sitemap = sitemap.replace('</urlset>',articles.filter(x=>x.body && x.origin==='site').map(item=>`  <url><loc>${absoluteUrl(item)}</loc><lastmod>${item.updated || item.date}</lastmod></url>\n`).join('')+'</urlset>');
outputs.set('sitemap.xml',sitemap);
let stale = false;
for (const [relative,content] of outputs) {
  const target = path.join(root,relative);
  if (checkOnly) {
    if (!fs.existsSync(target) || fs.readFileSync(target,'utf8')!==content) { console.error(`Needs rebuild: ${relative}`); stale=true; }
  } else { fs.mkdirSync(path.dirname(target),{recursive:true}); fs.writeFileSync(target,content); }
}
if (stale) process.exitCode=1;
console.log(`${checkOnly?'Checked':'Built'} ${articles.length} article listings, ${coverage.length} media entries, ${articles.filter(x=>x.body).length} article pages, RSS and sitemap.`);
