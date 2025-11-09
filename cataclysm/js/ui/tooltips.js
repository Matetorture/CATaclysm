import { gameState } from '../data/gameState.js';
import { getModifiedStats } from '../helpers/modifiers.js';

export function showTooltip(element, card, position = 'top') {
    removeTooltip(element);

    const stats = card.getStats();
    const dpsStats = card.getDPS();

    const slotIndex = gameState.deckCards.findIndex(c => c === card);
    const slotType = slotIndex !== -1 ? gameState.deckModifiers[slotIndex] : '';

    let modStats = null;
    if (slotType) {
        modStats = getModifiedStats(card, slotType);
        const attacksPerSecond = 1000 / modStats.speed;
        const critMultiplier = 2;
        const critChance = modStats.crit / 100;
        const damagePerHit = modStats.attack;
        const dps = damagePerHit * attacksPerSecond;
        const dpsWithCrit = (damagePerHit * (1 - critChance) + damagePerHit * critMultiplier * critChance) * attacksPerSecond;
        modStats.dps = dps.toFixed(2);
        modStats.dpsWithCrit = dpsWithCrit.toFixed(2);
    }

    const tooltip = document.createElement('div');
    tooltip.className = `card-tooltip`;
    tooltip.innerHTML = `
        <div style="text-align: center; font-size: 15px; font-weight: bold; color: var(--primary-color); margin-bottom: 2px;">
            ${card.name}
        </div>
        <div style="text-align: center; font-size: 11px; color: #dfccff; font-weight: 500; margin-bottom: 8px;">
            ${card.collection} <span style="color:#aaa;">#${card.number}</span>
        </div>

        <div class="tooltip-stats" style="display: flex; margin-bottom: 8px;">
            <div style="display: flex; flex-direction:column; align-items:center; width:33%;">
                <span style="font-size:13px; color:#fff; font-weight:bold;">A</span>
                <span style="font-size:14px; color:#ff6464; font-weight:600;">${stats.attack}</span>
            </div>
            <div style="display: flex; flex-direction:column; align-items:center; width:33%;">
                <span style="font-size:13px; color:#fff; font-weight:bold;">S</span>
                <span style="font-size:14px; color:#3cb7fa; font-weight:600;">${modStats ? '' : '<span class="speed-timer"></span>'} ${(Number(stats.speed) / 1000).toFixed(2)}s</span>
            </div>
            <div style="display: flex; flex-direction:column; align-items:center; width:33%;">
                <span style="font-size:13px; color:#fff; font-weight:bold;">C</span>
                <span style="font-size:14px; color:#ffe769; font-weight:600;">${stats.crit}%</span>
            </div>
        </div>

        <div class="tooltip-dps-columns">
            <div class="tooltip-dps-label">DPS:</div>
            <div class="tooltip-dps-value-attack" style="color: #ff6464;">${dpsStats.dps}</div>
            <div class="tooltip-dps-label">Crit DPS:</div>
            <div class="tooltip-dps-value-crit" style="color: #ffe769;">${dpsStats.dpsWithCrit}</div>
        </div>

        ${modStats ? `
        <div class="slot-modifier-tooltip">
            <span style="display:block; text-align:center; font-size:12px; color:#aaa; margin-bottom:6px;">WITH MODIFIER:</span>
            <div class="tooltip-stats" style="display: flex; margin-bottom: 8px;">
                <div style="display: flex; flex-direction:column; align-items:center; width:33%;">
                    <span style="font-size:13px; color:#fff; font-weight:bold;">A</span>
                    <span style="font-size:14px; color:#ff6464; font-weight:600;">${modStats.attack}</span>
                </div>
                <div style="display: flex; flex-direction:column; align-items:center; width:33%;">
                    <span style="font-size:13px; color:#fff; font-weight:bold;">S</span>
                    <span style="font-size:14px; color:#3cb7fa; font-weight:600;">${modStats ? '<span class="speed-timer"></span>' : ''} ${(Number(modStats.speed) / 1000).toFixed(2)}s</span>
                </div>
                <div style="display: flex; flex-direction:column; align-items:center; width:33%;">
                    <span style="font-size:13px; color:#fff; font-weight:bold;">C</span>
                    <span style="font-size:14px; color:#ffe769; font-weight:600;">${modStats.crit}%</span>
                </div>
            </div>

            <div class="tooltip-dps-columns">
                <div class="tooltip-dps-label">DPS:</div>
                <div class="tooltip-dps-value-attack" style="color: #ff6464;">${modStats.dps}</div>
                <div class="tooltip-dps-label">Crit DPS:</div>
                <div class="tooltip-dps-value-crit" style="color: #ffe769;">${modStats.dpsWithCrit}</div>
            </div>
        </div>
        ` : ''}

        <div style="display:flex; justify-content: center; gap:22px; margin: 20px;">
            <div style="font-size: 12px; color:#aaa;">
                <span style="color:#ffb862;">${card.getLevelDisplay()}</span>
            </div>
            <div style="font-size: 12px; color:#aaa;">
                Copies: <span style="color:#dfccff;">${card.getCopiesDisplay()}</span>
            </div>
        </div>

        <div style="display:flex; justify-content: center; gap: 8px; text-align: center; width:80%; margin: auto;">
        ${card.attackType.map(type => 
            `<div class="type-${type.toLowerCase()}-text type-attack-text" style="font-size: 11px; font-weight:600;">${type}</div>`
        ).join('')}
        </div>
        <div class="${card.getRarityClass()}-text" style="font-size: 11px; font-weight:600; text-align: center; margin-top: 16px;">${card.rarity}</div>
    `;

    setTimeout(() => {
        const rect = element.getBoundingClientRect();
        const spacing = 12;
        let top, left;

        left = rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2;

        if (position === 'bottom') {
            top = rect.bottom + window.scrollY + spacing;
        } else {
            top = rect.top + window.scrollY - tooltip.offsetHeight - spacing;
        }

        tooltip.style.position = 'absolute';
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        tooltip.style.zIndex = 10000;
        tooltip.style.pointerEvents = 'none';
    }, 1);

    document.body.appendChild(tooltip);
    element.dataset.tooltipActive = 'true';
}

