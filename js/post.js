/* ============================================
   POST — Single article reader
   ============================================ */

import { fetchJSON, dataRoot, formatDate, categoryBadge, markdownToHtml, initReveal } from './utils.js';
import { initNav } from './nav.js';

function initProgressBar() {
  const bar = document.createElement('div');
  bar.className = 'reading-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total > 0) bar.style.width = Math.min(100, (window.scrollY / total) * 100) + '%';
  }, { passive: true });
}

async function init() {
  initProgressBar();
  await initNav();

  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');

  if (!postId) { renderError('No post ID specified.'); return; }

  const root  = dataRoot();
  const posts = await fetchJSON(root + 'blogs/posts.json');
  if (!posts)  { renderError('Could not load posts.'); return; }

  const post = posts.find(p => p.id === postId || p.slug === postId);
  if (!post)   { renderError(`Post "${postId}" not found.`); return; }

  document.title = `${post.title} — Indrajith V Iyer`;

  renderHeader(post);
  renderHeroEmoji(post);
  renderBody(post);
  renderRelated(posts, post);
  initReveal();
}

function renderHeader(post) {
  const el = document.getElementById('article-header');
  if (!el) return;
  el.innerHTML = `
    <div class="container container--prose">
      <a href="index.html"
         style="display:inline-flex;align-items:center;gap:6px;
                font-family:var(--font-mono);font-size:var(--text-xs);
                color:var(--color-ink-muted);letter-spacing:.06em;
                text-transform:uppercase;margin-bottom:var(--space-6);
                text-decoration:none;transition:color .15s"
         onmouseover="this.style.color='var(--color-accent)'"
         onmouseout="this.style.color='var(--color-ink-muted)'">
        ← Back to blog
      </a>
      <div class="article-header__meta">
        ${categoryBadge(post.category)}
        <span class="card__date">${formatDate(post.date)}</span>
        <span class="card__read-time">${post.readTime} read</span>
      </div>
      <h1 class="article-header__title">${post.title}</h1>
      ${post.excerpt ? `<p class="article-header__excerpt">${post.excerpt}</p>` : ''}
    </div>
  `;
}

function renderHeroEmoji(post) {
  const el = document.getElementById('article-hero');
  if (!el) return;
  el.innerHTML = `
    <div style="background:linear-gradient(135deg,var(--color-accent-bg) 0%,var(--color-surface-2) 100%);
                height:280px;display:flex;align-items:center;justify-content:center;font-size:5.5rem;">
      ${post.emoji}
    </div>
  `;
}

function renderBody(post) {
  const el = document.getElementById('article-body');
  if (!el) return;

  const bodyHtml = post.content
    ? `<div class="prose">${markdownToHtml(post.content)}</div>`
    : `<div class="prose">
         <p>${post.excerpt}</p>
         <p style="color:var(--color-ink-muted);font-style:italic;border-left:3px solid var(--color-border);padding-left:var(--space-4);margin-top:var(--space-6)">
           Full article coming soon. Add a <code>content</code> field to this post in
           <code>data/blogs/posts.json</code> to publish the full text.
         </p>
       </div>`;

  const tagsHtml = post.tags?.length ? `
    <div style="margin-top:var(--space-10);padding-top:var(--space-6);border-top:1px solid var(--color-border-light)">
      <div class="section-label" style="margin-bottom:var(--space-3)">Tagged</div>
      <div style="display:flex;flex-wrap:wrap;gap:var(--space-2)">
        ${post.tags.map(t => `<span class="badge badge--neutral">${t}</span>`).join('')}
      </div>
    </div>
  ` : '';

  const shareHtml = `
    <div style="margin-top:var(--space-8);padding:var(--space-6);
                background:var(--color-accent-bg);border-radius:var(--radius-lg);
                border:1px solid var(--color-accent-bg-2);text-align:center">
      <p style="font-family:var(--font-display);font-size:var(--text-lg);
                font-weight:700;margin-bottom:var(--space-3)">Enjoyed this essay?</p>
      <p style="color:var(--color-ink-2);font-size:var(--text-sm);margin-bottom:var(--space-5)">
        Share it with someone who'd find it useful.
      </p>
      <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap">
        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}"
           target="_blank" rel="noopener"
           class="btn btn--secondary" style="font-size:var(--text-sm)">Share on X →</a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}"
           target="_blank" rel="noopener"
           class="btn btn--secondary" style="font-size:var(--text-sm)">Share on LinkedIn →</a>
      </div>
    </div>
  `;

  el.innerHTML = bodyHtml + tagsHtml + shareHtml;
}

function renderRelated(posts, current) {
  const el = document.getElementById('related-posts');
  if (!el) return;

  const related = posts
    .filter(p => p.id !== current.id && p.category === current.category)
    .slice(0, 3);

  if (!related.length) { el.style.display = 'none'; return; }

  const catLabel = { finance: 'Finance', sports: 'Sports', books: 'Books' };

  el.innerHTML = `
    <div class="container">
      <div class="section-header section-header--split" style="margin-bottom:var(--space-8)">
        <h3>More from ${catLabel[current.category] || 'the blog'}</h3>
        <a href="index.html?category=${current.category}" class="btn btn--ghost">See all →</a>
      </div>
      <div class="grid grid--3">
        ${related.map((post, i) => `
          <a href="post.html?id=${post.id}" class="card reveal reveal--delay-${i}">
            <div class="card__image-placeholder">${post.emoji}</div>
            <div class="card__body">
              <div class="card__meta">
                ${categoryBadge(post.category)}
                <span class="card__date">${formatDate(post.date)}</span>
              </div>
              <h3 class="card__title">${post.title}</h3>
              <p class="card__excerpt">${post.excerpt}</p>
              <div class="card__footer">
                <span class="card__read-link">Read →</span>
                <span class="card__read-time">${post.readTime}</span>
              </div>
            </div>
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

function renderError(msg) {
  const el = document.getElementById('article-body');
  if (el) el.innerHTML = `
    <div class="empty-state" style="padding:var(--space-24) 0">
      <div class="empty-state__icon">😕</div>
      <div class="empty-state__title">Post not found</div>
      <div class="empty-state__desc">${msg}</div>
      <a href="index.html" class="btn btn--secondary" style="margin-top:var(--space-6)">← Back to blog</a>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', init);
