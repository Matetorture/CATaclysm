import { CatCard } from '../models/CatCard.js';
import { bossCategories } from './bossesData.js';

export const gameState = {
    ownedCards: [], // All owned cards
    deckCards: [null, null, null, null, null, null, null, null], // 8 deck slots
    ownedModifiers: ['S', 'G', 'B', 'R', 'N'], // S, G, B, R, N
    deckModifiers: ['', '', '', '', '', '', '', ''],
    money: 1250
};

// Boss state management
export let selectedCategoryId = bossCategories[0].id;
export let currentBossId = null;
export let currentBossIsRandom = false;
export let bossListVisible = false;

export const defeatedBossesByCategory = {};
bossCategories.forEach(cat => {
    defeatedBossesByCategory[cat.id] = new Set();
});

// Boss state setters
export function setSelectedCategoryId(id) {
    selectedCategoryId = id;
}

export function setCurrentBossId(id) {
    currentBossId = id;
}

export function setCurrentBossIsRandom(value) {
    currentBossIsRandom = value;
}

export function setBossListVisible(value) {
    bossListVisible = value;
}

export function updateMoneyDisplay() {
    const moneyDisplay = document.querySelector('.money-display');
    if (moneyDisplay) {
        moneyDisplay.textContent = gameState.money;
    }
}
