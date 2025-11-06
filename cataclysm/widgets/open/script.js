import { cardsData } from '../../js/data/cardsData.js';
import { showTooltip, removeTooltip } from '../../js/ui/tooltips.js';
import { createCardElement } from '../../js/ui/cardRenderer.js';
import { setupSingleCardTilt } from '../../js/helpers/utils.js';

let pullCount = 0;
let lastGuaranteedPulls = {
    Rare: 0,
    Epic: 0,
    Legendary: 0,
    Ultimate: 0
};

const selectedGuaranteeCards = {
    Rare: null,
    Epic: null,
    Legendary: null,
    Ultimate: null
};

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

function getCardsByRarity(rarity) {
    return cardsData.filter(card => card.rarity === rarity);
}

function drawRandomCard() {
    const rand = Math.random();
    let targetRarity;
    
    if (rand < 0.80) {
        targetRarity = 'Common';
    } else if (rand < 0.95) {
        targetRarity = 'Uncommon';
    } else {
        targetRarity = 'Rare';
    }
    
    const possibleCards = getCardsByRarity(targetRarity);
    if (possibleCards.length === 0) {
        return cardsData[Math.floor(Math.random() * cardsData.length)];
    }
    
    return possibleCards[Math.floor(Math.random() * possibleCards.length)];
}

function checkGuarantee() {
    const rarityOrder = ['Ultimate', 'Legendary', 'Epic', 'Rare'];
    
    for (const rarity of rarityOrder) {
        const threshold = guaranteeThresholds[rarity];
        const pullsSinceLastGuarantee = pullCount - lastGuaranteedPulls[rarity];
        
        if (pullsSinceLastGuarantee >= threshold) {
            lastGuaranteedPulls[rarity] = pullCount;
            
            if (selectedGuaranteeCards[rarity]) {
                return { card: selectedGuaranteeCards[rarity], rarity };
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
    
    const cardElement = createCardElement(card, 'unused', '../../img/cats/');
    setupSingleCardTilt(cardElement);
    
    cardElement.addEventListener('mouseenter', () => {
        const rect = cardElement.getBoundingClientRect();
        const isUpper = rect.top < window.innerHeight / 2;
        showTooltip(cardElement, card, isUpper ? 'bottom' : 'top');
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
    cardElement.style.transform = 'scale(0.3) rotateY(720deg)';
    setTimeout(() => {
        cardElement.style.transition = 'all 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        cardElement.style.opacity = '1';
        cardElement.style.transform = 'scale(1) rotateY(0deg)';
    }, 50);
}

function updatePullCounter() {
    pullCounter.textContent = `Pulls: ${pullCount}`;
}

drawButton.addEventListener('click', () => {
    pullCount++;
    updatePullCounter();
    
    const guarantee = checkGuarantee();
    
    if (guarantee) {
        displayDrawnCard(guarantee.card, true, guarantee.rarity);
    } else {
        const drawnCard = drawRandomCard();
        displayDrawnCard(drawnCard, false);
    }
});

function updateGuaranteePreview(rarity) {
    const preview = document.getElementById(`preview-${rarity.toLowerCase()}`);
    const selectedCard = selectedGuaranteeCards[rarity];
    
    if (selectedCard) {
        preview.innerHTML = '';
        const miniCard = createCardElement(selectedCard, 'unused', '../../img/cats/');
        setupSingleCardTilt(miniCard);
        
        miniCard.addEventListener('mouseenter', () => {
            const rect = miniCard.getBoundingClientRect();
            const isUpper = rect.top < window.innerHeight / 2;
            showTooltip(miniCard, selectedCard, isUpper ? 'bottom' : 'top');
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
        modalCardsGrid.innerHTML = '<p>No cards available for this rarity</p>';
        modal.classList.add('show');
        return;
    }
    
    cardsOfRarity.forEach(card => {
        const cardElement = createCardElement(card, 'unused', '../../img/cats/');
        setupSingleCardTilt(cardElement);
        cardElement.classList.add('modal-card');
        
        cardElement.addEventListener('mouseenter', () => {
            const rect = cardElement.getBoundingClientRect();
            const isUpper = rect.top < window.innerHeight / 2;
            showTooltip(cardElement, card, isUpper ? 'bottom' : 'top');
        });
        cardElement.addEventListener('mouseleave', () => {
            removeTooltip(cardElement);
        });
        
        cardElement.addEventListener('click', () => {
            selectedGuaranteeCards[rarity] = card;
            updateGuaranteePreview(rarity);
            modal.classList.remove('show');
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

updatePullCounter();