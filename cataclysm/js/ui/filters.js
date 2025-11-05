import { gameState } from '../data/gameState.js';
import { cardRarities, attackTypes } from '../data/constants.js';
import { sortCardsById, sortCardsByDPSWithCrit, filterCardsByAttackType, filterCardsByRarity } from '../helpers/filters.js';
import { renderAvailableCards } from './cardRenderer.js';

export function generateFilterButtons() {
    const typeContainer = document.querySelector('.card-filter-types');
    const rarityContainer = document.querySelector('.card-filter-rarity');

    if (!typeContainer || !rarityContainer) return;

    typeContainer.innerHTML = '';
    rarityContainer.innerHTML = '';

    attackTypes.forEach(type => {
        const btn = document.createElement('button');
        btn.className = `type-${type}-text btnFilterType filterBtn`;
        btn.setAttribute('data-type', type);

        const icon = document.createElement('img');
        icon.src = `img/types/${type}.png`;
        icon.alt = type + ' icon';
        icon.style.width = '16px';
        icon.style.height = '18px';
        icon.style.marginRight = '6px';
        icon.style.verticalAlign = 'middle';
        icon.style.pointerEvents = 'none';

        btn.appendChild(icon);
        btn.appendChild(document.createTextNode(type));
        typeContainer.appendChild(btn);
    });

    cardRarities.forEach(rarity => {
        const btn = document.createElement('button');
        btn.className = `rarity-${rarity}-text btnFilterRarity filterBtn`;
        btn.setAttribute('data-rarity', rarity);
        btn.textContent = rarity;
        rarityContainer.appendChild(btn);
    });

    setupFilterButtons();
}

export function setupFilterButtons() {
    document.querySelectorAll('.filterBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filterBtn').forEach(b => b.classList.remove('activeFilterBtn'));
            btn.classList.add('activeFilterBtn');
        });
    });

    const btnAll = document.getElementById('btnAll');
    if (btnAll) {
        btnAll.addEventListener('click', () => {
            const sorted = sortCardsById(gameState.ownedCards);
            renderAvailableCards(sorted);
        });
    }

    const btnSortDPS = document.getElementById('btnSortDPS');
    if (btnSortDPS) {
        btnSortDPS.addEventListener('click', () => {
            const sorted = sortCardsByDPSWithCrit(gameState.ownedCards);
            renderAvailableCards(sorted);
        });
    }

    document.querySelectorAll('.btnFilterType').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            const filtered = filterCardsByAttackType(gameState.ownedCards, type);
            renderAvailableCards(filtered);
        });
    });

    document.querySelectorAll('.btnFilterRarity').forEach(btn => {
        btn.addEventListener('click', () => {
            const rarity = btn.dataset.rarity;
            const filtered = filterCardsByRarity(gameState.ownedCards, rarity);
            renderAvailableCards(filtered);
        });
    });
}
