/* ============================================
   CAREER — Timeline page
   ============================================ */

import { fetchJSON, dataRoot, initReveal } from './utils.js';
import { initNav } from './nav.js';

async function init() {
  await initNav();

  const root   = dataRoot();
  const career = await fetchJSON(root + 'career.json');
  if (!career) {
    const el = document.getElementById('timeline');
    if (el) el.innerHTML = `<div class="error-state">Could not load career data. Run a local server.</div>`;
    return;
  }

  renderTimeline(career);
  initReveal();
}

function renderTimeline(items) {
  const el = document.getElementById('timeline');
  if (!el) return;

  el.innerHTML = items.map((item, idx) => `
    <div class="timeline-item reveal reveal--delay-${idx % 3}">
      <div class="timeline-item__date">${item.period}</div>
      <div class="timeline-item__spine">
        <div class="timeline-item__dot"
             style="${item.current
               ? 'background:var(--color-accent);box-shadow:0 0 0 4px rgba(200,137,42,.2)'
               : ''}">
        </div>
        <div class="timeline-item__line"></div>
      </div>
      <div class="timeline-item__content">
        <div class="timeline-item__role">
          ${item.role}
          ${item.current
            ? `<span class="badge badge--accent"
                     style="margin-left:var(--space-2);vertical-align:middle;font-size:.65rem">
                 Current
               </span>`
            : ''}
        </div>
        <div class="timeline-item__company">
          ${item.company}
          <span style="color:var(--color-border)">·</span>
          ${item.location}
          <span style="color:var(--color-border)">·</span>
          ${item.type}
        </div>
        <p class="timeline-item__desc">${item.description}</p>
        ${item.highlights?.length ? `
          <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);margin-top:var(--space-3)">
            ${item.highlights.map(h => `<span class="badge badge--neutral">${h}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', init);
