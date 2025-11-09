import { gameState } from '../data/gameState.js';
import { getModifiedStats } from '../helpers/modifiers.js';

let deckStatsElement = null;

export function createDeckStatsDisplay() {
    if (deckStatsElement) return;
    
    deckStatsElement = document.createElement('div');
    deckStatsElement.id = 'deck-stats-display';
    deckStatsElement.style.cssText = `
        position: fixed;
        top: 10px;
        left: 60%;
        transform: translateX(-50%);
        background: rgba(35, 33, 60, 0.85);
        border: 2px solid var(--primary-color);
        border-radius: 12px;
        padding: 12px 24px;
        z-index: 999;
        display: flex;
        gap: 24px;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        pointer-events: none;
        user-select: none;
    `;
    
    document.body.appendChild(deckStatsElement);
    updateDeckStats();
}

export function updateDeckStats() {
    if (!deckStatsElement) return;
    
    let totalDPS = 0;
    let totalCritDPS = 0;
    
    gameState.deckCards.forEach((card, index) => {
        if (!card) return;
        
        const slotModifier = gameState.deckModifiers[index];
        let stats;
        
        if (slotModifier) {
            stats = getModifiedStats(card, slotModifier);
            const attacksPerSecond = 1000 / stats.speed;
            const critMultiplier = 2;
            const critChance = stats.crit / 100;
            const damagePerHit = stats.attack;
            const dps = damagePerHit * attacksPerSecond;
            const dpsWithCrit = (damagePerHit * (1 - critChance) + damagePerHit * critMultiplier * critChance) * attacksPerSecond;
            
            totalDPS += dps;
            totalCritDPS += dpsWithCrit;
        } else {
            const cardDPS = card.getDPS();
            totalDPS += parseFloat(cardDPS.dps);
            totalCritDPS += parseFloat(cardDPS.dpsWithCrit);
        }
    });
    
    deckStatsElement.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: #aaa;">Total DPS:</span>
            <span style="color: #ff6464; font-size: 18px;">${totalDPS.toFixed(2)}</span>
        </div>
        <div style="width: 2px; height: 24px; background: var(--border-color);"></div>
        <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: #aaa;">Total Crit DPS:</span>
            <span style="color: #ffe769; font-size: 18px;">${totalCritDPS.toFixed(2)}</span>
        </div>
    `;
}

export function removeDeckStatsDisplay() {
    if (deckStatsElement) {
        deckStatsElement.remove();
        deckStatsElement = null;
    }
}
