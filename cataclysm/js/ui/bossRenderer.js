import { bossCategories } from '../data/bossesData.js';
import { 
    gameState, 
    selectedCategoryId, 
    currentBossIndex,
    currentBossHp,
    bossListVisible,
    categoryProgress,
    setSelectedCategoryId,
    setCurrentBossIndex,
    setCurrentBossHp,
    setCategoryCompleted,
    setBossListVisible,
    updateMoneyDisplay,
    formatMoneyWithSpaces
} from '../data/gameState.js';
import { openCenteredIframe } from '../helpers/utils.js';
import { checkBossAchievements } from '../helpers/achievementChecker.js';
import { notifySuccess, notifyInfo } from './notifications.js';
import { playBossDefeatedSound } from '../helpers/audioManager.js';
import { appOptions } from '../../game.js';

export function getCategoryById(catId) {
    return bossCategories.find(cat => cat.id === catId);
}

export function getCurrentBoss() {
    const category = getCategoryById(selectedCategoryId);
    if (!category) return null;
    return category.bosses[currentBossIndex];
}

export function isCategoryUnlocked(categoryId) {
    if (categoryId === 1) return true;
    
    const prevCategoryId = categoryId - 1;
    return categoryProgress[prevCategoryId]?.completed || false;
}

export function selectBoss(categoryId) {
    const category = getCategoryById(categoryId);
    if (!category) return;
    
    if (!isCategoryUnlocked(categoryId)) {
        console.warn(`Category ${categoryId} is locked`);
        return;
    }
    
    setSelectedCategoryId(categoryId);
    
    const boss = category.bosses[currentBossIndex];
    if (currentBossHp === null) {
        setCurrentBossHp(boss.maxHp);
    }
    
    renderBoss();
}

export function renderBoss() {
    const bossContainer = document.querySelector('.boss-container');
    if (!bossContainer) return;
    
    const category = getCategoryById(selectedCategoryId);
    const boss = getCurrentBoss();
    if (!boss) return;

    const hp = currentBossHp !== null ? currentBossHp : boss.maxHp;
    const hpPercent = ((hp / boss.maxHp) * 100).toFixed(1);
    if (!renderBoss.lagHpPercent) renderBoss.lagHpPercent = hpPercent;

    const weaknessHtml = boss.weakness.map(type => {
        const className = `type-${type.toLowerCase()}-text type-attack-text`;
        return `<span class="${className}" style="font-weight: 600; margin-right: 6px;">${type}</span>`;
    }).join('');

    bossContainer.innerHTML = `
    <div class="boss-container-inner" style="display: flex; gap: 16px;">
        <div class="boss-category-list ${bossListVisible ? 'visible' : ''}">
            ${bossCategories.map(cat => {
            const progress = categoryProgress[cat.id];
            const isCompleted = progress.completed;
            const isUnlocked = isCategoryUnlocked(cat.id);
            const isActive = cat.id === selectedCategoryId;
            const totalBosses = cat.bosses.length;
            
            return `
            <button class="boss-category-button ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}" 
                    data-cat-id="${cat.id}" 
                    ${!isUnlocked ? 'disabled' : ''}>
                ${!isUnlocked ? '<img src="img/icons/lock.png" alt="Locked" class="lock-icon" />' : ''}
                ${isCompleted ? '<img src="img/icons/success.png" alt="Completed" class="category-completed-checkmark" />' : ''}
                <img src="${cat.img}" alt="${cat.name}" class="category-img ${!isUnlocked ? 'locked-img' : ''}" />
                <span class="defeated-count">${progress.currentBossIndex}/${totalBosses}</span>
            </button>`;
            }).join('')}
        </div>
        <button id="bossToggleBtn" class="boss-list-toggle-btn ${bossListVisible ? 'visible' : ''}">BOSS LIST</button>
        <div class="boss-details" style="flex: 1;">
            <div class="boss-name">${boss.name}</div>
            <div class="boss-image">
            <img src="img/bosses/${boss.id}.png" alt="${boss.name}">
            </div>
            <div class="boss-hp-bar-container">
                <span class="boss-hp-label">&nbsp;</span>
                <div class="boss-hp-bar-lag" style="width: ${renderBoss.lagHpPercent}%;"></div>
                <div class="boss-hp-bar" style="width: ${hpPercent}%;"></div>
            </div>
            <div class="boss-hp-text">${hp} / ${boss.maxHp} (${hpPercent}%)</div>
            <div class="boss-weakness">
            Weakness: ${weaknessHtml}
            ${boss.onlyWeakness ? '<br><em class="weakness-info">Can only be damaged by its weaknesses</em>' : ''}
            </div>
        </div>
    </div>
    `;

    const hpBar = bossContainer.querySelector('.boss-hp-bar');
    if (hpPercent <= 10) {
        hpBar.classList.add('red');
        hpBar.classList.remove('yellow');
    } else if (hpPercent <= 30) {
        hpBar.classList.add('yellow');
        hpBar.classList.remove('red');
    } else {
        hpBar.classList.remove('yellow');
        hpBar.classList.remove('red');
    }

    animateLagHpBar(parseFloat(hpPercent));

    const buttons = bossContainer.querySelectorAll('.boss-category-button');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const catId = parseInt(btn.dataset.catId);
            if (isCategoryUnlocked(catId)) {
                selectBoss(catId);
            }
        });
    });

    const bossList = bossContainer.querySelector('.boss-category-list');
    const toggleBtn = bossContainer.querySelector('#bossToggleBtn');
    if (toggleBtn && bossList) {
        toggleBtn.addEventListener('click', (e) => {
            const newVisible = !bossListVisible;
            setBossListVisible(newVisible);
            bossList.classList.toggle('visible');
            toggleBtn.classList.toggle('visible');
        });
    }
}

