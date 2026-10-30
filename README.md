# Vee Valentine site

Plain HTML/CSS with one small script (`site.js`, photo viewer only). No trackers, cookies, or third-party requests.
Hosted on GitHub Pages at https://veevalentine.com (`CNAME`).

## Pages
`index.html` (home), `about.html`, `music.html`, `shows.html`, `contact.html`, `privacy.html`, plus `robots.txt` and `sitemap.xml`.
Every page carries its own title, description, canonical URL, and Open Graph tags.

## Assets
- `images/logo-d.webp` is the original wordmark (transparent). Never redraw or recolor it.
- `images/vee-*.jpg` are the original photos. `images/web/` holds the optimized WebP versions the pages use
  (`*-640.webp` for small screens, `*-full.webp` for large/lightbox).
- `images/og-vee-valentine.jpg` is the 1200x630 social-share image.
- Fonts are self-hosted in `fonts/` (Jost and Cormorant Garamond, SIL Open Font License).

## Content rules
- Only confirmed facts. No invented shows, releases, links, or credits.
- **Shows:** replace the empty state in `shows.html` with the commented list template once shows are confirmed.
- **Music / Spotify:** copy the commented release template in `music.html`, fill in verified details, and add
  `frame-src https://open.spotify.com` to that page's Content-Security-Policy meta tag.
- **Mailing list:** "Join the list" currently opens an email to contact@veevalentine.com (it does not collect addresses
  automatically). To connect a provider later, swap the button for the provider's form and allow its URL in `form-action`.
- **Social links:** none are listed because no official profiles have been confirmed. Add them to the footer and Contact page when known.

## Updating
GitHub Pages caches CSS for about 10 minutes. After changing `style.css`, bump the `?v=` number on its link in every page.
