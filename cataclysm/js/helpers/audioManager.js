// Detect if we're in a widget subfolder (e.g., widgets/open/)
const audioPath = window.location.pathname.includes('/widgets/') ? '../../audio/' : 'audio/';

const sounds = {
    cardMove: new Audio(audioPath + 'card-move.mp3'),
    cardDamage: new Audio(audioPath + 'card-damage.mp3'),
    moneySpent: new Audio(audioPath + 'money.mp3'),
    buttonClick: new Audio(audioPath + 'button-click.mp3'),
    cardOpen: new Audio(audioPath + 'card-open.mp3'),
    bossDefeated: new Audio(audioPath + 'boss-defeated.mp3'),//x
    cardHover: new Audio(audioPath + 'card-hover.mp3')
};

// Default base volumes
const baseVolumes = {
    cardMove: 0.85,
    cardDamage: 0.4,
    moneySpent: 0.5,
    buttonClick: 0.15,
    cardOpen: 0.005,
    bossDefeated: 0.7,
    cardHover: 0.1
};

let soundMultiplier = parseFloat(localStorage.getItem('setting-audio-sound-multiplier') || '1');
let musicMultiplier = parseFloat(localStorage.getItem('setting-audio-music-multiplier') || '1');

function clampVolume(v) {
    return Math.max(0, Math.min(1, v));
}
function applySoundVolumes() {
    Object.keys(baseVolumes).forEach(key => {
        if (sounds[key]) sounds[key].volume = clampVolume(baseVolumes[key] * soundMultiplier);
    });
}
applySoundVolumes();

// Preload all sounds
Object.values(sounds).forEach(sound => {
    sound.preload = 'auto';
});

let audioUnlocked = false;

// Unlock audio on first user interaction
function unlockAudio() {
    if (!audioUnlocked) {
        audioUnlocked = true;
        playSound("buttonClick");
        startBackgroundMusic();
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('keydown', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
    }
}

document.addEventListener('click', unlockAudio);
document.addEventListener('keydown', unlockAudio);
document.addEventListener('touchstart', unlockAudio);

function playSound(soundName) {
    const sound = sounds[soundName];
    if (sound && audioUnlocked) {
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

// --- Background music system ---
const musicTracks = [
    audioPath + 'music/track1.mp3',
    audioPath + 'music/track2.mp3',
    audioPath + 'music/track3.mp3',
    audioPath + 'music/track4.mp3'
];
let baseMusicVolume = 0.01;
let musicVolume = clampVolume(baseMusicVolume * musicMultiplier);
let currentMusic = null;
let availableTracks = [...musicTracks];
let isMusicPlaying = false;

function getRandomTrack() {
    if (availableTracks.length === 0) {
        availableTracks = [...musicTracks];
    }
    const randomIndex = Math.floor(Math.random() * availableTracks.length);
    const track = availableTracks[randomIndex];
    availableTracks.splice(randomIndex, 1);
    return track;
}

function playNextMusicTrack() {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
        currentMusic.removeEventListener('ended', playNextMusicTrack);
    }
    const trackPath = getRandomTrack();
    currentMusic = new Audio(trackPath);
    currentMusic.volume = musicVolume;
    currentMusic.loop = false;
    currentMusic.play().catch(() => {});
    currentMusic.addEventListener('ended', playNextMusicTrack);
}

// Expose for settings widget
window.setAudioMultipliers = function(soundMult, musicMult) {
    soundMultiplier = soundMult;
    musicMultiplier = musicMult;
    applySoundVolumes();
    musicVolume = clampVolume(baseMusicVolume * musicMultiplier);
    if (currentMusic) currentMusic.volume = musicVolume;
};

function startBackgroundMusic() {
    if (!isMusicPlaying) {
        isMusicPlaying = true;
        playNextMusicTrack();
    }
}

function stopBackgroundMusic() {
    if (currentMusic) {
        isMusicPlaying = false;
        currentMusic.pause();
        currentMusic.currentTime = 0;
        currentMusic.removeEventListener('ended', playNextMusicTrack);
        currentMusic = null;
    }
}
