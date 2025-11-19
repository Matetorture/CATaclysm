import { cardsData } from '../../js/data/cardsData.js';
import { showTooltip, removeTooltip } from '../../js/ui/tooltips.js';
import { createCardElement } from '../../js/ui/cardRenderer.js';
import { setupSingleCardTilt } from '../../js/helpers/utils.js';
import { gameState as localGameState, triggerManualSave as localTriggerManualSave, updateMoneyDisplay as localUpdateMoneyDisplay } from '../../js/data/gameState.js';
import { CatCard } from '../../js/models/CatCard.js';
import { checkCardUnlockAchievements, onCardMaxed } from '../../js/helpers/achievementChecker.js';

// Get gameState from parent window if we're in iframe, otherwise use local
const gameState = (window.parent && window.parent !== window && window.parent.gameState) 
    ? window.parent.gameState 
    : localGameState;

const triggerManualSave = (window.parent && window.parent !== window && window.parent.triggerManualSave) 
    ? window.parent.triggerManualSave 
    : localTriggerManualSave;

const updateMoneyDisplay = (window.parent && window.parent !== window && window.parent.updateMoneyDisplay) 
    ? window.parent.updateMoneyDisplay 
    : localUpdateMoneyDisplay;

console.log('GameState ownedCards count:', gameState.ownedCards?.length || 0);

// Initialize or get openCardsState from parent window
if (window.parent && window.parent !== window) {
    if (!window.parent.openCardsState) {
        window.parent.openCardsState = {
            pullCount: 0,
            lastGuaranteedPulls: { Rare: 0, Epic: 0, Legendary: 0, Ultimate: 0 },
            selectedGuaranteeCards: {}
        };
    }
} else {
    if (!window.openCardsState) {
        window.openCardsState = {
            pullCount: 0,
            lastGuaranteedPulls: { Rare: 0, Epic: 0, Legendary: 0, Ultimate: 0 },
            selectedGuaranteeCards: {}
        };
    }
}

// Get reference to the state
const openCardsState = (window.parent && window.parent !== window) 
    ? window.parent.openCardsState 
    : window.openCardsState;

const guaranteeThresholds = {
    Rare: 20,
    Epic: 50,
    Legendary: 70,
    Ultimate: 100
};

const drawButton = document.getElementById('draw-button');
const pullCounter = document.getElementById('pull-counter');
const drawnCardContainer = document.getElementById('drawn-card-container');
const modal = document.getElementById('card-modal');
const modalTitle = document.getElementById('modal-title');
const modalCardsGrid = document.getElementById('modal-cards-grid');
const closeModalBtn = document.getElementById('close-modal');

const MAX_LEVEL_COPIES = 62;

// Calculate pull cost function
// First pull is free (n = 0)
// a(n) = 100 * e^(0.0931 * (n - 1))
// For n >= 100: cost = 1,000,000
function calculatePullCost(n) {
    if (n === 0) return 0;
    if (n >= 100) return 1000000;
    
    // a(n) = 100 * e^(0.0931 * (n - 1))
    const cost = 100 * Math.exp(0.0931 * (n - 1));
    
    // Round up
    return Math.ceil(cost);
}

