# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Purpose

A simple reference app for the video game **Brotato** — a roguelite wave survival game. The app surfaces useful game stats and info: weapon DPS, item effects, synergies, and similar data to help players make informed build decisions.

## Commands

```bash
npm run dev      # start dev server (Turbopack by default)
npm run build    # production build (Turbopack by default)
npm run start    # start production server
npm run lint     # run ESLint directly (not `next lint` — removed in v16)
```

No test runner is configured yet.

## Stack

- **Next.js 16.2** — App Router, React 19, TypeScript 5
- **Tailwind CSS v4** — configured via `@import "tailwindcss"` in `globals.css`; theme tokens defined with `@theme inline`
- **Geist fonts** — loaded via `next/font/google` in `app/layout.tsx`

## Next.js 16 breaking changes to know

Read `node_modules/next/dist/docs/` before writing code — especially `01-app/02-guides/upgrading/version-16.md`.

Key differences from prior versions:

- **Turbopack is the default bundler** for both `next dev` and `next build`. Custom `webpack` configs will break the build. Use `--webpack` flag to opt out.
- **`middleware.ts` → `proxy.ts`**: The file and exported function are renamed. `proxy` runs Node.js only (no `edge` runtime). Keep using `middleware.ts` if you need the edge runtime.
- **`next lint` removed**: Use `eslint` directly. `next build` no longer runs linting.
- **`serverRuntimeConfig` / `publicRuntimeConfig` removed**: Use `process.env` and `NEXT_PUBLIC_` prefix instead.
- **`experimental.dynamicIO` → `cacheComponents`**: Top-level config key, enables Cache Components / PPR.
- **`unstable_` prefix removed** from stabilized APIs (`unstable_cache` → `use cache` directive, etc.).
- **`use cache` directive**: Replaces `unstable_cache`. Add `'use cache'` at the top of a Server Component or async function to cache its output. Use `cacheLife` and `cacheTag` from `next/cache` for TTL and tag-based invalidation.
- **Async Request APIs**: `cookies()`, `headers()`, `draftMode()`, `params`, and `searchParams` are now async — must be awaited.
- **Instant navigation**: For routes that should navigate instantly with `cacheComponents` enabled, export `unstable_instant` from the route. Wrap uncached data in `<Suspense>`. See `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md`.
- **AMP removed**: `next/amp` and `amp` config are gone.
- **`devIndicators`** options `appIsrStatus`, `buildActivity`, `buildActivityPosition` removed.

## Project layout

```
app/
  layout.tsx          # root layout — includes Nav
  page.tsx            # /weapons — DPS table
  build/page.tsx      # /build  — character build planner
  components/Nav.tsx  # sticky nav bar
  data/
    weapons.ts        # all weapon stats + per-tier damage/scaling
    characters.ts     # all character starting stats + special rules
    enemies.ts        # enemy base HP, wave appearance, difficulty multipliers
  globals.css         # Tailwind v4 import + CSS custom properties
public/               # static assets
next.config.ts        # NextConfig
```

## Data model — adding a new character

Characters live in `app/data/characters.ts`. Each entry has:
- **Starting DPS stats** (flat numbers applied before any level-up): `meleeDmg`, `rangedDmg`, `elementalDmg`, `pctDmg`, `atkSpeed`, `critChance`
- **Display-only stats**: `maxHp`, `armor`, `speed`, `luck`, `harvesting`, `engineering`
- **Optional `specialRules`** — character-specific mechanics that affect how level-up picks work

### Special rules

Three rule types (defined in `SpecialRule` union type at top of `characters.ts`):

```ts
// Picking stat X also adds (pickedValue × ratio) to a DPS stat
{ type: "onPick",   statKey: "range",     targetStat: "pctDmg",    ratio: 0.1 }
// Picks of stat X are multiplied before applying
{ type: "pickMult", statKey: "critChance", mult: 1.25 }
// Every level-up adds amount to a DPS stat regardless of what was picked
{ type: "perLevel", targetStat: "meleeDmg", amount: 2 }
```

**Hunter example:**
```ts
specialRules: [
  { type: "onPick",   statKey: "range",     targetStat: "pctDmg",    ratio: 0.1 },
  { type: "pickMult", statKey: "critChance", mult: 1.25 },
],
```

**Known characters with pending rules** (data only — no code changes needed):

| Character | Rule | Notes |
|-----------|------|-------|
| Knight    | `onPick` armor → meleeDmg × 2 | `{ type:"onPick", statKey:"armor", targetStat:"meleeDmg", ratio:2 }` |
| Speedy    | `onPick` speed → meleeDmg × 0.5 | `{ type:"onPick", statKey:"speed", targetStat:"meleeDmg", ratio:0.5 }` |
| Captain   | `pickMult` × 2 on all DPS stats | One rule per stat key |
| Apprentice | `perLevel` +2 meleeDmg, +1 rangedDmg | Two `perLevel` rules |
| Chunky    | `onPick` hp → pctDmg × 0.33 | 1% Damage per 3 Max HP |
| Mage      | `pickMult` elementalDmg × 1.25; `pickMult` meleeDmg × 0 (or omit) | Elemental mods +25%, melee/ranged mods -100% |

### Adding a character with special rules

1. Add entry to `characters` array in `app/data/characters.ts`
2. Set starting DPS stats accurately (check wiki: `brotato.wiki.spellsandguns.com/Characters`)
3. Add `specialRules` array if the character has cross-stat interactions
4. No code changes needed — `statsUpTo()` and `expandedOptions` in `app/build/page.tsx` automatically apply all rules

### Weapon scaling model

Weapons have per-tier arrays: `tierDamage`, `meleeScaling`, `rangedScaling`, `elementalScaling` (all `[T1, T2, T3, T4]`).

DPS formula:
```
effectiveDmg = tierDamage[tier]
  + meleeStat  × meleeScaling[tier]  / 100
  + rangedStat × rangedScaling[tier] / 100
  + elemStat   × elementalScaling[tier] / 100
```

`elementalScaling` is optional — omit it for weapons with no elemental component (defaults to 0).
