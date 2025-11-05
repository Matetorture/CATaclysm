// Import models
import { CatCard } from './js/models/CatCard.js';

// Import data
import { gameState, selectedCategoryId, updateMoneyDisplay } from './js/data/gameState.js';
import { cardsData } from './js/data/cardsData.js';

// Import UI renderers
import { renderAvailableCards, renderDeckSlots } from './js/ui/cardRenderer.js';
import { selectBoss } from './js/ui/bossRenderer.js';
import { generateFilterButtons } from './js/ui/filters.js';

// Import game logic
import { startDeckContinuousAttacks } from './js/game/combat.js';

// Import helpers
import { setupBottomPanelToggle } from './js/helpers/utils.js';
import { setupUnusedCardsDropZone } from './js/helpers/dragDrop.js';

function initGame() {
    gameState.ownedCards = [...cardsData];
    setupBottomPanelToggle();
    setupUnusedCardsDropZone();
    renderAvailableCards();
    renderDeckSlots();
    startDeckContinuousAttacks();
    generateFilterButtons();
    selectBoss(selectedCategoryId);
    updateMoneyDisplay();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initGame();
    });
} else {
    initGame();   
}
