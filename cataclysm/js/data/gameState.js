import { CatCard } from '../models/CatCard.js';
import { bossCategories } from './bossesData.js';

export const gameState = {
    ownedCards: [], // All owned cards
    deckCards: [null, null, null, null, null, null, null, null], // 8 deck slots
    ownedModifiers: ['B', 'S', 'L', 'R', 'N'], // B, S, L, R, N
    deckModifiers: ['', '', '', '', '', '', '', ''],
    money: 0,
    unlockedSlots: [true, false, false, false, false, false, false, false], // First slot unlocked by default
    slotPrices: [0, 100, 250, 500, 1000, 2000, 4000, 8000], // Cost to unlock each slot
    
    currentBaseId: 1,
    baseUpgradeInProgress: null,
    
    combatPaused: false,
    
    unlockedAchievements: new Set()
};

// Boss state management
export let selectedCategoryId = bossCategories[0].id;
export let currentBossIndex = 0;
export let currentBossHp = null;
export let bossListVisible = false;

export const categoryProgress = {};
bossCategories.forEach(cat => {
    categoryProgress[cat.id] = {
        currentBossIndex: 0,
        currentBossHp: null,
        completed: false
    };
});

// Boss state setters
export function setSelectedCategoryId(id) {
    selectedCategoryId = id;
    currentBossIndex = categoryProgress[id].currentBossIndex;
    currentBossHp = categoryProgress[id].currentBossHp;
}

export function setCurrentBossIndex(index) {
    currentBossIndex = index;
    categoryProgress[selectedCategoryId].currentBossIndex = index;
}

export function setCurrentBossHp(hp) {
    currentBossHp = hp;
    categoryProgress[selectedCategoryId].currentBossHp = hp;
}

export function setCategoryCompleted(categoryId, completed) {
    categoryProgress[categoryId].completed = completed;
}

export function setBossListVisible(value) {
    bossListVisible = value;
}

function formatMoneyWithSpaces(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function updateMoneyDisplay() {
    const moneyDisplay = document.querySelector('.money-display');
    if (moneyDisplay) {
        moneyDisplay.textContent = formatMoneyWithSpaces(gameState.money);
    }
}

export function triggerManualSave() {
    import('../helpers/saveManager.js').then(({ saveGame }) => {
        saveGame();
    });
}
