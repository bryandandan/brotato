// When the player picks statKey during level-up, also add (pickedValue × ratio) to targetStat
// e.g. Hunter: onPick range → pctDmg × 0.1  (1% dmg per 10 range)
type RuleOnPick   = { type: "onPick";   statKey: string; targetStat: "meleeDmg"|"rangedDmg"|"elementalDmg"|"pctDmg"|"atkSpeed"|"critChance"; ratio: number }
// Picks of statKey are scaled by mult before applying
// e.g. Hunter crit picks × 1.25; Captain all picks × 2
type RulePickMult = { type: "pickMult"; statKey: string; mult: number }
// Every level-up adds amount to targetStat regardless of what was picked
// e.g. Apprentice: +2 meleeDmg per level
type RulePerLevel = { type: "perLevel"; targetStat: "meleeDmg"|"rangedDmg"|"elementalDmg"; amount: number }
export type SpecialRule = RuleOnPick | RulePickMult | RulePerLevel

export type Character = {
  name: string
  // Starting DPS stats (unconditional base values only)
  meleeDmg: number     // flat Melee Damage stat bonus
  rangedDmg: number    // flat Ranged Damage stat bonus
  elementalDmg?: number // flat Elemental Damage stat bonus (omit = 0)
  pctDmg: number       // % damage bonus
  atkSpeed: number     // % attack speed bonus (negative = slower)
  critChance: number   // bonus crit chance %
  critDmg: number      // bonus crit damage %
  // Display-only stats
  maxHp: number
  armor: number
  speed: number
  luck: number
  harvesting: number
  engineering: number
  // Restrictions / special notes (shown in UI, not used in calc)
  restriction?: string
  note?: string        // relevant conditional mechanics
  specialRules?: SpecialRule[]
  dlc?: boolean
}

