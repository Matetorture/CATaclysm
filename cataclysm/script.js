class CatCard {
    constructor(id, number, name, collection, rarity, baseAttack, baseSpeed, baseCrit, attackType, copies = 1) {
        this.id = id;
        this.number = number; // e.g., "1.1", "1.52", "4.2"
        this.name = name;
        this.collection = collection;
        this.rarity = rarity; // Common, Uncommon, Rare, Epic, Legendary, Ultimate
        this.baseAttack = baseAttack;
        this.baseSpeed = baseSpeed;
        this.baseCrit = baseCrit; // in percentage
        this.attackType = attackType; // Fire, Water, Earth, Plant, Air, Electric, Ice
        this.copies = copies; // Number of copies owned
    }

    getLevel() {
        if (this.copies < 1) return 0;
        if (this.copies < 2) return 1;
        if (this.copies < 6) return 2;
        if (this.copies < 14) return 3;
        if (this.copies < 30) return 4;
        if (this.copies < 62) return 5;
        return 6;
    }

    getCopiesForNextLevel() {
        const level = this.getLevel();
        const copiesNeeded = [1, 2, 6, 14, 30, 62];
        return copiesNeeded[level] || 62;
    }

    getCopiesDisplay() {
        const level = this.getLevel();
        const copiesNeeded = this.getCopiesForNextLevel();
        
        if (level === 6) {
            return `MAX`;
        }
        
        const prevLevelCopies = level === 0 ? 0 : [1, 2, 6, 14, 30, 62][level - 1];
        const copiesInThisLevel = this.copies - prevLevelCopies;
        const copiesNeededForThisLevel = copiesNeeded - prevLevelCopies;
        
        return `${copiesInThisLevel}/${copiesNeededForThisLevel}`;
    }

    getLevelDisplay() {
        const level = this.getLevel();
        return level === 6 ? 'MAX' : `LEVEL ${level}`;
    }

    getStats() {
        const level = this.getLevel();
        return {
            attack: Math.floor(this.baseAttack * level * 2),
            speed: Math.floor(this.baseSpeed * level * 1.5),
            crit: (this.baseCrit * level * 1.5).toFixed(1)
        };
    }

    getRarityClass() {
        return `rarity-${this.rarity.toLowerCase()}`;
    }

    getTypeClass() {
        return `type-${this.attackType.toLowerCase()}`;
    }
}

const gameState = {
    ownedCards: [], // All owned cards
    deckCards: [null, null, null, null, null, null, null, null], // 8 deck slots
    ownedModifiers: ['S', 'G', 'B', 'R', 'N'], // S, G, B, R, N
    deckModifiers: ['', '', '', '', '', '', '', ''],
    money: 1250
};

const sampleCardsData = [
    new CatCard(1, '1.1', 'Fire Kitten', 'Starter', 'Common', 10, 8, 5, 'Fire', 3),
    new CatCard(2, '1.2', 'Water Paw', 'Starter', 'Uncommon', 8, 10, 4, 'Water', 2),
    new CatCard(3, '1.3', 'Earth Tiger', 'Starter', 'Rare', 12, 7, 6, 'Earth', 6),
    new CatCard(4, '2.1', 'Plant Guardian', 'Forest', 'Epic', 9, 9, 5, 'Plant', 1),
    new CatCard(5, '2.2', 'Air Dancer', 'Sky', 'Legendary', 11, 12, 7, 'Air', 14),
    new CatCard(6, '2.3', 'Electric Spark', 'Thunder', 'Legendary', 13, 11, 8, 'Electric', 30),
    new CatCard(7, '2.4', 'Frost Whisker', 'Frozen', 'Ultimate', 14, 9, 6, 'Ice', 62),
    new CatCard(8, '2.5', 'Legendary Beast', 'Legendary', 'Legendary', 20, 15, 10, 'Fire', 5),
];

function initGame() {
    gameState.ownedCards = [...sampleCardsData];
    renderAvailableCards();
    renderDeckSlots();
}

