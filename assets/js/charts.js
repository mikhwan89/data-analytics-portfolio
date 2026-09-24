// ─── Chart defaults ───────────────────────────────────────────────
Chart.defaults.color = '#7a82a0';
Chart.defaults.borderColor = '#2e3350';
Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
Chart.defaults.font.size = 11;

// Sales portal palette — the live portal's own tokens
const P = {
  accent: '#4f7ef0', accent2: '#6ec6a8', warning: '#e0a84c', purple: '#b48ef0',
  muted: '#7a82a0', positive: '#4caf88', negative: '#e05c5c', grid: '#262b40', surface: '#1a1d27'
};
const PRODUCT_COLORS = [P.accent, P.accent2, P.warning, P.purple, P.muted];

// Every figure on this page is synthetic. A seeded generator keeps them
// identical on every load, so the charts don't reshuffle on refresh.
function rng(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function gauss(r) { return Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r()); }

const fmtUSD = v => '$' + (Math.abs(v) >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : Math.abs(v) >= 1e3 ? (v / 1e3).toFixed(0) + 'K' : v.toFixed(0));
const fmtNum = v => Math.round(v).toLocaleString('en-US');
const fmtPct = v => (v >= 0 ? '+' : '') + (v * 100).toFixed(1) + '%';
const gridOpts = { grid: { color: P.grid } };
const legendOpts = { labels: { boxWidth: 10, padding: 12 } };

// ─── Tab switching ────────────────────────────────────────────────
// Charts in a hidden panel measure 0px, so each panel is drawn the first
// time it is opened.
const portalInited = {};
function showPortal(name, btn) {
  document.querySelectorAll('.pt-panel').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.pt-tab').forEach(el => el.classList.remove('active'));
  document.getElementById('pt-' + name).classList.add('active');
  btn.classList.add('active');
  if (!portalInited[name]) { portalInited[name] = true; (PORTAL_INIT[name] || (() => {}))(); }
}

const PORTAL_INIT = {
  dashboard: initDashboard,
  overview: initOverview,
  profit: renderProfit,
  dca: renderDca,
  impact: renderImpact,
  structured: renderSharkfin
};

