import { gameState, updateMoneyDisplay, triggerManualSave, defeatedBossesByCategory } from '../data/gameState.js';
import { basesData, getEffectiveCloneTime, getCurrentBaseConfig } from '../data/basesData.js';
import { renderAvailableCards, renderDeckSlots } from './cardRenderer.js';
import { showTooltip, removeTooltip } from './tooltips.js';
import { CatCard } from '../models/CatCard.js';

let updateInterval = null;
export let baseUpgradeCats = [null, null];
export let cloneSlots = [
    { card: null, startTime: null, totalTime: null },
    { card: null, startTime: null, totalTime: null },
    { card: null, startTime: null, totalTime: null },
    { card: null, startTime: null, totalTime: null }
];

const MAX_LEVEL_COPIES = 62;

function ensureCatCard(cat) {
    if (cat instanceof CatCard) {
        return cat;
    }
    return new CatCard(
        cat.id,
        cat.number,
        cat.name,
        cat.collection,
        cat.rarity,
        cat.baseAttack,
        cat.baseSpeed,
        cat.baseCrit,
        cat.attackType,
        cat.copies
    );
}

export function setBaseUpgradeCats(cats) {
    baseUpgradeCats = cats;
}

export function setCloneSlots(slots) {
    cloneSlots = slots;
}

export function isCardUsedInBase(card) {
    if (baseUpgradeCats.includes(card)) return true;
    if (cloneSlots.some(slot => slot.card === card)) return true;
    
    if (gameState.baseUpgradeInProgress) {
        const upgradeCats = gameState.baseUpgradeInProgress.cats || [];
        if (upgradeCats.some(c => c.id === card.id)) return true;
    }
    
    return false;
}

export function isBaseUnlocked(baseId) {

    if (baseId === 1) return true;

    const requiredCategory = baseId - 1;
    const defeatedCount = defeatedBossesByCategory[requiredCategory]?.size || 0;
    
    return defeatedCount >= 10;
}

export function initializeBasePanel() {
    setupBaseSubTabs();
    renderBaseUpgradeTab();
    renderCardCloneTab();
    
    if (updateInterval) clearInterval(updateInterval);
    updateInterval = setInterval(() => {
        updateBaseUpgradeProgress();
        updateCardCloneProgress();
    }, 100);
}

function setupBaseSubTabs() {
    const subtabs = document.querySelectorAll('.base-subtab');
    const subcontents = document.querySelectorAll('.base-subtab-content');
    
    subtabs.forEach(subtab => {
        subtab.addEventListener('click', () => {
            const subtabName = subtab.dataset.subtab;
            
            subtabs.forEach(st => st.classList.remove('active'));
            subtab.classList.add('active');
            
            subcontents.forEach(sc => sc.classList.remove('active'));
            document.getElementById(`${subtabName}-subtab`).classList.add('active');
        });
    });
}

export function renderBaseUpgradeTab() {
    const container = document.getElementById('upgrade-subtab');
    if (!container) return;
    
    const currentBase = basesData.find(b => b.id === gameState.currentBaseId);
    const nextBase = basesData.find(b => b.id === gameState.currentBaseId + 1);
    
    const isNextBaseUnlocked = nextBase ? isBaseUnlocked(nextBase.id) : false;
    
    container.innerHTML = `
        <div class="base-upgrade-panel">
            <h2 class="current-base-title">${currentBase.name}</h2>
            
            <div class="base-upgrade-content">
                <div class="base-image-container">
                    <img src="img/bases/${currentBase.id}.png" alt="${currentBase.name}">
                </div>
                
                ${gameState.baseUpgradeInProgress ? renderUpgradeInProgress(nextBase) : (nextBase ? renderUpgradeControls(nextBase, isNextBaseUnlocked) : '<p class="max-level">MAX LEVEL REACHED!</p>')}
            </div>
        </div>
    `;
    
    setupBaseUpgradeControls(isNextBaseUnlocked);
}

