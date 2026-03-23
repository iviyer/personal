/* ============================================
   HOME — Homepage logic
   ============================================ */

import { fetchJSON, dataRoot, rootPath, formatDate, categoryBadge, initReveal } from './utils.js';
import { initNav } from './nav.js';

async function init() {
  await initNav();

  const root = dataRoot();
  const [siteData, postsData, projectsData] = await Promise.all([
    fetchJSON(root + 'site.json'),
    fetchJSON(root + 'blogs/posts.json'),
    fetchJSON(root + 'projects.json'),
  ]);

  if (siteData)     renderHero(siteData);
  if (siteData)     renderCurrently(siteData);
  if (postsData)    renderFeaturedPosts(postsData);
  if (projectsData) renderFeaturedProjects(projectsData);
  renderTicker();
  initReveal();
  initTypewriter();
}

/* ── Hero ─────────────────────────────────── */
function renderHero(data) {
  const { site, hero } = data;
  const el = document.getElementById('hero');
  if (!el) return;

  const imgRoot = rootPath();
  const stats = (hero.stats || []).map(s => `
    <div class="hero__stat-card">
      <div class="hero__stat-num">${s.num}</div>
      <div class="hero__stat-label">${s.label}</div>
    </div>
  `).join('');

  el.innerHTML = `
    <div class="container">
      <div class="hero__inner">

        <div class="hero__copy">
          <div class="hero__eyebrow">${hero.greeting}</div>
          <h1 class="hero__title">${hero.headline}</h1>
          <p class="hero__subtitle">${hero.subheadline}</p>
          <div class="hero__actions">
            <a href="${hero.cta_primary.href}" class="btn btn--primary btn--lg">${hero.cta_primary.text}</a>
            <a href="${hero.cta_secondary.href}" class="btn btn--secondary btn--lg">${hero.cta_secondary.text}</a>
          </div>
          <div class="hero__scroll-hint">
            <span class="hero__scroll-line"></span>
            Scroll to explore
          </div>
        </div>

        <div class="hero__visual">
          <div class="hero__avatar-wrap" style="position:relative;display:inline-block">
            ${site.avatar
              ? `<img src="${imgRoot}${site.avatar}" alt="${site.name}"
                      style="width:clamp(260px,28vw,380px);height:clamp(260px,28vw,380px);
                             border-radius:40% 60% 50% 50%/50% 50% 60% 40%;
                             object-fit:cover;object-position:top center;
                             border:4px solid rgba(255,255,255,0.12);box-shadow:0 24px 64px rgba(0,0,0,.6);
                             display:block;">`
              : `<div class="hero__avatar">✍️</div>`
            }
            <div style="position:absolute;right:-70px;top:50%;transform:translateY(-50%);
                        display:flex;flex-direction:column;gap:12px">
              ${stats}
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

/* ── Currently ────────────────────────────── */
function renderCurrently(data) {
  const el = document.getElementById('currently-section');
  if (!el) return;
  const items = data?.currently?.items;
  if (!items?.length) return;

  el.innerHTML = `
    <div class="currently-block reveal">
      <div class="section-label">Right Now</div>
      <div class="currently-grid">
        ${items.map(item => `
          <div class="currently-item">
            <span class="currently-item__emoji">${item.emoji}</span>
            <div>
              <div class="currently-item__label">${item.label}</div>
              <div class="currently-item__text">${item.text}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ── Typewriter effect ────────────────────── */
function initTypewriter() {
  const el = document.querySelector('.hero__title em');
  if (!el) return;

  const phrases = ['data thinker,', 'behavioral scientist,', 'long-form essayist,', 'product analyst,'];
  let i = 0, charIndex = 0, deleting = false;

  function tick() {
    const current = phrases[i];
    if (!deleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 85);
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        i = (i + 1) % phrases.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, 45);
    }
  }

  // Start after a short delay so page load doesn't feel jarring
  setTimeout(tick, 1800);
}

