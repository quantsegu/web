# Task completion checklist

1. `npx tsc --noEmit` passes.
2. `npx vite build` succeeds (then `rm -rf dist`; it is gitignored but should not linger).
3. For UI changes, view the page at ~375 / 1024 / 1280px wide (navbar desktop menu is `xl`; check no horizontal overflow). Known pre-existing issue: Contact form is ~14px wider than the viewport at 375px.
4. `git status` should show only intended files; local tool dirs `.graqle/`, `graqle.yaml` are gitignored, `.serena/` has its own gitignore for cache/local config.
5. Commit only when asked; commits land on `main` and trigger a Railway deploy once pushed.
