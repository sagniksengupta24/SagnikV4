# Sagnik Sengupta — Cinematic Engineering Portfolio

A production-ready Next.js portfolio for AI systems, machine-learning research, simulation and expressive software.

This version replaces the previous blue terminal/dashboard identity with a scene-based editorial experience. Each flagship project has its own visual world, motion language and narrative structure instead of repeating the same card or interface pattern.

## What this version delivers

- A cinematic opening built around one clear positioning statement.
- Strong light/dark scene contrast rather than one continuous navy dashboard.
- An experiential Indus Agent chapter showing the path from goal to verified action.
- A visual NIFTY 50 research story that separates noise, walk-forward testing and execution reality.
- A full-width MotoSim mountain replay with live progress and engine-memory behaviour.
- An editorial experiment archive, connected capability map, human about section and restrained contact ending.
- Responsive composition for desktop, tablet and mobile.
- Reduced-motion support, keyboard navigation, semantic structure and visible focus states.
- Metadata, Open Graph, sitemap, robots, error and not-found surfaces.

## Run locally

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Quality commands

```bash
npm run check
npm run test:browser
npm audit
```

`npm run check` runs TypeScript, ESLint, link integrity, confidentiality scanning, metadata checks, repository hygiene and a production build.

## Performance strategy

- The 3D object is dynamically imported only on eligible desktop devices.
- React Three Fiber uses demand rendering instead of a permanent render loop.
- Mobile and reduced-motion contexts receive a lightweight CSS fallback.
- MotoSim playback pauses outside the viewport and under reduced-motion preferences.
- No remote fonts, analytics SDK, chat widget or decorative video is loaded.

## Deploy to Vercel

1. Push this directory to GitHub.
2. Import it in Vercel using the Next.js preset.
3. Set `NEXT_PUBLIC_SITE_URL` to the final production URL.
4. Deploy.
5. Run the browser suite against production:

```bash
PLAYWRIGHT_BASE_URL=https://your-domain.com npm run test:browser
```
