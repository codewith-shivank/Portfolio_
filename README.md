# Shivannkk portfolio

An editorial developer portfolio built with Next.js, TypeScript, and CSS. The visual direction uses a warm paper / ink palette with a signal-green accent, an interactive pointer-reactive hero console, and an index-like project presentation.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Personalize before launch

The biography and technology list use the profile details supplied by Shivank. Featured projects link to public GitHub repositories; update the project data in `components/PortfolioShell.tsx` as the featured work changes. Experience details are omitted; education is limited to the supplied BCA-at-BBDU headline. Confirm the contact address in `lib/identity.ts` before publishing; `hello@shivank.dev` is a deliberate placeholder.

## Design notes

- The hero uses a lazily loaded, self-hosted Three.js portrait, a pointer-drawn ink trail, and project thumbnails built from CSS primitives.
- The hero uses `public/models/portfolio-character.glb`, an optimized CC0 model by Innerscene adapted from MakeHuman/MPFB assets. The source and license are documented in `public/models/CC0-MODEL-LICENSE.txt`; the original 20.8 MB download was compressed to about 707 KB for the site. The older `rui-character.glb` is unused because its source/license is not documented.
- Motion is limited to the hero pointer response, project hover feedback, section reveals, and the mobile navigation. `prefers-reduced-motion` disables those effects.
- The Nothin reference was inspected with REA. Its editorial scale, restrained top navigation, and layered floating visual field informed the composition without copying its identity or content.
