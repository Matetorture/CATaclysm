// Import data
import { gameState, selectedCategoryId, updateMoneyDisplay, triggerManualSave } from './js/data/gameState.js';
import { cardsData } from './js/data/cardsData.js';

// Import UI renderers
import { renderDeckSlots } from './js/ui/cardRenderer.js';
import { applyCurrentFilter } from './js/ui/filters.js';
import { selectBoss } from './js/ui/bossRenderer.js';
import { generateFilterButtons } from './js/ui/filters.js';
import { createDeckStatsDisplay } from './js/ui/deckStats.js';
import { initializeBasePanel } from './js/ui/basePanel.js';

// Import game logic
import { startDeckContinuousAttacks } from './js/game/combat.js';

// Import helpers
import { setupBottomPanelToggle, openCenteredIframe } from './js/helpers/utils.js';
import { setupUnusedCardsDropZone } from './js/helpers/dragDrop.js';
import { toggleCombatPause } from './js/helpers/pauseManager.js';
import { loadGame, startAutoSave, setupBeforeUnloadSave } from './js/helpers/saveManager.js';
import { checkDeckAchievements, checkBaseAchievements, checkMaxCardAchievements } from './js/helpers/achievementChecker.js';

function setupPauseButton() {
    const pauseBtn = document.getElementById('pauseBtn');
    if (!pauseBtn) return;
    
    pauseBtn.addEventListener('click', () => {
        toggleCombatPause();
    });
}

function setupOpenCardsButton() {
    const openCardsBtn = document.getElementById('openCardsBtn');
    if (!openCardsBtn) return;
    
    openCardsBtn.addEventListener('click', () => {
        openCenteredIframe('/widgets/open/', -1, true);
    });
}

function setupTutorialsButton() {
    const tutorialsBtn = document.getElementById('tutorialsBtn');
    if (!tutorialsBtn) return;
    
    tutorialsBtn.addEventListener('click', () => {
        openCenteredIframe('/widgets/tutorials/', -1, true);
    });
}

function setupAchievementsButton() {
    const achievementsBtn = document.getElementById('achievementsBtn');
    if (!achievementsBtn) return;
    
    achievementsBtn.addEventListener('click', () => {
        openCenteredIframe('/widgets/achievements/', -1, true);
    });
}

function initGame() {
    const saveLoaded = loadGame();

    if (!saveLoaded) {
        gameState.ownedCards = [...cardsData];
    }
    
    setupBottomPanelToggle();
    setupUnusedCardsDropZone();
    setupPauseButton();
    setupOpenCardsButton();
    setupTutorialsButton();
    setupAchievementsButton();
    applyCurrentFilter();
    renderDeckSlots();
    createDeckStatsDisplay();
    startDeckContinuousAttacks();
    generateFilterButtons();
    selectBoss(selectedCategoryId);
    updateMoneyDisplay();
    initializeBasePanel();
    checkDeckAchievements();
    checkBaseAchievements();
    checkMaxCardAchievements();
    
    startAutoSave();
    setupBeforeUnloadSave();
    
    window.applyCurrentFilter = applyCurrentFilter;
    window.gameState = gameState;
    window.triggerManualSave = triggerManualSave;
    window.updateMoneyDisplay = updateMoneyDisplay;
    
    console.log('Game initialized!', saveLoaded ? 'Save loaded' : 'New game started');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initGame();
    });
} else {
    initGame();   
}
