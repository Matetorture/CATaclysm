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
        this.attackType = attackType; // Fire, Water, Stone, Plant, Air, Electric, Ice, Holy, Dark
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
            speed: Math.floor(this.baseSpeed / ((level + 1))),
            crit: (this.baseCrit * level * 1.5).toFixed(1)
        };
    }

    getRarityClass() {
        return `rarity-${this.rarity.toLowerCase()}`;
    }

    getTypeClass() {
        return `type-${this.attackType.toLowerCase()}`;
    }

    getDPS() {
        const stats = this.getStats();
        const attacksPerSecond = 1000 / stats.speed;
        const critMultiplier = 2;
        const critChance = stats.crit / 100;

        const damagePerHit = stats.attack;

        const dps = damagePerHit * attacksPerSecond;

        const dpsWithCrit = 
        (damagePerHit * (1 - critChance) + damagePerHit * critMultiplier * critChance) * attacksPerSecond;

        return {
        dps: dps.toFixed(2),
        dpsWithCrit: dpsWithCrit.toFixed(2),
        };
    }
}

const cardRarities = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "ultimate"
];

const attackTypes = [
  "fire",
  "water",
  "stone",
  "plant",
  "air",
  "electric",
  "ice",
  "holy",
  "dark"
];

const gameState = {
    ownedCards: [], // All owned cards
    deckCards: [null, null, null, null, null, null, null, null], // 8 deck slots
    ownedModifiers: ['S', 'G', 'B', 'R', 'N'], // S, G, B, R, N
    deckModifiers: ['', '', '', '', '', '', '', ''],
    money: 1250
};

const sampleCardsData = [
    new CatCard(1, '1.1', 'Fire Kitten', 'Starter', 'Common', 10, 20000, 5, 'Fire', 3),
    new CatCard(2, '1.2', 'Water Paw', 'Starter', 'Uncommon', 8, 20000, 4, 'Water', 2),
    new CatCard(3, '1.3', 'Stone Tiger', 'Starter', 'Rare', 12, 20000, 6, 'Stone', 6),
    new CatCard(4, '2.1', 'Plant Guardian', 'Forest', 'Epic', 9, 20000, 5, 'Plant', 1),
    new CatCard(5, '2.2', 'Air Dancer', 'Sky', 'Legendary', 11, 20000, 7, 'Air', 14),
    new CatCard(6, '2.3', 'Electric Spark', 'Thunder', 'Legendary', 13, 20000, 8, 'Electric', 30),
    new CatCard(7, '2.4', 'Frost Whisker', 'Frozen', 'Ultimate', 14, 20000, 6, 'Ice', 62),
    new CatCard(8, '2.5', 'Legendary Beast', 'Legendary', 'Legendary', 20, 20000, 10, 'Fire', 5),
];

function initGame() {
    gameState.ownedCards = [...sampleCardsData];
    setupBottomPanelToggle();
    renderAvailableCards();
    renderDeckSlots();
    renderBoss();
    startDeckContinuousAttacks();
    generateFilterButtons();
}

function renderAvailableCards(cardsToRender = gameState.ownedCards) {
    const container = document.getElementById('availableCardsGrid');
    container.innerHTML = '';

    cardsToRender.forEach((card) => {
        const inDeck = gameState.deckCards.includes(card);
        if (inDeck) return;

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

function generateFilterButtons() {
    const typeContainer = document.querySelector('.card-filter-types');
    const rarityContainer = document.querySelector('.card-filter-rarity');

    typeContainer.innerHTML = '';
    rarityContainer.innerHTML = '';

    attackTypes.forEach(type => {
        const btn = document.createElement('button');
        btn.className = `type-${type}-text btnFilterType filterBtn`;
        btn.setAttribute('data-type', type);

        const icon = document.createElement('img');
        icon.src = `img/types/${type}.png`;
        icon.alt = type + ' icon';
        icon.style.width = '16px';
        icon.style.height = '18px';
        icon.style.marginRight = '6px';
        icon.style.verticalAlign = 'middle';
        icon.style.pointerEvents = 'none';

        btn.appendChild(icon);
        btn.appendChild(document.createTextNode(type));
        typeContainer.appendChild(btn);
    });

    cardRarities.forEach(rarity => {
        const btn = document.createElement('button');
        btn.className = `rarity-${rarity}-text btnFilterRarity filterBtn`;
        btn.setAttribute('data-rarity', rarity);
        btn.textContent = rarity;
        rarityContainer.appendChild(btn);
    });

    setupFilterButtons();
}


function setupFilterButtons() {
    document.querySelectorAll('.filterBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filterBtn').forEach(b => b.classList.remove('activeFilterBtn'));
            btn.classList.add('activeFilterBtn');
        });
    });

    document.getElementById('btnAll').addEventListener('click', () => {
        const sorted = sortCardsById(gameState.ownedCards);
        renderAvailableCards(sorted);
    });

    document.getElementById('btnSortDPS').addEventListener('click', () => {
        const sorted = sortCardsByDPSWithCrit(gameState.ownedCards);
        renderAvailableCards(sorted);
    });

    document.querySelectorAll('.btnFilterType').forEach(btn => {
        btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const filtered = filterCardsByAttackType(gameState.ownedCards, type);
        renderAvailableCards(filtered);
        });
    });

    document.querySelectorAll('.btnFilterRarity').forEach(btn => {
        btn.addEventListener('click', () => {
        const rarity = btn.dataset.rarity;
        const filtered = filterCardsByRarity(gameState.ownedCards, rarity);
        renderAvailableCards(filtered);
        });
    });
}

