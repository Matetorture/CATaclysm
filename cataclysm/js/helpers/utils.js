import { pauseCombat, resumeCombat, isCombatPaused } from './pauseManager.js';

export function setupTiltEffect() {
    const wrappers = document.querySelectorAll('.card-tilt-wrapper');
    wrappers.forEach(wrapper => {
        const card = wrapper.querySelector('.unused-card, .slot-card, .cat-slot-inner');
        if (card) setupSingleCardTilt(wrapper, card);
    });
    
    const directCards = document.querySelectorAll('.slot-card.filled:not(.card-tilt-wrapper .slot-card)');
    directCards.forEach(card => {
        const existingWrapper = card.closest('.card-tilt-wrapper');
        if (!existingWrapper) {
            setupSingleCardTilt(card, card);
        }
    });
}

export function setupSingleCardTilt(wrapper, card) {
    const isGlitter = card.classList.contains('rarity-epic');
    const isNormal = card.classList.contains('rarity-common');
    
    wrapper.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
    });

    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        let maxTilt = 50;
        
        let tiltX = (y - 0.5) * maxTilt;
        let tiltY = (x - 0.5) * -maxTilt;
        
        card.style.transform =
            `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        
        const cardImage = card.querySelector('.card-image, .unused-card-image, .cat-slot-image');
        
        if (card.classList.contains('rarity-ultimate')) {
            card.style.setProperty('--holo-x', `${(x - 0.5) * 225}px`);
            card.style.setProperty('--holo-y', `${(y - 0.5) * 225}px`);
            card.style.setProperty('--holo-rotate', `${x * 300}deg`);
            card.style.setProperty('--holo-scale', `${1 + (x + y) * 0.5}`);
        } else if (card.classList.contains('rarity-epic')) {
            card.style.setProperty('--glitter-x', `${(x - 0.5) * 40}px`);
            card.style.setProperty('--glitter-y', `${(y - 0.5) * 40}px`);
            card.style.setProperty('--glitter-rotate', `${x * 120}deg`);
            card.style.setProperty('--glitter-scale', `${1 + (Math.abs(x - 0.5) + Math.abs(y - 0.5)) * .5}`);
        } else if (card.classList.contains('rarity-rare')) {
            card.style.setProperty('--crystal-x', `${(x - 0.5) * 180}px`);
            card.style.setProperty('--crystal-y', `${(y - 0.5) * 180}px`);
            card.style.setProperty('--crystal-scale', `${1 + (x + y) * 0.1}`);
        } else if (card.classList.contains('rarity-uncommon')) {
            card.style.setProperty('--foil-x', `${(x - 0.5) * 70}px`);
            card.style.setProperty('--foil-y', `${(y - 0.5) * 70}px`);
            card.style.setProperty('--foil-rotate', `${(x + y) * 50}deg`);
        } 
        
        const sparkleMove = isGlitter ? -70 : -90;
        if (cardImage) {
            cardImage.style.setProperty('--sparkle-x', `${(x - 0.5) * sparkleMove}px`);
            cardImage.style.setProperty('--sparkle-y', `${(y - 0.5) * sparkleMove}px`);
        }
    });

    wrapper.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.3s ease';
        card.style.transform = '';
        card.style.removeProperty('--holo-x');
        card.style.removeProperty('--holo-y');
        card.style.removeProperty('--holo-rotate');
        card.style.removeProperty('--glitter-x');
        card.style.removeProperty('--glitter-y');
        card.style.removeProperty('--glitter-rotate');
        card.style.removeProperty('--glitter-scale');
        card.style.removeProperty('--foil-x');
        card.style.removeProperty('--foil-y');
        card.style.removeProperty('--foil-rotate');
        card.style.removeProperty('--crystal-x');
        card.style.removeProperty('--crystal-y');
        card.style.removeProperty('--crystal-scale');
        card.style.removeProperty('--gold-x');
        card.style.removeProperty('--gold-y');
        card.style.removeProperty('--gold-rotate');
        card.style.removeProperty('--gold-scale');
        
        const cardImage = card.querySelector('.card-image, .unused-card-image, .cat-slot-image, .clone-slot-image');
        if (cardImage) {
            cardImage.style.removeProperty('--sparkle-x');
            cardImage.style.removeProperty('--sparkle-y');
        }
    });
}

export function setupBottomPanelToggle() {
    const bottomPanel = document.getElementById('bottomPanel');
    const toggleBtn = document.getElementById('togglePanelBtn');
    const closeBtn = document.getElementById('closePanelBtn');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            bottomPanel.classList.toggle('visible');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            bottomPanel.classList.remove('visible');
        });
    }
}

export function openCenteredIframe(url, displayTime = -1, shouldPauseCombat = false) {
    const existingWrapper = document.getElementById('iframeWrapper');
    if (existingWrapper) {
        existingWrapper.remove();
        clearInterval(window.iframeProgressInterval);
    }

    let wasPausedBeforeIframe = false;
    
    if (shouldPauseCombat) {
        wasPausedBeforeIframe = isCombatPaused();
        
        if (!wasPausedBeforeIframe) {
            pauseCombat();
        }
    }

    const wrapper = document.createElement('div');
    wrapper.id = 'iframeWrapper';

    wrapper.addEventListener('click', (e) => {
        if (e.target === wrapper) {
            closeIframe();
        }
    });

    const iframeContainer = document.createElement('div');
    iframeContainer.className = 'iframe-container';

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.className = 'iframe-close-btn';
    closeBtn.setAttribute('aria-label', 'Close iframe');
    closeBtn.addEventListener('click', closeIframe);

    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.className = 'iframe-pure';

    const progressBar = document.createElement('div');
    progressBar.className = 'iframe-bar';

    iframeContainer.appendChild(closeBtn);
    iframeContainer.appendChild(iframe);
    iframeContainer.appendChild(progressBar);
    wrapper.appendChild(iframeContainer);
    document.body.appendChild(wrapper);

    function closeIframe() {
        clearInterval(window.iframeProgressInterval);
        wrapper.remove();
        
        if (shouldPauseCombat && !wasPausedBeforeIframe) {
            resumeCombat();
        }
    }

    if (displayTime && typeof displayTime === 'number' && displayTime > 0) {
        let timeLeft = displayTime * 1000;
        const intervalDuration = 100;
        const totalIntervals = timeLeft / intervalDuration;
        let intervalsPassed = 0;

        window.iframeProgressInterval = setInterval(() => {
            intervalsPassed++;
            const progressPercent = 100 - (intervalsPassed / totalIntervals) * 100;
            progressBar.style.width = progressPercent + '%';
            if (intervalsPassed >= totalIntervals) {
                closeIframe();
            }
        }, intervalDuration);
    } else {
        progressBar.style.width = '100%';
    }
}
