import { gameState, updateMoneyDisplay } from '../data/gameState.js';
import { getCurrentBaseConfig } from '../data/basesData.js';
import { setupTiltEffect, setupSingleCardTilt } from '../helpers/utils.js';
import { dragStartHandler, dragEndHandler, dragOverHandler, dragEnterHandler, dragLeaveHandler, dropHandler } from '../helpers/dragDrop.js';
import { showTooltip, removeTooltip, handleUnusedCardMouseEnter, handleUnusedCardMouseLeave, removeDeckComparisonTooltip } from './tooltips.js';
import { startDeckContinuousAttacks } from '../game/combat.js';
import { updateDeckStats } from './deckStats.js';
import { isCardUsedInBase } from './basePanel.js';
import { allModifiers } from '../helpers/modifiers.js';
import { checkSlotAchievements, checkDeckAchievements } from '../helpers/achievementChecker.js';
import { applyCurrentFilter } from './filters.js';
import { notifySuccess, notifyError } from './notifications.js';
import { playCardMoveSound, playMoneySpentSound } from '../helpers/audioManager.js';

export function renderAvailableCards(cardsToRender = gameState.ownedCards) {
    const container = document.getElementById('availableCardsGrid');
    if (!container) return;
    
    container.innerHTML = '';

    cardsToRender.forEach((card) => {
        const inDeck = gameState.deckCards.includes(card);
        const inBase = isCardUsedInBase(card);
        if (inDeck || inBase) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'card-tilt-wrapper';
        
        const cardElement = createCardElement(card, 'unused');
        wrapper.appendChild(cardElement);
        container.appendChild(wrapper);

        wrapper.addEventListener('click', () => addCardToDeck(card));

        wrapper.addEventListener('mouseenter', (e) => handleUnusedCardMouseEnter(e, card));

        wrapper.addEventListener('mouseleave', handleUnusedCardMouseLeave);

        wrapper.setAttribute('draggable', 'true');

        wrapper.addEventListener('dragstart', (e) => dragStartHandler(e, card, 'unused'));

        wrapper.addEventListener('dragend', dragEndHandler);
    });

    setupTiltEffect();
}

