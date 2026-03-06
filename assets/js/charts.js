// ─── Chart defaults ───────────────────────────────────────────────
Chart.defaults.color = '#8b949e';
Chart.defaults.borderColor = '#30363d';
Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
Chart.defaults.font.size = 11;

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─── Revenue + Spend ──────────────────────────────────────────────
new Chart(document.getElementById('revenueChart'), {
  type: 'bar',
  data: {
    labels: months,
    datasets: [
      {
        label: 'Revenue ($K)',
        data: [44, 48, 62, 57, 75, 88, 81, 98, 94, 112, 168, 155],
        backgroundColor: 'rgba(88,166,255,0.2)',
        borderColor: '#58a6ff',
        borderWidth: 2,
        borderRadius: 3,
        order: 2
      },
      {
        label: 'Ad Spend ($K)',
        data: [6.5, 6.2, 7.5, 7.1, 8.5, 9.1, 8.7, 10.3, 10.2, 12.5, 16.2, 15.2],
        type: 'line',
        borderColor: '#f78166',
        borderWidth: 2,
        pointBackgroundColor: '#f78166',
        pointRadius: 3,
        tension: 0.4,
        fill: false,
        yAxisID: 'y2',
        order: 1
      }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      y: { grid: { color: '#21262d' }, ticks: { callback: v => '$' + v + 'K' } },
      y2: {
        position: 'right', grid: { display: false },
        ticks: { callback: v => '$' + v + 'K' }
      }
    },
    plugins: { legend: { labels: { boxWidth: 12, padding: 16 } } }
  }
});

// ─── Channel donut ────────────────────────────────────────────────
new Chart(document.getElementById('channelChart'), {
  type: 'doughnut',
  data: {
    labels: ['Google Ads', 'Facebook Ads', 'Organic', 'Email', 'Direct'],
    datasets: [{
      data: [30, 24, 18, 16, 12],
      backgroundColor: ['#58a6ff','#3fb950','#d2a8ff','#f2cc60','#f78166'],
      borderColor: '#161b22',
      borderWidth: 3,
      hoverOffset: 6
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { position: 'right', labels: { padding: 14, boxWidth: 10 } },
      tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` } }
    }
  }
});

// ─── ROAS bar ─────────────────────────────────────────────────────
new Chart(document.getElementById('roasChart'), {
  type: 'bar',
  data: {
    labels: ['Brand Search', 'Non-Brand\nSearch', 'Display\nRemarketing', 'FB Retarget', 'FB Lookalike', 'FB Prospect'],
    datasets: [{
      label: 'ROAS',
      data: [4.6, 3.4, 2.8, 3.9, 3.1, 1.9],
      backgroundColor: ctx => {
        const v = ctx.parsed.y;
        return v >= 3.5 ? 'rgba(63,185,80,0.4)' : v >= 2.5 ? 'rgba(88,166,255,0.4)' : 'rgba(247,129,102,0.4)';
      },
      borderColor: ctx => {
        const v = ctx.parsed.y;
        return v >= 3.5 ? '#3fb950' : v >= 2.5 ? '#58a6ff' : '#f78166';
      },
      borderWidth: 2,
      borderRadius: 4,
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false, indexAxis: 'y',
    scales: {
      x: { grid: { color: '#21262d' }, ticks: { callback: v => v + 'x' }, beginAtZero: true },
      y: { grid: { display: false } }
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ` ROAS: ${ctx.parsed.x}x` } }
    }
  }
});

// ─── Funnel ───────────────────────────────────────────────────────
new Chart(document.getElementById('funnelChart'), {
  type: 'bar',
  data: {
    labels: ['Impressions', 'Clicks', 'Leads', 'Trials', 'Customers'],
    datasets: [{
      label: 'Count',
      data: [1284000, 55200, 3840, 620, 88],
      backgroundColor: [
        'rgba(88,166,255,0.5)',
        'rgba(88,166,255,0.6)',
        'rgba(210,168,255,0.5)',
        'rgba(210,168,255,0.65)',
        'rgba(63,185,80,0.7)'
      ],
      borderColor: ['#58a6ff','#58a6ff','#d2a8ff','#d2a8ff','#3fb950'],
      borderWidth: 2,
      borderRadius: 4
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: '#21262d' }, type: 'logarithmic',
        ticks: { callback: v => v >= 1000 ? (v/1000)+'K' : v }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y.toLocaleString()}` } }
    }
  }
});