function renderAvailableCards() {
    const container = document.getElementById('availableCardsGrid');
    container.innerHTML = '';

    gameState.ownedCards.forEach((card) => {
        const inDeck = gameState.deckCards.includes(card);
        if (inDeck) return;

        const cardElement = createCardElement(card, 'unused');
        container.appendChild(cardElement);

        cardElement.addEventListener('click', () => {
            addCardToDeck(card);
        });

        cardElement.addEventListener('mouseenter', () => {
            showTooltip(cardElement, card, 'bottom');
        });

        cardElement.addEventListener('mouseleave', () => {
            removeTooltip(cardElement);
        });

        cardElement.setAttribute('draggable', 'true');
        cardElement.addEventListener('dragstart', (e) => {
            dragStartHandler(e, card, 'unused');
        });
        cardElement.addEventListener('dragend', dragEndHandler);
    });

    setupTiltEffect();
}

function renderDeckSlots() {
    const container = document.querySelector('.deck-slots');
    container.innerHTML = '';

    for (let i = 0; i < 8; i++) {
        const slot = document.createElement('div');
        slot.className = 'deck-slot';
        slot.dataset.slot = i;

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
            btn.className = 'slot-modifier';
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
}

function createCardElement(card, type = 'deck') {
    const element = document.createElement('div');
    element.className = type === 'unused' ? 'unused-card' : 'card';
    element.classList.add(card.getRarityClass());

    if (type === 'unused') {
        element.innerHTML = `
            <img class="unused-card-image" src="img/${card.number}.png" alt="${card.name}">
        `;
    }

    return element;
}

function createCardContent(card) {
    const container = document.createElement('div');
    container.className = 'card-content';

    container.innerHTML = `
        <img class="card-image" src="img/${card.number}.png" alt="${card.name}">
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
        });
    });
}

function showTooltip(element, card, position = 'bottom') {
    removeTooltip(element);

    const stats = card.getStats();
    
    const tooltip = document.createElement('div');
    tooltip.className = `card-tooltip`;
    tooltip.innerHTML = `
        <div style="text-align: center; font-size: 15px; font-weight: bold; color: var(--primary-color); margin-bottom: 2px;">
            ${card.name}
        </div>
        <div style="text-align: center; font-size: 11px; color: #dfccff; font-weight: 500; margin-bottom: 8px;">
            ${card.collection} <span style="color:#aaa;">#${card.number}</span>
        </div>

        <div style="display: flex; justify-content: space-around; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; flex-direction:column; align-items:center;">
                <span style="font-size:13px; color:#fff; font-weight:bold;">A</span>
                <span style="font-size:14px; color:#ff6464; font-weight:600;">${stats.attack}</span>
            </div>
            <div style="display: flex; flex-direction:column; align-items:center;">
                <span style="font-size:13px; color:#fff; font-weight:bold;">S</span>
                <span style="font-size:14px; color:#3cb7fa; font-weight:600;">${stats.speed}</span>
            </div>
            <div style="display: flex; flex-direction:column; align-items:center;">
                <span style="font-size:13px; color:#fff; font-weight:bold;">C</span>
                <span style="font-size:14px; color:#ffe769; font-weight:600;">${stats.crit}%</span>
            </div>
        </div>

        <div style="display:flex; justify-content: center; gap:22px; margin-bottom: 5px;">
            <div style="font-size: 11px; color:#aaa;">
                <span style="color:#ffb862;">${card.getLevelDisplay()}</span>
            </div>
            <div style="font-size: 11px; color:#aaa;">
                Copies: <span style="color:#dfccff;">${card.getCopiesDisplay()}</span>
            </div>
        </div>

        <div style="display:flex; justify-content:center; align-items: center; gap:16px;">
            <div class="${card.getTypeClass()}-text" style="font-size: 11px; font-weight:600;">${card.attackType}</div>
            <div class="${card.getRarityClass()}-text" style="font-size: 11px; font-weight:600;">${card.rarity}</div>
        </div>
    `;

    setTimeout(() => {
        const rect = element.getBoundingClientRect();
        const spacing = 12;
        let top, left;

        left = rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2;

        if (position === 'bottom') {
            top = rect.bottom + window.scrollY + spacing;
        } else {
            top = rect.top + window.scrollY - tooltip.offsetHeight - spacing;
        }

        tooltip.style.position = 'absolute';
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        tooltip.style.zIndex = 10000;
        tooltip.style.pointerEvents = 'none';
    }, 1);

    document.body.appendChild(tooltip);
    element.dataset.tooltipActive = 'true';
}

function removeTooltip(element) {
    const tooltips = document.querySelectorAll('.card-tooltip');
    tooltips.forEach(t => t.remove());
    delete element.dataset.tooltipActive;
}

function addCardToDeck(card) {
    const emptySlot = gameState.deckCards.findIndex(slot => slot === null);
    
    if (emptySlot !== -1) {
        gameState.deckCards[emptySlot] = card;
        renderAvailableCards();
        renderDeckSlots();
    } else {
        alert('All deck slots are full!');
    }
}

function removeCardFromDeck(slotIndex) {
    gameState.deckCards[slotIndex] = null;
    gameState.deckModifiers[slotIndex] = '';
    renderAvailableCards();
    renderDeckSlots();
}

function setupTiltEffect() {
    const allCards = document.querySelectorAll('.unused-card, .slot-card.filled');

    allCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 8;
            const rotateY = (centerX - x) / 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.3s ease';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
}

function setupBottomPanelToggle() {
    const bottomPanel = document.getElementById('bottomPanel');
    const toggleBtn = document.getElementById('togglePanelBtn');
    const closeBtn = document.getElementById('closePanelBtn');

    toggleBtn.addEventListener('click', () => {
        bottomPanel.classList.toggle('visible');
    });

    closeBtn.addEventListener('click', () => {
        bottomPanel.classList.remove('visible');
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initGame();
        setupBottomPanelToggle();
    });
} else {
    initGame();
    setupBottomPanelToggle();
}

let draggedCard = null;
let draggedFrom = null; // 'deck' lub 'unused'
let draggedFromIndex = null; // slot index lub null
const dragPreview = document.getElementById('dragPreview');
let dragOffsetX = 0;
let dragOffsetY = 0;
let draggedCardElement = null;

function dragStartHandler(e, card, from, index = null) {
    draggedCard = card;
    draggedFrom = from;
    draggedFromIndex = index;

    const target = e.target.closest('.slot-card, .unused-card');
    if (target) {
        removeTooltip(target);
    }

    const crt = document.createElement('canvas');
    crt.width = 0;
    crt.height = 0;
    e.dataTransfer.setDragImage(crt, 0, 0);

    dragPreview.style.display = 'block';
    dragPreview.innerHTML = '';
    dragPreview.className = '';
    dragPreview.classList.add(card.getRarityClass());
    const img = document.createElement('img');
    img.src = `img/${card.number}.png`;
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

function moveDragPreview(x, y) {
    dragPreview.style.left = (x - dragOffsetX) + 'px';
    dragPreview.style.top = (y - dragOffsetY) + 'px';
}

function dragEndHandler(e) {
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

function dragOverHandler(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
}

function dragEnterHandler(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function dragLeaveHandler(e) {
    e.currentTarget.classList.remove('drag-over');
}

function dropHandler(e) {
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
        if (targetCard === null) {
            gameState.deckCards[slotIndex] = draggedCard;
            gameState.deckCards[draggedFromIndex] = null;
        } else {
            gameState.deckCards[slotIndex] = draggedCard;
            gameState.deckCards[draggedFromIndex] = targetCard;
        }
    } else if (draggedFrom === 'unused') {
        if (targetCard === null) {
            gameState.deckCards[slotIndex] = draggedCard;
        } else {
            gameState.deckCards[slotIndex] = draggedCard;
        }
    }
    renderAvailableCards();
    renderDeckSlots();
    dragEndHandler(e);
}

const unusedCardsGrid = document.getElementById('availableCardsGrid');
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
        gameState.deckCards[draggedFromIndex] = null;
        renderAvailableCards();
        renderDeckSlots();
    }
    dragEndHandler(e);
});