export function removeTooltip(element) {
    const tooltips = document.querySelectorAll('.card-tooltip');
    tooltips.forEach(t => t.remove());
    delete element.dataset.tooltipActive;
}

export function showDeckComparisonTooltip(compareCard) {
    removeDeckComparisonTooltip();

    const hasCardsInDeck = gameState.deckCards.some(card => card !== null);
    if (!hasCardsInDeck) {
        return;
    }

    const container = document.createElement('div');
    container.id = 'deck-comparison-tooltip';

    const header = document.createElement('h2');
    header.textContent = 'WITHOUT MODIFIERS!';
    header.classList.add('comparison-header');
    container.appendChild(header);

    document.body.appendChild(container);

    for(let i=0; i<8; i++) {
        const deckCard = gameState.deckCards[i];
        const slotDiv = document.createElement('div');
        slotDiv.style.display = 'flex';
        slotDiv.style.justifyContent = 'center';
        slotDiv.style.alignItems = 'center';
        if (!deckCard) {
            slotDiv.innerHTML = '<div style="text-align: center; font-size: 14px; color: #777;">Empty Slot</div>';
        } else {
            const tooltip = document.createElement('div');
            tooltip.className = 'card-tooltip';
            tooltip.style.width = '210px';
            tooltip.style.whiteSpace = 'normal';

            const deckStats = deckCard.getStats();
            const compareStats = compareCard.getStats();

            function getStatClass(statName) {
                if (deckStats[statName] > compareStats[statName]) return 'stat-better';
                if (deckStats[statName] < compareStats[statName]) return 'stat-worse';
                return '';
            }

            function getDPSClass(deckDpsStr, compareDpsStr) {
                const deckDps = parseFloat(deckDpsStr);
                const compareDps = parseFloat(compareDpsStr);
                if (deckDps > compareDps) return 'stat-better';
                if (deckDps < compareDps) return 'stat-worse';
                return '';
            }

            const deckDPS = deckCard.getDPS();
            const compareDPS = compareCard.getDPS();

            tooltip.innerHTML = `
                <div style="text-align:center; font-size: 15px; font-weight: bold; color: var(--primary-color); margin-bottom: 6px;">${deckCard.name}</div>
                <div style="text-align:center; justify-content: center; font-size: 11px; color: #dfccff; font-weight: 500; margin-bottom: 6px;">${deckCard.collection}</div>
                <div style="display: flex; justify-content: center; margin-bottom: 6px; font-size: 13px; width: 100%;">
                    <div class="${getStatClass('attack')}" style="width: 33%; text-align: center;">A:<br>${deckStats.attack}</div>
                    <div class="${getStatClass('speed')}" style="width: 33%; text-align: center;">S:<br>${(deckStats.speed / 1000).toFixed(2)}s</div>
                    <div class="${getStatClass('crit')}" style="width: 33%; text-align: center;">C:<br>${deckStats.crit}%</div>
                </div>
                <div style="display: flex; justify-content: center; margin-bottom: 6px; font-size: 13px; width: 100%;">
                    <div class="${getDPSClass(deckDPS.dps, compareDPS.dps)}" style="width: 50%; text-align: center;">DPS:<br>${deckDPS.dps}</div>
                    <div class="${getDPSClass(deckDPS.dps, compareDPS.dps)}" style="width: 50%; text-align: center;">Crit DPS:<br>${deckDPS.dpsWithCrit}</div>
                </div>
            `;

            slotDiv.appendChild(tooltip);
        }
        container.appendChild(slotDiv);
    }
}

export function removeDeckComparisonTooltip() {
    const container = document.getElementById('deck-comparison-tooltip');
    if (container) container.remove();
}

export function handleUnusedCardMouseEnter(e, card) {
    showTooltip(e.currentTarget, card, 'top');
    showDeckComparisonTooltip(card);
}

export function handleUnusedCardMouseLeave(e) {
    removeTooltip(e.currentTarget);
    removeDeckComparisonTooltip();
}
