import { bossCategories } from '../data/bossesData.js';
import { 
    gameState, 
    selectedCategoryId, 
    currentBossId, 
    currentBossIsRandom, 
    bossListVisible,
    defeatedBossesByCategory,
    setSelectedCategoryId,
    setCurrentBossId,
    setCurrentBossIsRandom,
    setBossListVisible,
    updateMoneyDisplay
} from '../data/gameState.js';
import { openCenteredIframe } from '../helpers/utils.js';

export function getCategoryById(catId) {
    return bossCategories.find(cat => cat.id === catId);
}

export function getNextUndefeatedBoss(category) {
    return category.bosses.find(b => !defeatedBossesByCategory[category.id].has(b.id));
}

export function getCurrentBoss() {
    const category = getCategoryById(selectedCategoryId);
    if (!category) return null;
    return category.bosses.find(b => b.id === currentBossId);
}

export function isCategoryUnlocked(categoryId) {
    if (categoryId === 1) return true;
    
    const prevCategoryId = categoryId - 1;
    const prevCategory = getCategoryById(prevCategoryId);
    
    if (!prevCategory) return false;
    
    const defeatedCount = defeatedBossesByCategory[prevCategoryId]?.size || 0;
    return defeatedCount >= 10;
}

export function selectBoss(categoryId) {
    const category = getCategoryById(categoryId);
    if (!category) return;
    
    if (!isCategoryUnlocked(categoryId)) {
        console.warn(`Category ${categoryId} is locked`);
        return;
    }
    
    setSelectedCategoryId(categoryId);

    let boss = category.bosses.find(b => !defeatedBossesByCategory[categoryId].has(b.id));

    if (!boss) {
        boss = category.bosses[Math.floor(Math.random() * category.bosses.length)];
        boss.hp = boss.maxHp;
        setCurrentBossIsRandom(true);
    } else {
        setCurrentBossIsRandom(false);
        if (boss.hp === undefined) {
            boss.hp = boss.maxHp;
        }
    }

    setCurrentBossId(boss.id);
    renderBoss(boss, currentBossIsRandom);
}

export function renderBoss(bossOverride = null, isRandom = false) {
    if (!bossOverride) {
        isRandom = currentBossIsRandom;
    } else {
        setCurrentBossIsRandom(isRandom);
    }

    const bossContainer = document.querySelector('.boss-container');
    if (!bossContainer) return;
    
    const category = getCategoryById(selectedCategoryId);
    const boss = bossOverride || category.bosses.find(b => b.id === currentBossId);
    if (!boss) return;

    const hpPercent = ((boss.hp / boss.maxHp) * 100).toFixed(1);
    if (!renderBoss.lagHpPercent) renderBoss.lagHpPercent = hpPercent;

    const weaknessHtml = boss.weakness.map(type => {
        const className = `type-${type.toLowerCase()}-text type-attack-text`;
        return `<span class="${className}" style="font-weight: 600; margin-right: 6px;">${type}</span>`;
    }).join('');

    bossContainer.innerHTML = `
    <div class="boss-container-inner" style="display: flex; gap: 16px;">
        <div class="boss-category-list ${bossListVisible ? 'visible' : ''}">
            ${bossCategories.map(cat => {
            const defeatedCount = defeatedBossesByCategory[cat.id].size;
            const total = cat.bosses.length;
            const isUnlocked = isCategoryUnlocked(cat.id);
            const isActive = cat.id === selectedCategoryId;
            
            return `
            <button class="boss-category-button ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}" 
                    data-cat-id="${cat.id}" 
                    ${!isUnlocked ? 'disabled' : ''}>
                ${!isUnlocked ? '<img src="img/icons/lock.png" alt="Locked" class="lock-icon" />' : ''}
                <img src="${cat.img}" alt="${cat.name}" class="category-img ${!isUnlocked ? 'locked-img' : ''}" />
                <span class="defeated-count">${defeatedCount}/${total}</span>
            </button>`;
            }).join('')}
        </div>
        <button id="bossToggleBtn" class="boss-list-toggle-btn ${bossListVisible ? 'visible' : ''}">BOSS LIST</button>
        <div class="boss-details" style="flex: 1;">
            <div class="boss-name">${boss.name}${isRandom ? ' [R]' : ''}</div>
            <div class="boss-image">
            <img src="img/bosses/${boss.id}.png" alt="${boss.name}">
            </div>
            <div class="boss-hp-bar-container">
                <span class="boss-hp-label">&nbsp;</span>
                <div class="boss-hp-bar-lag" style="width: ${renderBoss.lagHpPercent}%;"></div>
                <div class="boss-hp-bar" style="width: ${hpPercent}%;"></div>
            </div>
            <div class="boss-hp-text">${boss.hp} / ${boss.maxHp} (${hpPercent}%)</div>
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

    boss.hp = Math.max(0, Math.min(boss.maxHp, boss.hp + amount));

    if (boss.hp === 0) {
        defeatedBossesByCategory[selectedCategoryId].add(boss.id);
        
        const rewardMoney = calculateRewardMoney(boss.baseRewardMoney);
        openCenteredIframe('widgets/reward/index.html?amount=' + rewardMoney, 10);
        gameState.money += rewardMoney;
        updateMoneyDisplay();

        const category = getCategoryById(selectedCategoryId);
        const nextBoss = category.bosses.find(b => !defeatedBossesByCategory[selectedCategoryId].has(b.id));

        if (nextBoss) {
            setCurrentBossId(nextBoss.id);
            setCurrentBossIsRandom(false);
            renderBoss();
        } else {
            const randomBoss = category.bosses[Math.floor(Math.random() * category.bosses.length)];
            setCurrentBossId(randomBoss.id);
            randomBoss.hp = randomBoss.maxHp;
            setCurrentBossIsRandom(true);
            renderBoss(randomBoss, true);
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