export function renderDeckSlots() {
    const container = document.querySelector('.deck-slots');
    if (!container) return;
    
    const baseConfig = getCurrentBaseConfig(gameState.currentBaseId);
    const maxSlots = baseConfig.maxDeckSlots;
    const unlockedModifiers = allModifiers.slice(0, baseConfig.unlockedModifiers);
    
    container.innerHTML = '';

    for (let i = 0; i < 8; i++) {
        const slot = document.createElement('div');
        slot.className = 'deck-slot';
        slot.dataset.slot = i;

        const isBeyondBaseLimit = i >= maxSlots;
        const isUnlocked = gameState.unlockedSlots[i];

        if (isBeyondBaseLimit || !isUnlocked) {
            slot.classList.add('locked');
            
            const lockOverlay = document.createElement('div');
            lockOverlay.className = 'lock-overlay';
            
            if (isBeyondBaseLimit) {
                lockOverlay.classList.add('base-locked');
                lockOverlay.innerHTML = `
                    <img src="img/icons/lock.png" alt="Locked" class="lock-icon">
                    <div class="unlock-price base-upgrade-required">Upgrade Base</div>
                `;
            } else {
                lockOverlay.innerHTML = `
                    <img src="img/icons/lock.png" alt="Locked" class="lock-icon">
                    <div class="unlock-price">$${gameState.slotPrices[i]}</div>
                `;
                
                lockOverlay.addEventListener('click', () => {
                    unlockSlot(i);
                });
            }
            
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
        cardContainer.className = 'slot-card-container';

        let card = gameState.deckCards[i];
        if (card) {
            const { wrapper, cardElement } = renderCardWithWrapper(card, 'deck');
            cardElement.classList.remove('unused-card');
            cardElement.className = 'slot-card filled';
            cardElement.classList.add(card.getRarityClass());
            
            cardContainer.appendChild(wrapper);

            wrapper.setAttribute('draggable', 'true');
            wrapper.addEventListener('dragstart', (e) => {
                dragStartHandler(e, card, 'deck', i);
            });
            wrapper.addEventListener('dragend', dragEndHandler);
            wrapper.addEventListener('click', () => {
                removeCardFromDeck(i);
            });
            wrapper.addEventListener('mouseenter', () => {
                const rect = wrapper.getBoundingClientRect();
                const isUpper = rect.top < window.innerHeight / 2;
                showTooltip(wrapper, card, isUpper ? 'bottom' : 'top');
            });
            wrapper.addEventListener('mouseleave', () => {
                removeTooltip(wrapper);
            });
        } else {
            const emptySlot = document.createElement('div');
            emptySlot.className = 'slot-card';
            emptySlot.innerHTML = '<span>Empty Slot</span>';
            cardContainer.appendChild(emptySlot);
        }

        const modifiersDiv = document.createElement('div');
        modifiersDiv.className = 'slot-modifiers';
        allModifiers.forEach(mod => {
            const isModUnlocked = unlockedModifiers.includes(mod);
            const btn = document.createElement('button');
            btn.className = 'slot-modifier slot-modifier-effect';
            btn.setAttribute('data-modifier', mod);
            
            if (!isModUnlocked) {
                btn.classList.add('locked');
                btn.disabled = true;
                btn.innerHTML = `<img class="img-icon locked-icon" src="img/icons/lock.png" alt="Locked">`;
            } else {
                btn.innerHTML = `<img class="img-icon" src="img/icons/${mod}.png" alt="${mod}">`;
                
                if (gameState.deckModifiers[i] === mod) {
                    btn.classList.add('active');
                }
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

export function renderCardWithWrapper(card, type = 'deck', imgBasePath = 'img/cats/') {
    const wrapper = document.createElement('div');
    wrapper.className = 'card-tilt-wrapper';
    
    const cardElement = createCardElement(card, type, imgBasePath);
    wrapper.appendChild(cardElement);
    
    return { wrapper, cardElement };
}

export function createCardElement(card, type = 'deck', imgBasePath = 'img/cats/') {
    const element = document.createElement('div');
    element.className = type === 'unused' ? 'unused-card' : 'card';
    element.classList.add(card.getRarityClass());

    if (type === 'unused') {
        const content = document.createElement('div');
        content.className = 'unused-card-content';
        content.innerHTML = `
            <img class="unused-card-image" src="${imgBasePath}${card.number}.png" alt="${card.name}">
        `;
        element.appendChild(content);
    } else if (type === 'deck') {
        const content = document.createElement('div');
        content.className = 'card-content';
        content.innerHTML = `
            <img class="card-image" src="${imgBasePath}${card.number}.png" alt="${card.name}">
        `;
        element.appendChild(content);
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
        playCardMoveSound();

        const tooltips = document.querySelectorAll('[data-tooltip-active="true"]');
        tooltips.forEach(el => removeTooltip(el));
        removeDeckComparisonTooltip();
        
        applyCurrentFilter();
        renderDeckSlots();
        startDeckContinuousAttacks();
        checkDeckAchievements();
    }
}

export function removeCardFromDeck(slotIndex) {
    gameState.deckCards[slotIndex] = null;
    gameState.deckModifiers[slotIndex] = '';
    playCardMoveSound();

    const tooltips = document.querySelectorAll('[data-tooltip-active="true"]');
    tooltips.forEach(el => removeTooltip(el));
    
    checkDeckAchievements();
    removeDeckComparisonTooltip();
    
    applyCurrentFilter();
    renderDeckSlots();
    startDeckContinuousAttacks();
}

function unlockSlot(slotIndex) {
    const price = gameState.slotPrices[slotIndex];
    
    if (gameState.money >= price) {
        playMoneySpentSound();
        gameState.money -= price;
        gameState.unlockedSlots[slotIndex] = true;
        updateMoneyDisplay();
        renderDeckSlots();
        checkSlotAchievements();
        notifySuccess(`Slot ${slotIndex + 1} unlocked!`);
    } else {
        notifyError(`Not enough money! Need $${price}`);
    }
}