# weft landing page

Static landing page for weft, styled after [eza.rocks](https://eza.rocks)
(Cayman theme). Built with SvelteKit and `@sveltejs/adapter-static`.

All copy lives in `src/lib/content.ts`; keep it in sync with the root `README.md`.

## Develop

```sh
cd site
npm ci
npm run dev        # http://localhost:5173
npm run check      # type and Svelte diagnostics
```

## Build

```sh
BASE_PATH=/weft npm run build   # output in site/build
npm run preview
```

`BASE_PATH` must match the URL prefix the site is served from
(`/<repo>` for GitHub project pages, empty for a custom domain).

## Deploy

`.github/workflows/pages.yml` builds and publishes to GitHub Pages on every
push to `dev` that touches `site/`. Enable it once under
**Settings → Pages → Source: GitHub Actions**.