// ─── 1. Dashboard ─────────────────────────────────────────────────
function initDashboard() {
  const r = rng(7);
  const days = [];
  const d0 = new Date(Date.UTC(2026, 7, 25));
  for (let i = 0; i < 30; i++) {
    const d = new Date(d0.getTime() + i * 864e5);
    days.push(d.getUTCDate() + ' ' + ['Aug', 'Sep'][d.getUTCMonth() - 7]);
  }

  // Daily AUS by asset — random walks ending near the $48.6M KPI
  const assets = [['BTC', 21.4, 0.018], ['ETH', 8.6, 0.022], ['USDT', 13.4, 0.004], ['Others', 5.2, 0.02]];
  const ausSets = assets.map(([label, end, vol], i) => {
    const s = [end];
    for (let k = 1; k < 30; k++) s.unshift(s[0] / (1 + vol * gauss(r) + 0.002));
    return { label, data: s, fill: true, borderColor: PRODUCT_COLORS[i], backgroundColor: PRODUCT_COLORS[i] + '55', borderWidth: 1.5, pointRadius: 0, tension: 0.3 };
  });
  new Chart(document.getElementById('ptAusChart'), {
    type: 'line',
    data: { labels: days, datasets: ausSets },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 10, maxRotation: 0 } }, y: { stacked: true, ...gridOpts, ticks: { callback: v => '$' + v + 'M' } } },
      plugins: { legend: legendOpts, tooltip: { callbacks: { label: c => ` ${c.dataset.label}: $${c.parsed.y.toFixed(1)}M` } } }
    }
  });

  // Daily transaction value by product
  const products = ['Fixed Earn', 'Dual Currency', 'Structured', 'Staking', 'Flexible Earn'];
  const weights = [0.32, 0.26, 0.2, 0.12, 0.1];
  new Chart(document.getElementById('ptTrxChart'), {
    type: 'bar',
    data: {
      labels: days,
      datasets: products.map((label, i) => ({
        label, backgroundColor: PRODUCT_COLORS[i], borderRadius: 2,
        data: days.map(() => Math.max(0, 413 * weights[i] * (0.4 + 1.2 * r())))
      }))
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { x: { stacked: true, grid: { display: false }, ticks: { maxTicksLimit: 8, maxRotation: 0 } }, y: { stacked: true, ...gridOpts, ticks: { callback: v => '$' + v + 'K' } } },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.dataset.label}: $${c.parsed.y.toFixed(0)}K` } } }
    }
  });

  // Revenue product mix
  new Chart(document.getElementById('ptMixChart'), {
    type: 'doughnut',
    data: { labels: products, datasets: [{ data: [34, 24, 18, 14, 10], backgroundColor: PRODUCT_COLORS, borderColor: P.surface, borderWidth: 3 }] },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '66%',
      plugins: { legend: { position: 'right', labels: { boxWidth: 10, padding: 10 } }, tooltip: { callbacks: { label: c => ` ${c.label}: ${c.parsed}%` } } }
    }
  });
}

// ─── 2. Sales overview ────────────────────────────────────────────
function initOverview() {
  const reps = ['Sales A', 'Sales B', 'Sales C', 'Sales D', 'Sales E', 'Sales F', 'Sales G', 'Sales H'];
  new Chart(document.getElementById('ptAusBySalesChart'), {
    type: 'bar',
    data: { labels: reps, datasets: [{ label: 'AUS', data: [48.6, 36.1, 29.4, 22.8, 17.3, 12.9, 9.8, 7.3], backgroundColor: P.accent, borderRadius: 3 }] },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      scales: { x: { ...gridOpts, ticks: { callback: v => '$' + v + 'M' } }, y: { grid: { display: false } } },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` $${c.parsed.x}M` } } }
    }
  });
  new Chart(document.getElementById('ptCommChart'), {
    type: 'bar',
    data: {
      labels: reps,
      datasets: [
        { label: "Rep's commission", data: [212, 158, 118, 86, 57, 52, 38, 29], backgroundColor: P.positive, borderRadius: 3 },
        { label: "Upline's portion", data: [53, 40, 24, 18, 14, 13, 10, 7], backgroundColor: P.muted, borderRadius: 3 }
      ]
    },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      scales: { x: { stacked: true, ...gridOpts, ticks: { callback: v => 'Rp ' + v + 'M' } }, y: { stacked: true, grid: { display: false } } },
      plugins: { legend: legendOpts, tooltip: { callbacks: { label: c => ` ${c.dataset.label}: Rp ${c.parsed.x}M` } } }
    }
  });
}

// ─── 3. Client profitability ──────────────────────────────────────
const PROFIT = {
  fiat: {
    unit: 'USD', data: [4200, 6100, -3800, 2900, 8400, -5200, 3100, 7600, 1900, -2400, 6800, 8820],
    fmt: v => (v >= 0 ? '+$' : '−$') + fmtNum(Math.abs(v)),
    pl: '+$38,420', plSub: '+12.6% on net invested', flow: '+$305,000', bal: '$343,420'
  },
  crypto: {
    unit: 'BTC', data: [0.021, 0.034, 0.012, 0.018, 0.041, 0.015, 0.019, 0.037, 0.016, 0.011, 0.033, 0.045],
    fmt: v => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(3) + ' BTC',
    pl: '+0.302 BTC', plSub: 'holdings grown by yield, not price', flow: '+3.20 BTC', bal: '3.502 BTC'
  }
};
let profitChart;
function renderProfit() {
  const m = PROFIT[document.getElementById('ptProfitMethod').value];
  document.getElementById('ptProfitPL').textContent = m.pl;
  document.getElementById('ptProfitPLSub').textContent = m.plSub;
  document.getElementById('ptProfitFlow').textContent = m.flow;
  document.getElementById('ptProfitBal').textContent = m.bal;
  document.getElementById('ptProfitBadge').textContent = m.unit;
  const labels = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  if (profitChart) profitChart.destroy();
  profitChart = new Chart(document.getElementById('ptProfitChart'), {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Profit / loss', data: m.data, backgroundColor: m.data.map(v => v >= 0 ? P.positive : P.negative), borderRadius: 3 }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { x: { grid: { display: false } }, y: gridOpts },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ' ' + m.fmt(c.parsed.y) } } }
    }
  });
}

// ─── 4. CRM ───────────────────────────────────────────────────────
function crmFilter(tag, btn) {
  document.querySelectorAll('#ptCrmSeg button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#ptCrmBody tr').forEach(tr => {
    tr.style.display = tag === 'all' || tr.dataset.tags.split(' ').includes(tag) ? '' : 'none';
  });
}
function crmLog(btn) {
  const tr = btn.closest('tr');
  const client = tr.cells[0].textContent;
  tr.querySelector('.lc').textContent = 'Today';
  const wasGap = tr.dataset.tags.split(' ').includes('gap');
  tr.dataset.tags = tr.dataset.tags.replace('gap', '').trim() || 'done';
  btn.textContent = '✓ Logged';
  btn.disabled = true;
  if (wasGap) {
    const gap = document.getElementById('ptCrmGap');
    gap.textContent = Math.max(0, +gap.textContent - 1);
  }
  const log = document.getElementById('ptCrmLog');
  const empty = log.querySelector('.muted');
  if (empty) empty.remove();
  const li = document.createElement('li');
  li.innerHTML = `<span class="pt-pill pos">Call</span> Logged a contact with <strong>${client}</strong>. Next action: follow up in 14 days.`;
  log.prepend(li);
}

// ─── Synthetic monthly price paths (10 years) ─────────────────────
// Illustrative only: drift/volatility loosely shaped like each asset class.
const ASSETS = [
  { name: 'Crypto', seed: 314, mu: 0.028, sigma: 0.19 },
  { name: 'Gold', seed: 10, mu: 0.006, sigma: 0.04 },
  { name: 'Equity index', seed: 8, mu: 0.008, sigma: 0.045 }
].map(a => {
  const r = rng(a.seed), p = [100];
  for (let i = 0; i < 120; i++) p.push(p[i] * Math.exp(a.mu - a.sigma * a.sigma / 2 + a.sigma * gauss(r)));
  return { ...a, prices: p };
});

// ─── 5. DCA simulator ─────────────────────────────────────────────
let dcaChart;
function dca(prices, amt) {
  let units = 0, invested = 0;
  const inv = [], val = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < prices.length - 1) { units += amt / prices[i]; invested += amt; }
    inv.push(invested); val.push(units * prices[i]);
  }
  return { inv, val, invested, final: val[val.length - 1], lump: invested * prices[prices.length - 1] / prices[0] };
}
function renderDca() {
  const years = +document.getElementById('ptDcaYears').value;
  const amt = Math.max(0, +document.getElementById('ptDcaAmt').value || 0);
  const pick = +document.getElementById('ptDcaAsset').value;
  const n = years * 12 + 1;
  const results = ASSETS.map(a => ({ name: a.name, ...dca(a.prices.slice(-n), amt) }));

  document.getElementById('ptDcaBody').innerHTML = results.map(x => {
    const dr = x.invested ? x.final / x.invested - 1 : 0, lr = x.invested ? x.lump / x.invested - 1 : 0;
    return `<tr><td>${x.name}</td><td class="num">${fmtNum(x.invested)}</td><td class="num">${fmtNum(x.final)}</td>` +
      `<td class="num ${dr >= 0 ? 'pos' : 'neg'}">${fmtPct(dr)}</td><td class="num">${fmtNum(x.lump)}</td>` +
      `<td class="num ${lr >= 0 ? 'pos' : 'neg'}">${fmtPct(lr)}</td><td><span class="pt-pill ${x.final >= x.lump ? 'pos' : 'warn'}">${x.final >= x.lump ? 'DCA' : 'Lump sum'}</span></td></tr>`;
  }).join('');

  const x = results[pick];
  const labels = x.inv.map((_, i) => i % 12 === 0 ? 'Y' + (i / 12) : '');
  if (dcaChart) dcaChart.destroy();
  dcaChart = new Chart(document.getElementById('ptDcaChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Portfolio value', data: x.val, borderColor: P.accent, backgroundColor: P.accent + '33', fill: true, pointRadius: 0, borderWidth: 2, tension: 0.2 },
        { label: 'Invested', data: x.inv, borderColor: P.muted, borderDash: [5, 4], pointRadius: 0, borderWidth: 1.5 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: { x: { grid: { display: false }, ticks: { autoSkip: false, maxRotation: 0 } }, y: { ...gridOpts, ticks: { callback: v => fmtUSD(v) } } },
      plugins: { legend: legendOpts, tooltip: { callbacks: { title: c => 'Month ' + c[0].dataIndex, label: c => ` ${c.dataset.label}: $${fmtNum(c.parsed.y)}` } } }
    }
  });
}

// ─── 6. Bitcoin impact to portfolio ───────────────────────────────
let impactChart;
function simulatePortfolio(wCrypto, rebalance) {
  const crypto = ASSETS[0].prices.slice(-61), eq = ASSETS[2].prices.slice(-61);
  const fiRet = Math.pow(1.06, 1 / 12) - 1;
  const target = [wCrypto, (1 - wCrypto) * 0.6, (1 - wCrypto) * 0.4];
  let hold = target.map(w => w * 100e6);
  const values = [100e6];
  for (let i = 1; i < 61; i++) {
    hold = [hold[0] * crypto[i] / crypto[i - 1], hold[1] * eq[i] / eq[i - 1], hold[2] * (1 + fiRet)];
    const v = hold[0] + hold[1] + hold[2];
    values.push(v);
    if (rebalance && i % 3 === 0) hold = target.map(w => w * v);
  }
  const rets = values.slice(1).map((v, i) => v / values[i] - 1);
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
  const vol = Math.sqrt(rets.reduce((a, b) => a + (b - mean) ** 2, 0) / (rets.length - 1) * 12);
  let peak = values[0], mdd = 0;
  values.forEach(v => { peak = Math.max(peak, v); mdd = Math.min(mdd, v / peak - 1); });
  const cagr = Math.pow(values[60] / values[0], 1 / 5) - 1;
  return { values, cagr, vol, sharpe: (mean * 12 - 0.05) / vol, mdd };
}
function renderImpact() {
  const reb = document.getElementById('ptImpactReb').checked;
  const allocs = [0, 0.01, 0.05, 0.1];
  const colors = [P.muted, P.accent2, P.accent, P.warning];
  const sims = allocs.map(w => simulatePortfolio(w, reb));
  const name = w => w === 0 ? 'No bitcoin' : (w * 100) + '% bitcoin';

  document.getElementById('ptImpactBody').innerHTML = sims.map((s, i) =>
    `<tr><td><span class="cap-dot" style="--c:${colors[i]}"></span> ${name(allocs[i])}</td>` +
    `<td class="num">Rp ${(s.values[60] / 1e6).toFixed(1)}M</td><td class="num">${fmtPct(s.cagr)}</td>` +
    `<td class="num">${(s.vol * 100).toFixed(1)}%</td><td class="num">${s.sharpe.toFixed(2)}</td>` +
    `<td class="num neg">${(s.mdd * 100).toFixed(1)}%</td></tr>`).join('');

  if (impactChart) impactChart.destroy();
  impactChart = new Chart(document.getElementById('ptImpactChart'), {
    type: 'line',
    data: {
      labels: sims[0].values.map((_, i) => i % 12 === 0 ? 'Y' + (i / 12) : ''),
      datasets: sims.map((s, i) => ({ label: name(allocs[i]), data: s.values.map(v => v / 1e6), borderColor: colors[i], pointRadius: 0, borderWidth: 2, tension: 0.2 }))
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: { x: { grid: { display: false }, ticks: { autoSkip: false, maxRotation: 0 } }, y: { ...gridOpts, ticks: { callback: v => 'Rp ' + v + 'M' } } },
      plugins: { legend: legendOpts, tooltip: { callbacks: { title: c => 'Month ' + c[0].dataIndex, label: c => ` ${c.dataset.label}: Rp ${c.parsed.y.toFixed(1)}M` } } }
    }
  });
}

// ─── 9. Structured product template (sharkfin) ────────────────────
let sfChart;
function renderSharkfin() {
  const v = id => +document.getElementById(id).value || 0;
  const amt = v('ptSfAmt'), days = v('ptSfDays'), bar = Math.max(101, v('ptSfBar'));
  const lo = v('ptSfMin'), hi = v('ptSfMax'), reb = v('ptSfReb');
  const apy = p => p <= 100 ? lo : p < bar ? lo + (hi - lo) * (p - 100) / (bar - 100) : reb;
  const coupon = p => amt * apy(p) / 100 * days / 365;

  const xs = [];
  for (let p = 80; p <= Math.max(130, bar + 15); p++) xs.push(p);
  if (sfChart) sfChart.destroy();
  sfChart = new Chart(document.getElementById('ptSfChart'), {
    type: 'line',
    data: {
      labels: xs.map(p => p + '%'),
      datasets: [{ label: 'APY', data: xs.map(apy), borderColor: P.accent, backgroundColor: P.accent + '26', fill: true, pointRadius: 0, borderWidth: 2, stepped: false }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 12 } }, y: { ...gridOpts, beginAtZero: true, ticks: { callback: v => v + '%' } } },
      plugins: { legend: { display: false }, tooltip: { callbacks: { title: c => 'Price at expiry: ' + c[0].label + ' of spot', label: c => ` APY ${c.parsed.y.toFixed(2)}%` } } }
    }
  });

  const mid = Math.round((100 + bar) / 2);
  const scen = [[90, 'Falls 10%'], [100, 'Unchanged'], [mid, 'Rises to midway'], [bar - 1, 'Just under barrier'], [bar, 'Hits barrier']];
  document.getElementById('ptSfBody').innerHTML = scen.map(([p, label]) =>
    `<tr><td>${p}% <span class="pt-pill">${label}</span></td><td class="num">${apy(p).toFixed(2)}%</td>` +
    `<td class="num">${fmtNum(coupon(p))}</td><td class="num">${fmtNum(amt + coupon(p))}</td></tr>`).join('');
}

// Dashboard is the panel open on load
portalInited.dashboard = true;
initDashboard();
