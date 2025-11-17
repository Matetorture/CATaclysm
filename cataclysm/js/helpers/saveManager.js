import { gameState } from '../data/gameState.js';
import { CatCard } from '../models/CatCard.js';
import { cardsData } from '../data/cardsData.js';
import { 
    selectedCategoryId,
    categoryProgress,
    setSelectedCategoryId
} from '../data/gameState.js';
import { 
    baseUpgradeCats, 
    cloneSlots,
    setBaseUpgradeCats,
    setCloneSlots,
    isBaseUnlocked
} from '../ui/basePanel.js';
import { isCategoryUnlocked } from '../ui/bossRenderer.js';

const SAVE_KEY = 'cataclysm_save';
const AUTO_SAVE_INTERVAL = 30000;

let autoSaveIntervalId = null;

export function saveGame() {
    try {
        const saveData = {
            version: '0.1.0',
            timestamp: Date.now(),
            money: gameState.money,
            currentBaseId: gameState.currentBaseId,
            unlockedSlots: gameState.unlockedSlots,
            deckModifiers: gameState.deckModifiers,
            
            ownedCards: gameState.ownedCards.map(card => ({
                id: card.id,
                copies: card.copies
            })),
            
            deckCards: gameState.deckCards.map(card => card ? card.id : null),
            
            baseUpgradeInProgress: gameState.baseUpgradeInProgress ? {
                targetBaseId: gameState.baseUpgradeInProgress.targetBaseId,
                startTime: gameState.baseUpgradeInProgress.startTime,
                baseBuildTime: gameState.baseUpgradeInProgress.baseBuildTime,
                remainingTime: gameState.baseUpgradeInProgress.remainingTime,
                cats: gameState.baseUpgradeInProgress.cats.map(cat => cat.id)
            } : null,
            
            baseUpgradeCats: baseUpgradeCats.map(cat => cat ? cat.id : null),
            
            cloneSlots: cloneSlots.map(slot => ({
                cardId: slot.card ? slot.card.id : null,
                startTime: slot.startTime,
                totalTime: slot.totalTime
            })),
            
            selectedCategoryId: selectedCategoryId,
            categoryProgress: categoryProgress,
            
            unlockedAchievements: Array.from(gameState.unlockedAchievements),
            
            openCardsData: {
                pullCount: window.openCardsState?.pullCount || 0,
                lastGuaranteedPulls: window.openCardsState?.lastGuaranteedPulls || { Rare: 0, Epic: 0, Legendary: 0, Ultimate: 0 },
                selectedGuaranteeCards: (() => {
                    const cards = {};
                    if (window.openCardsState?.selectedGuaranteeCards) {
                        Object.entries(window.openCardsState.selectedGuaranteeCards).forEach(([rarity, card]) => {
                            if (card && card.id) {
                                cards[rarity] = card.id;
                            }
                        });
                    }
                    return cards;
                })()
            }
        };
        
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
        console.log('Game saved!', new Date().toLocaleTimeString());
        return true;
    } catch (error) {
        console.error('Failed to save game:', error);
        return false;
    }
}