// ─── Dashboard tabs ───────────────────────────────────────────────
const dashInited = { marketing: true };
function showDash(name, btn) {
  document.querySelectorAll('.dash-panel').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.dash-tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('dash-' + name).classList.add('active');
  btn.classList.add('active');
  if (!dashInited[name]) { dashInited[name] = true; initDash(name); }
}

function initDash(name) {
  const G = '#21262d', NG = { display: false };

  // ── Segmentation ──────────────────────────────────────────────
  if (name === 'segmentation') {
    new Chart(document.getElementById('segRevenueChart'), {
      type: 'bar',
      data: {
        labels: ['Champions','Loyal','Promising','At-Risk','Churned'],
        datasets: [{ label: 'Total Revenue ($K)', data: [366,190,75,48,8],
          backgroundColor: ['rgba(88,166,255,0.5)','rgba(63,185,80,0.4)','rgba(210,168,255,0.4)','rgba(242,204,96,0.4)','rgba(247,129,102,0.4)'],
          borderColor: ['#58a6ff','#3fb950','#d2a8ff','#f2cc60','#f78166'],
          borderWidth: 2, borderRadius: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        scales: { x: { grid: { color: G }, ticks: { callback: v => '$'+v+'K' }, beginAtZero: true }, y: { grid: NG } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` $${ctx.raw}K total revenue` } } }
      }
    });
    new Chart(document.getElementById('segSizeChart'), {
      type: 'doughnut',
      data: {
        labels: ['Champions','Loyal','Promising','At-Risk','Churned'],
        datasets: [{ data: [223,298,260,273,186],
          backgroundColor: ['#58a6ff','#3fb950','#d2a8ff','#f2cc60','#f78166'],
          borderColor: '#161b22', borderWidth: 3, hoverOffset: 6 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '68%',
        plugins: { legend: { position: 'right', labels: { padding: 14, boxWidth: 10 } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} customers` } } }
      }
    });
    new Chart(document.getElementById('segAOVChart'), {
      type: 'bar',
      data: {
        labels: ['Champions','Loyal','Promising','At-Risk','Churned'],
        datasets: [{ label: 'Avg Order Value', data: [186,128,92,68,28],
          backgroundColor: ctx => ctx.raw >= 150 ? 'rgba(63,185,80,0.4)' : ctx.raw >= 80 ? 'rgba(88,166,255,0.4)' : 'rgba(247,129,102,0.35)',
          borderColor: ctx => ctx.raw >= 150 ? '#3fb950' : ctx.raw >= 80 ? '#58a6ff' : '#f78166',
          borderWidth: 2, borderRadius: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { grid: { color: G }, ticks: { callback: v => '$'+v }, beginAtZero: true }, x: { grid: NG } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` AOV: $${ctx.raw}` } } }
      }
    });
    new Chart(document.getElementById('segTrendChart'), {
      type: 'line',
      data: {
        labels: ['Oct','Nov','Dec'],
        datasets: [
          { label: 'Champions', data: [205,214,223], borderColor: '#58a6ff', backgroundColor: 'rgba(88,166,255,0.1)', tension: 0.4, fill: true, borderWidth: 2, pointRadius: 4 },
          { label: 'At-Risk',   data: [248,261,273], borderColor: '#f78166', backgroundColor: 'rgba(247,129,102,0.08)', tension: 0.4, fill: true, borderWidth: 2, pointRadius: 4 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { grid: { color: G }, beginAtZero: false }, x: { grid: NG } },
        plugins: { legend: { labels: { boxWidth: 10, padding: 14 } } }
      }
    });
  }

  // ── Retention ─────────────────────────────────────────────────
  else if (name === 'retention') {
    const rm = ['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12'];
    new Chart(document.getElementById('retCohortChart'), {
      type: 'line',
      data: {
        labels: rm,
        datasets: [
          { label: 'Jan 2024', data: [100,91,85,79,75,72,68,66,64,61,59,52], borderColor: '#58a6ff', tension: 0.3, fill: false, borderWidth: 2, pointRadius: 2 },
          { label: 'Apr 2024', data: [100,89,83,76,72,69,65,62,60,58,null,null], borderColor: '#3fb950', tension: 0.3, fill: false, borderWidth: 2, pointRadius: 2 },
          { label: 'Jul 2024', data: [100,92,87,80,76,74,70,67,null,null,null,null], borderColor: '#d2a8ff', tension: 0.3, fill: false, borderWidth: 2, pointRadius: 2 },
          { label: 'Oct 2024', data: [100,90,82,70,null,null,null,null,null,null,null,null], borderColor: '#f2cc60', tension: 0.3, fill: false, borderWidth: 2, pointRadius: 2 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { grid: { color: G }, ticks: { callback: v => v+'%' }, min: 40, max: 100 }, x: { grid: NG } },
        plugins: { legend: { labels: { boxWidth: 10, padding: 12 } },
          tooltip: { callbacks: { label: ctx => ctx.raw != null ? ` ${ctx.dataset.label}: ${ctx.raw}%` : null } } }
      }
    });
    new Chart(document.getElementById('retChurnChart'), {
      type: 'bar',
      data: {
        labels: months,
        datasets: [{ label: 'Churn Rate (%)', data: [5.1,4.9,4.7,4.4,4.2,4.0,3.9,3.8,4.0,4.1,4.3,4.2],
          backgroundColor: ctx => ctx.raw >= 4.5 ? 'rgba(247,129,102,0.5)' : 'rgba(88,166,255,0.4)',
          borderColor: ctx => ctx.raw >= 4.5 ? '#f78166' : '#58a6ff',
          borderWidth: 2, borderRadius: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { grid: { color: G }, ticks: { callback: v => v+'%' }, min: 3 }, x: { grid: NG } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` Churn: ${ctx.raw}%` } } }
      }
    });
    new Chart(document.getElementById('retNRRChart'), {
      type: 'bar',
      data: {
        labels: ['Champions','Loyal','Promising','At-Risk'],
        datasets: [{ label: 'NRR (%)', data: [138,121,104,82],
          backgroundColor: ctx => ctx.raw >= 100 ? 'rgba(63,185,80,0.4)' : 'rgba(247,129,102,0.4)',
          borderColor: ctx => ctx.raw >= 100 ? '#3fb950' : '#f78166',
          borderWidth: 2, borderRadius: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { grid: { color: G }, ticks: { callback: v => v+'%' }, min: 60 }, x: { grid: NG } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` NRR: ${ctx.raw}%` } } }
      }
    });
    new Chart(document.getElementById('retActiveChart'), {
      type: 'line',
      data: {
        labels: months,
        datasets: [{ label: 'Active Customers', data: [1052,1069,1084,1098,1114,1131,1148,1162,1179,1196,1218,1240],
          borderColor: '#3fb950', backgroundColor: 'rgba(63,185,80,0.08)', tension: 0.4, fill: true, borderWidth: 2, pointRadius: 3 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { grid: { color: G }, min: 1000 }, x: { grid: NG } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` Active: ${ctx.raw.toLocaleString()}` } } }
      }
    });
  }

  // ── Operations ────────────────────────────────────────────────
  else if (name === 'operations') {
    const days30 = Array.from({length:30}, (_,i) => i+1);
    const vol = [128,142,155,139,161,148,172,145,158,163,170,141,154,168,175,149,162,178,155,171,184,148,165,180,168,175,192,158,171,186];
    new Chart(document.getElementById('opsVolumeChart'), {
      type: 'line',
      data: {
        labels: days30,
        datasets: [{ label: 'Orders', data: vol,
          borderColor: '#58a6ff', backgroundColor: 'rgba(88,166,255,0.1)', tension: 0.3, fill: true, borderWidth: 2, pointRadius: 0 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { grid: { color: G }, min: 100 }, x: { grid: NG, ticks: { maxTicksLimit: 10 } } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.raw} orders` } } }
      }
    });
    new Chart(document.getElementById('opsIssueChart'), {
      type: 'doughnut',
      data: {
        labels: ['Delayed Shipment','Wrong Item','Damaged','Missing Item','Other'],
        datasets: [{ data: [42,27,18,8,5],
          backgroundColor: ['#f78166','#d2a8ff','#f2cc60','#58a6ff','#3fb950'],
          borderColor: '#161b22', borderWidth: 3, hoverOffset: 6 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '68%',
        plugins: { legend: { position: 'right', labels: { padding: 12, boxWidth: 10 } } }
      }
    });
    new Chart(document.getElementById('opsSLAChart'), {
      type: 'bar',
      data: {
        labels: ['Electronics','Apparel','Home & Living','Sports','Beauty'],
        datasets: [{ label: 'SLA Hit Rate (%)', data: [97.2,95.1,96.4,90.8,93.5],
          backgroundColor: ctx => ctx.raw >= 95 ? 'rgba(63,185,80,0.4)' : 'rgba(247,129,102,0.4)',
          borderColor: ctx => ctx.raw >= 95 ? '#3fb950' : '#f78166',
          borderWidth: 2, borderRadius: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        scales: { x: { grid: { color: G }, ticks: { callback: v => v+'%' }, min: 85, max: 100 }, y: { grid: NG } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` SLA: ${ctx.raw}%` } } }
      }
    });
    new Chart(document.getElementById('opsFulfillChart'), {
      type: 'bar',
      data: {
        labels: ['Jakarta (WH1)','Surabaya (WH2)','Bandung (WH3)','Medan (WH4)'],
        datasets: [{ label: 'Avg Days', data: [1.4,2.1,1.8,2.4],
          backgroundColor: ctx => ctx.raw <= 2 ? 'rgba(63,185,80,0.4)' : 'rgba(247,129,102,0.4)',
          borderColor: ctx => ctx.raw <= 2 ? '#3fb950' : '#f78166',
          borderWidth: 2, borderRadius: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { grid: { color: G }, ticks: { callback: v => v+'d' }, beginAtZero: true }, x: { grid: NG } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.raw} days avg` } } }
      }
    });
  }

  // ── Finance ───────────────────────────────────────────────────
  else if (name === 'finance') {
    const rev = [44,48,62,57,75,88,81,98,94,112,168,155];
    const cogs = [14,15,20,18,24,28,26,31,30,35,52,51];
    new Chart(document.getElementById('finPLChart'), {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          { label: 'Revenue ($K)', data: rev, backgroundColor: 'rgba(88,166,255,0.3)', borderColor: '#58a6ff', borderWidth: 2, borderRadius: 3 },
          { label: 'COGS ($K)',    data: cogs, backgroundColor: 'rgba(247,129,102,0.4)', borderColor: '#f78166', borderWidth: 2, borderRadius: 3 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { grid: { color: G }, ticks: { callback: v => '$'+v+'K' }, beginAtZero: true }, x: { grid: NG } },
        plugins: { legend: { labels: { boxWidth: 12, padding: 14 } } }
      }
    });
    new Chart(document.getElementById('finExpChart'), {
      type: 'doughnut',
      data: {
        labels: ['Salaries','Infrastructure','Marketing','G&A','R&D'],
        datasets: [{ data: [48,18,14,12,8],
          backgroundColor: ['#58a6ff','#3fb950','#d2a8ff','#f2cc60','#f78166'],
          borderColor: '#161b22', borderWidth: 3, hoverOffset: 6 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '68%',
        plugins: { legend: { position: 'right', labels: { padding: 12, boxWidth: 10 } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` } } }
      }
    });
    new Chart(document.getElementById('finBudgetChart'), {
      type: 'bar',
      data: {
        labels: ['Engineering','Marketing','Sales','Customer Success','G&A'],
        datasets: [
          { label: 'Budget ($K)',  data: [62,38,44,22,18], backgroundColor: 'rgba(88,166,255,0.2)', borderColor: '#58a6ff', borderWidth: 2, borderRadius: 3 },
          { label: 'Actuals ($K)', data: [61,35,46,21,17], backgroundColor: 'rgba(63,185,80,0.35)', borderColor: '#3fb950', borderWidth: 2, borderRadius: 3 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { grid: { color: G }, ticks: { callback: v => '$'+v+'K' }, beginAtZero: true }, x: { grid: NG } },
        plugins: { legend: { labels: { boxWidth: 12, padding: 14 } } }
      }
    });
    new Chart(document.getElementById('finCashChart'), {
      type: 'line',
      data: {
        labels: months,
        datasets: [{ label: 'Cash Position ($K)', data: [380,372,368,374,386,402,414,431,452,486,562,628],
          borderColor: '#3fb950', backgroundColor: 'rgba(63,185,80,0.1)', tension: 0.4, fill: true, borderWidth: 2, pointRadius: 3 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { grid: { color: G }, ticks: { callback: v => '$'+v+'K' }, min: 300 }, x: { grid: NG } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` $${ctx.raw}K` } } }
      }
    });
  }

  // ── Supply Chain ──────────────────────────────────────────────
  else if (name === 'supply') {
    const wks = ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'];
    new Chart(document.getElementById('supInventoryChart'), {
      type: 'line',
      data: {
        labels: wks,
        datasets: [
          { label: 'Electronics', data: [1820,1740,1660,1580,1500,1430,1360,1300,1280,1260,1245,1240], borderColor: '#58a6ff', tension: 0.3, fill: false, borderWidth: 2, pointRadius: 2 },
          { label: 'Apparel',     data: [1200,1140,1080,1010,960,900,920,880,870,860,855,850], borderColor: '#3fb950', tension: 0.3, fill: false, borderWidth: 2, pointRadius: 2 },
          { label: 'Sports',      data: [680,640,610,580,560,520,500,478,460,445,432,420], borderColor: '#f78166', tension: 0.3, fill: false, borderWidth: 2, pointRadius: 2 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { grid: { color: G }, min: 300 }, x: { grid: NG } },
        plugins: { legend: { labels: { boxWidth: 10, padding: 12 } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw.toLocaleString()} units` } } }
      }
    });
    new Chart(document.getElementById('supFillChart'), {
      type: 'bar',
      data: {
        labels: ['Electronics','Home & Living','Beauty','Apparel','Sports'],
        datasets: [{ label: 'Fill Rate (%)', data: [98.2,97.8,97.1,95.4,91.8],
          backgroundColor: ctx => ctx.raw >= 96 ? 'rgba(63,185,80,0.4)' : ctx.raw >= 93 ? 'rgba(88,166,255,0.4)' : 'rgba(247,129,102,0.4)',
          borderColor: ctx => ctx.raw >= 96 ? '#3fb950' : ctx.raw >= 93 ? '#58a6ff' : '#f78166',
          borderWidth: 2, borderRadius: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        scales: { x: { grid: { color: G }, ticks: { callback: v => v+'%' }, min: 85, max: 100 }, y: { grid: NG } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` Fill Rate: ${ctx.raw}%` } } }
      }
    });
    new Chart(document.getElementById('supLeadChart'), {
      type: 'bar',
      data: {
        labels: ['TechDist Co.','FashionHub','SportCo','HomeSupply','BeautyWholesale'],
        datasets: [{ label: 'Lead Time (days)', data: [12,18,22,9,14],
          backgroundColor: ctx => ctx.raw <= 14 ? 'rgba(63,185,80,0.4)' : ctx.raw <= 20 ? 'rgba(88,166,255,0.4)' : 'rgba(247,129,102,0.4)',
          borderColor: ctx => ctx.raw <= 14 ? '#3fb950' : ctx.raw <= 20 ? '#58a6ff' : '#f78166',
          borderWidth: 2, borderRadius: 4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { grid: { color: G }, ticks: { callback: v => v+'d' }, beginAtZero: true }, x: { grid: NG } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.raw} day lead time` } } }
      }
    });
    new Chart(document.getElementById('supOTDChart'), {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          { label: 'OTD %',        data: [88.4,89.1,90.2,91.8,93.1,93.4,92.8,93.0,92.5,91.9,91.5,91.3], borderColor: '#58a6ff', backgroundColor: 'rgba(88,166,255,0.1)', tension: 0.4, fill: true, borderWidth: 2, pointRadius: 3 },
          { label: 'Target (93%)', data: Array(12).fill(93), borderColor: '#3fb950', borderDash: [6,3], borderWidth: 1.5, pointRadius: 0, fill: false }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { grid: { color: G }, ticks: { callback: v => v+'%' }, min: 85, max: 97 }, x: { grid: NG } },
        plugins: { legend: { labels: { boxWidth: 10, padding: 14 } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}%` } } }
      }
    });
  }
}
