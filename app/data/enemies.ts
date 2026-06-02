// Enemy data sourced from brotato.wiki.spellsandguns.com/Enemies
// baseHp = HP at first appearance (firstWave)
// HP at any later wave = baseHp * HP_SCALE_PER_WAVE ^ (wave - firstWave)
// minDanger = minimum Danger level required for enemy to appear

export type Enemy = {
  name: string
  baseHp: number
  firstWave: number
  minDanger: 0 | 1 | 2 | 3 | 4 | 5
  isBoss?: boolean
}

// Per-wave HP growth factor (~35% per wave, approximated from community data)
export const HP_SCALE_PER_WAVE = 1.35

// HP multipliers per Danger level (source: wiki.spellsandguns.com/Dangers)
// Danger 0-2: no HP modifier (differ only in enemy variety / elite waves)
// Danger 3: +12% HP, Danger 4: +26% HP, Danger 5: +40% HP
export const DANGER_HP_MULT: Record<number, number> = {
  0: 1.00,
  1: 1.00,
  2: 1.00,
  3: 1.12,
  4: 1.26,
  5: 1.40,
}

export const DANGER_LABELS: Record<number, string> = {
  0: "Danger 0",
  1: "Danger 1",
  2: "Danger 2",
  3: "Danger 3 (+12% HP)",
  4: "Danger 4 (+26% HP)",
  5: "Danger 5 (+40% HP)",
}

export const enemies: Enemy[] = [
  // ── Always spawn (Danger 0+) ──────────────────────────────────────────────
  { name: "Baby Alien",     baseHp: 3,     firstWave: 1,  minDanger: 0 },
  { name: "Gobbler",        baseHp: 5,     firstWave: 1,  minDanger: 0 },
  { name: "Tree",           baseHp: 10,    firstWave: 1,  minDanger: 0 },
  { name: "Chaser",         baseHp: 1,     firstWave: 2,  minDanger: 0 },
  { name: "Charger",        baseHp: 4,     firstWave: 3,  minDanger: 0 },
  { name: "Looter",         baseHp: 5,     firstWave: 3,  minDanger: 0 },
  { name: "Spitter",        baseHp: 8,     firstWave: 4,  minDanger: 0 },
  { name: "Bruiser",        baseHp: 20,    firstWave: 8,  minDanger: 0 },
  { name: "Pursuer",        baseHp: 10,    firstWave: 11, minDanger: 0 },
  { name: "Fin Alien",      baseHp: 12,    firstWave: 15, minDanger: 0 },
  { name: "Spawner",        baseHp: 10,    firstWave: 14, minDanger: 0 },
  { name: "Junkie",         baseHp: 5,     firstWave: 14, minDanger: 0 },
  { name: "Buffer",         baseHp: 20,    firstWave: 16, minDanger: 0 },
  { name: "Horned Charger", baseHp: 12,    firstWave: 18, minDanger: 0 },

  // ── Danger 1+ ─────────────────────────────────────────────────────────────
  { name: "Fly",            baseHp: 15,    firstWave: 4,  minDanger: 1 },
  { name: "Slasher",        baseHp: 50,    firstWave: 4,  minDanger: 1 },
  { name: "Slasher Egg",    baseHp: 5,     firstWave: 7,  minDanger: 1 },
  { name: "Healer",         baseHp: 10,    firstWave: 7,  minDanger: 1 },
  { name: "Horned Bruiser", baseHp: 30,    firstWave: 8,  minDanger: 1 },
  { name: "Fin Alien (D1)", baseHp: 12,    firstWave: 9,  minDanger: 1 },
  { name: "Helmet Alien",   baseHp: 8,     firstWave: 10, minDanger: 1 },
  { name: "Horned Bruiser", baseHp: 30,    firstWave: 13, minDanger: 1 },

  // ── Danger 3+ ─────────────────────────────────────────────────────────────
  { name: "Tentacle",       baseHp: 100,   firstWave: 13, minDanger: 3 },

  // ── Danger 4+ ─────────────────────────────────────────────────────────────
  { name: "Helmet Alien (D4)", baseHp: 8,  firstWave: 4,  minDanger: 4 },
  { name: "Horned Charger (D4)", baseHp: 12, firstWave: 5, minDanger: 4 },

  // ── Wave 20 bosses (excluded from avg HP calc) ────────────────────────────
  { name: "Predator",       baseHp: 29900, firstWave: 20, minDanger: 0, isBoss: true },
  { name: "Invoker",        baseHp: 29900, firstWave: 20, minDanger: 0, isBoss: true },
]

export function computeAvgEnemyHp(wave: number, danger: number): number {
  const eligible = enemies.filter(
    (e) => !e.isBoss && e.firstWave <= wave && e.minDanger <= danger
  )
  if (eligible.length === 0) return 10
  const total = eligible.reduce(
    (sum, e) => sum + e.baseHp * Math.pow(HP_SCALE_PER_WAVE, wave - e.firstWave),
    0
  )
  return Math.round((total / eligible.length) * (DANGER_HP_MULT[danger] ?? 1))
}
