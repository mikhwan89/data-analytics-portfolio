// ─── Opinion toggle ───────────────────────────────────────────────
function toggleOpinion(id, btn) {
  const el = document.getElementById(id);
  const isOpen = el.style.display !== 'none';
  el.style.display = isOpen ? 'none' : 'block';
  btn.textContent = isOpen ? 'Read full article ↓' : 'Collapse ↑';
}

// ─── Tab switching (DBT section) ──────────────────────────────────
function showTab(name) {
  document.querySelectorAll('#dbt .code-block').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('#dbt .tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  event.target.classList.add('active');
}

// ─── Tab switching (Actions section) ──────────────────────────────
function showActionTab(name) {
  document.querySelectorAll('#actions .code-block').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('#actions .tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('action-tab-' + name).classList.add('active');
  event.target.classList.add('active');
}

// ─── Tab switching (How I Build section) ──────────────────────────
function showBuild(name, btn) {
  document.querySelectorAll('.build-panel').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.build-tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(name).classList.add('active');
  btn.classList.add('active');
}

// ─── Open an article from a link elsewhere on the page ────────────
function openArticle(id) {
  const el = document.getElementById(id);
  if (el.style.display === 'none') toggleOpinion(id, el.parentElement.querySelector('.opinion-toggle'));
}
