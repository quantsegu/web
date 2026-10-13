# Conventions

- Components: one default-exported function component per file, PascalCase filename, Tailwind utility classes inline, no CSS modules. Shared classes (`.bjp-card`, `.section-heading`, `.btn-primary`, `.link-accent`, `.tricolor-bar`, `.badge-location`) are in `src/index.css` `@layer components`.
- Section headers on the home page use `components/SectionHeader.tsx` (`hindiTitle`, `title`, `subtitle`); entrance animation via `motion.div` with `whileInView` + `viewport={{ once: true }}`.
- Dark theme only: backgrounds `bg-bjp-navy*`, text white / `gray-300`, accent `saffron-*`. New logos/images must work on dark backgrounds.
- Tailwind class names must appear as full static strings (no string-built class fragments) so the JIT picks them up.
- Copy uses Sanātana diacritics ("Sanātana") and Devanagari eyebrows (e.g. सेवा · संस्कृति · विकास).
- Images: set explicit `width`/`height` on `<img>`; decorative images use `alt=""`.
