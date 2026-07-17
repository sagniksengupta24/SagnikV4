# Validation Report

## Automated gates

| Gate | Result |
|---|---|
| TypeScript | Passed |
| ESLint | Passed with 0 warnings |
| Static link check | Passed — 14 static links |
| Confidentiality scan | Passed after updating the public boundary for Indus Agent |
| Metadata check | Passed |
| Repository hygiene | Passed |
| Next.js production build | Passed |
| Dependency audit | Passed — 0 vulnerabilities |
| Static WCAG A/AA scan | Passed at 1440 × 900 and 390 × 844 |
| Horizontal overflow | 0 px at 1440 and 390 px |

## Visual verification

- Full-page desktop and mobile renders were inspected.
- Hero composition, project transitions, experiment archive, capabilities, method, about and contact were reviewed separately at readable scale.
- The mobile MotoSim bike position was corrected so the vehicle does not clip at the start of the replay.
- Low-contrast editorial labels were raised to WCAG-compliant values.
- The site remains readable without client-side animation and supplies a lightweight mobile/reduced-motion 3D fallback.

## Browser-suite note

The Playwright interaction suite was updated for the new Indus, NIFTY and MotoSim experiences. The container's managed Chromium blocks direct navigation to local and intercepted URLs with `ERR_BLOCKED_BY_ADMINISTRATOR`, so the complete hydrated Playwright run could not be executed here. TypeScript, ESLint, production build, static browser rendering, responsive overflow checks and axe analysis all passed.

## External checks after deployment

- Run the included Playwright suite against the public production URL.
- Run Lighthouse from the deployed region.
- Complete one manual VoiceOver or NVDA pass.

## 3D/cursor integration validation

- TypeScript: passed
- ESLint with zero warnings: passed
- Static link validation: passed
- Confidentiality scan: passed
- Metadata validation: passed
- Archive hygiene: passed
- Next.js production build: passed
- Browser automation: the managed Chromium environment blocks navigation to local development URLs with `ERR_BLOCKED_BY_ADMINISTRATOR`; this is an environment restriction rather than an application failure.
