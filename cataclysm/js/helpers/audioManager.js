import { notifyInfo } from "../ui/notifications.js";

// Detect if we're in a widget subfolder (e.g., widgets/open/)
const isWidget = window.location.pathname.includes('/widgets/');

const audioPath = isWidget ? '../../audio/' : 'audio/';

if (!isWidget) {
    notifyInfo(`Due to browser restrictions, audio will start after your first interaction with the page.`);
}

const sounds = {
    cardMove: new Audio(audioPath + 'card-move.mp3'),
    cardDamage: new Audio(audioPath + 'card-damage.mp3'),
    moneySpent: new Audio(audioPath + 'money.mp3'),
    buttonClick: new Audio(audioPath + 'button-click.mp3'),
    cardOpen: new Audio(audioPath + 'card-open.mp3'),
    bossDefeated: new Audio(audioPath + 'boss-defeated.mp3'),
    cardHover: new Audio(audioPath + 'card-hover.mp3')
};

// Default base volumes
const baseVolumes = {
    cardMove: 0.85,
    cardDamage: 0.4,
    moneySpent: 0.5,
    buttonClick: 0.15,
    cardOpen: 0.005,
    bossDefeated: 1.5,
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
        if(!isWidget){
            startBackgroundMusic();
        }
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
    {
        src: audioPath + 'music/track1.mp3',
        title: 'Cat Walk',
        author: 'Sakura Girl'
    },
    {
        src: audioPath + 'music/track2.mp3',
        title: 'Daisy',
        author: 'Sakura Girl'
    },
    {
        src: audioPath + 'music/track3.mp3',
        title: 'Yay',
        author: 'Sakura Girl'
    },
    {
        src: audioPath + 'music/track4.mp3',
        title: 'Lights',
        author: 'Sakura Girl'
    },
    {
        src: audioPath + 'music/track5.mp3',
        title: 'Go To The Picnic',
        author: 'Loyalty Freak Music'
    },
    {
        src: audioPath + 'music/track6.mp3',
        title: 'Yippee !',
        author: 'Loyalty Freak Music'
    }
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
    const trackObj = getRandomTrack();
    currentMusic = new Audio(trackObj.src);
    currentMusic.volume = musicVolume;
    currentMusic.loop = false;
    currentMusic.play().catch(() => {});
    currentMusic.addEventListener('ended', playNextMusicTrack);

    notifyInfo(`Now playing: ${trackObj.title} by ${trackObj.author}`);
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