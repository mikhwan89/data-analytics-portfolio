// ─── Opinion toggle ───────────────────────────────────────────────
function toggleOpinion(id, btn) {
  const el = document.getElementById(id);
  const isOpen = el.style.display !== 'none';
  el.style.display = isOpen ? 'none' : 'block';
  btn.textContent = isOpen ? 'Read full article ↓' : 'Collapse ↑';
}

// ─── Tab switching ────────────────────────────────────────────────
function showTab(name) {
  document.querySelectorAll('.code-block').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  event.target.classList.add('active');
}
