import { achievementsData } from '../data/achievementsData.js';
import { gameState } from '../data/gameState.js';
import { categoryProgress } from '../data/gameState.js';
import { notifyAchievement } from '../ui/notifications.js';

export function unlockAchievement(achievementId) {
    if (gameState.unlockedAchievements.has(achievementId)) {
        return false;
    }
    
    gameState.unlockedAchievements.add(achievementId);
    
    const achievement = achievementsData.find(a => a.id === achievementId);
    if (achievement) {
        notifyAchievement(`Achievement unlocked: ${achievement.name}`);
    }
    
    import('./saveManager.js').then(({ saveGame }) => {
        saveGame();
    });
    
    return true;
}

export function checkAllAchievements() {
    achievementsData.forEach(achievement => {
        if (!gameState.unlockedAchievements.has(achievement.id)) {
            if (checkAchievement(achievement)) {
                unlockAchievement(achievement.id);
            }
        }
    });
}

export function checkAchievement(achievement) {
    const req = achievement.requirements;
    
    switch (req.type) {
        case 'all_slots_unlocked':
            return gameState.unlockedSlots.every(slot => slot === true);
        
        case 'deck_rarity_count': {
            const count = gameState.deckCards.filter(card => 
                card && card.rarity === req.rarity
            ).length;
            return count >= req.count;
        }
        
        case 'deck_specific_cards': {
            const deckCardIds = gameState.deckCards
                .filter(card => card !== null)
                .map(card => card.id);
            return req.cardIds.every(id => deckCardIds.includes(id));
        }
        
        case 'deck_total_crit_dps': {
            const totalCritDps = gameState.deckCards.reduce((sum, card) => {
                if (!card) return sum;
                return sum + (card.baseAttack * (card.baseCrit / 100));
            }, 0);
            return totalCritDps > req.minValue;
        }
        
        case 'defeat_boss_category': {
            const progress = categoryProgress[req.categoryId];
            return progress && progress.currentBossIndex > 0;
        }
        
        case 'clone_card_count': {
            return false;
        }
        
        case 'max_card_count': {
            const maxedCount = gameState.ownedCards.filter(c => c.copies >= 62).length;
            return maxedCount >= req.count;
        }
        
        case 'clone_card_rarity': {
            return false;
        }
        
        case 'max_card_rarity': {
            return gameState.ownedCards.some(c => c.rarity === req.rarity && c.copies >= 62);
        }
        
        case 'unlock_card_count': {
            return gameState.ownedCards.length >= req.count;
        }
        
        case 'unlock_card_rarity': {
            return gameState.ownedCards.some(card => card.rarity === req.rarity);
        }
        
        case 'base_level': {
            return gameState.currentBaseId >= req.level;
        }
        
        default:
            console.warn(`Unknown achievement type: ${req.type}`);
            return false;
    }
}

export function checkDeckAchievements() {
    achievementsData
        .filter(a => a.requirements.type.startsWith('deck_'))
        .forEach(achievement => {
            if (!gameState.unlockedAchievements.has(achievement.id)) {
                if (checkAchievement(achievement)) {
                    unlockAchievement(achievement.id);
                }
            }
        });
}

export function checkSlotAchievements() {
    const slotAchievements = achievementsData.filter(a => 
        a.requirements.type === 'all_slots_unlocked'
    );
    
    slotAchievements.forEach(achievement => {
        if (!gameState.unlockedAchievements.has(achievement.id)) {
            if (checkAchievement(achievement)) {
                unlockAchievement(achievement.id);
            }
        }
    });
}

export function checkCardUnlockAchievements() {
    const unlockAchievements = achievementsData.filter(a => 
        a.requirements.type === 'unlock_card_count' || 
        a.requirements.type === 'unlock_card_rarity'
    );
    
    unlockAchievements.forEach(achievement => {
        if (!gameState.unlockedAchievements.has(achievement.id)) {
            if (checkAchievement(achievement)) {
                unlockAchievement(achievement.id);
            }
        }
    });
}

export function checkBossAchievements() {
    const bossAchievements = achievementsData.filter(a => 
        a.requirements.type === 'defeat_boss_category'
    );
    
    bossAchievements.forEach(achievement => {
        if (!gameState.unlockedAchievements.has(achievement.id)) {
            if (checkAchievement(achievement)) {
                unlockAchievement(achievement.id);
            }
        }
    });
}

export function onCardCloned(card) {
    const cloneCount = achievementsData.find(a => 
        a.requirements.type === 'clone_card_count' && a.requirements.count === 1
    );
    if (cloneCount && !gameState.unlockedAchievements.has(cloneCount.id)) {
        unlockAchievement(cloneCount.id);
    }
    
    if (card.rarity === 'Ultimate') {
        const ultimateClone = achievementsData.find(a => 
            a.requirements.type === 'clone_card_rarity' && a.requirements.rarity === 'Ultimate'
        );
        if (ultimateClone && !gameState.unlockedAchievements.has(ultimateClone.id)) {
            unlockAchievement(ultimateClone.id);
        }
    }
}

export function onCardMaxed(card) {
    const maxCount = achievementsData.find(a => 
        a.requirements.type === 'max_card_count' && a.requirements.count === 1
    );
    if (maxCount && !gameState.unlockedAchievements.has(maxCount.id)) {
        unlockAchievement(maxCount.id);
    }
    
    if (card.rarity === 'Ultimate') {
        const ultimateMax = achievementsData.find(a => 
            a.requirements.type === 'max_card_rarity' && a.requirements.rarity === 'Ultimate'
        );
        if (ultimateMax && !gameState.unlockedAchievements.has(ultimateMax.id)) {
            unlockAchievement(ultimateMax.id);
        }
    }
    
    const maxedCards = gameState.ownedCards.filter(c => c.copies >= 62).length;
    const collectionMaster = achievementsData.find(a => 
        a.requirements.type === 'max_card_count' && a.requirements.count === 20
    );
    if (collectionMaster && !gameState.unlockedAchievements.has(collectionMaster.id)) {
        if (maxedCards >= 20) {
            unlockAchievement(collectionMaster.id);
        }
    }
}

export function checkBaseAchievements() {
    const baseAchievements = achievementsData.filter(a => 
        a.requirements.type === 'base_level'
    );
    
    baseAchievements.forEach(achievement => {
        if (!gameState.unlockedAchievements.has(achievement.id)) {
            if (checkAchievement(achievement)) {
                unlockAchievement(achievement.id);
            }
        }
    });
}