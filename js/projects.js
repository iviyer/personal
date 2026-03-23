/* ============================================
   PROJECTS — Project listing page
   ============================================ */

import { fetchJSON, dataRoot, initReveal } from './utils.js';
import { initNav } from './nav.js';

async function init() {
  await initNav();

  const root     = dataRoot();
  const projects = await fetchJSON(root + 'projects.json');
  if (!projects) {
    const el = document.getElementById('projects-grid');
    if (el) el.innerHTML = `<div class="error-state">Could not load projects. Run a local server.</div>`;
    return;
  }

  renderProjects(projects);
  initReveal();
}

function renderProjects(projects) {
  const el = document.getElementById('projects-grid');
  if (!el) return;

  const statusColors = { live: '#2E7D32', wip: '#C8892A', idea: '#7A766D' };
  const statusLabel  = { live: 'Live',    wip: 'In Progress', idea: 'Concept' };

  // Group by year, newest first
  const byYear = {};
  projects.forEach(p => {
    const y = p.year || 'Other';
    if (!byYear[y]) byYear[y] = [];
    byYear[y].push(p);
  });
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  el.innerHTML = years.map(year => `
    <div style="margin-bottom:var(--space-16)">
      <div style="display:flex;align-items:center;gap:var(--space-4);margin-bottom:var(--space-8)">
        <span style="font-family:var(--font-mono);font-size:var(--text-xs);
                     color:var(--color-ink-muted);letter-spacing:.08em;text-transform:uppercase;
                     white-space:nowrap">${year}</span>
        <div style="flex:1;height:1px;background:var(--color-border-light)"></div>
      </div>
      <div class="grid grid--3">
        ${byYear[year].map((p, i) => `
          <div class="project-card reveal reveal--delay-${i % 3}">
            <div class="project-card__icon">${p.emoji}</div>
            <div class="project-card__header">
              <div>
                <div class="project-card__title">${p.title}</div>
                <div style="color:${statusColors[p.status]};font-family:var(--font-mono);
                            font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;margin-top:3px">
                  ● ${statusLabel[p.status] || p.status}
                </div>
              </div>
              ${(p.links.demo || p.links.github) ? `
                <a href="${p.links.demo || p.links.github}"
                   target="_blank" rel="noopener"
                   style="display:flex;align-items:center;flex-shrink:0">
                  <svg class="project-card__arrow" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M5 15L15 5M15 5H7M15 5v8"/>
                  </svg>
                </a>
              ` : ''}
            </div>
            <p class="project-card__desc">${p.description}</p>
            <div class="project-card__tags">
              ${p.tags.map(t => `<span class="badge badge--neutral">${t}</span>`).join('')}
            </div>
            <div style="display:flex;gap:var(--space-3);margin-top:var(--space-2)">
              ${p.links.demo   ? `<a href="${p.links.demo}"   target="_blank" rel="noopener" style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--color-accent);text-decoration:none">Demo ↗</a>` : ''}
              ${p.links.github ? `<a href="${p.links.github}" target="_blank" rel="noopener" style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--color-ink-muted);text-decoration:none">GitHub ↗</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', init);
