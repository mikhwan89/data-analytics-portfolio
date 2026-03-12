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
