
const settingKeys = [
    'boss-reward'
];

function loadSettings() {
    settingKeys.forEach(key => {
        const el = document.getElementById(key);
        if (el) {
            el.checked = localStorage.getItem('setting-' + key) !== 'false';
        }
    });
}

function saveSettings() {
    settingKeys.forEach(key => {
        const el = document.getElementById(key);
        if (el) {
            localStorage.setItem('setting-' + key, el.checked ? 'true' : 'false');
        }
    });
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
    return settings;
}

settingKeys.forEach(key => {
    const el = document.getElementById(key);
    if (el) {
        el.addEventListener('change', saveSettings);
    }
});
window.addEventListener('DOMContentLoaded', () => {
    loadSettings();
});
