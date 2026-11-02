# Publishing articles

The website is static and stays compatible with its existing GitHub Pages hosting. Run `node scripts/build-writing.mjs` after changing article content or the catalogue, and commit the generated pages alongside the source. No package installation is needed.

## Choose the section

“Articles & Commentary” contains independent writing published on this website or the author's own channels, such as LinkedIn or Medium. “In the Media” contains all articles published by media outlets, including authored Conversation pieces, as well as interviews, quotations and reporting about the author's work. Apply this distinction consistently to new and older entries. A Medium republication of an existing website article stays attached to its existing entry.

## Add an original article

1. Write the article in `content/articles/your-article-slug.md`. Supported Markdown: paragraphs separated by blank lines, `## Section headings`, `[link text](https://example.com)`, `**bold**` and `*italic*`. Raw HTML is escaped. Other block types produce a build error instead of silently rendering incorrectly.
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

## Shared layout and styles

`templates/page.html` controls article and archive navigation, metadata and the footer. `assets/writing.css` holds their responsive styles; `assets/writing.js` supplies article copy-link behaviour. Rebuild after changing the template or these assets. The builder adds a content-based version to writing asset URLs so visitors receive updated styles and scripts without a hard refresh. The other existing portfolio pages retain their own HTML.
