# Shreshti web (core)

Single-page marketing/tools site for Shreshti (React SPA, deployed from GitHub `main` to Railway).

## Layout invariants
- Source is NOT under `src/`. `components/`, `pages/`, `lib/`, `content/` live at repo root; `src/` holds only `App.tsx` (all routes), `main.tsx`, `index.css`. tsconfig `include` and Tailwind `content` globs depend on this.
- `pages/Home.tsx` composes the landing page over a WebGL shader canvas; sections are `components/*` in order: Hero, BrandStory (`#story`), SanatanDharmaLiving, Subsidiaries, Collaborations, Founders, Contact, Footer.
- Navbar `section` items scroll via `getElementById(hash)`: nav `hash` MUST equal the section `id`.
- Wealth tools / ops pages are static HTML in `public/` (not React). Reached either via `WealthToolFrame` iframe routes or `WealthToolStaticRedirect` (full-page redirect) in `src/App.tsx`; also add rewrites in `public/_redirects` / `vercel.json` / `vite.config.ts` when a clean URL must map to a `.html`.
- `lib/*.ts` hold data/config for pages (tools list, compliance deadlines, investment universe, communities); `content/software/*.md` are frontmatter docs loaded by `lib/loadSoftwareProjects.ts`.

## Brand / theme
- Site theme is the BJP-inspired palette: Tailwind tokens `saffron-*`, `bjp-green`, `bjp-navy` (+ `.tricolor-bar`, `.bjp-card`, `.btn-primary` in `src/index.css`). Used across many pages; do not re-theme casually.
- Shreshti brand palette lives in separate `brand-*` tokens (saffron #E87A00, emerald #005B3A, gold #D4AF37, midnight #0E2338); currently used only in `components/BrandStory.tsx`.
- Logo assets: `public/brands/shreshti-logo-dark.png` (navbar/footer; white wordmark on transparent, only valid on dark backgrounds), `public/brands/shreshti-emblem.png` (hero), icons at `public/` root (`favicon.ico` tight-"S" crop, `favicon-32.png`, `apple-touch-icon.png` opaque). Derived from supplied JPGs; originals not in repo.
- Navbar desktop menu switches at `xl` (11 items + wide logo overflow at `lg`).

## Further reading
- Stack/versions and deploy targets: `mem:tech_stack`
- Commands to run/verify: `mem:suggested_commands`, `mem:task_completion`
- Code style specifics: `mem:conventions`
