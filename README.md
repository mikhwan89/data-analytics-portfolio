# Data Analytics Portfolio

Portfolio of Muhammad Ikhwan: data leadership, work experience, a sample dashboard, and side projects.

Live site: https://mikhwan89.github.io/data-analytics-portfolio/

## Structure

```
├── index.html                        # Shell: Jekyll front matter + {% include %} tags
├── _config.yml                       # Jekyll config (title, description)
├── _includes/                        # Section partials — edit individual sections here
│   ├── section-nav.html
│   ├── section-hero.html             # Name, positioning, proof figures, LinkedIn + CV
│   ├── section-achievements.html
│   ├── section-dashboard.html        # Interactive sales-portal sample (synthetic data)
│   ├── section-career.html
│   ├── section-skills.html
│   ├── section-thoughts.html         # Add new opinion pieces here (newest first)
│   ├── section-build.html            # How I Build: stack, dbt walkthrough ({% raw %}), data actions
│   └── section-projects.html         # Side projects (apps)
├── _resume/resume.html               # CV source (not published); print to assets/Muhammad-Ikhwan-Resume-2026.pdf
├── assets/
│   ├── css/
│   │   └── style.css                 # All styles and responsive layout
│   └── js/
│       ├── charts.js                 # Chart.js dashboard initialisation
│       └── ui.js                     # Tab switching and interactive toggles
```

## Tech

- Vanilla HTML/CSS/JS — no build tools or frameworks
- [Jekyll](https://jekyllrb.com/) includes for section partials, built natively by GitHub Pages
- [Chart.js](https://www.chartjs.org/) for data visualisations
- Hosted on GitHub Pages

## Editing sections

Each section is a standalone HTML partial in `_includes/`. To edit a section, open its file directly — no need to scroll through the full page. GitHub Pages builds Jekyll automatically on every push.