function renderUpgradeInProgress() {
    return `
        <div class="upgrade-controls-box">
            <h4>Speed up with cats:</h4>
            <div class="cat-slots-container">
                <div class="cat-slot" data-slot="0">
                    <span class="empty-text">Drag here</span>
                </div>
                <div class="cat-slot" data-slot="1">
                    <span class="empty-text">Drag here</span>
                </div>
            </div>
            <div class="upgrade-time-display" id="base-upgrade-time">Calculating...</div>
        </div>
    `;
}

function renderUpgradeControls(nextBase, isUnlocked) {
    if (!isUnlocked) {
        return `
            <div class="upgrade-controls-box locked">
                <div class="locked-base-overlay">
                    <img src="img/icons/lock.png" alt="Locked" class="lock-icon">
                    <p class="unlock-requirement">
                        Defeat all 10 bosses from the next category to unlock this base upgrade
                    </p>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="upgrade-controls-box">
            <h4>Speed up with cats:</h4>
            <div class="cat-slots-container">
                <div class="cat-slot" data-slot="0">
                    <span class="empty-text">Drag here</span>
                </div>
                <div class="cat-slot" data-slot="1">
                    <span class="empty-text">Drag here</span>
                </div>
            </div>
            <button class="start-upgrade-btn">Upgrade - $${nextBase.cost}</button>
        </div>
    `;
}

function setupBaseUpgradeControls(isNextBaseUnlocked) {
    if (!isNextBaseUnlocked) return;
    
    const slots = document.querySelectorAll('.cat-slot');
    slots.forEach((slot, index) => {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            slot.classList.add('drag-over');
        });
        
        slot.addEventListener('dragleave', () => {
            slot.classList.remove('drag-over');
        });
        
        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            
            const cardId = e.dataTransfer.getData('cardId');
            const sourceType = e.dataTransfer.getData('sourceType');
            const sourceIndex = e.dataTransfer.getData('sourceIndex');
            const card = gameState.ownedCards.find(c => c.id == cardId);
            
            if (!card || gameState.deckCards.includes(card)) return;
            
            const otherIndex = index === 0 ? 1 : 0;
            if (baseUpgradeCats[otherIndex] === card) {
                return;
            }
            
            if (sourceType === 'base-upgrade' && sourceIndex !== undefined) {
                const fromIndex = parseInt(sourceIndex);
                const temp = baseUpgradeCats[index];
                baseUpgradeCats[index] = baseUpgradeCats[fromIndex];
                baseUpgradeCats[fromIndex] = temp;
                
                const slots = document.querySelectorAll('.cat-slot');
                renderCatSlot(slots[fromIndex], fromIndex);
                renderCatSlot(slots[index], index);
                
                if (gameState.baseUpgradeInProgress) {
                    gameState.baseUpgradeInProgress.cats = baseUpgradeCats.filter(c => c !== null);
                }
            } else {
                const oldCat = baseUpgradeCats[index];
                baseUpgradeCats[index] = card;
                renderCatSlot(slot, index);
                
                if (gameState.baseUpgradeInProgress) {
                    gameState.baseUpgradeInProgress.cats = baseUpgradeCats.filter(c => c !== null);
                    recalculateUpgradeTime(oldCat, card);
                }
            }
            
            renderAvailableCards();
        });
        
        slot.addEventListener('click', () => {
            if (baseUpgradeCats[index]) {
                const removedCat = baseUpgradeCats[index];
                baseUpgradeCats[index] = null;
                renderCatSlot(slot, index);
                
                removeTooltip();
                
                if (gameState.baseUpgradeInProgress) {
                    gameState.baseUpgradeInProgress.cats = baseUpgradeCats.filter(c => c !== null);
                    recalculateUpgradeTime(removedCat, null);
                }
                
                renderAvailableCards();
            }
        });
    });
    
    const startBtn = document.querySelector('.start-upgrade-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startBaseUpgrade);
    }
    
    slots.forEach((slot, index) => {
        renderCatSlot(slot, index);
    });
}