export function changeBossHp(amount) {
    const boss = getCurrentBoss();
    if (!boss) return;

    const newHp = Math.max(0, Math.min(boss.maxHp, currentBossHp + amount));
    setCurrentBossHp(newHp);

    if (newHp === 0) {
        playBossDefeatedSound();
        const rewardMoney = calculateRewardMoney(boss.baseRewardMoney);
        
        showBossReward(rewardMoney);

        gameState.money += rewardMoney;
        updateMoneyDisplay();
        
        notifySuccess(`${boss.name} defeated! + $ ${formatMoneyWithSpaces(rewardMoney)}`);

        import('./basePanel.js').then(({ renderBaseUpgradeTab }) => {
            if (typeof renderBaseUpgradeTab === 'function') {
                renderBaseUpgradeTab();
            }
        });

        const category = getCategoryById(selectedCategoryId);
        const nextIndex = currentBossIndex + 1;

        if (nextIndex >= category.bosses.length) {
            const wasFirstCompletion = !categoryProgress[selectedCategoryId].completed;
            const completedCategoryId = selectedCategoryId;
            setCategoryCompleted(completedCategoryId, true);
            
            let targetCategory = category;
            let completionMessage = `${category.name} category completed!`;

            
            if (wasFirstCompletion) {
                const currentCategoryIndex = bossCategories.findIndex(cat => cat.id === completedCategoryId);
                const nextCategory = bossCategories[currentCategoryIndex + 1];
                
                if (nextCategory && isCategoryUnlocked(nextCategory.id)) {
                    categoryProgress[completedCategoryId].currentBossIndex = 0;
                    categoryProgress[completedCategoryId].currentBossHp = category.bosses[0].maxHp;
                    
                    setSelectedCategoryId(nextCategory.id);
                    targetCategory = nextCategory;
                    completionMessage = `${category.name} category completed! Now facing ${nextCategory.name}!`;
                }
            }
            
            notifySuccess(completionMessage);
            setCurrentBossIndex(0);
            setCurrentBossHp(targetCategory.bosses[0].maxHp);
            renderBoss();
            checkBossAchievements();
        } else {
            setCurrentBossIndex(nextIndex);
            setCurrentBossHp(category.bosses[nextIndex].maxHp);
            renderBoss();
            checkBossAchievements();
        }
    } else {
        renderBoss();
    }
}

function calculateRewardMoney(baseAmount) {
    const variation = 0.3; // ±30%
    const min = baseAmount * (1 - variation);
    const max = baseAmount * (1 + variation);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function animateLagHpBar(targetPercent) {
  if (!renderBoss.lagHpPercent) {
    renderBoss.lagHpPercent = targetPercent;
    return;
  }

  const startPercent = renderBoss.lagHpPercent;
  const duration = 1000;
  const startTime = performance.now();

  function animate(time) {
    const elapsed = time - startTime;
    if (elapsed < duration) {
      const progress = elapsed / duration;
      renderBoss.lagHpPercent = startPercent - (startPercent - targetPercent) * progress;
      const lagBar = document.querySelector('.boss-hp-bar-lag');
      if (lagBar) lagBar.style.width = `${renderBoss.lagHpPercent}%`;

      requestAnimationFrame(animate);
    } else {
      renderBoss.lagHpPercent = targetPercent;
      const lagBar = document.querySelector('.boss-hp-bar-lag');
      if (lagBar) lagBar.style.width = `${targetPercent}%`;
    }
  }
  requestAnimationFrame(animate);
}

function showBossReward(rewardMoney) {
    if (!appOptions['boss-reward']) return;

    openCenteredIframe(`widgets/reward/index.html?amount=${rewardMoney}`, 10);
}
