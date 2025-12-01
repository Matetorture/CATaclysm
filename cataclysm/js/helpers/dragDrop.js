import { gameState } from '../data/gameState.js';
import { renderDeckSlots } from '../ui/cardRenderer.js';
import { applyCurrentFilter } from '../ui/filters.js';
import { removeTooltip, removeDeckComparisonTooltip } from '../ui/tooltips.js';
import { startDeckContinuousAttacks } from '../game/combat.js';
import { updateDeckStats } from '../ui/deckStats.js';
import { checkDeckAchievements } from './achievementChecker.js';
import { playCardMoveSound } from './audioManager.js';

let draggedCard = null;
let draggedFrom = null; // 'deck' or 'unused'
let draggedFromIndex = null; // Slot index or null
const dragPreview = document.getElementById('dragPreview');
let dragOffsetX = 0;
let dragOffsetY = 0;
let draggedCardElement = null;

export function dragStartHandler(e, card, from, index = null) {
    draggedCard = card;
    draggedFrom = from;
    draggedFromIndex = index;

    const target = e.target.closest('.slot-card, .unused-card');
    if (target) {
        removeTooltip(target);
    }
    removeDeckComparisonTooltip();

    // Use an off-screen div as drag image to hide default drag image in Chrome
    let dragGhost = document.getElementById('dragGhost');
    if (!dragGhost) {
        dragGhost = document.createElement('div');
        dragGhost.id = 'dragGhost';
        dragGhost.style.position = 'absolute';
        dragGhost.style.top = '-9999px';
        dragGhost.style.left = '-9999px';
        dragGhost.style.width = '1px';
        dragGhost.style.height = '1px';
        dragGhost.style.opacity = '0';
        document.body.appendChild(dragGhost);
    }
    e.dataTransfer.setDragImage(dragGhost, 0, 0);
    
    // Set card ID for base slots to access
    e.dataTransfer.setData('cardId', card.id);

    dragPreview.style.display = 'block';
    dragPreview.innerHTML = '';
    dragPreview.className = '';
    dragPreview.classList.add(card.getRarityClass());
    const img = document.createElement('img');
    img.src = `img/cats/${card.number}.png`;
    img.className = 'card-image';
    dragPreview.appendChild(img);

    const firstSlot = document.querySelector('.deck-slot');
    if (firstSlot) {
        const rect = firstSlot.getBoundingClientRect();
        dragPreview.style.width = rect.width + 'px';
        dragPreview.style.height = rect.height + 'px';
    }

    if (target) {
        draggedCardElement = target;
        draggedCardElement.style.opacity = '0';
    }

    const rectTarget = target?.getBoundingClientRect();
    if (rectTarget) {
        dragOffsetX = e.clientX - rectTarget.left;
        dragOffsetY = e.clientY - rectTarget.top;
    }

    moveDragPreview(e.clientX, e.clientY);

    document.addEventListener('dragover', dragMoveHandler);
}

function moveDragPreview(x, y) {
    dragPreview.style.left = (x - dragOffsetX) + 'px';
    dragPreview.style.top = (y - dragOffsetY) + 'px';
}

function dragMoveHandler(e) {
    e.preventDefault();
    moveDragPreview(e.clientX, e.clientY);
}

export function dragEndHandler(e) {
    draggedCard = null;
    draggedFrom = null;
    draggedFromIndex = null;

    if (draggedCardElement) {
        draggedCardElement.style.opacity = '1';
        draggedCardElement = null;
    }

    dragPreview.style.display = 'none';
    document.removeEventListener('dragover', dragMoveHandler);
}

export function dragOverHandler(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
}

export function dragEnterHandler(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

export function dragLeaveHandler(e) {
    e.currentTarget.classList.remove('drag-over');
}

export function dropHandler(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (!draggedCard) return;

    const slotIndex = +e.currentTarget.dataset.slot;
    const targetCard = gameState.deckCards[slotIndex];

    if (draggedFrom === 'deck') {
        if (draggedFromIndex === slotIndex) {
            dragEndHandler(e);
            return;
        }
        playCardMoveSound();
        if (targetCard === null) {
            gameState.deckCards[slotIndex] = draggedCard;
            gameState.deckCards[draggedFromIndex] = null;
        } else {
            gameState.deckCards[slotIndex] = draggedCard;
            gameState.deckCards[draggedFromIndex] = targetCard;
        }
    } else if (draggedFrom === 'unused') {
        playCardMoveSound();
        if (targetCard === null) {
            gameState.deckCards[slotIndex] = draggedCard;
        } else {
            gameState.deckCards[slotIndex] = draggedCard;
        }
    }
    applyCurrentFilter();
    renderDeckSlots();
    startDeckContinuousAttacks();
    updateDeckStats();
    checkDeckAchievements();
    dragEndHandler(e);
}

export function setupUnusedCardsDropZone() {
    const unusedCardsGrid = document.getElementById('availableCardsGrid');
        if (!unusedCardsGrid) return;
    unusedCardsGrid.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        unusedCardsGrid.classList.add('drag-over');
    });
    
    unusedCardsGrid.addEventListener('dragleave', () => {
        unusedCardsGrid.classList.remove('drag-over');
    });
    
    unusedCardsGrid.addEventListener('drop', (e) => {
        e.preventDefault();
        unusedCardsGrid.classList.remove('drag-over');
        if (!draggedCard) return;
        if (draggedFrom === 'deck' && draggedFromIndex !== null) {
            playCardMoveSound();
            gameState.deckCards[draggedFromIndex] = null;
            applyCurrentFilter();
            renderDeckSlots();
            startDeckContinuousAttacks();
            updateDeckStats();
            checkDeckAchievements();
        }
        dragEndHandler(e);
    });
}
