"use client"

import { useState, useMemo } from "react"
import { weapons } from "@/app/data/weapons"
import { characters } from "@/app/data/characters"
import { computeAvgEnemyHp, DANGER_LABELS } from "@/app/data/enemies"

// ── Stat definitions ─────────────────────────────────────────────────────────
const STATS = [
  { key: "meleeDmg",    label: "MELEE DMG",    tiers: [3, 6, 10, 15],   suffix: "",  affectsDps: true  },
  { key: "rangedDmg",  label: "RANGED DMG",  tiers: [3, 6, 10, 15],   suffix: "",  affectsDps: true  },
  { key: "elementalDmg", label: "ELEM DMG",  tiers: [3, 6, 10, 15],   suffix: "",  affectsDps: true  },
  { key: "pctDmg",     label: "% DMG",       tiers: [5, 10, 15],      suffix: "%", affectsDps: true  },
  { key: "atkSpeed",   label: "ATK SPD",    tiers: [5, 10, 15],      suffix: "%", affectsDps: true  },
  { key: "critChance", label: "CRIT %",     tiers: [2, 4, 6, 8],     suffix: "%", affectsDps: true  },
  { key: "range",      label: "RANGE",      tiers: [15, 30, 50],     suffix: "",  affectsDps: false },
  { key: "luck",       label: "LUCK",       tiers: [1, 2, 3, 5],     suffix: "",  affectsDps: false },
  { key: "hp",         label: "MAX HP",     tiers: [10, 20, 30, 50], suffix: "",  affectsDps: false },
  { key: "hpRegen",    label: "HP REGEN",   tiers: [1, 2, 3, 5],     suffix: "",  affectsDps: false },
  { key: "armor",      label: "ARMOR",      tiers: [1, 2, 3],        suffix: "",  affectsDps: false },
  { key: "speed",      label: "SPEED",      tiers: [5, 10, 20],      suffix: "%", affectsDps: false },
]

// Tier unlocking: every 5 levels unlocks the next tier
// Levels 1-5 → tier 1, 6-10 → tier 2, 11-15 → tier 3, 16-25 → tier 4
function maxTierIdx(levelIdx: number) {
  return Math.min(Math.floor(levelIdx / 5), 3)
}

const TIER_STYLE: Record<number, { idle: string; active: string }> = {
  1: { idle: "text-zinc-400 bg-zinc-800 hover:bg-zinc-700", active: "bg-zinc-500 text-zinc-100" },
  2: { idle: "text-green-500 bg-green-900/20 hover:bg-green-900/40", active: "bg-green-500 text-zinc-950" },
  3: { idle: "text-blue-400 bg-blue-900/20 hover:bg-blue-900/40", active: "bg-blue-400 text-zinc-950" },
  4: { idle: "text-purple-400 bg-purple-900/20 hover:bg-purple-900/40", active: "bg-purple-400 text-zinc-950" },
}
// ── DPS formula ───────────────────────────────────────────────────────────────
// effectiveDmg = tierBaseDmg + meleeStat*(meleeScaling/100) + rangedStat*(rangedScaling/100)
function calcDps(
  effectiveDmg: number, pctDmg: number,
  atkSpeed: number, critChance: number, critMult: number,
  cooldown: number, pierce: number
) {
  const total = effectiveDmg * (1 + pctDmg / 100)
  const avg = total * (1 + (critChance / 100) * (critMult - 1)) * pierce
  return avg / (cooldown / (1 + atkSpeed / 100))
}

function effectiveDmg(
  tierDamage: number,
  meleeStat: number, rangedStat: number, elementalStat: number,
  meleeScaling: number, rangedScaling: number, elementalScaling: number
) {
  return tierDamage
    + (meleeStat    * meleeScaling    / 100)
    + (rangedStat   * rangedScaling   / 100)
    + (elementalStat * elementalScaling / 100)
}

type Pick = { statKey: string; value: number }

const BASE_CHARS = characters.filter((c) => !c.dlc)

