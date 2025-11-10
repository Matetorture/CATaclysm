import { gameState } from '../data/gameState.js';
import { getCurrentBoss } from '../ui/bossRenderer.js';

export function getModifiedStats(card, slotType) {
    const base = card.getStats();
    let attack = base.attack, speed = base.speed, crit = base.crit;
    let modifiedType = card.attackType;

    switch(slotType) {
        case 'B': // Bloody - attack * 3
            attack = attack * 3;
            break;
        case 'S': // Shiny - attack speed / 3
            speed = Math.floor(speed / 3);
            break;
        case 'L': // Lucky - crit rate * 2
            crit = crit * 2;
            break;
        case 'R': // Rainbow - all stats boosted
            attack *= 2;
            speed = Math.floor(speed / 2);
            crit *= 1.3;
            break;
        case 'N': // Negative - change attack type to boss weakness (keep as array)
            const boss = getCurrentBoss();
            if (boss && boss.weakness.length > 0) {
                modifiedType = [boss.weakness[0]];
            }
            break;
    }
    return { attack, speed, crit, modifiedType };
}
