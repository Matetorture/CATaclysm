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
import { setupButtonHoverSounds, setupCardHoverSounds } from './js/helpers/audioManager.js';

export const appSettings = {
    'boss-reward': true
};

function loadAppSettings() {
    Object.keys(appSettings).forEach(key => {
        const val = localStorage.getItem('setting-' + key);
        if (val !== null) appSettings[key] = val === 'true';
    });
}

export function applySettings(settings) {
    Object.keys(appSettings).forEach(key => {
        if (settings[key] !== undefined) appSettings[key] = settings[key];
        localStorage.setItem('setting-' + key, appSettings[key] ? 'true' : 'false');
    });
}

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

function setupSettingsButton() {
    const settingsBtn = document.getElementById('settingsBtn');
    if (!settingsBtn) return;
    
    settingsBtn.addEventListener('click', () => {
        openCenteredIframe('/widgets/settings/', -1, true);
    });
}

function setupCreditsButton() {
    const creditsBtn = document.getElementById('creditsBtn');
    if (!creditsBtn) return;
    creditsBtn.addEventListener('click', () => {
        openCenteredIframe('/widgets/credits/', -1, true);
    });
}

function initGame() {
    loadAppSettings();
    
    const saveLoaded = loadGame();

    if (!saveLoaded) {
        gameState.ownedCards = [];
    }
    
    setupBottomPanelToggle();
    setupUnusedCardsDropZone();
    setupPauseButton();
    setupOpenCardsButton();
    setupTutorialsButton();
    setupAchievementsButton();
    setupSettingsButton();
    setupCreditsButton();
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
    setupButtonHoverSounds();
    setupCardHoverSounds();
    
    startAutoSave();
    setupBeforeUnloadSave();
    
    window.applyCurrentFilter = applyCurrentFilter;
    window.gameState = gameState;
    window.triggerManualSave = triggerManualSave;
    window.updateMoneyDisplay = updateMoneyDisplay;
    window.applySettings = applySettings;
    
    console.log('Game initialized!', saveLoaded ? 'Save loaded' : 'New game started');

    function setRandomFavicon() {
        if (!cardsData || !cardsData.length) return;
        const card = cardsData[Math.floor(Math.random() * cardsData.length)];
        const faviconUrl = `/img/cats/${card.number}.png`;
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            link.type = 'image/png';
            document.head.appendChild(link);
        }
        if (link) link.href = faviconUrl;
    }
    setInterval(setRandomFavicon, 1000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initGame();
    });
} else {
    initGame();   
}