export function loadGame() {
    try {
        const savedData = localStorage.getItem(SAVE_KEY);
        if (!savedData) {
            console.log('No save data found');
            return false;
        }
        
        const data = JSON.parse(savedData);
        console.log('Loading save from:', new Date(data.timestamp).toLocaleString());
        
        gameState.money = data.money || 0;
        
        if (data.unlockedAchievements) {
            gameState.unlockedAchievements = new Set(data.unlockedAchievements);
        }
        
        if (data.categoryProgress) {
            Object.keys(categoryProgress).forEach(catId => {
                if (data.categoryProgress[catId]) {
                    categoryProgress[catId].currentBossIndex = data.categoryProgress[catId].currentBossIndex || 0;
                    categoryProgress[catId].currentBossHp = data.categoryProgress[catId].currentBossHp || null;
                    categoryProgress[catId].completed = data.categoryProgress[catId].completed || false;
                }
            });
        }

        gameState.currentBaseId = data.currentBaseId || 1;
        
        if (!isBaseUnlocked(gameState.currentBaseId)) {
            console.warn(`Base ${gameState.currentBaseId} is locked, resetting to base 1`);
            gameState.currentBaseId = 1;
        }
        
        gameState.unlockedSlots = data.unlockedSlots || [true, false, false, false, false, false, false, false];
        gameState.deckModifiers = data.deckModifiers || ['', '', '', '', '', '', '', ''];
        
        if (data.ownedCards && data.ownedCards.length > 0) {
            gameState.ownedCards = data.ownedCards.map(savedCard => {
                const originalCard = cardsData.find(c => c.id === savedCard.id);
                if (!originalCard) {
                    console.warn(`Card with id ${savedCard.id} not found in cardsData`);
                    return null;
                }
                
                return new CatCard(
                    originalCard.id,
                    originalCard.number,
                    originalCard.name,
                    originalCard.collection,
                    originalCard.rarity,
                    originalCard.baseAttack,
                    originalCard.baseSpeed,
                    originalCard.baseCrit,
                    originalCard.attackType,
                    savedCard.copies
                );
            }).filter(card => card !== null);
        }
        
        if (data.deckCards) {
            gameState.deckCards = data.deckCards.map(cardId => {
                if (cardId === null) return null;
                return gameState.ownedCards.find(c => c.id === cardId) || null;
            });
        }
        
        if (data.baseUpgradeInProgress) {
            const cats = data.baseUpgradeInProgress.cats.map(catId => 
                gameState.ownedCards.find(c => c.id === catId)
            ).filter(c => c !== undefined);
            
            gameState.baseUpgradeInProgress = {
                targetBaseId: data.baseUpgradeInProgress.targetBaseId,
                startTime: data.baseUpgradeInProgress.startTime,
                baseBuildTime: data.baseUpgradeInProgress.baseBuildTime || 10,
                remainingTime: data.baseUpgradeInProgress.remainingTime,
                cats: cats
            };
        }
        
        if (data.baseUpgradeCats) {
            const cats = data.baseUpgradeCats.map(catId => {
                if (catId === null) return null;
                return gameState.ownedCards.find(c => c.id === catId) || null;
            });
            setBaseUpgradeCats(cats);
        }

        if (data.cloneSlots) {
            const slots = data.cloneSlots.map(slotData => {
                if (!slotData.cardId) {
                    return { card: null, startTime: null, totalTime: null };
                }
                const card = gameState.ownedCards.find(c => c.id === slotData.cardId);
                return {
                    card: card || null,
                    startTime: slotData.startTime,
                    totalTime: slotData.totalTime
                };
            });
            setCloneSlots(slots);
        }
        
        if (data.selectedCategoryId !== undefined) {
            setSelectedCategoryId(data.selectedCategoryId);
        }
        
        if (selectedCategoryId && !isCategoryUnlocked(selectedCategoryId)) {
            console.warn(`Category ${selectedCategoryId} is locked, resetting to category 1`);
            setSelectedCategoryId(1);
        }
        
        if (data.openCardsData) {
            window.openCardsState = {
                pullCount: data.openCardsData.pullCount || 0,
                lastGuaranteedPulls: data.openCardsData.lastGuaranteedPulls || { Rare: 0, Epic: 0, Legendary: 0, Ultimate: 0 },
                selectedGuaranteeCards: {}
            };
            
            if (data.openCardsData.selectedGuaranteeCards) {
                Object.entries(data.openCardsData.selectedGuaranteeCards).forEach(([rarity, cardId]) => {
                    const card = cardsData.find(c => c.id === cardId);
                    if (card) {
                        window.openCardsState.selectedGuaranteeCards[rarity] = card;
                    }
                });
            }
        }
        
        console.log('Game loaded successfully!');
        return true;
    } catch (error) {
        console.error('Failed to load game:', error);
        return false;
    }
}

export function deleteSave() {
    try {
        localStorage.removeItem(SAVE_KEY);
        console.log('Save deleted');
        return true;
    } catch (error) {
        console.error('Failed to delete save:', error);
        return false;
    }
}

export function hasSaveData() {
    return localStorage.getItem(SAVE_KEY) !== null;
}

export function startAutoSave() {
    if (autoSaveIntervalId) {
        clearInterval(autoSaveIntervalId);
    }
    
    autoSaveIntervalId = setInterval(() => {
        saveGame();
    }, AUTO_SAVE_INTERVAL);
}

export function stopAutoSave() {
    if (autoSaveIntervalId) {
        clearInterval(autoSaveIntervalId);
        autoSaveIntervalId = null;
        console.log('Auto-save stopped');
    }
}

export function setupBeforeUnloadSave() {
    window.addEventListener('beforeunload', () => {
        saveGame();
    });
}
