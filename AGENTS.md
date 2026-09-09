<!-- agents-md ceiling: 65 lines -->
# AGENTS.md — wedding

A cyberpunk wedding invitation: a Bun-served React 19 SPA with a Three.js background, a
guest "dossier" browser, an audio layer and EN/RU localisation. [`README.md`](README.md)
covers the feature set and the component tree.

**The event has happened.** Nothing here is speculative work any more: what remains is
keeping the deployed page alive and correct. Guest data is real people's names, photos and
relationships — treat every change to `src/data` as a change about a person, and do not
publish, quote or copy that content anywhere outside this repo.

## Commands, run 2026-09-09

```sh
bun install       # rc=0
bun run build     # rc=0 — Tailwind CLI, then build.ts; emits dist/ with the image assets
bun run dev       # Tailwind in --watch beside `bun --hot src/index.ts`
bun run preview   # build, then serve the built output
bun run start     # NODE_ENV=production bun src/index.ts
```

`bun install` and `bun run build` were exercised; `dev`, `preview` and `start` were not —
they are servers, and nothing about them was verified in this pass.

**There is no test suite and no typecheck script.** The gate is the build plus
`.github/workflows/deploy.yml`, which runs `bun install`, `bun run build`, writes the SPA
redirect and deploys to Cloudflare Pages. A build that succeeds and a page that works are
different claims; open it before you call a change done.

## Two things the build does that a reader would not guess

- **CSS is generated.** `src/compiled.css` is produced by the Tailwind CLI from
  `src/index.css` in `predev` and `build`. Editing the compiled file is overwritten on the
  next run.
- **`dist/_redirects` is written by CI, not by the build.** `echo "/* /index.html 200"` in
  the workflow is what makes client-side routing survive a deep link. A local `bun run
  build` does not produce it, so a locally-served build can 404 on a route that works in
  production — that difference is the workflow's, not a bug in the router.

## Layout

| path | what it is |
|---|---|
| `src/components/cyberpunk/` | the effects layer, including `SoundContext.tsx` and `GlitchContext.tsx` — global state, not props |
| `src/index.ts` | the Bun server entry, used by `dev`, `start` and `preview` |
| `build.ts`, `preview.ts` | the build and preview drivers; there is no vite/webpack config to look for |
| `src/index.css` → `src/compiled.css` | Tailwind source and its **generated** output |
| `src/data/`, `src/photos/`, `styles/` | the guest dossiers, their portraits, and the fonts/audio |

## Conventions that differ from the defaults

- **Bun is the runtime, the bundler and the package manager.** There is no Node script
  path here; `bun.lock` is the lockfile, `package-lock.json` in the tree is vestigial.
- **Sound and glitch are React contexts, deliberately.** A component that reaches for the
  audio element or triggers an effect directly breaks the global mute and the persisted
  preference.
- **Language and audio preferences persist to local storage.** A change to their keys
  silently resets every guest who has already visited.

**Nothing about who may merge, how agents are spawned, or how the maintainer's
machine handles secrets belongs in this file, and none of it is stated here.**
Those are properties of a working environment, not of this project; if you are
contributing, your own conventions apply and nothing in this repo depends on
the maintainer's.
