import { basesData, cloneTimeByRarity } from '../../js/data/basesData.js';
import { cardRarities, attackTypes } from '../../js/data/constants.js';

const cardLevelRequirements = [
    { level: 0, totalCopies: 0, copiesNeeded: 0 },
    { level: 1, totalCopies: 1, copiesNeeded: 1 },
    { level: 2, totalCopies: 2, copiesNeeded: 1 },
    { level: 3, totalCopies: 6, copiesNeeded: 4 },
    { level: 4, totalCopies: 14, copiesNeeded: 8 },
    { level: 5, totalCopies: 30, copiesNeeded: 16 },
    { level: 6, totalCopies: 62, copiesNeeded: 32 }
];

document.addEventListener('DOMContentLoaded', () => {
    initializeContent();
    setupTabs();
});

function initializeContent() {
    updateCardsTab();
    updateBaseTab();
    updateCombatTab();
    updateRatesTab();
}

function updateCardsTab() {
    const raritiesCard = document.querySelector('#cards .info-card:nth-child(1)');
    if (raritiesCard) {
        let raritiesHTML = '<h3>Rarities</h3>';
        raritiesHTML += '<ul>';
        cardRarities.forEach(rarity => {
            const rarityClass = `rarity-${rarity.toLowerCase()}-text`;
            const rarityName = rarity.charAt(0).toUpperCase() + rarity.slice(1);
            raritiesHTML += `<li><span class="${rarityClass}">${rarityName}</span></li>`;
        });
        raritiesHTML += '</ul>';
        raritiesCard.innerHTML = raritiesHTML;
    }
    
    const levelingCard = document.querySelector('#cards .info-card:nth-child(2)');
    if (levelingCard) {
        let levelingHTML = '<h3>Leveling Cards</h3>';
        levelingHTML += '<p>Collect copies to level up cards. Each level multiplies all stats (<span class="stat-attack">Attack</span>, <span class="stat-speed">Speed</span>, <span class="stat-crit">Crit</span>) by 2.</p>';
        levelingHTML += '<ul>';
        cardLevelRequirements.forEach(req => {
            if (req.level > 0) {
                levelingHTML += `<li><span style="color: #eaff71ff">Level ${req.level}:</span> <span style="color: #7746ffff">${req.totalCopies}</span> total copies (<span style="color: #ff7146ff">${req.copiesNeeded}</span> new)</li>`;
            }
        });
        levelingHTML += '</ul>';
        levelingHTML += '<p><span>Max Level:</span> <span style="color: #eaff71ff">6</span> (<span style="color: #7746ffff">62</span> copies total)</p>';
        levelingCard.innerHTML = levelingHTML;
    }
}

function updateBaseTab() {
    const baseTable = document.querySelector('.base-table tbody');
    if (baseTable) {
        baseTable.innerHTML = '';
        basesData.forEach(base => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${base.id}</td>
                <td>${base.name}</td>
                <td>${base.cost > 0 ? '$' + base.cost.toLocaleString() : '-'}</td>
                <td>${base.baseBuildTime > 0 ? base.baseBuildTime + 's' : '-'}</td>
                <td>${base.maxDeckSlots}</td>
                <td>${base.unlockedModifiers}</td>
                <td>${base.cloneSlots}</td>
                <td>${base.cloneSpeedMultiplier}×</td>
            `;
            baseTable.appendChild(row);
        });
    }
}

function updateCombatTab() {
    const attackTypesCard = document.querySelector('#combat .info-card:nth-child(3)');
    if (attackTypesCard) {
        let typesHTML = '<h3>Attack Types</h3>';
        typesHTML += '<ul style="list-style: none; padding-left: 0;">';
        attackTypes.forEach(type => {
            const typeClass = `type-${type.toLowerCase()}-text`;
            const typeName = type.charAt(0).toUpperCase() + type.slice(1);
            const iconPath = `../../img/types/${type.toLowerCase()}.png`;
            typesHTML += `<li style="margin: 8px 0;"><img src="${iconPath}" class="img-icon" style="vertical-align: middle; margin-right: 8px;"><span class="${typeClass}" style="font-weight: 600;">${typeName}</span></li>`;
        });
        typesHTML += '</ul>';
        typesHTML += '<p>Each boss has weaknesses. Match your card types to weaknesses for bonus damage (×2).</p>';
        attackTypesCard.innerHTML = typesHTML;
    }
}

function updateRatesTab() {
    const pullRatesCard = document.querySelector('#rates .info-card:nth-child(1)');
    if (pullRatesCard) {
        let ratesHTML = '<h3>Card Pull Rates</h3>';
        ratesHTML += '<ul>';
        ratesHTML += '<li><span class="rarity-common-text"><span>Common:</span></span> 70%</li>';
        ratesHTML += '<li><span class="rarity-uncommon-text"><span>Uncommon:</span></span> 25%</li>';
        ratesHTML += '<li><span class="rarity-rare-text"><span>Rare:</span></span> 5%</li>';
        ratesHTML += '</ul>';
        ratesHTML += '<br>';
        ratesHTML += '<h3>Guaranteed System</h3>';
        ratesHTML += '<p>Before reaching the guaranteed threshold, you can pre-select the card you want to receive. The guaranteed system ensures:</p>';
        ratesHTML += '<ul>';
        ratesHTML += '<li><span class="rarity-rare-text"><span>Rare:</span></span> Every 20 pulls</li>';
        ratesHTML += '<li><span class="rarity-epic-text"><span>Epic:</span></span> Every 50 pulls</li>';
        ratesHTML += '<li><span class="rarity-legendary-text"><span>Legendary:</span></span> Every 70 pulls</li>';
        ratesHTML += '<li><span class="rarity-ultimate-text"><span>Ultimate:</span></span> Every 100 pulls</li>';
        ratesHTML += '</ul>';
        ratesHTML += '<p>Make sure to choose your desired card before the guaranteed pull activates.</p>';
        pullRatesCard.innerHTML = ratesHTML;
    }
    
    const cloneTimesCard = document.querySelector('#rates .info-card:nth-child(2)');
    if (cloneTimesCard) {
        let cloneHTML = '<h3>Clone Times (Base)</h3>';
        cloneHTML += '<ul>';
        Object.entries(cloneTimeByRarity).forEach(([rarity, time]) => {
            const rarityLower = rarity.toLowerCase();
            const rarityClass = `rarity-${rarityLower}-text`;
            cloneHTML += `<li><span class="${rarityClass}"><span>${rarity}:</span></span> ${time}s</li>`;
        });
        cloneHTML += '</ul>';
        cloneHTML += '<p>Divided by base clone speed multiplier.</p>';
        cloneTimesCard.innerHTML = cloneHTML;
    }
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}