// Format function with rounding to first 2 digits + zeros
function formatCostToTwoDigits(num) {
    if (num === 0) return 'FREE';
    if (num < 100) {
        return num.toString();
    }
    
    // Convert to string and get first 2 digits
    const numStr = num.toString();
    const firstTwoDigits = numStr.substring(0, 2);
    const zerosCount = numStr.length - 2;
    
    // Create number with 2 digits and appropriate number of zeros
    const roundedNum = parseInt(firstTwoDigits) * Math.pow(10, zerosCount);
    
    // Format with spaces every 3 digits from the end
    return roundedNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function getCardsByRarity(rarity) {
    const gameState = window.parent.gameState || localGameState;
    
    // Filter cards by rarity, excluding those already at max level
    return cardsData.filter(card => {
        if (card.rarity !== rarity) return false;
        
        // Check if player already has this card at max level
        const ownedCard = gameState.ownedCards.find(c => c.id === card.id);
        if (ownedCard && ownedCard.copies >= MAX_LEVEL_COPIES) {
            return false; // Exclude cards at max level
        }
        
        return true;
    });
}

function drawRandomCard() {
    const rand = Math.random();
    let targetRarity;
    
    // Common: 70%, Uncommon: 25%, Rare: 5%
    if (rand < 0.70) {
        targetRarity = 'Common';
    } else if (rand < 0.95) {  // 0.70 + 0.25 = 0.95
        targetRarity = 'Uncommon';
    } else {  // remaining 5%
        targetRarity = 'Rare';
    }
    
    let possibleCards = getCardsByRarity(targetRarity);
    
    // If no cards of this rarity available (all maxed), try other rarities
    if (possibleCards.length === 0) {
        console.warn(`No ${targetRarity} cards available (all maxed), trying other rarities`);
        
        // Try all rarities
        const allRarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Ultimate'];
        for (const rarity of allRarities) {
            if (rarity === targetRarity) continue;
            possibleCards = getCardsByRarity(rarity);
            if (possibleCards.length > 0) {
                console.log(`Drawing from ${rarity} instead`);
                break;
            }
        }
        
        // If still no cards available, all cards are at max
        if (possibleCards.length === 0) {
            console.warn('All cards are at max level!');
            return null;
        }
    }
    
    return possibleCards[Math.floor(Math.random() * possibleCards.length)];
}

function checkGuarantee() {
    const rarityOrder = ['Ultimate', 'Legendary', 'Epic', 'Rare'];
    
    for (const rarity of rarityOrder) {
        const threshold = guaranteeThresholds[rarity];
        const pullsSinceLastGuarantee = openCardsState.pullCount - openCardsState.lastGuaranteedPulls[rarity];
        
        if (pullsSinceLastGuarantee >= threshold) {
            openCardsState.lastGuaranteedPulls[rarity] = openCardsState.pullCount;
            
            if (openCardsState.selectedGuaranteeCards[rarity]) {
                // Check if selected card is already at max level
                const selectedCard = openCardsState.selectedGuaranteeCards[rarity];
                const ownedCard = gameState.ownedCards.find(c => c.id === selectedCard.id);
                
                if (ownedCard && ownedCard.copies >= MAX_LEVEL_COPIES) {
                    console.log(`Selected ${rarity} card is at max level, drawing random`);
                    // Selected card is at max, draw another one
                    const cardsOfRarity = getCardsByRarity(rarity);
                    if (cardsOfRarity.length > 0) {
                        const randomCard = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
                        return { card: randomCard, rarity };
                    }
                } else {
                    return { card: openCardsState.selectedGuaranteeCards[rarity], rarity };
                }
            } else {
                const cardsOfRarity = getCardsByRarity(rarity);
                if (cardsOfRarity.length > 0) {
                    const randomCard = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
                    return { card: randomCard, rarity };
                }
            }
        }
    }
    return null;
}

function displayDrawnCard(card, isGuarantee = false, guaranteeRarity = null) {
    drawnCardContainer.innerHTML = '';
    
    // Check if card exists
    if (!card) {
        drawnCardContainer.innerHTML = '<p style="color: gold; font-size: 20px; text-align: center;">🎉 All cards are at max level! 🎉</p>';
        console.log('All available cards are at max level');
        return;
    }
    
    // Find card in ownedCards or add new one
    let ownedCard = gameState.ownedCards.find(c => c.id === card.id);
    
    if (ownedCard) {
        ownedCard.copies += 1;
        console.log(`Added copy to ${ownedCard.name}, now has ${ownedCard.copies} copies`);
        if (ownedCard.copies >= 62) {
            onCardMaxed(ownedCard);
        }
    } else {
        ownedCard = new CatCard(
            card.id,
            card.number,
            card.name,
            card.collection,
            card.rarity,
            card.baseAttack,
            card.baseSpeed,
            card.baseCrit,
            card.attackType,
            1
        );
        gameState.ownedCards.push(ownedCard);
        console.log(`Added new card: ${ownedCard.name}`);
        checkCardUnlockAchievements();
    }
    
    // Save game after adding card
    triggerManualSave();
    
    // Refresh card view in main window (if window.parent exists)
    try {
        if (window.parent && window.parent !== window) {
            if (window.parent.renderAvailableCards) {
                window.parent.renderAvailableCards();
            }
        }
    } catch (e) {
        console.log('Cannot update parent cards view:', e);
    }
    
    // Display card from ownedCards (with current copy count)
    const cardElement = createCardElement(ownedCard, 'unused', '../../img/cats/');
    setupSingleCardTilt(cardElement, cardElement);
    
    cardElement.addEventListener('mouseenter', () => {
        showTooltip(cardElement, ownedCard, 'bottom', '../../');
    });
    cardElement.addEventListener('mouseleave', () => {
        removeTooltip(cardElement);
    });
    
    if (isGuarantee) {
        const guaranteeLabel = document.createElement('div');
        guaranteeLabel.style.cssText = `
            position: absolute;
            top: 5px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #ff9800 0%, #f44336 100%);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 20px;
            font-weight: bold;
            z-index: 10;
            box-shadow: 0 2px 8px rgba(0,0,0,0.5);
            width: 80%;
            text-align: center;
        `;
        guaranteeLabel.textContent = `${guaranteeRarity.toUpperCase()} GUARANTEED!`;
        cardElement.appendChild(guaranteeLabel);
    }
    
    drawnCardContainer.appendChild(cardElement);
    
    cardElement.style.opacity = '0';
    cardElement.style.transform = 'scale(0.3) rotateY(1440deg)';
    setTimeout(() => {
        cardElement.style.transition = 'all 3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        cardElement.style.opacity = '1';
        cardElement.style.transform = 'scale(1) rotateY(0deg)';
    }, 50);
}

function updatePullCounter() {
    const cost = calculatePullCost(openCardsState.pullCount);
    const formattedCost = formatCostToTwoDigits(cost);
    pullCounter.textContent = `Pulls: ${openCardsState.pullCount}`;
    drawButton.textContent = `DRAW - ${formattedCost === 'FREE' ? formattedCost : formattedCost + ' $'}`;

    updateGuaranteeInfo();
    
    // Check if player has enough money
    if (gameState.money < cost) {
        drawButton.disabled = true;
        drawButton.style.opacity = '0.5';
        drawButton.style.cursor = 'not-allowed';
    } else {
        drawButton.disabled = false;
        drawButton.style.opacity = '1';
        drawButton.style.cursor = 'pointer';
    }
}

drawButton.addEventListener('click', () => {
    const cost = calculatePullCost(openCardsState.pullCount);
    
    // Check if player has enough money
    if (gameState.money < cost) {
        drawnCardContainer.innerHTML = '<p style="color: red;">Not enough money!</p>';
        return;
    }
    
    // Subtract cost
    gameState.money -= cost;
    updateMoneyDisplay();
    
    openCardsState.pullCount++;
    updatePullCounter();
    
    const guarantee = checkGuarantee();
    
    if (guarantee && guarantee.card) {
        displayDrawnCard(guarantee.card, true, guarantee.rarity);
    } else {
        const drawnCard = drawRandomCard();
        if (drawnCard) {
            displayDrawnCard(drawnCard, false);
        } else {
            drawnCardContainer.innerHTML = '<p style="color: red;">No cards available!</p>';
        }
    }
    
    // Save after each pull
    triggerManualSave();
});

function updateGuaranteeInfo() {
    ['Rare', 'Epic', 'Legendary', 'Ultimate'].forEach(rarity => {
        const threshold = guaranteeThresholds[rarity];
        const lastGuaranteed = openCardsState.lastGuaranteedPulls[rarity];
        const nextGuaranteed = lastGuaranteed + threshold;
        
        const infoElement = document.getElementById(`${rarity.toLowerCase()}-pulls-info`);
        if (infoElement) {
            infoElement.textContent = `At ${nextGuaranteed} pulls`;
        }
    });
}

function updateGuaranteePreview(rarity) {
    const preview = document.getElementById(`preview-${rarity.toLowerCase()}`);
    const selectedCard = openCardsState.selectedGuaranteeCards[rarity];
    
    if (selectedCard) {
        preview.innerHTML = '';
        const miniCard = createCardElement(selectedCard, 'unused', '../../img/cats/');
        setupSingleCardTilt(miniCard, miniCard);
        
        // Rare and Epic (top row) - tooltip at bottom, Legendary and Ultimate (bottom row) - tooltip at top
        const tooltipPosition = (rarity === 'Rare' || rarity === 'Epic') ? 'bottom' : 'top';
        
        miniCard.addEventListener('mouseenter', () => {
            showTooltip(miniCard, selectedCard, tooltipPosition, '../../');
        });
        miniCard.addEventListener('mouseleave', () => {
            removeTooltip(miniCard);
        });
        
        preview.appendChild(miniCard);
    } else {
        preview.innerHTML = '<span style="color: var(--text-secondary);">Random</span>';
    }
}

function openCardSelectionModal(rarity) {
    modalTitle.textContent = `Select ${rarity} Guarantee Card`;
    modalCardsGrid.innerHTML = '';
    
    const cardsOfRarity = getCardsByRarity(rarity);
    
    if (cardsOfRarity.length === 0) {
        modalCardsGrid.innerHTML = '<p style="color: gold; font-size: 18px; text-align: center;">All cards of this rarity are at max level!</p>';
        modal.classList.add('show');
        return;
    }
    
    cardsOfRarity.forEach(card => {
        const cardElement = createCardElement(card, 'unused', '../../img/cats/');
        setupSingleCardTilt(cardElement, cardElement);
        cardElement.classList.add('modal-card');
        
        cardElement.addEventListener('mouseenter', () => {
            showTooltip(cardElement, card, 'top', '../../');
        });
        cardElement.addEventListener('mouseleave', () => {
            removeTooltip(cardElement);
        });
        
        cardElement.addEventListener('click', () => {
            openCardsState.selectedGuaranteeCards[rarity] = card;
            updateGuaranteePreview(rarity);
            modal.classList.remove('show');
            // Save after selecting guarantee card
            triggerManualSave();
        });
        
        modalCardsGrid.appendChild(cardElement);
    });
    
    modal.classList.add('show');
}

closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('show');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

document.getElementById('btn-rare').addEventListener('click', () => openCardSelectionModal('Rare'));
document.getElementById('btn-epic').addEventListener('click', () => openCardSelectionModal('Epic'));
document.getElementById('btn-legendary').addEventListener('click', () => openCardSelectionModal('Legendary'));
document.getElementById('btn-ultimate').addEventListener('click', () => openCardSelectionModal('Ultimate'));

// Initialize UI
updatePullCounter();
['Rare', 'Epic', 'Legendary', 'Ultimate'].forEach(rarity => {
    updateGuaranteePreview(rarity);
});