
const settingKeys = [
    'boss-reward'
];

const SOUND_MULT_KEY = 'setting-audio-sound-multiplier';
const MUSIC_MULT_KEY = 'setting-audio-music-multiplier';

function loadSettings() {
    settingKeys.forEach(key => {
        const el = document.getElementById(key);
        if (el) {
            el.checked = localStorage.getItem('setting-' + key) !== 'false';
        }
    });
    // Load sliders
    const soundMult = parseFloat(localStorage.getItem(SOUND_MULT_KEY) || '1');
    const musicMult = parseFloat(localStorage.getItem(MUSIC_MULT_KEY) || '1');
    document.getElementById('audio-sound-multiplier').value = soundMult;
    document.getElementById('audio-sound-multiplier-value').textContent = soundMult.toFixed(2);
    document.getElementById('audio-music-multiplier').value = musicMult;
    document.getElementById('audio-music-multiplier-value').textContent = musicMult.toFixed(2);
    // Notify audioManager if available
    if (window.parent && window.parent !== window && window.parent.setAudioMultipliers) {
        window.parent.setAudioMultipliers(soundMult, musicMult);
    }
}

function saveSettings() {
    settingKeys.forEach(key => {
        const el = document.getElementById(key);
        if (el) {
            localStorage.setItem('setting-' + key, el.checked ? 'true' : 'false');
        }
    });
    // Save sliders
    const soundMult = parseFloat(document.getElementById('audio-sound-multiplier').value);
    const musicMult = parseFloat(document.getElementById('audio-music-multiplier').value);
    localStorage.setItem(SOUND_MULT_KEY, soundMult);
    localStorage.setItem(MUSIC_MULT_KEY, musicMult);
    document.getElementById('audio-sound-multiplier-value').textContent = soundMult.toFixed(2);
    document.getElementById('audio-music-multiplier-value').textContent = musicMult.toFixed(2);
    // Notify audioManager if available
    if (window.parent && window.parent !== window && window.parent.setAudioMultipliers) {
        window.parent.setAudioMultipliers(soundMult, musicMult);
    }
    if (window.parent && window.parent !== window && window.parent.applySettings) {
        window.parent.applySettings(getSettings());
    }
}

function getSettings() {
    const settings = {};
    settingKeys.forEach(key => {
        const el = document.getElementById(key);
        settings[key] = el ? el.checked : true;
    });
    settings['audio-sound-multiplier'] = parseFloat(document.getElementById('audio-sound-multiplier').value);
    settings['audio-music-multiplier'] = parseFloat(document.getElementById('audio-music-multiplier').value);
    return settings;
}


settingKeys.forEach(key => {
    const el = document.getElementById(key);
    if (el) {
        el.addEventListener('change', saveSettings);
    }
});
document.getElementById('audio-sound-multiplier').addEventListener('input', saveSettings);
document.getElementById('audio-music-multiplier').addEventListener('input', saveSettings);
window.addEventListener('DOMContentLoaded', () => {
    loadSettings();
});
