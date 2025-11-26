// Simple localStorage-based options persistence
const optionKeys = [
    'notif-success',
    'notif-error',
    'notif-achievement',
    'notif-boss',
    'audio-sound',
    'audio-music',
    'boss-reward'
];

function loadOptions() {
    optionKeys.forEach(key => {
        const el = document.getElementById(key);
        if (el) {
            el.checked = localStorage.getItem('option-' + key) !== 'false';
        }
    });
}

function saveOptions() {
    optionKeys.forEach(key => {
        const el = document.getElementById(key);
        if (el) {
            localStorage.setItem('option-' + key, el.checked ? 'true' : 'false');
        }
    });
    // Optionally: send message to parent to update settings live
    if (window.parent && window.parent !== window && window.parent.applyOptions) {
        window.parent.applyOptions(getOptions());
    }
}

function getOptions() {
    const opts = {};
    optionKeys.forEach(key => {
        const el = document.getElementById(key);
        opts[key] = el ? el.checked : true;
    });
    return opts;
}

document.getElementById('saveOptionsBtn').addEventListener('click', saveOptions);
window.addEventListener('DOMContentLoaded', loadOptions);
