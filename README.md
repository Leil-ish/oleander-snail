# leilaanderson.dev — personal brand hub

The site behind **leilaanderson.dev**: a personal hub about how Leila Anderson
thinks — clinical/behavioral depth applied to product work, shown through case
studies, tools, and writing. The audience is product and behavioral-health
industry people, board/licensing contacts, conference organizers, and readers of
her writing.

> Client-facing clinical content (therapy, pricing, framework, legal notices)
> lives on **arc-psychotherapy.com**, a separate project. It is not part of this
> repo.

## Stack

Static HTML/CSS/vanilla JS, deployed via GitHub Pages (`CNAME` → `leilaanderson.dev`).
No build step. Open `index.html` in a browser, or serve locally:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Layout

Single vertical-scroll page (`index.html`), in order:

1. **Routing banner** — dismissible one-liner pointing therapy-seekers to
   arc-psychotherapy.com. Dismiss state is stored in `localStorage`.
2. **Hero** — positioning statement + two case-study teasers.
3. **Process** — the case studies (the core of the site).
4. **Writing** — curated external links (Substack, LinkedIn).
5. **Context** — brief professional background.
6. **Contact** — email + LinkedIn for speaking/board/consulting/collaboration.

## Key files

- `index.html` — all page content and structure.
- `assets/css/site.css` — dark theme + scroll layout.
- `assets/css/fair-pay-calculator.css` — styles for the embedded calculator.
- `assets/js/content.js` — the editable `writing` array + small behaviors
  (banner dismiss, footer year).
- `assets/js/fair-pay-calculator.js` — the self-contained Fair Pay Calculator.

## Adding a case study

Case studies are repeatable HTML blocks in `index.html`. To add one:

1. Copy the `<article class="case">` block marked **CASE STUDY TEMPLATE**.
2. Give it a unique `id` and matching `aria-labelledby`.
3. Fill the four labeled parts, always in this order:
   - `.case__open` — the open question / problem noticed
   - `.case__pattern` — the pattern recognized (a short narrative)
   - `.case__artifact` — what it became (the artifact + why it's built that way)
   - `.case__demonstrates` — one line tying back to the thesis
4. Optionally add a teaser to the hero `.teasers` row linking to the new `id`.

## Adding a writing entry

Edit the `writing` array in `assets/js/content.js` — add an object with
`title`, `blurb`, `url`, and `source`. Newest first. No HTML changes needed.

## Content still marked for final copy

Search `index.html` and `content.js` for `COPY:` comments — these mark scaffolded
placeholder text (positioning sentence, meta tags, professional context, Substack
URL, writing entries) waiting on final copy.

## Credits

Originally based on **Dimension** by [HTML5 UP](https://html5up.net) (CCA 3.0);
rebuilt as a scrolling brand hub.
