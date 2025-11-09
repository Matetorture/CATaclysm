export class CatCard {
    constructor(id, number, name, collection, rarity, baseAttack, baseSpeed, baseCrit, attackType, copies = 1) {
        this.id = id;
        this.number = number; // e.g., "1.1", "1.52", "4.2"
        this.name = name;
        this.collection = collection;
        this.rarity = rarity; // Common, Uncommon, Rare, Epic, Legendary, Ultimate
        this.baseAttack = baseAttack;
        this.baseSpeed = baseSpeed;
        this.baseCrit = baseCrit; // In percentage
        this.attackType = attackType; // Array of attack types: Fire, Water, Stone, Plant, Air, Electric, Ice, Holy, Dark
        this.copies = copies; // Number of copies owned
    }

    getLevel() {
        if (this.copies < 1) return 0;
        if (this.copies < 2) return 1;
        if (this.copies < 6) return 2;
        if (this.copies < 14) return 3;
        if (this.copies < 30) return 4;
        if (this.copies < 62) return 5;
        return 6;
    }

    getCopiesForNextLevel() {
        const level = this.getLevel();
        const copiesNeeded = [1, 2, 6, 14, 30, 62];
        return copiesNeeded[level] || 62;
    }

    getCopiesDisplay() {
        const level = this.getLevel();
        const copiesNeeded = this.getCopiesForNextLevel();
        
        if (level === 6) {
            return `MAX`;
        }
        
        const prevLevelCopies = level === 0 ? 0 : [1, 2, 6, 14, 30, 62][level - 1];
        const copiesInThisLevel = this.copies - prevLevelCopies;
        const copiesNeededForThisLevel = copiesNeeded - prevLevelCopies;
        
        return `${copiesInThisLevel}/${copiesNeededForThisLevel}`;
    }

    getLevelDisplay() {
        const level = this.getLevel();
        return level === 6 ? 'MAX' : `LEVEL ${level}`;
    }

    getStats() {
        const level = this.getLevel();
        return {
            attack: Math.floor(this.baseAttack * level * 2),
            speed: Math.floor(this.baseSpeed / ((level + 1))),
            crit: (this.baseCrit * level * 1.5).toFixed(1)
        };
    }

    getRarityClass() {
        return `rarity-${this.rarity.toLowerCase()}`;
    }

    getDPS() {
        const stats = this.getStats();
        const attacksPerSecond = 1000 / stats.speed;
        const critMultiplier = 2;
        const critChance = stats.crit / 100;

        const damagePerHit = stats.attack;

        const dps = damagePerHit * attacksPerSecond;

        const dpsWithCrit = 
        (damagePerHit * (1 - critChance) + damagePerHit * critMultiplier * critChance) * attacksPerSecond;

        return {
            dps: dps.toFixed(2),
            dpsWithCrit: dpsWithCrit.toFixed(2),
        };
    }

    calculateCritDPS() {
        const dpsData = this.getDPS();
        return parseFloat(dpsData.dpsWithCrit);
    }
}