function recalculateUpgradeTime(oldCat, newCat) {
    if (!gameState.baseUpgradeInProgress) return;

    const oldCDPS = oldCat ? ensureCatCard(oldCat).calculateCritDPS() : 0;
    const newCDPS = newCat ? ensureCatCard(newCat).calculateCritDPS() : 0;
    
    if (oldCat && !newCat && oldCDPS > 0) {
        gameState.baseUpgradeInProgress.remainingTime *= oldCDPS;
        gameState.baseUpgradeInProgress.startTime = Date.now();
    }
    else if (!oldCat && newCat && newCDPS > 0) {
        gameState.baseUpgradeInProgress.remainingTime = Math.max(100, gameState.baseUpgradeInProgress.remainingTime / newCDPS);
        gameState.baseUpgradeInProgress.startTime = Date.now();
    }
    else if (oldCat && newCat) {
        if (oldCDPS > 0) {
            gameState.baseUpgradeInProgress.remainingTime *= oldCDPS;
        }
        if (newCDPS > 0) {
            gameState.baseUpgradeInProgress.remainingTime = Math.max(100, gameState.baseUpgradeInProgress.remainingTime / newCDPS);
        }
        gameState.baseUpgradeInProgress.startTime = Date.now();
    }
}

function renderCatSlot(slot, index) {
    const cat = baseUpgradeCats[index];
    
    if (cat) {
        slot.classList.remove('rarity-common', 'rarity-uncommon', 'rarity-rare', 'rarity-epic', 'rarity-legendary', 'rarity-ultimate');
        
        slot.innerHTML = `
            <img src="img/cats/${cat.number}.png" alt="${cat.name}">
        `;
        slot.classList.add('filled');
        slot.classList.add(ensureCatCard(cat).getRarityClass());
        
        slot.setAttribute('draggable', 'true');
        
        const oldDragStartListener = slot._dragStartListener;
        if (oldDragStartListener) {
            slot.removeEventListener('dragstart', oldDragStartListener);
        }
        const oldMouseEnterListener = slot._mouseEnterListener;
        if (oldMouseEnterListener) {
            slot.removeEventListener('mouseenter', oldMouseEnterListener);
        }
        const oldMouseLeaveListener = slot._mouseLeaveListener;
        if (oldMouseLeaveListener) {
            slot.removeEventListener('mouseleave', oldMouseLeaveListener);
        }
        
        const dragStartListener = (e) => {
            e.dataTransfer.setData('cardId', cat.id);
            e.dataTransfer.setData('sourceType', 'base-upgrade');
            e.dataTransfer.setData('sourceIndex', index);
            removeTooltip();
        };
        slot._dragStartListener = dragStartListener;
        slot.addEventListener('dragstart', dragStartListener);
        
        const mouseEnterListener = (e) => {
            showTooltip(slot, cat, 'top');
        };
        slot._mouseEnterListener = mouseEnterListener;
        slot.addEventListener('mouseenter', mouseEnterListener);
        
        const mouseLeaveListener = () => {
            removeTooltip();
        };
        slot._mouseLeaveListener = mouseLeaveListener;
        slot.addEventListener('mouseleave', mouseLeaveListener);
    } else {
        slot.innerHTML = '<span class="empty-text">Drag here</span>';
        slot.classList.remove('filled', 'rarity-common', 'rarity-uncommon', 'rarity-rare', 'rarity-epic', 'rarity-legendary', 'rarity-ultimate');
        slot.removeAttribute('draggable');
    }
}

function startBaseUpgrade() {
    const nextBase = basesData.find(b => b.id === gameState.currentBaseId + 1);
    if (!nextBase) return;
    
    if (gameState.money < nextBase.cost) {
        alert(`Not enough money! Need $${nextBase.cost}, you have $${gameState.money}`);
        return;
    }
    
    const baseBuildTime = nextBase.baseBuildTime;
    const cats = baseUpgradeCats.filter(c => c !== null);
    const totalCritDPS = cats.length > 0 
        ? cats.reduce((sum, cat) => sum + ensureCatCard(cat).calculateCritDPS(), 0) 
        : 0;
    
    let buildTime = baseBuildTime;
    if (totalCritDPS > 0) {
        buildTime = Math.max(1, baseBuildTime / totalCritDPS);
    }
    
    gameState.money -= nextBase.cost;
    updateMoneyDisplay();
    
    gameState.baseUpgradeInProgress = {
        targetBaseId: nextBase.id,
        startTime: Date.now(),
        baseBuildTime: baseBuildTime,
        remainingTime: buildTime * 1000,
        cats: [...cats]
    };
    
    renderAvailableCards();
    renderBaseUpgradeTab();
}

