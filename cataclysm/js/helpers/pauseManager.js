import { gameState } from '../data/gameState.js';

export function pauseCombat() {
    if (!gameState.combatPaused) {
        gameState.combatPaused = true;
        updatePauseButton();
    }
}

export function resumeCombat() {
    if (gameState.combatPaused) {
        gameState.combatPaused = false;
        updatePauseButton();
    }
}

export function toggleCombatPause() {
    gameState.combatPaused = !gameState.combatPaused;
    updatePauseButton();
}

export function isCombatPaused() {
    return gameState.combatPaused;
}

function updatePauseButton() {
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
        if (gameState.combatPaused) {
            pauseBtn.textContent = '▶ RESUME';
            pauseBtn.classList.add('paused');
        } else {
            pauseBtn.textContent = '❚❚ PAUSE';
            pauseBtn.classList.remove('paused');
        }
    }
}