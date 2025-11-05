export function setupTiltEffect() {
    const allCards = document.querySelectorAll('.unused-card, .slot-card.filled');

    allCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 8;
            const rotateY = (centerX - x) / 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.3s ease';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
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

export function openCenteredIframe(url, displayTime) {
    const existingWrapper = document.getElementById('iframeWrapper');
    if (existingWrapper) {
        existingWrapper.remove();
        clearInterval(window.iframeProgressInterval);
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