function sortCardsById(cards) {
  return cards.slice().sort((a, b) => a.id - b.id);
}

function sortCardsByDPSWithCrit(cards) {
  return cards.slice().sort((a, b) => {
    const dpsA = parseFloat(a.getDPS().dpsWithCrit);
    const dpsB = parseFloat(b.getDPS().dpsWithCrit);
    return dpsB - dpsA;
  });
}

function filterCardsByAttackType(cards, type) {
  return cards.filter(card => card.attackType.toLowerCase() === type.toLowerCase());
}

function filterCardsByRarity(cards, rarity) {
  return cards.filter(card => card.rarity.toLowerCase() === rarity.toLowerCase());
}

function renderDeckSlots() {
    const container = document.querySelector('.deck-slots');
    container.innerHTML = '';

    for (let i = 0; i < 8; i++) {
        const slot = document.createElement('div');
        slot.className = 'deck-slot';
        slot.dataset.slot = i;

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
}

function createCardElement(card, type = 'deck') {
    const element = document.createElement('div');
    element.className = type === 'unused' ? 'unused-card' : 'card';
    element.classList.add(card.getRarityClass());

    if (type === 'unused') {
        element.innerHTML = `
            <img class="unused-card-image" src="img/cats/${card.number}.png" alt="${card.name}">
        `;
    }

    return element;
}

function createCardContent(card) {
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
        });
    });
}

