import { gameState, updateMoneyDisplay } from '../data/gameState.js';
import { setupTiltEffect, setupSingleCardTilt } from '../helpers/utils.js';
import { dragStartHandler, dragEndHandler, dragOverHandler, dragEnterHandler, dragLeaveHandler, dropHandler } from '../helpers/dragDrop.js';
import { showTooltip, removeTooltip, handleUnusedCardMouseEnter, handleUnusedCardMouseLeave, removeDeckComparisonTooltip } from './tooltips.js';
import { startDeckContinuousAttacks } from '../game/combat.js';
import { updateDeckStats } from './deckStats.js';
import { isCardUsedInBase } from './basePanel.js';

export function renderAvailableCards(cardsToRender = gameState.ownedCards) {
    const container = document.getElementById('availableCardsGrid');
    if (!container) return;
    
    container.innerHTML = '';

    cardsToRender.forEach((card) => {
        const inDeck = gameState.deckCards.includes(card);
        const inBase = isCardUsedInBase(card);
        if (inDeck || inBase) return;

        const cardElement = createCardElement(card, 'unused');
        container.appendChild(cardElement);

        cardElement.addEventListener('click', () => addCardToDeck(card));

        cardElement.addEventListener('mouseenter', (e) => handleUnusedCardMouseEnter(e, card));

        cardElement.addEventListener('mouseleave', handleUnusedCardMouseLeave);

        cardElement.setAttribute('draggable', 'true');

        cardElement.addEventListener('dragstart', (e) => dragStartHandler(e, card, 'unused'));

        cardElement.addEventListener('dragend', dragEndHandler);
    });

    setupTiltEffect();
}

export function renderDeckSlots() {
    const container = document.querySelector('.deck-slots');
    if (!container) return;
    
    container.innerHTML = '';

    for (let i = 0; i < 8; i++) {
        const slot = document.createElement('div');
        slot.className = 'deck-slot';
        slot.dataset.slot = i;

        const isUnlocked = gameState.unlockedSlots[i];

        if (!isUnlocked) {
            slot.classList.add('locked');
            
            const lockOverlay = document.createElement('div');
            lockOverlay.className = 'lock-overlay';
            lockOverlay.innerHTML = `
                <img src="img/icons/lock.png" alt="Locked" class="lock-icon">
                <div class="unlock-price">$${gameState.slotPrices[i]}</div>
            `;
            
            lockOverlay.addEventListener('click', () => {
                unlockSlot(i);
            });
            
            slot.appendChild(lockOverlay);
            container.appendChild(slot);
            continue;
        }

        const mod = gameState.deckModifiers[i];
        if (mod) {
            slot.className += ' slot-modifier-effect active';
            slot.setAttribute('data-modifier', mod);
        } else {
            slot.removeAttribute('data-modifier');
        }

        slot.addEventListener('dragover', dragOverHandler);
        slot.addEventListener('drop', dropHandler);
        slot.addEventListener('dragenter', dragEnterHandler);
        slot.addEventListener('dragleave', dragLeaveHandler);

        const cardContainer = document.createElement('div');
        cardContainer.className = 'slot-card';

        let card = gameState.deckCards[i];
        if (card) {
            cardContainer.classList.add('filled');
            cardContainer.classList.add(card.getRarityClass());
            cardContainer.innerHTML = '';
            const cardContent = createCardContent(card);
            cardContainer.appendChild(cardContent);

            cardContainer.setAttribute('draggable', 'true');
            cardContainer.addEventListener('dragstart', (e) => {
                dragStartHandler(e, card, 'deck', i);
            });
            cardContainer.addEventListener('dragend', dragEndHandler);
            cardContainer.addEventListener('click', () => {
                removeCardFromDeck(i);
            });
            cardContainer.addEventListener('mouseenter', () => {
                const rect = cardContainer.getBoundingClientRect();
                const isUpper = rect.top < window.innerHeight / 2;
                showTooltip(cardContainer, card, isUpper ? 'bottom' : 'top');
            });
            cardContainer.addEventListener('mouseleave', () => {
                removeTooltip(cardContainer);
            });
        } else {
            cardContainer.classList.remove('filled');
            cardContainer.innerHTML = '<span>Empty Slot</span>';
            cardContainer.removeAttribute('draggable');
        }

        const modifiersDiv = document.createElement('div');
        modifiersDiv.className = 'slot-modifiers';
        gameState.ownedModifiers.forEach(mod => {
            const btn = document.createElement('button');
            btn.className = 'slot-modifier slot-modifier-effect';
            btn.setAttribute('data-modifier', mod);
            btn.innerText = mod;

            if (gameState.deckModifiers[i] === mod) {
                btn.classList.add('active');
            }

            modifiersDiv.appendChild(btn);
        });

        slot.appendChild(cardContainer);
        slot.appendChild(modifiersDiv);

        container.appendChild(slot);
    }
    setupTiltEffect();
    setupSlotModifierClicks();
    updateDeckStats();
}

export function createCardElement(card, type = 'deck', imgBasePath = 'img/cats/') {
    const element = document.createElement('div');
    element.className = type === 'unused' ? 'unused-card' : 'card';
    element.classList.add(card.getRarityClass());

    if (type === 'unused') {
        element.innerHTML = `
            <img class="unused-card-image" src="${imgBasePath}${card.number}.png" alt="${card.name}">
        `;
    }

    return element;
}

export function createCardContent(card) {
    const container = document.createElement('div');
    container.className = 'card-content';

    container.innerHTML = `
        <img class="card-image" src="img/cats/${card.number}.png" alt="${card.name}">
    `;

    return container;
}

function setupSlotModifierClicks() {
    const modifierButtons = document.querySelectorAll('.slot-modifier');
    modifierButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modifier = btn.getAttribute('data-modifier');
            const slot = btn.closest('.deck-slot');
            const slotIndex = +slot.dataset.slot;

            const currentSlotWithModifier = gameState.deckModifiers.findIndex(
                mod => mod === modifier
            );

            if (currentSlotWithModifier === slotIndex) {
                gameState.deckModifiers[slotIndex] = '';
            } else {
                if (currentSlotWithModifier !== -1) {
                    gameState.deckModifiers[currentSlotWithModifier] = '';
                }
                gameState.deckModifiers[slotIndex] = modifier;
            }
            renderDeckSlots();
            startDeckContinuousAttacks();
            updateDeckStats();
        });
    });
}

export function addCardToDeck(card) {
    const emptySlot = gameState.deckCards.findIndex((slot, index) => 
        slot === null && gameState.unlockedSlots[index]
    );
    
    if (emptySlot !== -1) {
        gameState.deckCards[emptySlot] = card;

        const tooltips = document.querySelectorAll('[data-tooltip-active="true"]');
        tooltips.forEach(el => removeTooltip(el));
        removeDeckComparisonTooltip();
        
        renderAvailableCards();
        renderDeckSlots();
        startDeckContinuousAttacks();
    }
}

export function removeCardFromDeck(slotIndex) {
    gameState.deckCards[slotIndex] = null;
    gameState.deckModifiers[slotIndex] = '';

    const tooltips = document.querySelectorAll('[data-tooltip-active="true"]');
    tooltips.forEach(el => removeTooltip(el));
    removeDeckComparisonTooltip();
    
    renderAvailableCards();
    renderDeckSlots();
    startDeckContinuousAttacks();
}

function unlockSlot(slotIndex) {
    const price = gameState.slotPrices[slotIndex];
    
    if (gameState.money >= price) {
        gameState.money -= price;
        gameState.unlockedSlots[slotIndex] = true;
        updateMoneyDisplay();
        renderDeckSlots();
    }
}