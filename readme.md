# warkakajaki.pl

Website for the kayak and campsite rental company AKKA Kajaki.

Static site generator setup: [Panini](https://github.com/foundation/panini) (Handlebars pages, layouts and
partials) + Sass + webpack, orchestrated by Gulp and served with BrowserSync.

## Requirements

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | **>= 20** (LTS) | verified on 22.14.0; version pinned in `.nvmrc` |
| npm | >= 10 | ships with Node 20/22 |


```
nvm use          # optional, reads .nvmrc
npm install
```

## Getting Started

### Develop

```
npm run start
```

Builds into `dist/`, starts BrowserSync on <http://localhost:8000> (control UI on
<http://localhost:3001>) and watches `src/` — Sass is injected without a page reload, HTML/JS changes
trigger a reload. CSS source maps are generated in this mode.

### Build

```
npm run build
```

Production build into `dist/`: minified CSS (clean-css) and JS (webpack), minified HTML, no source maps.
The output is plain static files — deploy the contents of `dist/` to any web server. `src/server/.htaccess`
is copied to the root of `dist/` as part of the build.

Change the dev-server port and the build paths in `config.yml`; target browsers for Autoprefixer and Babel
live in `.browserslistrc`.

## Project structure

```
src/
  assets/       static files copied as-is (images/, favicon, robots, ...)
  data/         Handlebars data files (yml/json/js)
  helpers/      Handlebars helpers
  js/           webpack entry (app.js), partials, helpers, vendored libs (slick, lightbox2)
  layouts/      page layouts
  pages/        one folder per route, compiled to dist/<route>/index.html
  partials/     Handlebars partials + their Sass, side by side
  scss/         Sass entry (app.scss), base, pages, partials, vendors
  server/       .htaccess shipped with the build
dist/           build output (git-ignored)
```

## Acknowledgments
created with plumming love to code ❤