function showTooltip(element, card, position = 'top') {
    removeTooltip(element);

    const stats = card.getStats();
    const dpsStats = card.getDPS();

    const slotIndex = gameState.deckCards.findIndex(c => c === card);
    const slotType = slotIndex !== -1 ? gameState.deckModifiers[slotIndex] : '';

    let modStats = null;
    if (slotType) {
        modStats = getModifiedStats(card, slotType);
        const attacksPerSecond = 1000 / modStats.speed;
        const critMultiplier = 2;
        const critChance = modStats.crit / 100;
        const damagePerHit = modStats.attack;
        const dps = damagePerHit * attacksPerSecond;
        const dpsWithCrit = (damagePerHit * (1 - critChance) + damagePerHit * critMultiplier * critChance) * attacksPerSecond;
        modStats.dps = dps.toFixed(2);
        modStats.dpsWithCrit = dpsWithCrit.toFixed(2);
    }

    const tooltip = document.createElement('div');
    tooltip.className = `card-tooltip`;
    tooltip.innerHTML = `
        <div style="text-align: center; font-size: 15px; font-weight: bold; color: var(--primary-color); margin-bottom: 2px;">
            ${card.name}
        </div>
        <div style="text-align: center; font-size: 11px; color: #dfccff; font-weight: 500; margin-bottom: 8px;">
            ${card.collection} <span style="color:#aaa;">#${card.number}</span>
        </div>

        <div class="tooltip-stats" style="display: flex; margin-bottom: 8px;">
            <div style="display: flex; flex-direction:column; align-items:center; width:33%;">
                <span style="font-size:13px; color:#fff; font-weight:bold;">A</span>
                <span style="font-size:14px; color:#ff6464; font-weight:600;">${stats.attack}</span>
            </div>
            <div style="display: flex; flex-direction:column; align-items:center; width:33%;">
                <span style="font-size:13px; color:#fff; font-weight:bold;">S</span>
                <span style="font-size:14px; color:#3cb7fa; font-weight:600;">${modStats ? '' : '<span class="speed-timer"></span>'} ${(Number(stats.speed) / 1000).toFixed(2)}s</span>
            </div>
            <div style="display: flex; flex-direction:column; align-items:center; width:33%;">
                <span style="font-size:13px; color:#fff; font-weight:bold;">C</span>
                <span style="font-size:14px; color:#ffe769; font-weight:600;">${stats.crit}%</span>
            </div>
        </div>

        <div class="tooltip-dps-columns">
            <div class="tooltip-dps-label">DPS:</div>
            <div class="tooltip-dps-value-attack" style="color: #ff6464;">${dpsStats.dps}</div>
            <div class="tooltip-dps-label">Crit DPS:</div>
            <div class="tooltip-dps-value-crit" style="color: #ffe769;">${dpsStats.dpsWithCrit}</div>
        </div>

        ${modStats ? `
        <div class="slot-modifier-tooltip">
            <span style="display:block; text-align:center; font-size:12px; color:#aaa; margin-bottom:6px;">WITH MODIFIER:</span>
            <div class="tooltip-stats" style="display: flex; margin-bottom: 8px;">
                <div style="display: flex; flex-direction:column; align-items:center; width:33%;">
                    <span style="font-size:13px; color:#fff; font-weight:bold;">A</span>
                    <span style="font-size:14px; color:#ff6464; font-weight:600;">${modStats.attack}</span>
                </div>
                <div style="display: flex; flex-direction:column; align-items:center; width:33%;">
                    <span style="font-size:13px; color:#fff; font-weight:bold;">S</span>
                    <span style="font-size:14px; color:#3cb7fa; font-weight:600;">${modStats ? '<span class="speed-timer"></span>' : ''} ${(Number(modStats.speed) / 1000).toFixed(2)}s</span>
                </div>
                <div style="display: flex; flex-direction:column; align-items:center; width:33%;">
                    <span style="font-size:13px; color:#fff; font-weight:bold;">C</span>
                    <span style="font-size:14px; color:#ffe769; font-weight:600;">${modStats.crit}%</span>
                </div>
            </div>

            <div class="tooltip-dps-columns">
                <div class="tooltip-dps-label">DPS:</div>
                <div class="tooltip-dps-value-attack" style="color: #ff6464;">${modStats.dps}</div>
                <div class="tooltip-dps-label">Crit DPS:</div>
                <div class="tooltip-dps-value-crit" style="color: #ffe769;">${modStats.dpsWithCrit}</div>
            </div>
        </div>
        ` : ''}

        <div style="display:flex; justify-content: center; gap:22px; margin: 20px;">
            <div style="font-size: 12px; color:#aaa;">
                <span style="color:#ffb862;">${card.getLevelDisplay()}</span>
            </div>
            <div style="font-size: 12px; color:#aaa;">
                Copies: <span style="color:#dfccff;">${card.getCopiesDisplay()}</span>
            </div>
        </div>

        <div style="display:flex; justify-content:center; align-items: center; gap:16px;">
            <div class="${card.getTypeClass()}-text type-attack-text" style="font-size: 11px; font-weight:600;">${card.attackType}</div>
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
        startDeckContinuousAttacks();
    } else {
        alert('All deck slots are full!');
    }
}

function removeCardFromDeck(slotIndex) {
    gameState.deckCards[slotIndex] = null;
    gameState.deckModifiers[slotIndex] = '';
    renderAvailableCards();
    renderDeckSlots();
    startDeckContinuousAttacks();
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
    });
} else {
    initGame();   
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
    removeDeckComparisonTooltip();

    const crt = document.createElement('canvas');
    crt.width = 0;
    crt.height = 0;
    e.dataTransfer.setDragImage(crt, 0, 0);

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


const bosses = [
  { id: 1, name: "Fire Dragon", maxHp: 5000, hp: 5000, weakness: ["Ice"], onlyWeakness: false },
  { id: 2, name: "Stone Golem", maxHp: 7000, hp: 7000, weakness: ["Water", "Electric"], onlyWeakness: false },
  { id: 3, name: "Shadow Wraith", maxHp: 3500, hp: 3500, weakness: ["Plant"], onlyWeakness: false }
];

let currentBossId = 1;

function getCurrentBoss() {
  return bosses.find(b => b.id === currentBossId);
}

function changeBossHp(amount) {
  const boss = getCurrentBoss();
  if (!boss) return;
  boss.hp = Math.max(0, Math.min(boss.maxHp, boss.hp + amount));
  renderBoss();
}

function renderBoss() {
  const bossContainer = document.querySelector('.boss-container');
  const boss = getCurrentBoss();
  if (!boss) return;

  const hpPercent = ((boss.hp / boss.maxHp) * 100).toFixed(1);
  if (!renderBoss.lagHpPercent) renderBoss.lagHpPercent = hpPercent;

  const weaknessHtml = boss.weakness.map(type => {
    const className = `type-${type.toLowerCase()}-text type-attack-text`;
    return `<span class="${className}" style="font-weight: 600; margin-right: 6px;">${type}</span>`;
  }).join('');

  bossContainer.innerHTML = `
    <div class="boss-name">${boss.name}</div>
    <div class="boss-image">
      <img src="img/bosses/${boss.id}.png" alt="${boss.name}">
    </div>
    <span class="boss-hp-label">&nbsp;</span>
    <div class="boss-hp-bar-container">
      <div class="boss-hp-bar-lag" style="width: ${renderBoss.lagHpPercent}%;"></div>
      <div class="boss-hp-bar" style="width: ${hpPercent}%;"></div>
    </div>
    <div class="boss-hp-text">${boss.hp} / ${boss.maxHp} (${hpPercent}%)</div>
    <div class="boss-weakness">
      Weakness: ${weaknessHtml}
      ${boss.onlyWeakness ? '<br><em class="weakness-info">Can only be damaged by its weaknesses</em>' : ''}
    </div>
  `;

  const hpBar = bossContainer.querySelector('.boss-hp-bar');
  if (hpPercent <= 10) {
    hpBar.classList.add('red');
    hpBar.classList.remove('yellow');
  } else if (hpPercent <= 30) {
    hpBar.classList.add('yellow');
    hpBar.classList.remove('red');
  } else {
    hpBar.classList.remove('yellow');
    hpBar.classList.remove('red');
  }

  animateLagHpBar(parseFloat(hpPercent));
}

let attackIntervals = [];
const cardAttackTimers = new Map();

function clearAttackIntervals() {
  attackIntervals.forEach(id => clearInterval(id));
  attackIntervals = [];
  cardAttackTimers.clear();
}

function playAttackAnimation(card) {
  const deckCardElements = document.querySelectorAll('.deck-slot .slot-card.filled');
  deckCardElements.forEach(el => {
    const img = el.querySelector('img.card-image');
    if (img && img.alt === card.name) {
      el.classList.add('attack-animation');
      el.addEventListener('animationend', () => {
        el.classList.remove('attack-animation');
      }, { once: true });
    }
  });
}

function attackWithCard(card) {
    const slotIndex = gameState.deckCards.findIndex(c => c === card);
    const slotType = slotIndex !== -1 ? gameState.deckModifiers[slotIndex] : '';

    const modifiedStats = getModifiedStats(card, slotType);
    const boss = getCurrentBoss();
    if (!boss) return;

    const critChancePercent = modifiedStats.crit;
    let damage = modifiedStats.attack;
    const attackTypeUsed = modifiedStats.modifiedType;

    const isWeaknessMatch = boss.weakness.includes(attackTypeUsed);

    const infoTime = 4000;
    if (boss.onlyWeakness && !isWeaknessMatch) {
        const damageElement = showCardInfo(card.name, "NO DAMAGE", true, infoTime);
        setTimeout(() => damageElement.remove(), infoTime);
        return;
    }

    if (isWeaknessMatch) {
        damage *= 2;
    }

    const isCrit = Math.random() * 100 < critChancePercent;
    if (isCrit) {
        damage *= 2;
    }

    changeBossHp(-damage);

    playAttackAnimation(card);

    const bossHpBarDamage = document.querySelector('.boss-hp-label');
    bossHpBarDamage.classList.add('move-up-animation');
    console.log(boss.hp / boss.maxHp * 100 + '%');
    bossHpBarDamage.style.left = boss.hp / boss.maxHp * 100 - 50 + '%';
    bossHpBarDamage.style.color = isCrit ? '#ff4444' : '#ffffff';
    bossHpBarDamage.innerText = (isCrit ? 'CRIT! ' : '') + '-' + Math.floor(damage);

    setTimeout(() => {
        bossHpBarDamage.innerHTML = '&nbsp;';
    }, infoTime);

    const damageElement = showCardInfo(card.name, (isCrit ? 'CRIT! ' : '') + '-' + Math.floor(damage), isCrit, infoTime);
    setTimeout(() => damageElement.remove(), infoTime);
}

function startDeckContinuousAttacks() {
    clearAttackIntervals();

    gameState.deckCards.forEach((card, index) => {
        if (!card) return;

        const slotMod = gameState.deckModifiers[index] || '';
        const modStats = getModifiedStats(card, slotMod);
        const attackInterval = modStats.speed;

        if (attackInterval <= 0) return;

        cardAttackTimers.set(card.id, 0);

        const intervalId = setInterval(() => {
        attackWithCard(card);
        cardAttackTimers.set(card.id, 0);
        }, attackInterval);

        attackIntervals.push(intervalId);
    });

    requestAnimationFrame(updateAttackTimers);
}

function updateAttackTimers(timestamp) {
  if (!updateAttackTimers.last) updateAttackTimers.last = timestamp;
  const delta = timestamp - updateAttackTimers.last;
  updateAttackTimers.last = timestamp;

  cardAttackTimers.forEach((time, cardId) => {
    const card = gameState.ownedCards.find(c => c.id === cardId);
    if (!card) return;

    const slotIndex = gameState.deckCards.findIndex(c => c === card);
    const slotMod = slotIndex !== -1 ? gameState.deckModifiers[slotIndex] : '';

    const modStats = getModifiedStats(card, slotMod);
    const modSpeed = modStats.speed;
    if (modSpeed <= 0) return;

    const newTime = Math.min(time + delta, modSpeed);
    cardAttackTimers.set(card.id, newTime);
    updateCardTooltipAttackTimer(card, newTime, modSpeed);
  });

  requestAnimationFrame(updateAttackTimers);
}

function updateCardTooltipAttackTimer(card, currentMs) {
  const tooltips = document.querySelectorAll('.card-tooltip');
  tooltips.forEach(tooltip => {
    if (!tooltip.textContent.includes(card.name)) return;

    const speedSpans = tooltip.querySelectorAll('.speed-timer');
    speedSpans.forEach(speedSpan => {
      speedSpan.textContent = `${(currentMs / 1000).toFixed(2)} /`;
    });
  });
}

function animateLagHpBar(targetPercent) {
  if (!renderBoss.lagHpPercent) {
    renderBoss.lagHpPercent = targetPercent;
    return;
  }

  const startPercent = renderBoss.lagHpPercent;
  const duration = 1000;
  const startTime = performance.now();

  function animate(time) {
    const elapsed = time - startTime;
    if (elapsed < duration) {
      const progress = elapsed / duration;
      renderBoss.lagHpPercent = startPercent - (startPercent - targetPercent) * progress;
      const lagBar = document.querySelector('.boss-hp-bar-lag');
      if (lagBar) lagBar.style.width = `${renderBoss.lagHpPercent}%`;

      requestAnimationFrame(animate);
    } else {
      renderBoss.lagHpPercent = targetPercent;
      const lagBar = document.querySelector('.boss-hp-bar-lag');
      if (lagBar) lagBar.style.width = `${targetPercent}%`;
    }
  }
  requestAnimationFrame(animate);
}

function showCardInfo(cardName, displayText, isCrit = false, infoTime) {
  const cardElements = document.querySelectorAll('.slot-card.filled');
  for (const el of cardElements) {
    const img = el.querySelector('img.card-image');
    if (img && img.alt === cardName) {
      const damageDisplayCard = document.createElement('div');
      damageDisplayCard.className = 'info-display-card';

      const rect = el.getBoundingClientRect();
      damageDisplayCard.style.top = (rect.top + 30) + 'px';
      damageDisplayCard.style.left = (rect.left + rect.width / 2) + 'px';
      damageDisplayCard.style.color = isCrit ? '#ff4444' : '#ffffff';
      damageDisplayCard.innerText = displayText;

      document.body.appendChild(damageDisplayCard);

      damageDisplayCard.animate([
        { top: (rect.top + 30) + 'px', opacity: 1 },
        { top: (rect.top) + 'px', opacity: 0 }
      ], {
        duration: infoTime,
        easing: 'ease-out',
      });

      return damageDisplayCard;
    }
  }
  return null;
}

function getModifiedStats(card, slotType) {
    const base = card.getStats();
    let attack = base.attack, speed = base.speed, crit = base.crit;
    let modifiedType = card.attackType;

    switch(slotType) {
        case 'S': // Shiny - attack speed / 3
            speed = Math.floor(speed / 3);
            break;
        case 'G': // Golden - crit rate * 2
            crit = crit * 2;
            break;
        case 'B': // Bloody - attack * 3
            attack = attack * 3;
            break;
        case 'R': // Rainbow - all stats boosted
            attack *= 2;
            speed = Math.floor(speed / 2);
            crit *= 1.3;
            break;
        case 'N': // Negative - change attack type to boss weakness
            const boss = getCurrentBoss();
            if (boss && boss.weakness.length > 0) {
                modifiedType = boss.weakness[0];
            }
            break;
    }
    return { attack, speed, crit, modifiedType };
}

function showDeckComparisonTooltip(compareCard) {
    removeDeckComparisonTooltip();

    const hasCardsInDeck = gameState.deckCards.some(card => card !== null);
    if (!hasCardsInDeck) {
        return;
    }

    const container = document.createElement('div');
    container.id = 'deck-comparison-tooltip';

    const header = document.createElement('h2');
    header.textContent = 'WITHOUT MODIFIERS!';
    header.classList.add('comparison-header');
    container.appendChild(header);

    document.body.appendChild(container);

    for(let i=0; i<8; i++) {
        const deckCard = gameState.deckCards[i];
        const slotDiv = document.createElement('div');
        slotDiv.style.display = 'flex';
        slotDiv.style.justifyContent = 'center';
        slotDiv.style.alignItems = 'center';
        if (!deckCard) {
            slotDiv.innerHTML = '<div style="text-align: center; font-size: 14px; color: #777;">Empty Slot</div>';
        } else {
            const tooltip = document.createElement('div');
            tooltip.className = 'card-tooltip';
            tooltip.style.width = '210px';
            tooltip.style.whiteSpace = 'normal';

            const deckStats = deckCard.getStats();
            const compareStats = compareCard.getStats();

            function getStatClass(statName) {
                if (deckStats[statName] > compareStats[statName]) return 'stat-better';
                if (deckStats[statName] < compareStats[statName]) return 'stat-worse';
                return '';
            }

            function getDPSClass(deckDpsStr, compareDpsStr) {
                const deckDps = parseFloat(deckDpsStr);
                const compareDps = parseFloat(compareDpsStr);
                if (deckDps > compareDps) return 'stat-better';
                if (deckDps < compareDps) return 'stat-worse';
                return '';
            }

            const deckDPS = deckCard.getDPS();
            const compareDPS = compareCard.getDPS();

            tooltip.innerHTML = `
                <div style="text-align:center; font-size: 15px; font-weight: bold; color: var(--primary-color); margin-bottom: 6px;">${deckCard.name}</div>
                <div style="text-align:center; justify-content: center; font-size: 11px; color: #dfccff; font-weight: 500; margin-bottom: 6px;">${deckCard.collection}</div>
                <div style="display: flex; justify-content: center; margin-bottom: 6px; font-size: 13px; width: 100%;">
                    <div class="${getStatClass('attack')}" style="width: 33%; text-align: center;">A:<br>${deckStats.attack}</div>
                    <div class="${getStatClass('speed')}" style="width: 33%; text-align: center;">S:<br>${(deckStats.speed / 1000).toFixed(2)}s</div>
                    <div class="${getStatClass('crit')}" style="width: 33%; text-align: center;">C:<br>${deckStats.crit}%</div>
                </div>
                <div style="display: flex; justify-content: center; margin-bottom: 6px; font-size: 13px; width: 100%;">
                    <div class="${getDPSClass(deckDPS.dps, compareDPS.dps)}" style="width: 50%; text-align: center;">DPS:<br>${deckDPS.dps}</div>
                    <div class="${getDPSClass(deckDPS.dps, compareDPS.dps)}" style="width: 50%; text-align: center;">Crit DPS:<br>${deckDPS.dpsWithCrit}</div>
                </div>
            `;

            slotDiv.appendChild(tooltip);
        }
        container.appendChild(slotDiv);
    }
}

function removeDeckComparisonTooltip() {
    const container = document.getElementById('deck-comparison-tooltip');
    if (container) container.remove();
}

function handleUnusedCardMouseEnter(e, card) {
    showTooltip(e.currentTarget, card, 'top');
    showDeckComparisonTooltip(card);
}

function handleUnusedCardMouseLeave(e) {
    removeTooltip(e.currentTarget);
    removeDeckComparisonTooltip();
}