function updateBaseUpgradeProgress() {
    if (!gameState.baseUpgradeInProgress) return;
    
    const elapsed = Date.now() - gameState.baseUpgradeInProgress.startTime;
    
    gameState.baseUpgradeInProgress.remainingTime -= elapsed;
    gameState.baseUpgradeInProgress.startTime = Date.now();
    
    const timeDisplay = document.getElementById('base-upgrade-time');
    
    if (timeDisplay) {
        const remaining = Math.max(0, gameState.baseUpgradeInProgress.remainingTime);
        timeDisplay.textContent = `Time remaining: ${Math.ceil(remaining / 1000)}s`;
    }
    
    if (gameState.baseUpgradeInProgress.remainingTime <= 0) {
        completeBaseUpgrade();
    }
}

function completeBaseUpgrade() {
    gameState.currentBaseId = gameState.baseUpgradeInProgress.targetBaseId;
    gameState.baseUpgradeInProgress = null;
    
    baseUpgradeCats = [null, null];
    
    renderAvailableCards();
    renderBaseUpgradeTab();
    renderCardCloneTab();
    renderDeckSlots();
    
    triggerManualSave();
}

function renderCardCloneTab() {
    const container = document.getElementById('clone-subtab');
    if (!container) return;
    
    const baseConfig = getCurrentBaseConfig(gameState.currentBaseId);
    const isCloningUnlocked = baseConfig.cloneSlots > 0;
    
    if (!isCloningUnlocked) {
        container.innerHTML = `
            <div class="card-clone-panel locked">
                <div class="clone-locked-overlay">
                    <img src="img/icons/lock.png" alt="Locked" class="lock-icon">
                    <h3>Card Cloning Locked</h3>
                    <p>Upgrade your base to unlock card cloning</p>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="clone-speed-info">
            <p>Clone Speed: <strong>${baseConfig.cloneSpeedMultiplier}x</strong></p>
        </div>
        <div class="card-clone-panel">
            <div class="clone-slots-container">
                ${cloneSlots.map((slot, index) => renderCloneSlot(slot, index, baseConfig)).join('')}
            </div>
        </div>
    `;
    
    setupCardCloneControls();
}

function renderCloneSlot(slot, index, baseConfig) {
    const isSlotLocked = index >= baseConfig.cloneSlots;
    const hasCard = slot.card !== null;
    const isCloning = hasCard && slot.startTime !== null;
    
    if (isSlotLocked) {
        return `
            <div class="clone-slot-wrapper locked">
                <div class="clone-slot locked" data-slot="${index}">
                    <img src="img/icons/lock.png" alt="Locked" class="lock-icon">
                </div>
                <div class="clone-timer">LOCKED</div>
                <div class="clone-progress-bar-container">
                    <div class="clone-progress-bar" style="width: 0%"></div>
                </div>
            </div>
        `;
    }
    
    if (!hasCard) {
        return `
            <div class="clone-slot-wrapper">
                <div class="clone-slot empty" data-slot="${index}">
                    <span class="empty-text">Drag here</span>
                </div>
                <div class="clone-timer">SLOT ${index + 1}</div>
                <div class="clone-progress-bar-container">
                    <div class="clone-progress-bar" style="width: 0%"></div>
                </div>
            </div>
        `;
    }
    
    const card = slot.card;
    const rarityClass = `rarity-${card.rarity.toLowerCase()}`;
    const cloneTime = getEffectiveCloneTime(card.rarity, gameState.currentBaseId);
    
    const cardInstance = ensureCatCard(card);
    const level = cardInstance.getLevel();
    const copiesProgress = cardInstance.getCopiesDisplay();
    
    let progressPercent = 0;
    let timeText = `0/${cloneTime}s`;
    
    if (isCloning) {
        const elapsed = (Date.now() - slot.startTime) / 1000;
        progressPercent = Math.min((elapsed / cloneTime) * 100, 100);
        timeText = `${Math.floor(elapsed)}/${cloneTime}s`;
    } else {
        timeText = `0/${cloneTime}s`;
    }
    
    return `
        <div class="clone-slot-wrapper">
            <div class="clone-slot filled ${rarityClass}" data-slot="${index}" data-card-id="${card.id}">
                <img src="img/cats/${card.number}.png" alt="${card.name}">
            </div>
            <div class="clone-stats">
                <span>Level ${level}</span>
                <span>${copiesProgress} copies</span>
            </div>
            <div class="clone-timer">${timeText}</div>
            <div class="clone-progress-bar-container">
                <div class="clone-progress-bar" id="clone-bar-${index}" style="width: ${progressPercent}%"></div>
            </div>
        </div>
    `;
}

function setupCardCloneControls() {
    const baseConfig = getCurrentBaseConfig(gameState.currentBaseId);
    const slots = document.querySelectorAll('.clone-slot');
    slots.forEach((slotEl, index) => {
        if (index >= baseConfig.cloneSlots) return;
        
        slotEl.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!cloneSlots[index].card) {
                slotEl.classList.add('drag-over');
            }
        });
        
        slotEl.addEventListener('dragleave', () => {
            slotEl.classList.remove('drag-over');
        });
        
        slotEl.addEventListener('drop', (e) => {
            e.preventDefault();
            slotEl.classList.remove('drag-over');
            
            if (cloneSlots[index].card) return;
            
            const cardId = e.dataTransfer.getData('cardId');
            const card = gameState.ownedCards.find(c => c.id == cardId);
            
            if (!card || gameState.deckCards.includes(card)) return;
            
            if (card.copies >= MAX_LEVEL_COPIES) {
                alert('This card is already at max level!');
                return;
            }
            
            const cloneTime = getEffectiveCloneTime(card.rarity, gameState.currentBaseId);
            cloneSlots[index] = {
                card: card,
                startTime: Date.now(),
                totalTime: cloneTime * 1000
            };
            
            renderCardCloneTab();
            renderAvailableCards();
        });
        
        slotEl.addEventListener('click', (e) => {
            const slot = cloneSlots[index];
            if (slot.card) {
                removeTooltip();
                
                cloneSlots[index] = { card: null, startTime: null, totalTime: null };
                renderCardCloneTab();
                renderAvailableCards();
            }
        });
        
        if (cloneSlots[index].card) {
            const card = cloneSlots[index].card;
            
            slotEl.addEventListener('mouseenter', (e) => {
                showTooltip(slotEl, card, 'top');
            });
            
            slotEl.addEventListener('mouseleave', () => {
                removeTooltip();
            });
        }
    });
}

