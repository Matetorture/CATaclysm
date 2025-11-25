const sounds = {
    cardMove: new Audio('audio/card-move.mp3'),
    cardDamage: new Audio('audio/card-damage.mp3'),
    moneySpent: new Audio('audio/money.mp3'),
    buttonClick: new Audio('audio/button-click.mp3'),
    cardOpen: new Audio('audio/card-open.mp3'),//x
    bossDefeated: new Audio('audio/boss-defeated.mp3'),//x
    cardHover: new Audio('audio/card-hover.mp3')
};

// Set default volumes
sounds.cardMove.volume = 0.3;
sounds.cardDamage.volume = 0.4;
sounds.moneySpent.volume = 0.5;
sounds.buttonClick.volume = 0.3;
sounds.cardOpen.volume = 0.6;
sounds.bossDefeated.volume = 0.7;
sounds.cardHover.volume = 0.3;

// Preload all sounds
Object.values(sounds).forEach(sound => {
    sound.preload = 'auto';
});

function playSound(soundName) {
    const sound = sounds[soundName];
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(err => {
            console.warn(`Could not play sound ${soundName}:`, err);
        });
    }
}

export function playCardMoveSound() {
    playSound('cardMove');
}

export function playCardDamageSound() {
    playSound('cardDamage');
}

export function playMoneySpentSound() {
    playSound('moneySpent');
}

export function playButtonClickSound() {
    playSound('buttonClick');
}

export function playCardOpenSound() {
    playSound('cardOpen');
}

export function playBossDefeatedSound() {
    playSound('bossDefeated');
}

export function playCardHoverSound() {
    playSound('cardHover');
}

// Setup button click sounds for all buttons
export function setupButtonHoverSounds() {
    document.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button && !button.hasAttribute('data-sound-disabled')) {
            playButtonClickSound();
        }
    }, true);
}

// Setup card hover sounds for all cards
export function setupCardHoverSounds() {
    document.addEventListener('mouseenter', (e) => {
        const card = e.target.closest('.card-tilt-wrapper, .unused-card, .card');
        if (card && !card.hasAttribute('data-sound-disabled')) {
            playCardHoverSound();
        }
    }, true);
}
