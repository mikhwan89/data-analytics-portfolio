# Data Analytics Portfolio

Personal portfolio showcasing data analytics skills, work experience, and sample dashboards.

Live site: https://mikhwan89.github.io/data-analytics-portfolio/

## Structure

```
├── index.html                        # Shell: Jekyll front matter + {% include %} tags
├── _config.yml                       # Jekyll config (title, description)
├── _includes/                        # Section partials — edit individual sections here
│   ├── section-nav.html
│   ├── section-hero.html
│   ├── section-skills.html
│   ├── section-achievements.html
│   ├── section-dashboard.html
│   ├── section-dbt.html              # DBT Jinja syntax wrapped in {% raw %}
│   ├── section-thoughts.html         # Add new opinion pieces here
│   └── section-career.html
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
