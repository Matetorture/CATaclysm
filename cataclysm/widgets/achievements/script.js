import { achievementsData } from '../../js/data/achievementsData.js';
import { gameState as localGameState } from '../../js/data/gameState.js';
import { setupButtonHoverSounds } from '../../js/helpers/audioManager.js';

const gameState = (window.parent && window.parent !== window && window.parent.gameState) 
    ? window.parent.gameState 
    : localGameState;

console.log('Achievements widget loaded');
console.log('GameState unlockedAchievements:', gameState.unlockedAchievements);
console.log('Total achievements:', achievementsData.length);

let currentSort = 'id';

function renderAchievements() {
    const container = document.getElementById('achievementsList');
    const progressEl = document.getElementById('achievement-progress');
    if (!container) return;

    // Calculate progress
    const unlockedCount = achievementsData.filter(a => gameState.unlockedAchievements.has(a.id)).length;
    const totalCount = achievementsData.length;
    const percent = Math.round((unlockedCount / totalCount) * 100);
    if (progressEl) {
        progressEl.innerHTML = `<span style="font-size:18px;font-weight:bold;color:var(--primary-color);">${unlockedCount} / ${totalCount} <span style="color:var(--text-secondary);font-size:15px;">( ${percent}% )</span></span>`;
    }

    let sortedAchievements = [...achievementsData];

    switch (currentSort) {
        case 'id':
            sortedAchievements.sort((a, b) => a.id - b.id);
            break;
        case 'unlocked':
            sortedAchievements.sort((a, b) => {
                const aUnlocked = gameState.unlockedAchievements.has(a.id);
                const bUnlocked = gameState.unlockedAchievements.has(b.id);
                if (aUnlocked === bUnlocked) return a.id - b.id;
                return bUnlocked ? 1 : -1;
            });
            break;
        case 'locked':
            sortedAchievements.sort((a, b) => {
                const aUnlocked = gameState.unlockedAchievements.has(a.id);
                const bUnlocked = gameState.unlockedAchievements.has(b.id);
                if (aUnlocked === bUnlocked) return a.id - b.id;
                return aUnlocked ? 1 : -1;
            });
            break;
    }

    container.innerHTML = sortedAchievements.map(achievement => {
        const isUnlocked = gameState.unlockedAchievements.has(achievement.id);
        const achievementImg = `../../img/achievements/${achievement.id}.png`;
        
        return `
            <div class="achievement-item ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-id">#${achievement.id}</div>
                <div class="achievement-icon ${isUnlocked ? '' : 'locked'}">
                    ${isUnlocked 
                        ? `<img src="../../img/icons/achievement.png" alt="${achievement.name}" style="width: 70%; height: 70%; object-fit: contain;">`
                        : '<img src="../../img/icons/lock.png" alt="Locked" style="width: 70%; height: 70%; object-fit: contain;">'}
                </div>
                <div class="achievement-content">
                    <h3 class="achievement-name">${achievement.name}</h3>
                    <p class="achievement-description">${achievement.description}</p>
                </div>
                <div class="achievement-status ${isUnlocked ? 'unlocked' : 'locked'}">
                    ${isUnlocked ? 'Unlocked' : 'Locked'}
                </div>
            </div>
        `;
    }).join('');
}

function initializeSortControls() {
    const sortButtons = {
        id: document.getElementById('sortId'),
        unlocked: document.getElementById('sortUnlocked'),
        locked: document.getElementById('sortLocked')
    };

    Object.entries(sortButtons).forEach(([type, btn]) => {
        if (!btn) return;
        
        btn.addEventListener('click', () => {
            Object.values(sortButtons).forEach(b => b.classList.remove('active'));

            btn.classList.add('active');

            currentSort = type;
            renderAchievements();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeSortControls();
    renderAchievements();
});

if (window.parent && window.parent !== window) {
    window.addEventListener('message', (event) => {
        if (event.data.type === 'achievementUnlocked') {
            renderAchievements();
        }
    });
}

setupButtonHoverSounds();