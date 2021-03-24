
export interface Spell {
    name: string;
    baseDamage: number;
    spellDamageBonusPerc: number;
    castTimeMilliseconds?: number;
    cooldownMills?: number;
}

export interface SpellTick {
    name: string;
    baseDamage: number;
    spellDamageBonusPerc: number;
    totalTickingDurationMills: number;
}

export const flameShockTick: SpellTick = {
    name: "Flame Shock Tick",
    baseDamage: 834,
    spellDamageBonusPerc: 10,
    totalTickingDurationMills: 18000
}

export const flameShock: Spell = {
    name: "Flame Shock",
    spellDamageBonusPerc: 21.43,
    baseDamage: 500,
    cooldownMills: 4000
}
export const lightningBolt: Spell = {
    name: "Lightning Bolt",
    castTimeMilliseconds: 2500,
    spellDamageBonusPerc: 91.43,
    baseDamage: 765
}
export const lavaBurst: Spell = {
    name: "Lava Burst",
    castTimeMilliseconds: 2000,
    spellDamageBonusPerc: 92.14,
    baseDamage: 1355,
    cooldownMills: 8000
}