/* ── Topics ticker ────────────────────────── */
function renderTicker() {
  const el = document.getElementById('topics-ticker');
  if (!el) return;

  const topics = [
    { label: 'Finance',              href: 'pages/blog/finance.html', icon: '💹' },
    { label: 'Sports',               href: 'pages/blog/sports.html',  icon: '🏆' },
    { label: 'Books',                href: 'pages/blog/books.html',   icon: '📚' },
    { label: 'Behavioral Economics', href: 'pages/blog/finance.html', icon: '🧠' },
    { label: 'Football Analytics',   href: 'pages/blog/sports.html',  icon: '⚽' },
    { label: 'Book Reviews',         href: 'pages/blog/books.html',   icon: '📖' },
    { label: 'Data & Product',       href: 'pages/blog/finance.html', icon: '📊' },
    { label: 'Chess & Strategy',     href: 'pages/blog/sports.html',  icon: '♟️' },
    { label: 'Reading Notes',        href: 'pages/blog/books.html',   icon: '🗒️' },
    { label: 'Machine Learning',     href: 'pages/blog/finance.html', icon: '🤖' },
  ];

  const doubled = [...topics, ...topics];
  const items = doubled.map((t, i) => `
    <a class="topics-ticker__item" href="${t.href}">${t.icon} ${t.label}</a>
    ${i < doubled.length - 1 ? '<span class="topics-ticker__sep">·</span>' : ''}
  `).join('');

  el.innerHTML = `<div class="topics-ticker__track">${items}</div>`;
}

/* ── Featured posts ───────────────────────── */
function renderFeaturedPosts(posts) {
  const featured = posts.filter(p => p.featured).slice(0, 4);
  const el = document.getElementById('featured-posts');
  if (!el || !featured.length) return;

  const [first, ...rest] = featured;

  el.innerHTML = `
    <div class="section-label">Latest Writing</div>
    <div class="section-header section-header--split">
      <h2>From the Blog</h2>
      <a href="pages/blog/index.html" class="btn btn--ghost">All posts →</a>
    </div>

    <a href="pages/blog/post.html?id=${first.id}"
       class="featured-article reveal"
       style="display:grid;grid-template-columns:1fr 1fr;text-decoration:none;color:inherit;margin-bottom:var(--space-8)">
      <div class="featured-article__image-placeholder">${first.emoji}</div>
      <div class="featured-article__body">
        <div class="featured-article__eyebrow">
          ${categoryBadge(first.category)}&nbsp;&nbsp;${first.readTime} read
        </div>
        <h3 class="featured-article__title">${first.title}</h3>
        <p class="featured-article__excerpt">${first.excerpt}</p>
        <div style="margin-top:var(--space-6)">
          <span class="btn btn--secondary">Read essay →</span>
        </div>
      </div>
    </a>

    <div class="grid grid--3">
      ${rest.map((post, i) => `
        <a href="pages/blog/post.html?id=${post.id}"
           class="card reveal reveal--delay-${i + 1}"
           data-cat="${post.category}">
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
    </div>
  `;
}

/* ── Featured projects ────────────────────── */
function renderFeaturedProjects(projects) {
  const featured = projects.filter(p => p.featured).slice(0, 3);
  const el = document.getElementById('featured-projects');
  if (!el || !featured.length) return;

  const statusColors = { live: '#66BB6A', wip: '#E8A030', idea: '#736C60' };
  const statusLabel  = { live: 'Live',    wip: 'In Progress', idea: 'Concept' };

  el.innerHTML = `
    <div class="section-label">Selected Work</div>
    <div class="section-header section-header--split">
      <h2>Projects</h2>
      <a href="pages/projects.html" class="btn btn--ghost">All projects →</a>
    </div>
    <div class="grid grid--3">
      ${featured.map((p, i) => `
        <div class="project-card reveal reveal--delay-${i}">
          <div class="project-card__icon">${p.emoji}</div>
          <div class="project-card__header">
            <div>
              <div class="project-card__title">${p.title}</div>
              <div style="color:${statusColors[p.status]};font-family:var(--font-mono);
                          font-size:0.68rem;text-transform:uppercase;letter-spacing:.1em;margin-top:3px">
                ● ${statusLabel[p.status] || p.status}
              </div>
            </div>
          </div>
          <p class="project-card__desc">${p.description}</p>
          <div class="project-card__tags">
            ${p.tags.slice(0, 3).map(t => `<span class="badge badge--neutral">${t}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', init);