// ── Component ─────────────────────────────────────────────────────────────────
export default function Build() {
  const [selectedChar, setSelectedChar] = useState<string | null>(null)
  const [weaponName, setWeaponName] = useState<string>(weapons[0].name)
  const [weaponTier, setWeaponTier] = useState(1)
  const [noWeapon, setNoWeapon] = useState(false)
  const [levelPicks, setLevelPicks] = useState<(Pick | null)[]>(Array(25).fill(null))
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null)
  const [charFilter, setCharFilter] = useState("")
  const [danger, setDanger] = useState(1)
  const [wave, setWave] = useState(1)

  const char = useMemo(() => BASE_CHARS.find((c) => c.name === selectedChar) ?? null, [selectedChar])
  const weapon = useMemo(
    () => (noWeapon ? null : weapons.find((w) => w.name === weaponName) ?? null),
    [weaponName, noWeapon]
  )
  const tierIdx = weaponTier - 1

  function statsUpTo(levelIdx: number) {
    let meleeDmgStat    = char?.meleeDmg     ?? 0
    let rangedDmgStat   = char?.rangedDmg   ?? 0
    let elementalDmgStat = char?.elementalDmg ?? 0
    let pctDmg          = char?.pctDmg       ?? 0
    let atkSpeed        = char?.atkSpeed     ?? 0
    let critChance      = (weapon ? parseFloat(weapon.critical) : 0) + (char?.critChance ?? 0)
    const rules = char?.specialRules ?? []

    for (let i = 0; i < levelIdx; i++) {
      // perLevel bonuses apply every level regardless of pick (e.g. Apprentice)
      for (const rule of rules) {
        if (rule.type === "perLevel") {
          if (rule.targetStat === "meleeDmg")    meleeDmgStat    += rule.amount
          if (rule.targetStat === "rangedDmg")   rangedDmgStat   += rule.amount
          if (rule.targetStat === "elementalDmg") elementalDmgStat += rule.amount
        }
      }

      const p = levelPicks[i]
      if (!p) continue

      // pickMult: amplify effective pick value
      let effectiveVal = p.value
      for (const rule of rules) {
        if (rule.type === "pickMult" && rule.statKey === p.statKey) {
          effectiveVal = p.value * rule.mult
          break
        }
      }

      if (p.statKey === "meleeDmg")    meleeDmgStat    += effectiveVal
      if (p.statKey === "rangedDmg")   rangedDmgStat   += effectiveVal
      if (p.statKey === "elementalDmg") elementalDmgStat += effectiveVal
      if (p.statKey === "pctDmg")      pctDmg          += effectiveVal
      if (p.statKey === "atkSpeed")    atkSpeed        += effectiveVal
      if (p.statKey === "critChance")  critChance      += effectiveVal

      // onPick cross-stat bonuses (use raw p.value)
      for (const rule of rules) {
        if (rule.type === "onPick" && rule.statKey === p.statKey) {
          const bonus = p.value * rule.ratio
          if (rule.targetStat === "meleeDmg")    meleeDmgStat    += bonus
          if (rule.targetStat === "rangedDmg")   rangedDmgStat   += bonus
          if (rule.targetStat === "elementalDmg") elementalDmgStat += bonus
          if (rule.targetStat === "pctDmg")      pctDmg          += bonus
          if (rule.targetStat === "atkSpeed")    atkSpeed        += bonus
          if (rule.targetStat === "critChance")  critChance      += bonus
        }
      }
    }
    return { meleeDmgStat, rangedDmgStat, elementalDmgStat, pctDmg, atkSpeed, critChance }
  }

  function dpsAt(levelIdx: number): number | null {
    if (!char || !weapon) return null
    const s = statsUpTo(levelIdx)
    const eff = effectiveDmg(
      weapon.tierDamage[tierIdx],
      s.meleeDmgStat, s.rangedDmgStat, s.elementalDmgStat,
      weapon.meleeScaling[tierIdx], weapon.rangedScaling[tierIdx],
      weapon.elementalScaling?.[tierIdx] ?? 0
    )
    return calcDps(eff, s.pctDmg, s.atkSpeed, s.critChance,
      weapon.critMultiplier,
      weapon.effectiveCooldown ?? weapon.cooldown, weapon.pierceMultiplier)
  }

  const avgEnemyHp = computeAvgEnemyHp(wave, danger)

  // Overkill-aware KPS: accounts for wasted damage when a shot exceeds enemy HP
  // shotsToKill = ceil(enemyHP / avgDmgPerHit), KPS = fireRate / shotsToKill
  const kpsAt = (levelIdx: number) => {
    const dps = dpsAt(levelIdx)
    if (dps == null || !weapon) return null
    const cooldown = weapon.effectiveCooldown ?? weapon.cooldown
    const avgDmgPerHit = dps * cooldown
    const shotsToKill = Math.ceil(avgEnemyHp / avgDmgPerHit)
    return 1 / (cooldown * shotsToKill)
  }

  const currentCharLevel = levelPicks.filter(Boolean).length + 1

  // Precompute all options for the currently expanded level
  const expandedOptions = useMemo(() => {
    if (expandedLevel === null || !char || !weapon) return null
    const cooldown = weapon.effectiveCooldown ?? weapon.cooldown
    const critMult = weapon.critMultiplier
    const pierce   = weapon.pierceMultiplier
    const mScaling = weapon.meleeScaling[tierIdx]
    const rScaling = weapon.rangedScaling[tierIdx]
    const eScaling = weapon.elementalScaling?.[tierIdx] ?? 0
    const tierBase = weapon.tierDamage[tierIdx]
    const base = statsUpTo(expandedLevel)
    const prevEff = effectiveDmg(tierBase, base.meleeDmgStat, base.rangedDmgStat, base.elementalDmgStat, mScaling, rScaling, eScaling)
    const prevDps = calcDps(prevEff, base.pctDmg, base.atkSpeed, base.critChance,
      critMult, cooldown, pierce)
    const maxTier = maxTierIdx(expandedLevel)

    const rules = char?.specialRules ?? []

    return STATS.map((stat) => {
      const available = stat.tiers.slice(0, maxTier + 1)
      const locked    = stat.tiers.slice(maxTier + 1)
      const options = available.map((val) => {
        let ms = base.meleeDmgStat, rs = base.rangedDmgStat, es = base.elementalDmgStat
        let p = base.pctDmg, a = base.atkSpeed, c = base.critChance

        // pickMult
        let effectiveVal = val
        for (const rule of rules) {
          if (rule.type === "pickMult" && rule.statKey === stat.key) {
            effectiveVal = val * rule.mult; break
          }
        }

        if (stat.key === "meleeDmg")    ms += effectiveVal
        if (stat.key === "rangedDmg")   rs += effectiveVal
        if (stat.key === "elementalDmg") es += effectiveVal
        if (stat.key === "pctDmg")      p  += effectiveVal
        if (stat.key === "atkSpeed")    a  += effectiveVal
        if (stat.key === "critChance")  c  += effectiveVal

        // onPick cross-stat bonuses
        for (const rule of rules) {
          if (rule.type === "onPick" && rule.statKey === stat.key) {
            const bonus = val * rule.ratio
            if (rule.targetStat === "meleeDmg")    ms += bonus
            if (rule.targetStat === "rangedDmg")   rs += bonus
            if (rule.targetStat === "elementalDmg") es += bonus
            if (rule.targetStat === "pctDmg")      p  += bonus
            if (rule.targetStat === "atkSpeed")    a  += bonus
            if (rule.targetStat === "critChance")  c  += bonus
          }
        }

        const dpsChanged = ms !== base.meleeDmgStat || rs !== base.rangedDmgStat || es !== base.elementalDmgStat ||
                           p  !== base.pctDmg       || a  !== base.atkSpeed      || c  !== base.critChance
        let newDps: number | null = null
        if (dpsChanged) {
          const eff = effectiveDmg(tierBase, ms, rs, es, mScaling, rScaling, eScaling)
          newDps = calcDps(eff, p, a, c, critMult, cooldown, pierce)
        }
        const newKps = newDps != null
          ? 1 / (cooldown * Math.ceil(avgEnemyHp / (newDps * cooldown)))
          : null
        return { val, newDps, newKps, delta: newDps != null ? newDps - prevDps : null }
      })
      const hasDpsImpact = options.some(o => o.newDps !== null)
      return { stat, options, locked, hasDpsImpact }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedLevel, char, weapon, tierIdx, levelPicks])

  const bestKps = useMemo(() => {
    if (!expandedOptions) return null
    let best = -Infinity
    for (const { options } of expandedOptions)
      for (const { newKps } of options)
        if (newKps != null && newKps > best) best = newKps
    return best === -Infinity ? null : best
  }, [expandedOptions])

  function setPick(levelIdx: number, pick: Pick | null) {
    setLevelPicks((prev) => { const n = [...prev]; n[levelIdx] = pick; return n })
    setExpandedLevel(null)
  }

  const baseDps  = dpsAt(0)
  const finalDps = dpsAt(25)

  const filteredChars = useMemo(() => {
    const t = charFilter.toLowerCase()
    return t ? BASE_CHARS.filter((c) => c.name.toLowerCase().includes(t)) : BASE_CHARS
  }, [charFilter])

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-8 font-mono">
      <div className="max-w-[1100px] mx-auto space-y-8">

        {/* ── Character ─────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-base uppercase tracking-widest text-zinc-500 mb-3">Character</h2>
          <div className="bg-zinc-900 rounded-xl border border-zinc-700 p-4 space-y-3">
            <input type="search" placeholder="Filter..." value={charFilter}
              onChange={(e) => setCharFilter(e.target.value)}
              className="w-full max-w-xs px-3 py-1.5 rounded bg-zinc-800 border border-zinc-700 text-base text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500" />
            <div className="flex flex-wrap gap-1.5">
              {filteredChars.map((c) => (
                <button key={c.name} onClick={() => setSelectedChar(c.name)}
                  className={`px-3 py-1.5 rounded text-base font-semibold transition-all ${
                    selectedChar === c.name
                      ? "bg-orange-500 text-zinc-950"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}>
                  {c.name}
                </button>
              ))}
            </div>
            {char && (
              <div className="pt-2 border-t border-zinc-800 space-y-2">
                <div className="flex flex-wrap gap-2 text-sm">
                  {([
                    { label: "MELEE DMG",  v: char.meleeDmg,   dps: true,  s: ""  },
                    { label: "RANGED DMG", v: char.rangedDmg,  dps: true,  s: ""  },
                    { label: "% DMG",      v: char.pctDmg,     dps: true,  s: "%" },
                    { label: "ATK SPD",  v: char.atkSpeed,    dps: true,  s: "%" },
                    { label: "CRIT %",   v: char.critChance,  dps: true,  s: "%" },
                    { label: "CRIT DMG", v: char.critDmg,     dps: true,  s: "%" },
                    { label: "HP",       v: char.maxHp,       dps: false, s: ""  },
                    { label: "ARMOR",    v: char.armor,       dps: false, s: ""  },
                    { label: "SPEED",    v: char.speed,       dps: false, s: "%" },
                    { label: "LUCK",     v: char.luck,        dps: false, s: ""  },
                    { label: "HARVEST",  v: char.harvesting,  dps: false, s: ""  },
                    { label: "ENG",      v: char.engineering, dps: false, s: ""  },
                  ] as {label:string;v:number;dps:boolean;s:string}[])
                    .filter(({ v }) => v !== 0)
                    .map(({ label, v, dps, s }) => (
                      <span key={label} className={`px-2 py-0.5 rounded ${
                        dps ? (v > 0 ? "bg-orange-500/15 text-orange-300" : "bg-red-500/15 text-red-400")
                            : "bg-zinc-800 text-zinc-400"
                      }`}>
                        {label} {v > 0 ? "+" : ""}{v}{s}
                      </span>
                    ))}
                </div>
                {(char.restriction || char.note) && (
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {char.restriction && <span className="text-yellow-500/80 mr-2">[{char.restriction}]</span>}
                    {char.note}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── Danger ────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-base uppercase tracking-widest text-zinc-500 mb-3">Difficulty</h2>
          <div className="bg-zinc-900 rounded-xl border border-zinc-700 p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  onClick={() => setDanger(d)}
                  className={`px-4 py-2 rounded text-base font-semibold transition-all ${
                    danger === d
                      ? d >= 3 ? "bg-red-500 text-zinc-950" : "bg-orange-500 text-zinc-950"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  D{d}
                </button>
              ))}
            </div>
            <p className="text-sm text-zinc-500">{DANGER_LABELS[danger]}</p>
            <p className="text-sm text-zinc-600">
              Danger 0–2: same enemy HP, differs in enemy variety and elite waves.
              Danger 3+: HP multiplier applies to all enemies.
            </p>
          </div>
        </section>

        {/* ── Weapon ────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-base uppercase tracking-widest text-zinc-500 mb-3">Weapon</h2>
          <div className="bg-zinc-900 rounded-xl border border-zinc-700 p-4 space-y-4">
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input type="checkbox" checked={noWeapon} onChange={(e) => setNoWeapon(e.target.checked)} className="accent-orange-500" />
              <span className="text-base text-zinc-400">No weapon (Bull, Technomage, etc.)</span>
            </label>
            {!noWeapon && (
              <>
                <div className="flex flex-wrap items-end gap-4">
                  <label className="flex flex-col gap-1">
                    <span className="text-sm text-zinc-500">Weapon</span>
                    <select value={weaponName}
                      onChange={(e) => {
                        const w = weapons.find(x => x.name === e.target.value)
                        setWeaponName(e.target.value)
                        setWeaponTier(w?.availableFrom ?? 1)
                      }}
                      className="bg-zinc-800 border border-zinc-600 rounded px-2 py-1.5 text-base text-zinc-100 focus:outline-none focus:border-zinc-500">
                      {[...weapons].sort((a, b) => a.name.localeCompare(b.name)).map((w) => (
                        <option key={w.name} value={w.name}>{w.name}</option>
                      ))}
                    </select>
                  </label>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-zinc-500">Tier</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((t) => {
                        const s = TIER_STYLE[t]
                        const unavailable = weapon ? t < weapon.availableFrom : false
                        return (
                          <button key={t}
                            onClick={() => !unavailable && setWeaponTier(t)}
                            disabled={unavailable}
                            className={`px-3 py-1.5 rounded text-sm font-bold transition-all ${
                              unavailable ? "opacity-25 cursor-not-allowed text-zinc-600 bg-zinc-800"
                              : weaponTier === t ? s.active : s.idle
                            }`}>
                            T{t}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
                {weapon && (() => {
                  const base = weapon.tierDamage[tierIdx]
                  const mS = weapon.meleeScaling[tierIdx]
                  const rS = weapon.rangedScaling[tierIdx]
                  const eS = weapon.elementalScaling?.[tierIdx] ?? 0
                  const charPct = char?.pctDmg ?? 0
                  const flatBonus = ((char?.meleeDmg ?? 0) * mS / 100)
                                  + ((char?.rangedDmg ?? 0) * rS / 100)
                                  + ((char?.elementalDmg ?? 0) * eS / 100)
                  const effDmg = (base + flatBonus) * (1 + charPct / 100)
                  const modified = Math.abs(effDmg - base) > 0.001

                  const scalingLabel = mS > 0 ? `+${mS}% Melee`
                    : rS > 0 ? `+${rS}% Ranged`
                    : eS > 0 ? `+${eS}% Elemental`
                    : "no scaling"

                  return (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-sm">
                      {([
                        {
                          label: "Base DMG",
                          rawValue: String(base),
                          effValue: modified ? String(Math.round(effDmg)) : null,
                          sub: scalingLabel,
                        },
                        { label: "Cooldown", rawValue: `${weapon.effectiveCooldown ?? weapon.cooldown}s` },
                        { label: "Crit",     rawValue: weapon.critical },
                        { label: "Crit ×",   rawValue: `${weapon.critMultiplier}×` },
                        { label: "Pierce",   rawValue: `${weapon.pierceMultiplier}×` },
                      ] as {label:string;rawValue:string;effValue?:string|null;sub?:string}[]).map(({ label, rawValue, effValue, sub }) => (
                        <div key={label} className="bg-zinc-800 rounded p-2">
                          <div className="text-zinc-500 text-xs mb-0.5">{label}</div>
                          <div className="font-semibold">
                            {effValue
                              ? <><span className="line-through text-zinc-600">{rawValue}</span>{" "}<span className="text-orange-300">{effValue}</span></>
                              : <span className="text-zinc-200">{rawValue}</span>}
                          </div>
                          {sub && <div className="text-xs text-zinc-500 mt-0.5">{sub}</div>}
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </>
            )}
          </div>
        </section>

        {/* ── Build plan ────────────────────────────────────────────────── */}
        {char && (
          <section>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-4">
                <h2 className="text-base uppercase tracking-widest text-zinc-500">Build Plan — Levels 1–25</h2>
                <span className="text-base font-bold text-orange-400">
                  Level {currentCharLevel}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-zinc-500">
                  Wave
                  <input
                    type="number" min={1} max={20} value={wave}
                    onChange={(e) => setWave(Math.max(1, Math.min(20, Number(e.target.value))))}
                    className="w-14 bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-base text-zinc-100 focus:outline-none focus:border-zinc-500 text-center"
                  />
                  <span className="text-zinc-600">/ 20</span>
                </label>
                <span className="text-sm text-zinc-600">avg enemy HP: {avgEnemyHp.toLocaleString()}</span>
                {levelPicks.some(Boolean) && (
                  <button onClick={() => { setLevelPicks(Array(25).fill(null)); setExpandedLevel(null) }}
                    className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">
                    Clear all
                  </button>
                )}
              </div>
            </div>

            <div className="border border-zinc-700 rounded-xl overflow-hidden">
              <div className="grid grid-cols-[3rem_1fr_6rem_7rem] bg-zinc-800 text-sm uppercase tracking-wider text-zinc-500 px-3 py-2">
                <span>Lvl</span><span>Stat</span>
                <span className="text-right text-purple-400/80">KPS 💀</span>
                <span className="text-right text-orange-400/80">DPS ⚡</span>
              </div>
              <div className="grid grid-cols-[3rem_1fr_6rem_7rem] px-3 py-2 border-t border-zinc-800 bg-zinc-900/30 text-sm text-zinc-600">
                <span>Base</span>
                <span>{char.name}{weapon ? ` · ${weapon.name} T${weaponTier}` : " · no weapon"}</span>
                <span className="text-right tabular-nums text-zinc-500">{kpsAt(0)?.toFixed(2) ?? "—"}</span>
                <span className="text-right tabular-nums text-zinc-500">{baseDps?.toFixed(1) ?? "—"}</span>
              </div>

              {Array.from({ length: 25 }).map((_, i) => {
                const level = i + 1
                const pick = levelPicks[i]
                const dps = dpsAt(level)
                const kps = kpsAt(level)
                const prevDps = dpsAt(i)
                const delta = dps != null && prevDps != null ? dps - prevDps : null
                const isExpanded = expandedLevel === i
                const pickedStat = pick ? STATS.find((s) => s.key === pick.statKey) : null
                const TIER_BANDS: Record<number, string> = { 1: "Tier 1", 6: "Tier 2", 11: "Tier 3", 16: "Tier 4" }

                return (
                  <div key={level}>
                    {TIER_BANDS[level] && (
                      <div className="px-3 py-1.5 bg-zinc-800/40 border-t border-zinc-700/50 text-sm uppercase tracking-widest text-zinc-600">
                        {TIER_BANDS[level]} unlocked
                      </div>
                    )}

                    <button
                      onClick={() => setExpandedLevel(isExpanded ? null : i)}
                      className={`w-full grid grid-cols-[3rem_1fr_6rem_7rem] px-3 py-3 text-left transition-colors border-t border-zinc-800 ${
                        isExpanded ? "bg-zinc-800/80" : "hover:bg-zinc-900/60"
                      }`}
                    >
                      <span className="text-zinc-600 tabular-nums text-base self-center">{level}</span>
                      <span className="self-center">
                        {pick && pickedStat
                          ? <span className={`text-base font-semibold ${pickedStat.affectsDps ? "text-zinc-100" : "text-zinc-400"}`}>
                              {pickedStat.label} +{pick.value}{pickedStat.suffix}
                            </span>
                          : <span className="text-zinc-600 text-base">click to pick</span>}
                      </span>
                      <span className="text-right self-center">
                        {kps != null
                          ? <span className="tabular-nums text-base text-purple-400">{kps.toFixed(2)}</span>
                          : <span className="text-zinc-700 text-base">—</span>}
                      </span>
                      <span className="text-right self-center">
                        {dps != null
                          ? <span className="tabular-nums text-base text-orange-400">{dps.toFixed(1)}</span>
                          : <span className="text-zinc-700 text-base">—</span>}
                        {delta != null && delta > 0.05 && (
                          <span className="block text-green-500/50 text-sm tabular-nums">+{delta.toFixed(1)}</span>
                        )}
                      </span>
                    </button>

                    {/* ── Expanded picker ─────────────────────────────── */}
                    {isExpanded && expandedOptions && (
                      <div className="border-t border-zinc-700/50 bg-zinc-900/60 px-3 py-3 space-y-2">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                          {expandedOptions.map(({ stat, options, locked, hasDpsImpact }) => (
                            <div key={stat.key} className="bg-zinc-800/70 rounded-lg p-3 space-y-2">
                              <div className={`text-sm font-bold uppercase tracking-wider ${hasDpsImpact ? "text-orange-400/90" : "text-zinc-500"}`}>
                                {stat.label}{hasDpsImpact ? " ⚡" : ""}
                              </div>
                              {options.map(({ val, newDps, newKps, delta: d }) => {
                                const isBest = newKps != null && newKps === bestKps
                                const isActive = pick?.statKey === stat.key && pick?.value === val
                                return (
                                  <button key={val}
                                    onClick={() => setPick(i, isActive ? null : { statKey: stat.key, value: val })}
                                    className={`w-full text-left rounded px-2 py-2 text-base transition-all leading-tight ${
                                      isActive
                                        ? "bg-orange-500 text-zinc-950 font-bold"
                                        : isBest
                                        ? "bg-green-500/15 border border-green-500/40 text-green-300 hover:bg-green-500/25"
                                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                    }`}>
                                    <span className="font-mono font-semibold">+{val}{stat.suffix}</span>
                                    {newDps != null && (
                                      <span className="block text-sm mt-0.5 space-y-0.5">
                                        <span className={`block ${isActive ? "text-zinc-800" : "text-zinc-500"}`}>
                                          → {newDps.toFixed(1)} DPS
                                          {d != null && d > 0.05 && (
                                            <span className={isActive ? "text-zinc-800" : "text-green-400/80"}>
                                              {" "}(+{d.toFixed(1)})
                                            </span>
                                          )}
                                        </span>
                                        {newKps != null && (
                                          <span className={`block ${isActive ? "text-zinc-800" : "text-purple-400/70"}`}>
                                            → {newKps.toFixed(2)} KPS
                                          </span>
                                        )}
                                      </span>
                                    )}
                                    {isBest && !isActive && (
                                      <span className="block text-sm text-green-400 font-bold mt-1">★ best KPS</span>
                                    )}
                                  </button>
                                )
                              })}
                              {locked.map((val) => (
                                <div key={val} className="px-2 py-2 text-sm text-zinc-700 font-mono">
                                  +{val}{stat.suffix} 🔒
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                        {pick && (
                          <button onClick={() => setPick(i, null)}
                            className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">
                            Clear level {level}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              {levelPicks.some(Boolean) && (
                <div className="grid grid-cols-[3rem_1fr_6rem_7rem] px-3 py-3 border-t border-zinc-700 bg-zinc-800/60">
                  <span className="text-base text-zinc-600 self-center">Final</span>
                  <span className="text-base text-zinc-400 self-center">
                    {levelPicks.filter(Boolean).length}/25 picked
                    {baseDps != null && finalDps != null && baseDps > 0 && (
                      <span className="ml-2 text-green-400">
                        +{((finalDps / baseDps - 1) * 100).toFixed(0)}% vs base
                      </span>
                    )}
                  </span>
                  <span className="text-right self-center">
                    <span className="text-xl font-bold text-purple-400 tabular-nums">{kpsAt(25)?.toFixed(2) ?? "—"}</span>
                  </span>
                  <span className="text-right self-center">
                    <span className="text-xl font-bold text-orange-400 tabular-nums">{finalDps?.toFixed(1) ?? "—"}</span>
                  </span>
                </div>
              )}
            </div>
          </section>
        )}

        {!char && (
          <p className="text-center text-zinc-700 text-base py-12">Select a character above to start your build</p>
        )}
      </div>
    </main>
  )
}
