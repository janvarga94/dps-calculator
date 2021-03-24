import { Spell, SpellTick, flameShock, lavaBurst, lightningBolt, flameShockTick } from "./spells";

function calculateSpellDamage(spell: Spell | SpellTick, bonusSpellDamage: number): number {
    return spell.baseDamage + (spell.spellDamageBonusPerc / 100 + 1) * bonusSpellDamage;
}

interface CharacterStats {
    critChancePerc: number;
    hasteMultiplier: number;
    bonusSpellDamage: number;
}

interface SpellCooldown {
    spell: Spell;
    endMills: number;
}

interface Debuff {
    tick: SpellTick;
    endMills: number;
}

export interface DamageTick {
    spell: Spell | SpellTick;
    damage: number;
    isCrit?: boolean;
    happenedAtMills: number;
};

export class Engine {
    private currentMills = 0;
    private currentTargetDebuffs: Debuff[] = [];
    private currentSpellCooldowns: SpellCooldown[] = [];

    damageTicks: DamageTick[] = [];

    private GCDdurationMills: number;

    constructor(private characterStats: CharacterStats) {
        this.GCDdurationMills = 1.5 / characterStats.hasteMultiplier * 1000;
        if (this.GCDdurationMills < 750) this.GCDdurationMills = 750;
    }


    isSpellOnCd(spell: Spell) {
        return this.currentSpellCooldowns.find(cd => cd.spell === spell);
    }

    whatSpellToCastNext(): Spell {
        if (!this.isSpellOnCd(flameShock) && this.currentTargetDebuffs.every(d => d.tick !== flameShockTick)) {
            return flameShock;
        }
        if (!this.isSpellOnCd(lavaBurst) && this.currentTargetDebuffs.some(d => d.tick === flameShockTick)) {
            return lavaBurst;
        }
        return lightningBolt;
    }

    run(durationMills: number) {
        while (this.currentMills < durationMills) {
            this.currentSpellCooldowns = this.currentSpellCooldowns.filter(cd => cd.endMills > this.currentMills);
            this.currentTargetDebuffs = this.currentTargetDebuffs.filter(cd => cd.endMills > this.currentMills)


            const spellToCast = this.whatSpellToCastNext();
            const damage = calculateSpellDamage(spellToCast, this.characterStats.bonusSpellDamage);
            const spellCastDurationMills = (spellToCast.castTimeMilliseconds || 0) / this.characterStats.hasteMultiplier;

            this.damageTicks.push({ spell: spellToCast, damage, happenedAtMills: this.currentMills + spellCastDurationMills });

            if (spellToCast === flameShock) {
                const damage = calculateSpellDamage(flameShockTick, this.characterStats.bonusSpellDamage);
                const damagePerTick = damage / 6;
                const totalTickDurationMills = 18000 / this.characterStats.hasteMultiplier;
                this.damageTicks.push(...[1, 2, 3, 4, 5, 6].map((num, idx) => {
                    const tick: DamageTick = {
                        damage: damagePerTick,
                        spell: flameShockTick,
                        happenedAtMills: this.currentMills + (idx + 1) * totalTickDurationMills / 6 / this.characterStats.hasteMultiplier
                    };
                    return tick;
                }))
                this.currentTargetDebuffs.push({ tick: flameShockTick, endMills: this.currentMills + totalTickDurationMills })
            }

            if (spellToCast.cooldownMills) {
                this.currentSpellCooldowns.push({ spell: spellToCast, endMills: this.currentMills + spellToCast.cooldownMills })
            }


            console.log("previous mils", this.currentMills, spellToCast);
            if (spellCastDurationMills < this.GCDdurationMills)
                this.currentMills += this.GCDdurationMills;
            else this.currentMills += spellCastDurationMills
            console.log("next mils", this.currentMills);

        }
    }
}