/* ============================================
   BLOG — Listing page + category filter
   ============================================ */

import { fetchJSON, dataRoot, formatDate, categoryBadge, initReveal } from './utils.js';
import { initNav } from './nav.js';

async function init() {
  await initNav();

  const root  = dataRoot();
  const posts = await fetchJSON(root + 'blogs/posts.json');
  if (!posts) {
    showError('Could not load posts. Make sure you are running a local server (not file://).');
    return;
  }

  // Determine active category: from body data-attribute (category pages)
  // or from URL ?category= param (filter clicks)
  const params  = new URLSearchParams(window.location.search);
  const fromParam = params.get('category') || '';
  const fromBody  = document.body.dataset.category || '';
  const active    = fromParam || fromBody || 'all';

  renderHeader(active);
  renderPosts(posts, active);
  bindFilter(posts);
  initReveal();
}

function renderHeader(active) {
  const el = document.getElementById('blog-header-content');
  if (!el) return;

  const meta = {
    all:     { eyebrow: 'All Writing',  title: 'The Blog',        desc: 'Essays on finance, sports, and books. Long-form thinking at an unhurried pace.' },
    finance: { eyebrow: 'Finance',      title: 'Money & Markets', desc: 'Thinking through economics, investing, behavioral finance, and the decisions we make with money.' },
    sports:  { eyebrow: 'Sports',       title: 'Games & Culture', desc: 'What sports reveal about strategy, human nature, and the structures we build around competition.' },
    books:   { eyebrow: 'Books',        title: 'Reading Notes',   desc: 'Reviews, highlights, and the ideas that lodged themselves somewhere useful.' },
  };
  const t = meta[active] || meta.all;

  const categories = [
    { id: 'all',     label: 'All Posts', icon: '📝', cls: '' },
    { id: 'finance', label: 'Finance',   icon: '💹', cls: 'finance' },
    { id: 'sports',  label: 'Sports',    icon: '🏆', cls: 'sports'  },
    { id: 'books',   label: 'Books',     icon: '📚', cls: 'books'   },
  ];

  el.innerHTML = `
    <div class="section-label">${t.eyebrow}</div>
    <h1>${t.title}</h1>
    <p style="color:var(--color-ink-2);max-width:540px;margin-top:var(--space-3);font-size:var(--text-md)">${t.desc}</p>
    <div class="blog-header__category-nav" id="cat-filter">
      ${categories.map(c => `
        <button class="category-pill ${c.cls ? `category-pill--${c.cls}` : ''} ${c.id === active ? 'active' : ''}"
                data-cat="${c.id}">
          ${c.icon} ${c.label}
        </button>
      `).join('')}
    </div>
  `;
}

function renderPosts(posts, category) {
  const el = document.getElementById('posts-grid');
  if (!el) return;

  const filtered = category === 'all'
    ? posts
    : posts.filter(p => p.category === category);

  if (!filtered.length) {
    el.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state__icon">📭</div>
        <div class="empty-state__title">Nothing here yet</div>
        <div class="empty-state__desc">Check back soon — good writing takes time.</div>
      </div>
    `;
    return;
  }

  const [first, ...rest] = filtered;

  el.innerHTML = `
    <a href="post.html?id=${first.id}"
       class="featured-article reveal"
       style="grid-column:1/-1;text-decoration:none;color:inherit">
      <div class="featured-article__image-placeholder">${first.emoji}</div>
      <div class="featured-article__body">
        <div class="featured-article__eyebrow">
          ${categoryBadge(first.category)}&nbsp;&nbsp;${first.readTime} read&nbsp;&nbsp;·&nbsp;&nbsp;${formatDate(first.date)}
        </div>
        <h2 class="featured-article__title">${first.title}</h2>
        <p class="featured-article__excerpt">${first.excerpt}</p>
        <div style="margin-top:var(--space-6)">
          <span class="btn btn--secondary">Read essay →</span>
        </div>
      </div>
    </a>

    ${rest.map((post, i) => `
      <a href="post.html?id=${post.id}"
         class="card reveal reveal--delay-${(i % 3) + 1}">
        <div class="card__image-placeholder">${post.emoji}</div>
        <div class="card__body">
          <div class="card__meta">
            ${categoryBadge(post.category)}
            <span class="card__date">${formatDate(post.date)}</span>
          </div>
          <h3 class="card__title">${post.title}</h3>
          <p class="card__excerpt">${post.excerpt}</p>
          <div class="card__footer">
            <span class="card__read-link">Read more →</span>
            <span class="card__read-time">${post.readTime}</span>
          </div>
        </div>
      </a>
    `).join('')}
  `;
}

function bindFilter(posts) {
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;

    const cat = btn.dataset.cat;

    // Update active pill
    document.querySelectorAll('[data-cat]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Re-render posts
    renderPosts(posts, cat);
    setTimeout(initReveal, 50);
  });
}

function showError(msg) {
  const el = document.getElementById('posts-grid');
  if (el) el.innerHTML = `<div class="error-state" style="grid-column:1/-1">${msg}</div>`;
}

document.addEventListener('DOMContentLoaded', init);
