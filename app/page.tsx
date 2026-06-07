"use client"

import { useState } from "react"
import { weapons } from "@/app/data/weapons"
import { computeAvgEnemyHp, DANGER_LABELS } from "@/app/data/enemies"

function avgDmgPerShot(damage: number, critical: string, critMultiplier: number) {
  const critChance = parseFloat(critical) / 100
  return damage * (1 + critChance * (critMultiplier - 1))
}

function calcDps(damage: number, cooldown: number, critical: string, critMultiplier: number, pierceMultiplier: number, effectiveCooldown?: number) {
  return avgDmgPerShot(damage, critical, critMultiplier) * pierceMultiplier / (effectiveCooldown ?? cooldown)
}

function calcKps(damage: number, critical: string, critMultiplier: number, cooldown: number, avgHp: number, effectiveCooldown?: number) {
  const cd = effectiveCooldown ?? cooldown
  const shotsToKill = Math.ceil(avgHp / avgDmgPerShot(damage, critical, critMultiplier))
  return 1 / (shotsToKill * cd)
}

function dpsClass(dps: number) {
  if (dps >= 150) return "text-red-400 font-bold"
  if (dps >= 75)  return "text-orange-400 font-bold"
  if (dps >= 30)  return "text-yellow-400"
  return "text-zinc-400"
}

function kpsClass(kps: number) {
  if (kps >= 5)   return "text-red-400 font-bold"
  if (kps >= 2)   return "text-orange-400 font-bold"
  if (kps >= 0.5) return "text-yellow-400"
  return "text-zinc-400"
}

export default function Home() {
  const [query, setQuery] = useState("")
  const [wave, setWave] = useState(1)
  const [danger, setDanger] = useState(0)

  const avgHp = computeAvgEnemyHp(wave, danger)

  const sorted = [...weapons].sort(
    (a, b) =>
      calcDps(b.damage, b.cooldown, b.critical, b.critMultiplier, b.pierceMultiplier, b.effectiveCooldown) -
      calcDps(a.damage, a.cooldown, a.critical, a.critMultiplier, a.pierceMultiplier, a.effectiveCooldown)
  )

  const ranked = sorted.map((w, i) => ({ ...w, rank: i + 1 }))
  const terms = query.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
  const filtered = terms.length
    ? ranked.filter((w) => terms.some((t) => w.name.toLowerCase().includes(t)))
    : ranked

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-8 font-mono">
      <div className="max-w-[1400px] mx-auto">
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          type="search"
          placeholder="Search weapons..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 min-w-48 px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 text-base"
        />
        <select
          value={wave}
          onChange={(e) => setWave(Number(e.target.value))}
          className="px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-zinc-500 text-sm"
        >
          {Array.from({ length: 20 }, (_, i) => i + 1).map((w) => (
            <option key={w} value={w}>Wave {w}</option>
          ))}
        </select>
        <select
          value={danger}
          onChange={(e) => setDanger(Number(e.target.value))}
          className="px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-zinc-500 text-sm"
        >
          {[0, 1, 2, 3, 4, 5].map((d) => (
            <option key={d} value={d}>{DANGER_LABELS[d]}</option>
          ))}
        </select>
      </div>

      <div className="overflow-auto rounded-xl border border-zinc-700 max-h-[calc(100vh-11rem)]">
        <table className="w-full text-base text-left">
          <thead className="sticky top-0 z-10">
            <tr className="bg-zinc-800 text-zinc-400 uppercase text-sm tracking-wider">
              <th className="px-4 py-3 font-semibold">#</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold text-right">Damage</th>
              <th className="px-4 py-3 font-semibold text-right">Crit</th>
              <th className="px-4 py-3 font-semibold text-right">Cooldown</th>
              <th className="px-4 py-3 font-semibold text-right">Knockback</th>
              <th className="px-4 py-3 font-semibold text-right">Range</th>
              <th className="px-4 py-3 font-semibold text-right">Pierce</th>
              <th className="px-4 py-3 font-semibold">Special</th>
              <th className="px-4 py-3 font-semibold text-right text-orange-400">DPS ⚡</th>
              <th className="px-4 py-3 font-semibold text-right text-purple-400">KPS 💀</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((weapon) => {
              const dps = calcDps(weapon.damage, weapon.cooldown, weapon.critical, weapon.critMultiplier, weapon.pierceMultiplier, weapon.effectiveCooldown)
              const kps = calcKps(weapon.damage, weapon.critical, weapon.critMultiplier, weapon.cooldown, avgHp, weapon.effectiveCooldown)
              return (
                <tr
                  key={weapon.name}
                  className="border-t border-zinc-800 hover:bg-zinc-900/60 transition-colors"
                >
                  <td className="px-4 py-2.5 text-zinc-600 tabular-nums">{weapon.rank}</td>
                  <td className="px-4 py-2.5 font-medium text-zinc-100 whitespace-nowrap">{weapon.name}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-zinc-300">{weapon.damage}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-zinc-400">{weapon.critical}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-zinc-400">{weapon.cooldown}s</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-zinc-400">{weapon.knockback}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-zinc-400">{weapon.range}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-zinc-400">
                    {weapon.pierceMultiplier > 1 ? `${weapon.pierceMultiplier.toFixed(2)}×` : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-zinc-500 max-w-xs text-sm">{weapon.special}</td>
                  <td className={`px-4 py-2.5 text-right tabular-nums ${dpsClass(dps)}`}>
                    {dps.toFixed(1)}
                  </td>
                  <td className={`px-4 py-2.5 text-right tabular-nums ${kpsClass(kps)}`}>
                    {kps.toFixed(2)}
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-zinc-600">
                  No weapons match &quot;{query}&quot;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-zinc-600">
        Stats sourced from{" "}
        <a
          href="https://brotato.wiki.spellsandguns.com/Weapons"
          className="underline hover:text-zinc-400 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          brotato.wiki.spellsandguns.com
        </a>
        . Base Tier 1 values only. DPS includes crit and pierce multipliers; excludes stat scaling and DoT bonuses. KPS = 1 ÷ (shots-to-kill × cooldown), accounting for overkill.
      </p>
      </div>
    </main>
  )
}
