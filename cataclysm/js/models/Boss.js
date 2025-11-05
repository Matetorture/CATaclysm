export class Boss {
    constructor(id, name, maxHp, weakness, onlyWeakness, baseRewardMoney) {
        this.id = id;
        this.name = name;
        this.maxHp = maxHp;
        this.hp = maxHp;
        this.weakness = weakness; // Array of weakness types
        this.onlyWeakness = onlyWeakness; // Boolean - can only be damaged by weakness
        this.baseRewardMoney = baseRewardMoney;
    }

    resetHp() {
        this.hp = this.maxHp;
    }

    getHpPercent() {
        return ((this.hp / this.maxHp) * 100).toFixed(1);
    }

    isDefeated() {
        return this.hp <= 0;
    }

    takeDamage(amount) {
        this.hp = Math.max(0, this.hp - amount);
        return this.isDefeated();
    }

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }
}

export class BossCategory {
    constructor(id, name, img, bosses) {
        this.id = id;
        this.name = name;
        this.img = img;
        this.bosses = bosses; // Array of Boss instances
    }

    getBossById(bossId) {
        return this.bosses.find(b => b.id === bossId);
    }

    getAllBosses() {
        return this.bosses;
    }

    getBossCount() {
        return this.bosses.length;
    }
}