function updateCardCloneProgress() {
    cloneSlots.forEach((slot, index) => {
        if (!slot.card || !slot.startTime) return;
        
        const elapsed = Date.now() - slot.startTime;
        const progress = Math.min(elapsed / slot.totalTime, 1);
        
        const progressBar = document.getElementById(`clone-bar-${index}`);
        if (progressBar) {
            progressBar.style.width = `${progress * 100}%`;
        }
        
        const cloneTime = getEffectiveCloneTime(slot.card.rarity, gameState.currentBaseId);
        const elapsedSeconds = Math.floor(elapsed / 1000);
        const timerEl = document.querySelectorAll('.clone-timer')[index];
        if (timerEl) {
            timerEl.textContent = `${elapsedSeconds}/${cloneTime}s`;
        }
        
        if (progress >= 1) {
            completeCardCloning(index);
        }
    });
}

function completeCardCloning(slotIndex) {
    const slot = cloneSlots[slotIndex];
    if (!slot.card) return;
    
    const card = slot.card;
    card.copies += 1;
    
    console.log(`Card "${card.name}" cloned! New copies: ${card.copies}`);
    
    triggerManualSave();
    
    if (card.copies >= MAX_LEVEL_COPIES) {
        console.log(`Card "${card.name}" has reached max level! Removing from slot.`);
        cloneSlots[slotIndex] = { card: null, startTime: null, totalTime: null };
        renderCardCloneTab();
        renderAvailableCards();
    } else {
        const cloneTime = getEffectiveCloneTime(card.rarity, gameState.currentBaseId);
        cloneSlots[slotIndex] = {
            card: card,
            startTime: Date.now(),
            totalTime: cloneTime * 1000
        };
        renderCardCloneTab();
    }
}