export const characters: Character[] = [
  // ── Base game ──────────────────────────────────────────────────────────────
  {
    name: "Well Rounded",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 5, armor: 0, speed: 5, luck: 0, harvesting: 8, engineering: 0,
  },
  {
    name: "Brawler",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    restriction: "Unarmed only",
    note: "+50% Attack Speed with Unarmed weapons, +15% Dodge",
  },
  {
    name: "Crazy",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 25, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: -10,
    note: "+100 Range with Precise weapons, -30% Dodge",
  },
  {
    name: "Ranger",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 50, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: -25, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    restriction: "Ranged only",
    note: "+50% Ranged Damage, +50 Range",
  },
  {
    name: "Mage",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: -50,
    restriction: "Elemental only",
    note: "+25% Elemental Dmg mods, −100% Melee/Ranged mods",
  },
  {
    name: "Chunky",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 25, armor: 0, speed: -100, luck: 0, harvesting: 0, engineering: 0,
    note: "+1% Damage per 3 Max HP, −100% Speed, −50% Dodge, −100% Lifesteal",
  },
  {
    name: "Old",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: -10, luck: 0, harvesting: 10, engineering: 0,
    note: "−25% Enemy Speed, −33% Map Size",
  },
  {
    name: "Lucky",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: -60, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 100, harvesting: 0, engineering: 0,
    note: "+100 Luck, +25% Luck mods, −50% XP Gain",
  },
  {
    name: "Mutant",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "Levels 66% faster, items cost 50% more",
  },
  {
    name: "Generalist",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "Max 3 melee + 3 ranged; cross-type damage scaling",
  },
  {
    name: "Loud",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 30, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: -3, engineering: 0,
    note: "+50% Enemies",
  },
  {
    name: "Multitasker",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 20, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "+20% Damage, −5% Damage per weapon equipped (max 12 weapons)",
  },
  {
    name: "Wildling",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    restriction: "Tier 2 weapons max",
    note: "+30% Lifesteal with Primitive weapons",
  },
  {
    name: "Pacifist",
    meleeDmg: 0, rangedDmg: 0, pctDmg: -100, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: -100,
    note: "−100% Damage; gain materials from surviving enemies",
  },
  {
    name: "Gladiator",
    meleeDmg: 5, rangedDmg: 0, pctDmg: 0, atkSpeed: -40, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: -30, harvesting: 0, engineering: 0,
    restriction: "Melee only",
    note: "+20% Attack Speed per different weapon equipped",
  },
  {
    name: "Saver",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 15, engineering: 0,
    note: "+1% Damage per 25 Materials held",
  },
  {
    name: "Sick",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 12, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "+25% Lifesteal, −1 Damage/second passive, −100 HP Regen",
  },
  {
    name: "Farmer",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 20, engineering: 0,
    note: "+3% Harvesting end-of-wave, −50% materials dropped",
  },
  {
    name: "Ghost",
    meleeDmg: 10, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: -100, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "+10 Damage with Ethereal weapons, +30% Dodge (cap 90%)",
  },
  {
    name: "Speedy",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: -3, speed: 30, luck: 0, harvesting: 0, engineering: 0,
    note: "+1 Melee Damage per 2% Speed; −100 Armor when standing still",
  },
  {
    name: "Entrepreneur",
    meleeDmg: 0, rangedDmg: 0, pctDmg: -50, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "−25% Item Prices, +50% Harvesting mods, −100% materials start-of-wave",
  },
  {
    name: "Engineer",
    meleeDmg: 0, rangedDmg: 0, pctDmg: -50, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 10,
    note: "+10 Engineering, +25% Engineering mods",
  },
  {
    name: "Explorer",
    meleeDmg: 0, rangedDmg: 0, pctDmg: -40, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 10, luck: 0, harvesting: 0, engineering: 0,
    note: "+50% Pickup Range, +33% Map Size, +25% Enemies",
  },
  {
    name: "Doctor",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: -100, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 5, engineering: 0,
    note: "+200% Attack Speed with Medical weapons, +5 HP Regen, +100% HP Regen mods",
  },
  {
    name: "Hunter",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 10, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: -33, armor: 0, speed: 0, luck: 0, harvesting: -100, engineering: 0,
    note: "+100 Range starting → +10% Damage (1% per 10 Range); +25% Crit Chance mods",
    specialRules: [
      { type: "onPick",   statKey: "range",      targetStat: "pctDmg",    ratio: 0.1  },
      { type: "pickMult", statKey: "critChance",  mult: 1.25 },
    ],
  },
  {
    name: "Artificer",
    meleeDmg: 0, rangedDmg: 0, pctDmg: -100, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "+175% Explosion Damage, +100% Tool weapon Damage",
  },
  {
    name: "Arms Dealer",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 33, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 30, engineering: 0,
    note: "+33% Damage mods, −95% Weapon Prices, weapons destroyed entering shop",
  },
  {
    name: "Streamer",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 40, atkSpeed: 40, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "Bonuses only while moving; −50% materials dropped",
  },
  {
    name: "Cyborg",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: -75,
    restriction: "Ranged only",
    note: "+200% Ranged Damage mods (level-up gains tripled), −100% Melee/Elemental mods",
  },
  {
    name: "Glutton",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 50, harvesting: 0, engineering: 0,
    note: "Consumables explode for 10 damage",
  },
  {
    name: "Jack",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "+125% Damage vs bosses/elites, +200% materials, −70% Enemies, +175% Enemy HP",
  },
  {
    name: "Lich",
    meleeDmg: 0, rangedDmg: 0, pctDmg: -50, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "+10 HP Regen, +10% Lifesteal, −50% Damage mods",
  },
  {
    name: "Apprentice",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "+2 Melee/+1 Ranged/+1 Elemental Damage per level; −2 Max HP per level",
  },
  {
    name: "Cryptid",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "+3 Atk Speed dodging, Dodge capped 70%, −100 Range, −100% Lifesteal",
  },
  {
    name: "Fisherman",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 5, armor: 0, speed: 0, luck: 0, harvesting: 20, engineering: 0,
    note: "+2 Harvesting per Bait, −100% Bait Price",
  },
  {
    name: "Golem",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 40, critChance: 0, critDmg: 0,
    maxHp: 20, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "Atk Speed/Speed bonuses only <50% HP; cannot heal",
  },
  {
    name: "King",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 50, harvesting: 0, engineering: 0,
    note: "+25% Damage/Atk Speed per Tier IV weapon; penalties per Tier I weapon",
  },
  {
    name: "Renegade",
    meleeDmg: 0, rangedDmg: 0, pctDmg: -400, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    restriction: "Ranged only",
    note: "+2 Projectiles, +1 Pierce, +10% Damage per different Tier I item, −80% Dmg mods",
  },
  {
    name: "One Armed",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 100, atkSpeed: 200, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "+100% Damage mods, +200% Atk Speed; max 1 weapon",
  },
  {
    name: "Bull",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 20, armor: 10, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    restriction: "No weapons",
    note: "Cannot equip weapons; explodes on taking damage (30 dmg, 1.5× crit)",
  },
  {
    name: "Soldier",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 50, atkSpeed: 50, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 10, luck: 0, harvesting: 0, engineering: 0,
    note: "Damage/Atk Speed bonuses only while standing still; cannot attack while moving",
  },
  {
    name: "Masochist",
    meleeDmg: 0, rangedDmg: 0, pctDmg: -100, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 10, armor: 8, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "+5% Damage when taking damage end-of-wave (stacks), +20 HP Regen",
  },
  {
    name: "Knight",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: -50, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 3, speed: 0, luck: 0, harvesting: -80, engineering: 0,
    restriction: "Melee only, Tier 2+ only",
    note: "+2 Melee Damage per 1 Armor; −80% Harvesting mods",
  },
  {
    name: "Demon",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "Buys items with Max HP; materials → Max HP end-of-wave",
  },
  {
    name: "Baby",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 12, engineering: 0,
    note: "Gains weapon slots each level instead of stats (up to 24)",
  },
  {
    name: "Vagabond",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: -5, speed: 0, luck: -50, harvesting: -50, engineering: 0,
    note: "Weapons count toward other class bonuses; cannot equip duplicates",
  },
  {
    name: "Technomage",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    restriction: "No standard weapons",
    note: "+5% Structure Atk Speed per Elemental Dmg; −100% Melee/Ranged mods",
  },
  {
    name: "Vampire",
    meleeDmg: 0, rangedDmg: 0, pctDmg: -60, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: -25, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "+2% Damage per 1% missing HP; +1% Lifesteal per 3% missing HP",
  },
  // ── DLC ────────────────────────────────────────────────────────────────────
  {
    name: "Sailor",
    meleeDmg: 0, rangedDmg: 0, pctDmg: -25, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: -100, engineering: 0,
    restriction: "Tier 2+ only",
    note: "+200% Damage with Naval/Cursed weapons; Dodge capped 20%",
    dlc: true,
  },
  {
    name: "Curious",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "+2% XP Gain per different item; −10% Damage per duplicate item",
    dlc: true,
  },
  {
    name: "Builder",
    meleeDmg: 0, rangedDmg: 0, pctDmg: -75, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 20, engineering: 0,
    note: "Structure Atk Speed scales from uncollected materials; cannot have structures",
    dlc: true,
  },
  {
    name: "Captain",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "⚡ Level-up stat gains doubled (+100%); +200% XP required; enemies grow stronger each wave",
    dlc: true,
  },
  {
    name: "Creature",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "Weapon damage scales 35% Curse; +1 Curse per level",
    dlc: true,
  },
  {
    name: "Chef",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 35, harvesting: 0, engineering: 0,
    note: "+200% Non-Elemental Damage vs burning enemies; −75% Elemental mods",
    dlc: true,
  },
  {
    name: "Druid",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 5, armor: 0, speed: 0, luck: 15, harvesting: 0, engineering: -50,
    note: "+33% Luck per fruit; −100 HP Regen, −100% Lifesteal",
    dlc: true,
  },
  {
    name: "Dwarf",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: -100, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    restriction: "Melee only",
    note: "+1 Melee Dmg per 2 permanent Engineering; +1 Engineering per 6+ hit enemies",
    dlc: true,
  },
  {
    name: "Gangster",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "Steal 1 item per shop visit; +20% Item Prices; cannot lock items",
    dlc: true,
  },
  {
    name: "Diver",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 200,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    restriction: "Precise weapons only",
    note: "+200% Crit Damage with Precise weapons; +25% Crit Chance mods; −100 Ranged Dmg",
    dlc: true,
  },
  {
    name: "Hiker",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: -5, luck: 0, harvesting: 0, engineering: 0,
    note: "5 materials per 10 steps; +1 Max HP per 80 steps; +10% Speed mods",
    dlc: true,
  },
  {
    name: "Buccaneer",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: -100, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "+100% Material value on pickup; resets weapon cooldowns on pickup",
    dlc: true,
  },
  {
    name: "Ogre",
    meleeDmg: 10, rangedDmg: 0, pctDmg: 0, atkSpeed: -50, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: -10, luck: 0, harvesting: 0, engineering: 0,
    restriction: "Melee only",
    note: "+10 Melee Damage; enemies at 2× max HP explode (10 dmg)",
    dlc: true,
  },
  {
    name: "Romantic",
    meleeDmg: 0, rangedDmg: 0, pctDmg: 0, atkSpeed: 0, critChance: 0, critDmg: 0,
    maxHp: 0, armor: 0, speed: 0, luck: 0, harvesting: 0, engineering: 0,
    note: "+50 Range (melee); 5% chance to charm <25% HP enemies; −3% Damage per 5 Curse",
    dlc: true,
  },
]
