# Indrajith V Iyer — Portfolio

A clean, modular, JSON-driven personal portfolio. No frameworks, no build step, no database.

---

## 🚀 Quick Start

**You must run a local server** (browsers block `fetch()` on `file://` URLs).

```bash
# Option 1 — Python (easiest, already installed on most machines)
cd portfolio/
python3 -m http.server 8000
# Visit: http://localhost:8000

# Option 2 — Node.js / npx
npx serve .

# Option 3 — VS Code
# Install the "Live Server" extension, right-click index.html → Open with Live Server
```

---

## 📁 Folder Structure

```
portfolio/
├── index.html                  ← Homepage
├── assets/
│   ├── avatar.webp             ← Your profile photo
│   └── Indra_resume.pdf        ← CV download
├── css/
│   ├── tokens.css              ← Design tokens (colors, fonts, spacing)
│   ├── base.css                ← Reset + layout utilities
│   ├── nav.css                 ← Header, nav, dropdown, mobile nav
│   ├── components.css          ← Cards, badges, timeline, footer, prose
│   └── pages.css               ← Page-specific layouts (hero, blog, etc.)
├── js/
│   ├── utils.js                ← Shared helpers (fetch, date, markdown)
│   ├── nav.js                  ← Navigation builder (reads site.json)
│   ├── home.js                 ← Homepage logic
│   ├── blog.js                 ← Blog listing + filtering
│   ├── post.js                 ← Single post reader
│   ├── projects.js             ← Projects listing
│   └── career.js               ← Career timeline
├── data/                       ← ✏️ YOUR CMS — edit these files
│   ├── site.json               ← Name, tagline, social links, nav config
│   ├── career.json             ← Work history, education
│   ├── projects.json           ← Projects and builds
│   └── blogs/
│       └── posts.json          ← All blog posts (Finance, Sports, Books)
└── pages/
    ├── about.html
    ├── career.html
    ├── projects.html
    └── blog/
        ├── index.html          ← All posts
        ├── finance.html        ← Finance category
        ├── sports.html         ← Sports category
        ├── books.html          ← Books category
        └── post.html           ← Single post reader
```

---

## ✏️ How to Edit Content (Your CMS)

### Change your name, tagline, social links
→ Edit `data/site.json`

### Add a blog post
→ Open `data/blogs/posts.json` and add a new object:

```json
{
  "id": "fin-004",
  "slug": "my-new-post",
  "category": "finance",         // "finance" | "sports" | "books"
  "title": "My Post Title",
  "excerpt": "One-paragraph teaser shown on listing pages.",
  "content": "Full markdown content here.\n\n## Subheading\n\nParagraph text with **bold** and *italic*.",
  "date": "2025-03-01",
  "readTime": "5 min",
  "featured": false,             // true = shows in homepage featured section
  "emoji": "💡",
  "tags": ["tag1", "tag2"]
}
```

**Content supports basic Markdown:** `## headings`, `**bold**`, `*italic*`, `> blockquote`, `` `code` ``, `- lists`, `[links](url)`

### Add a project
→ Open `data/projects.json` and add a new object:

```json
{
  "id": "proj-007",
  "slug": "my-project",
  "title": "Project Name",
  "tagline": "One-line description",
  "description": "Longer description for the card.",
  "emoji": "🔧",
  "tags": ["Python", "BigQuery"],
  "status": "live",              // "live" | "wip" | "idea"
  "links": { "demo": "https://...", "github": "https://..." },
  "featured": true,              // true = shows on homepage
  "year": "2025"
}
```

### Edit career history
→ Open `data/career.json` and edit/add timeline entries.

---

## 🎨 Change the Design

All visual tokens (colors, fonts, spacing) live in one place:

**`css/tokens.css`** — edit the `:root` variables:

```css
--color-accent:   #C8892A;   /* Main amber gold  */
--color-bg:       #FAFAF7;   /* Background       */
--font-display:   'Playfair Display', serif;
```

Change `--color-accent` to instantly retheme the entire site.

---

## 🌐 Deployment

### GitHub Pages
1. Push the folder to a GitHub repo
2. Go to Settings → Pages → Source: `main` branch, root `/`
3. Done — no build step required

### Netlify / Vercel
1. Drag and drop the folder at netlify.com/drop
2. Or connect your GitHub repo — it auto-detects a static site

### Any static host
Upload the folder as-is. It's pure HTML/CSS/JS.

---

## 📝 Notes

- **Must use a local server** — `fetch()` doesn't work on `file://` URLs
- No npm, no webpack, no React — just files
- All pages are self-contained HTML that load shared CSS/JS via relative paths
- Navigation and footer are built dynamically from `data/site.json` so you only edit one place
