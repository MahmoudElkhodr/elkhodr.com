# Publishing articles

The website is static and stays compatible with its existing GitHub Pages hosting. Run `node scripts/build-writing.mjs` after changing article content or the catalogue, and commit the generated pages alongside the source. No package installation is needed.

## Choose the section

“Articles & Commentary” contains independent writing published on this website or the author's own channels, such as LinkedIn or Medium. “In the Media” contains all articles published by media outlets, including authored Conversation pieces, as well as interviews, quotations and reporting about the author's work. Apply this distinction consistently to new and older entries. A Medium republication of an existing website article stays attached to its existing entry.

## Add an original article

1. Write the article in `content/articles/your-article-slug.md`. Supported Markdown: paragraphs separated by blank lines, `## Section headings`, `[link text](https://example.com)`, `**bold**` and `*italic*`. A figure can be added as its own paragraph with `![Alt text](assets/articles/your-article-slug/figure.png "Optional caption")`; the image must exist in the repository. An optional `image` field in the catalogue entry (a repository path such as `assets/articles/your-article-slug/share.png`) sets the social sharing image. Raw HTML is escaped. Other block types produce a build error instead of silently rendering incorrectly.
2. Add an entry to the `articles` array in `content/writing.json`:

```json
{
  "id": "your-article-slug",
  "slug": "your-article-slug",
  "title": "Your article title",
  "summary": "A short description for the archive, search engines and social sharing.",
  "publisher": "elkhodr.com",
  "origin": "site",
  "date": "2026-11-02",
  "dateLabel": "2 November 2026",
  "sortDate": "2026-11-02",
  "topics": ["Cybersecurity"],
  "body": "articles/your-article-slug.md"
}
```

3. Articles are listed newest first using `sortDate`. The first article automatically receives a small “Latest” label. Each article appears once in the archive.
4. Run `node scripts/build-writing.mjs`. This updates `media.html`, the article pages, `feed.xml` and the article entries in `sitemap.xml`. Topics appear as labels beside each article. The complete archive is visible without JavaScript. Search, filtering and pagination are intentionally deferred until the archive needs them.
5. Preview the website, check the article on a phone-sized screen, then commit and publish. Use `node scripts/build-writing.mjs --check` to verify generated files are current without rewriting them.

Each article receives its own permanent address at `/articles/your-article-slug/`. Keep the slug unchanged when editing a published article. For a substantive update, add `updated` (ISO date) and `updatedLabel` (display date); keep the original publication date.

## Link to independent writing on another platform

For independent writing published on the author's own LinkedIn, Medium or other personal channel, add an entry to the articles array with `origin: "external"`, the original `publisher`, `url`, `dateLabel`, `sortDate`, `topics`, `title`, `summary` and a unique `id`. Add media-outlet articles to the coverage array instead. Omit `body`, `slug` and `date` when the full article lives only on the other platform. Preserve the precision of known dates: use just a year in `dateLabel` when the exact day is unknown. `sortDate` only controls order; it is not displayed as a factual publication date.

For an authorised republication of independent writing from another personal platform, also supply a local `body`, `slug`, `date`, and `originalUrl`. The page identifies the original publisher, offers both reading destinations and points its canonical link to the original article. Media-outlet articles remain listed under “In the Media.” Do not copy externally published articles onto the site without the appropriate republication rights.

## Republish an original article on Medium

Publish the website article first, then use Medium's import tool with its public address. Verify that Medium's canonical link points to the website article. Once the Medium post is live, add its URL as `mediumUrl` on the existing catalogue entry and rebuild. The article page gains an “Also available on Medium” link; no duplicate archive entry is created.

## Add media coverage

Add all articles published by media outlets (including authored articles), interviews, quotations, broadcasts and reporting about the author's work to the `coverage` array. Fields: `id`, `title`, `summary`, `publisher`, `url`, `dateLabel`, `sortDate` and `topics`. An optional `doi` preserves a DOI link. Optional `coverage` is an array of `{ "url": "https://…", "label": "Outlet name" }` entries, with a `coverageNote` explaining any reported reach figures. These appear in an expandable “Further coverage” section.

## How the Writing & Media page is laid out

`media.html` is one continuous, newest-first stream built from `articles` and `coverage` together. The newest item becomes the large lead. Entries after it appear under year headings. Interviews (`broadcasts`) appear once, as a band of players after the first two entries following the lead (`BAND_AFTER` in the builder). Coverage entries that carry a `broadcastId` are omitted from the stream because the band already shows them.

An entry is shown in full (a paragraph, the link to the original and related links) when it has a `longSummary`, or when it is an article hosted on this site. Otherwise it appears in the compact list with its short `summary`. Write a `longSummary` for each new article, in the first person, of 30 to 250 words (aim for 100 to 150), as original commentary that adds context rather than a reworded copy of the source. The build fails on em dashes. Add optional `related` links to specific resources, for example `{ "label": "SAGE-R", "url": "https://sage-framework.com/sager.html" }`. A related link may be an HTTPS address, a page on this site such as `sage.html`, or an anchor such as `#broadcast-abc-southern-queensland`. The short `summary` is still required and is used for search snippets, social sharing and the RSS feed.

An entry with `"kind": "research"` (a peer-reviewed paper summarised for readers) is labelled as a paper and its link reads “Read the paper”. Use it sparingly, for research that fills a visible gap or that readers are likely to ask about; the full list stays on the Publications page.

`yearNotes` explains a gap between two year groups, for example `{ "after": "2025", "before": "2021", "heading": "2022 to 2024", "text": "…", "linkLabel": "See my publications", "url": "publications.html" }`. Remove or edit a note when entries are added for the years it covers.

## Shared layout and styles

`templates/page.html` controls article and archive navigation, metadata and the footer. `assets/writing.css` holds their responsive styles; `assets/writing.js` supplies article copy-link behaviour. Rebuild after changing the template or these assets. The builder adds a content-based version to writing asset URLs so visitors receive updated styles and scripts without a hard refresh. The other existing portfolio pages retain their own HTML.

## Video and radio highlights

The `broadcasts` array supplies the Watch & Listen column. Use `type: "youtube"` with a `videoId`, or `type: "audio"` with an HTTPS `audioUrl`; include publisher, title, summary, dateLabel, duration and the original URL. A coverage entry can reference its highlight using `broadcastId`. For historical video kept within the chronological media archive, add `videoId` directly to the coverage entry instead. Label former roles and dates explicitly. Players load without autoplay and retain links to the original source.
