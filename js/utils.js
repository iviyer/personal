/* ============================================
   UTILS — Shared helpers used across all pages
   ============================================ */

export async function fetchJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${path}`);
    return await res.json();
  } catch (err) {
    console.error('[fetchJSON]', err);
    return null;
  }
}

/**
 * Returns the relative path to the site root from the current page.
 * index.html        → ""
 * pages/x.html      → "../"
 * pages/blog/x.html → "../../"
 */
export function rootPath() {
  const segs = window.location.pathname
    .replace(/\\/g, '/')
    .split('/')
    .filter(Boolean);
  // Remove filename (last segment)
  const dirs = segs.length > 1 ? segs.length - 1 : 0;
  return '../'.repeat(dirs);
}

/** Returns the data/ folder path relative to current page */
export function dataRoot() {
  return rootPath() + 'data/';
}

export function formatDate(str) {
  if (!str) return '';
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function truncate(text, maxWords = 20) {
  if (!text) return '';
  const words = text.split(' ');
  return words.length <= maxWords ? text : words.slice(0, maxWords).join(' ') + '…';
}

export function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function markdownToHtml(md) {
  if (!md) return '';
  let html = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^---$/gm, '<hr>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

  html = html.replace(/(<li>[\s\S]+?<\/li>)(\n<li>[\s\S]+?<\/li>)*/g, m => `<ul>${m}</ul>`);
  html = html.replace(/^(?!<[hbulop]|<li|<hr|<block)(.+)$/gm, '<p>$1</p>');
  return html;
}

export function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  els.forEach(el => io.observe(el));
}

export function categoryBadge(cat) {
  const map = {
    finance: { label: 'Finance', cls: 'finance', icon: '💹' },
    sports:  { label: 'Sports',  cls: 'sports',  icon: '🏆' },
    books:   { label: 'Books',   cls: 'books',   icon: '📚' },
  };
  const c = map[cat] || { label: cat, cls: 'neutral', icon: '📝' };
  return `<span class="badge badge--${c.cls}">${c.icon} ${c.label}</span>`;
}

export function statusBadge(status) {
  const map = { live: { label: 'Live', cls: 'accent' }, wip: { label: 'In Progress', cls: 'neutral' }, idea: { label: 'Concept', cls: 'neutral' } };
  const s = map[status] || { label: status, cls: 'neutral' };
  return `<span class="badge badge--${s.cls}">${s.label}</span>`;
}
