export type Weapon = {
  name: string
  // Existing fields (T1 values — used by the weapons table)
  damage: number
  critical: string
  critMultiplier: number
  cooldown: number
  effectiveCooldown?: number
  pierceMultiplier: number
  knockback: number
  range: number
  special: string
  // Per-tier base damage [T1, T2, T3, T4]
  // Unavailable tiers repeat the nearest available value
  tierDamage: [number, number, number, number]
  // % of Melee Damage stat added to weapon damage per tier
  meleeScaling: [number, number, number, number]
  // % of Ranged Damage stat added to weapon damage per tier
  rangedScaling: [number, number, number, number]
  // % of Elemental Damage stat added to weapon damage per tier (optional — omit if none)
  elementalScaling?: [number, number, number, number]
  // Lowest tier this weapon actually exists in-game
  availableFrom: 1 | 2 | 3 | 4
}

// Helper to repeat a value across all 4 tiers
const flat = (n: number): [number, number, number, number] => [n, n, n, n]

export const weapons: Weapon[] = [
  // ── Melee ─────────────────────────────────────────────────────────────────
  {
    name: "Anchor", damage: 45, critical: "3%", critMultiplier: 1.5, cooldown: 1.92,
    pierceMultiplier: 1, knockback: 10, range: 175, special: "Naval/Heavy weapon",
    tierDamage: [45, 45, 70, 110], meleeScaling: [100, 100, 125, 150], rangedScaling: flat(0), availableFrom: 2,
  },
  {
    name: "Brick", damage: 30, critical: "3%", critMultiplier: 1.5, cooldown: 1.39,
    pierceMultiplier: 1, knockback: 5, range: 150, special: "1% chance to drop materials on break",
    tierDamage: [30, 60, 90, 120], meleeScaling: [50, 65, 80, 100], rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Cacti Club", damage: 10, critical: "3%", critMultiplier: 2, cooldown: 1.66,
    pierceMultiplier: 1, knockback: 8, range: 200, special: "Spawns projectiles on hit",
    tierDamage: [10, 20, 30, 50], meleeScaling: [80, 85, 90, 100], rangedScaling: [50, 60, 70, 80], availableFrom: 1,
  },
  {
    name: "Captain's Sword", damage: 50, critical: "3%", critMultiplier: 2, cooldown: 1.03,
    pierceMultiplier: 1, knockback: 5, range: 200, special: "Bonus damage per free weapon slot",
    tierDamage: [50, 50, 50, 80], meleeScaling: [100, 100, 100, 125], rangedScaling: flat(0), availableFrom: 3,
  },
  {
    name: "Chainsaw", damage: 10, critical: "3%", critMultiplier: 1.5, cooldown: 0.53,
    pierceMultiplier: 1, knockback: 0, range: 175, special: "Forced cooldown every 30 shots",
    tierDamage: [10, 10, 10, 20], meleeScaling: [75, 75, 75, 100], rangedScaling: flat(0), availableFrom: 3,
  },
  {
    name: "Chopper", damage: 6, critical: "10%", critMultiplier: 2, cooldown: 0.99,
    pierceMultiplier: 1, knockback: 2, range: 135, special: "Heal bonus from consumables",
    tierDamage: [6, 12, 18, 30], meleeScaling: flat(50), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Circular Saw", damage: 10, critical: "5%", critMultiplier: 2, cooldown: 0.72,
    pierceMultiplier: 1, knockback: 0, range: 175, special: "Medical/Blade class",
    tierDamage: [10, 10, 15, 25], meleeScaling: flat(100), rangedScaling: flat(0), availableFrom: 2,
  },
  {
    name: "Claw", damage: 5, critical: "10%", critMultiplier: 2, cooldown: 0.78,
    pierceMultiplier: 1, knockback: 2, range: 150, special: "Precise weapon",
    tierDamage: [5, 10, 15, 25], meleeScaling: flat(50), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "DEX-troyer", damage: 100, critical: "3%", critMultiplier: 2, cooldown: 1.33,
    pierceMultiplier: 1, knockback: 10, range: 400, special: "50% chance to explode; spawns lightning",
    tierDamage: flat(100), meleeScaling: flat(100), rangedScaling: flat(0), availableFrom: 4,
  },
  {
    name: "Drill", damage: 10, critical: "50%", critMultiplier: 2.5, cooldown: 0.45,
    pierceMultiplier: 1, knockback: 5, range: 100, special: "Attack speed stacks over time; materials on crit kill",
    tierDamage: flat(10), meleeScaling: flat(100), rangedScaling: flat(0), availableFrom: 4,
  },
  {
    name: "Excalibur", damage: 200, critical: "10%", critMultiplier: 2.5, cooldown: 0.66,
    pierceMultiplier: 1, knockback: 5, range: 200, special: "−3 Armor per weapon equipped",
    tierDamage: flat(200), meleeScaling: flat(200), rangedScaling: flat(0), availableFrom: 4,
  },
  {
    name: "Fist", damage: 8, critical: "1%", critMultiplier: 1.5, cooldown: 0.78,
    pierceMultiplier: 1, knockback: 15, range: 150, special: "Unarmed basic weapon",
    tierDamage: [8, 16, 32, 64], meleeScaling: flat(100), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Flaming Brass Knuckles", damage: 16, critical: "1%", critMultiplier: 1.5, cooldown: 0.73,
    pierceMultiplier: 1, knockback: 15, range: 150, special: "Deals burning damage",
    tierDamage: [16, 16, 32, 64], meleeScaling: flat(100), rangedScaling: flat(0), availableFrom: 2,
  },
  {
    name: "Ghost Axe", damage: 12, critical: "3%", critMultiplier: 2, cooldown: 1.73,
    pierceMultiplier: 1, knockback: 2, range: 200, special: "Damage boost per kills with weapon",
    tierDamage: [12, 18, 24, 40], meleeScaling: flat(100), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Ghost Flint", damage: 6, critical: "3%", critMultiplier: 2, cooldown: 1.23,
    pierceMultiplier: 1, knockback: 2, range: 150, special: "Attack speed boost per kills",
    tierDamage: [6, 9, 12, 18], meleeScaling: flat(100), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Hammer", damage: 35, critical: "3%", critMultiplier: 1.75, cooldown: 1.67,
    pierceMultiplier: 1, knockback: 30, range: 175, special: "Heavy blunt with knockback bonus",
    tierDamage: [35, 70, 110, 110], meleeScaling: [150, 175, 200, 200], rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Hand", damage: 1, critical: "1%", critMultiplier: 1.5, cooldown: 1.01,
    pierceMultiplier: 1, knockback: 30, range: 150, special: "Harvesting support weapon",
    tierDamage: flat(1), meleeScaling: flat(50), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Hatchet", damage: 5, critical: "3%", critMultiplier: 2, cooldown: 0.68,
    pierceMultiplier: 1, knockback: 2, range: 125, special: "Primitive melee weapon",
    tierDamage: [5, 10, 20, 40], meleeScaling: flat(100), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Hiking Pole", damage: 12, critical: "3%", critMultiplier: 1.5, cooldown: 1.42,
    pierceMultiplier: 1, knockback: 0, range: 175, special: "Range increases per steps taken",
    tierDamage: [12, 18, 24, 30], meleeScaling: flat(50), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Jousting Lance", damage: 20, critical: "3%", critMultiplier: 2, cooldown: 1.58,
    pierceMultiplier: 1, knockback: 0, range: 250, special: "Damage penalty when stationary",
    tierDamage: [20, 25, 30, 50], meleeScaling: flat(50), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Knife", damage: 6, critical: "20%", critMultiplier: 2.5, cooldown: 1.01,
    pierceMultiplier: 1, knockback: 2, range: 150, special: "High crit chance",
    tierDamage: [6, 9, 12, 20], meleeScaling: flat(80), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Lightning Shiv", damage: 3, critical: "4%", critMultiplier: 2, cooldown: 1.01,
    pierceMultiplier: 1, knockback: 0, range: 150, special: "Spawns lightning projectile on hit",
    tierDamage: [3, 6, 9, 15], meleeScaling: flat(80), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Lute", damage: 4, critical: "3%", critMultiplier: 1.5, cooldown: 1.31,
    pierceMultiplier: 1, knockback: 2, range: 150, special: "Enemies take increased damage debuff",
    tierDamage: [4, 8, 12, 16], meleeScaling: flat(50), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Mace", damage: 40, critical: "3%", critMultiplier: 1.5, cooldown: 1.39,
    pierceMultiplier: 1, knockback: 5, range: 150, special: "Medieval heavy weapon",
    tierDamage: [40, 60, 100, 100], meleeScaling: flat(100), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Plank", damage: 10, critical: "3%", critMultiplier: 2, cooldown: 1.23,
    pierceMultiplier: 1, knockback: 5, range: 150, special: "25% chance to explode on hit",
    tierDamage: [10, 15, 20, 25], meleeScaling: [50, 60, 70, 80], rangedScaling: flat(0),
    elementalScaling: [50, 60, 70, 80], availableFrom: 1,
  },
  {
    name: "Plasma Sledge", damage: 80, critical: "3%", critMultiplier: 1.75, cooldown: 1.55,
    pierceMultiplier: 1, knockback: 30, range: 175, special: "25–50% explosion chance",
    tierDamage: [80, 80, 80, 120], meleeScaling: [150, 150, 150, 200], rangedScaling: flat(0),
    elementalScaling: [150, 150, 150, 200], availableFrom: 3,
  },
  {
    name: "Power Fist", damage: 40, critical: "1%", critMultiplier: 1.5, cooldown: 0.69,
    pierceMultiplier: 1, knockback: 15, range: 150, special: "25–50% explosion chance",
    tierDamage: [40, 40, 40, 60], meleeScaling: flat(100), rangedScaling: flat(0), availableFrom: 3,
  },
  {
    name: "Pruner", damage: 10, critical: "3%", critMultiplier: 1.25, cooldown: 1.14,
    pierceMultiplier: 1, knockback: 2, range: 150, special: "Creates garden spawning fruit",
    tierDamage: [10, 15, 20, 25], meleeScaling: [50, 67, 83, 100], rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Quarterstaff", damage: 10, critical: "3%", critMultiplier: 1.5, cooldown: 1.42,
    pierceMultiplier: 1, knockback: 0, range: 175, special: "Alternates attacks; XP gain bonus",
    tierDamage: [10, 15, 20, 30], meleeScaling: [50, 65, 85, 100], rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Rock", damage: 20, critical: "10%", critMultiplier: 1.5, cooldown: 1.68,
    pierceMultiplier: 1, knockback: 5, range: 150, special: "Primitive blunt weapon",
    tierDamage: [20, 35, 50, 70], meleeScaling: flat(100), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Scissors", damage: 5, critical: "10%", critMultiplier: 2, cooldown: 1.01,
    pierceMultiplier: 1, knockback: 2, range: 150, special: "40% lifesteal",
    tierDamage: [5, 10, 15, 20], meleeScaling: flat(80), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Screwdriver", damage: 8, critical: "10%", critMultiplier: 2, cooldown: 1.05,
    pierceMultiplier: 1, knockback: 3, range: 125, special: "Spawns landmine periodically",
    tierDamage: [8, 12, 16, 20], meleeScaling: flat(50), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Scythe", damage: 150, critical: "3%", critMultiplier: 2, cooldown: 0.72,
    pierceMultiplier: 1, knockback: 5, range: 250, special: "100% lifesteal; take damage over time",
    tierDamage: flat(150), meleeScaling: flat(150), rangedScaling: flat(0), availableFrom: 4,
  },
  {
    name: "Sharp Tooth", damage: 5, critical: "3%", critMultiplier: 2, cooldown: 1.14,
    pierceMultiplier: 1, knockback: 2, range: 150, special: "Lifesteal scales with missing HP",
    tierDamage: [5, 8, 11, 15], meleeScaling: flat(50), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Sickle", damage: 5, critical: "3%", critMultiplier: 2, cooldown: 0.87,
    pierceMultiplier: 1, knockback: 2, range: 125, special: "Bonus damage vs low HP enemies",
    tierDamage: [5, 8, 12, 15], meleeScaling: flat(80), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Spear", damage: 15, critical: "3%", critMultiplier: 2, cooldown: 1.52,
    pierceMultiplier: 1, knockback: 0, range: 350, special: "Long range thrust attack",
    tierDamage: [15, 25, 40, 60], meleeScaling: flat(100), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Spiky Shield", damage: 10, critical: "3%", critMultiplier: 2, cooldown: 1.16,
    pierceMultiplier: 1, knockback: 20, range: 150, special: "Scales with Armor stat only",
    tierDamage: [10, 15, 20, 30], meleeScaling: flat(0), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Spoon", damage: 10, critical: "0%", critMultiplier: 2, cooldown: 1.06,
    pierceMultiplier: 1, knockback: 2, range: 150, special: "Always crits burning targets",
    tierDamage: [10, 15, 20, 25], meleeScaling: flat(50), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Stick", damage: 8, critical: "3%", critMultiplier: 1.5, cooldown: 1.29,
    pierceMultiplier: 1, knockback: 0, range: 175, special: "Bonus damage per additional sticks held",
    tierDamage: [8, 9, 10, 12], meleeScaling: flat(100), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Sword", damage: 25, critical: "3%", critMultiplier: 2, cooldown: 1.28,
    pierceMultiplier: 1, knockback: 5, range: 200, special: "Alternates thrust/sweep attacks",
    tierDamage: [25, 25, 40, 60], meleeScaling: flat(100), rangedScaling: flat(0), availableFrom: 2,
  },
  {
    name: "Thief Dagger", damage: 6, critical: "20%", critMultiplier: 2, cooldown: 1.01,
    pierceMultiplier: 1, knockback: 2, range: 150, special: "Materials on crit kill",
    tierDamage: [6, 12, 18, 30], meleeScaling: flat(50), rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Thunder Sword", damage: 30, critical: "3%", critMultiplier: 2, cooldown: 1.21,
    pierceMultiplier: 1, knockback: 5, range: 200, special: "Spawns slowing projectiles on hit",
    tierDamage: [30, 30, 30, 60], meleeScaling: [125, 125, 125, 150], rangedScaling: flat(0),
    elementalScaling: [125, 125, 125, 150], availableFrom: 3,
  },
  {
    name: "Torch", damage: 1, critical: "0%", critMultiplier: 1.5, cooldown: 1.10,
    pierceMultiplier: 1, knockback: 20, range: 175, special: "Applies & spreads burning damage",
    tierDamage: flat(1), meleeScaling: [50, 65, 80, 100], rangedScaling: flat(0),
    elementalScaling: [50, 65, 80, 100], availableFrom: 1,
  },
  {
    name: "Trident", damage: 30, critical: "3%", critMultiplier: 2, cooldown: 1.58,
    pierceMultiplier: 1, knockback: 0, range: 325, special: "Bonus damage vs high HP enemies",
    tierDamage: [30, 30, 50, 80], meleeScaling: flat(100), rangedScaling: flat(0), availableFrom: 2,
  },
  {
    name: "Vorpal Sword", damage: 20, critical: "3%", critMultiplier: 2, cooldown: 1.11,
    pierceMultiplier: 1, knockback: 5, range: 200, special: "Chance to instantly kill enemy",
    tierDamage: [20, 20, 35, 55], meleeScaling: flat(100), rangedScaling: flat(0), availableFrom: 2,
  },
  {
    name: "War Hammer", damage: 100, critical: "3%", critMultiplier: 1.5, cooldown: 2.11,
    pierceMultiplier: 1, knockback: 20, range: 200, special: "Resets turret cooldowns on hit",
    tierDamage: [100, 100, 100, 180], meleeScaling: [150, 150, 150, 200], rangedScaling: flat(0), availableFrom: 3,
  },
  {
    name: "Wrench", damage: 12, critical: "3%", critMultiplier: 2, cooldown: 1.70,
    pierceMultiplier: 1, knockback: 20, range: 175, special: "Spawns turrets (type scales with tier)",
    tierDamage: [12, 16, 20, 24], meleeScaling: flat(100), rangedScaling: flat(0), availableFrom: 1,
  },

  // ── Ranged ────────────────────────────────────────────────────────────────
  {
    name: "Blunderbuss", damage: 25, critical: "3%", critMultiplier: 2, cooldown: 5.20,
    pierceMultiplier: 2.25, knockback: 10, range: 325, special: "Pierces 2 enemies (−25% each)",
    tierDamage: [25, 25, 50, 80], meleeScaling: flat(0), rangedScaling: [100, 100, 125, 150], availableFrom: 2,
  },
  {
    name: "Chain Gun", damage: 6, critical: "3%", critMultiplier: 1.5, cooldown: 0.073,
    pierceMultiplier: 1.5, knockback: 5, range: 500, special: "2×3 burst; forced cooldown every 100 shots; pierces 1 (−50%)",
    tierDamage: flat(6), meleeScaling: flat(0), rangedScaling: flat(100), availableFrom: 4,
  },
  {
    name: "Crossbow", damage: 10, critical: "30%", critMultiplier: 1.5, cooldown: 1.13,
    pierceMultiplier: 1.15, knockback: 8, range: 350, special: "Pierces 1 (−50%) on crit only",
    tierDamage: [10, 12, 15, 18], meleeScaling: flat(0), rangedScaling: flat(50), availableFrom: 1,
  },
  {
    name: "Double Barrel Shotgun", damage: 12, critical: "3%", critMultiplier: 2, cooldown: 1.37,
    pierceMultiplier: 2.10, knockback: 8, range: 350, special: "3×4 burst; pierces 2 (−30% each)",
    tierDamage: [12, 24, 36, 54], meleeScaling: flat(0), rangedScaling: [80, 85, 90, 100], availableFrom: 1,
  },
  {
    name: "Fireball", damage: 5, critical: "3%", critMultiplier: 1.5, cooldown: 1.12,
    pierceMultiplier: 1, knockback: 0, range: 400, special: "Explodes on hit; burning damage",
    tierDamage: [5, 5, 10, 20], meleeScaling: flat(0), rangedScaling: flat(0),
    elementalScaling: [25, 25, 50, 75], availableFrom: 2,
    // Scales with Elemental Damage only (not modelled)
  },
  {
    name: "Flamethrower", damage: 1, critical: "0%", critMultiplier: 2, cooldown: 0.12,
    pierceMultiplier: 1, knockback: 0, range: 250, special: "Burning damage; pierces up to 99 enemies",
    tierDamage: flat(1), meleeScaling: flat(0), rangedScaling: flat(0),
    elementalScaling: flat(1), availableFrom: 2,
  },
  {
    name: "Flute", damage: 5, critical: "3%", critMultiplier: 1.5, cooldown: 1.20,
    pierceMultiplier: 1, knockback: 0, range: 300, special: "10% chance to charm enemies below 60% HP",
    tierDamage: [5, 8, 11, 15], meleeScaling: flat(0), rangedScaling: flat(50), availableFrom: 1,
  },
  {
    name: "Gatling Laser", damage: 10, critical: "10%", critMultiplier: 3, cooldown: 0.073,
    pierceMultiplier: 2.5, knockback: 5, range: 500, special: "Pierces 3 enemies (−25% each)",
    tierDamage: flat(10), meleeScaling: flat(0), rangedScaling: flat(100), availableFrom: 4,
  },
  {
    name: "Ghost Scepter", damage: 10, critical: "3%", critMultiplier: 2, cooldown: 0.98,
    pierceMultiplier: 1, knockback: 2, range: 300, special: "+1 Max HP per 20 wave kills",
    tierDamage: [10, 15, 20, 30], meleeScaling: flat(0), rangedScaling: flat(100), availableFrom: 1,
  },
  {
    name: "Icicle", damage: 10, critical: "5%", critMultiplier: 2, cooldown: 1.03,
    pierceMultiplier: 1.5, knockback: 5, range: 400, special: "Pierces 1 (−50%); elemental scaling",
    tierDamage: [10, 20, 30, 40], meleeScaling: flat(0), rangedScaling: flat(0),
    elementalScaling: flat(100), availableFrom: 1,
  },
  {
    name: "Laser Gun", damage: 40, critical: "3%", critMultiplier: 2, cooldown: 1.98,
    pierceMultiplier: 1.75, knockback: 0, range: 500, special: "Pierces 1 (−25%)",
    tierDamage: [40, 55, 70, 100], meleeScaling: flat(0), rangedScaling: [400, 450, 500, 600], availableFrom: 1,
  },
  {
    name: "Medical Gun", damage: 10, critical: "3%", critMultiplier: 2, cooldown: 0.87,
    pierceMultiplier: 1, knockback: 0, range: 400, special: "40% lifesteal",
    tierDamage: [10, 15, 20, 30], meleeScaling: flat(0), rangedScaling: flat(100), availableFrom: 1,
  },
  {
    name: "Pistol", damage: 12, critical: "5%", critMultiplier: 2, cooldown: 1.20,
    pierceMultiplier: 1.5, knockback: 15, range: 400, special: "Pierces 1 (−50%)",
    tierDamage: [12, 20, 30, 50], meleeScaling: flat(0), rangedScaling: flat(100), availableFrom: 1,
  },
  {
    name: "Revolver", damage: 15, critical: "3%", critMultiplier: 2, cooldown: 0.43,
    effectiveCooldown: 0.775, pierceMultiplier: 1, knockback: 15, range: 450,
    special: "Every 6th shot triggers 2.07s forced cooldown (avg ~0.78s)",
    tierDamage: [15, 20, 25, 40], meleeScaling: flat(0), rangedScaling: [100, 130, 165, 200], availableFrom: 1,
  },
  {
    name: "Shredder", damage: 5, critical: "3%", critMultiplier: 2, cooldown: 1.30,
    pierceMultiplier: 4, knockback: 0, range: 450, special: "50% chance to explode; pierces 3 at full damage",
    tierDamage: [5, 10, 15, 25], meleeScaling: flat(0), rangedScaling: flat(50), availableFrom: 1,
  },
  {
    name: "Shuriken", damage: 6, critical: "35%", critMultiplier: 1.5, cooldown: 0.87,
    pierceMultiplier: 1, knockback: 0, range: 350, special: "Critical hits bounce 1 time",
    tierDamage: [6, 8, 10, 15], meleeScaling: [25, 34, 42, 50], rangedScaling: flat(0), availableFrom: 1,
  },
  {
    name: "Slingshot", damage: 10, critical: "3%", critMultiplier: 2, cooldown: 1.22,
    pierceMultiplier: 1, knockback: 5, range: 300, special: "Bounces 1 time",
    tierDamage: [10, 13, 16, 20], meleeScaling: flat(0), rangedScaling: flat(80), availableFrom: 1,
  },
  {
    name: "SMG", damage: 3, critical: "1%", critMultiplier: 1.5, cooldown: 0.17,
    pierceMultiplier: 1, knockback: 0, range: 400, special: "High ranged damage scaling; inaccurate at long range",
    tierDamage: [3, 4, 5, 8], meleeScaling: flat(0), rangedScaling: [50, 60, 70, 80], availableFrom: 1,
  },
  {
    name: "Taser", damage: 6, critical: "3%", critMultiplier: 2, cooldown: 0.95,
    pierceMultiplier: 1, knockback: 0, range: 200, special: "Slows enemies in radius around projectile",
    tierDamage: [6, 6, 6, 12], meleeScaling: flat(0), rangedScaling: flat(0),
    elementalScaling: [80, 70, 60, 50], availableFrom: 1,
  },
  {
    name: "Wand", damage: 1, critical: "0%", critMultiplier: 2, cooldown: 0.87,
    pierceMultiplier: 1, knockback: 10, range: 350, special: "Fires 3×3 burning projectiles; elemental scaling",
    tierDamage: flat(1), meleeScaling: flat(0), rangedScaling: flat(0),
    elementalScaling: [50, 65, 80, 100], availableFrom: 1,
  },
]
