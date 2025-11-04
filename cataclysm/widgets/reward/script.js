const urlParams = new URLSearchParams(window.location.search);

const targetAmount = urlParams.get('amount') || 0;

function easeOutQuad(t) {
    return t * (2 - t);
}

const duration = 6000;
let start = null;

function fitTextToWidth(element, maxFontSizeVW) {
    let fontSizeVW = maxFontSizeVW;
    const containerWidth = element.clientWidth;
    
    element.style.fontSize = fontSizeVW + 'dvw';

    while (element.scrollWidth > containerWidth && fontSizeVW > 1) {
        fontSizeVW -= 0.1;
        element.style.fontSize = fontSizeVW + 'dvw';
    }
}

const moneyElem = document.getElementById('money');

function animateMoney(timestamp) {
    if (!start) start = timestamp;
    let progress = (timestamp - start) / duration;
    if (progress > 1) progress = 1;
    const easedProgress = easeOutQuad(progress);
    const currentValue = Math.floor(easedProgress * targetAmount);
    moneyElem.textContent = '$ ' + currentValue.toLocaleString('en-US');
    fitTextToWidth(moneyElem, 15);
    
    if (progress < 1) {
        requestAnimationFrame(animateMoney);
    }
}

requestAnimationFrame(animateMoney);

const maxDollars = 600;

function createDollars() {
    
    for (let i = 0; i < maxDollars; i++) {
        
        const dollar = document.createElement('div');
        dollar.textContent = '$';
        dollar.className = 'dollar';
        
        dollar.style.left = Math.random() * 100 + 'dvw';
        

        dollar.style.fontSize = (Math.random() * 24 + 102) + 'px';
        
        dollar.style.fontFamily = '"Tiny5", sans-serif';
        
        const spinDuration = (Math.random() * 4 + 2) + 's';

        const spinDirection = Math.random() < 0.5 ? 'spin-right' : 'spin-left';

        dollar.style.animation = `${spinDirection} ${spinDuration} linear`;

        dollar.style.animationDelay = (Math.random() * 6) + 's';

        document.body.appendChild(dollar);
    }
}

createDollars();