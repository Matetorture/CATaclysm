import { gameState, currentBossHp } from '../data/gameState.js';
import { getModifiedStats } from '../helpers/modifiers.js';
import { getCurrentBoss, changeBossHp } from '../ui/bossRenderer.js';
import { notifyWarning } from '../ui/notifications.js';

let attackIntervals = [];
const cardAttackTimers = new Map();

export function clearAttackIntervals() {
  attackIntervals.forEach(id => clearInterval(id));
  attackIntervals = [];
  cardAttackTimers.clear();
}

function playAttackAnimation(card) {
  const deckCardElements = document.querySelectorAll('.deck-slot .slot-card.filled');
  deckCardElements.forEach(el => {
    const img = el.querySelector('img.card-image');
    if (img && img.alt === card.name) {
      el.classList.add('attack-animation');
      el.addEventListener('animationend', () => {
        el.classList.remove('attack-animation');
      }, { once: true });
    }
  });
}

export function attackWithCard(card) {
    if (gameState.combatPaused) return;
    
    const slotIndex = gameState.deckCards.findIndex(c => c === card);
    const slotType = slotIndex !== -1 ? gameState.deckModifiers[slotIndex] : '';

    const modifiedStats = getModifiedStats(card, slotType);
    const boss = getCurrentBoss();
    if (!boss) return;

    const critChancePercent = modifiedStats.crit;
    let damage = modifiedStats.attack;
    const attackTypeUsed = modifiedStats.modifiedType;

    let isWeaknessMatch = false;
    isWeaknessMatch = attackTypeUsed.some(type => boss.weakness.includes(type));

    const infoTime = 4000;
    if (boss.onlyWeakness && !isWeaknessMatch) {
        notifyWarning(`${card.name} can't damage ${boss.name}! Wrong attack type.`);
        const damageElement = showCardInfo(card.name, "NO DAMAGE", true, infoTime);
        if (damageElement) {
            setTimeout(() => damageElement.remove(), infoTime);
        }
        return;
    }

    if (isWeaknessMatch) {
        damage *= 2;
    }

    const isCrit = Math.random() * 100 < critChancePercent;
    if (isCrit) {
        damage *= 2;
    }

    const bossHpAfterDamage = currentBossHp - damage;
    
    changeBossHp(-damage);

    playAttackAnimation(card);

    const bossHpBarDamage = document.querySelector('.boss-hp-label');
    if (bossHpBarDamage) {
        bossHpBarDamage.classList.add('move-up-animation');
        bossHpBarDamage.style.position = 'absolute';
        bossHpBarDamage.style.zIndex = '1002';
        bossHpBarDamage.style.left = (bossHpAfterDamage / boss.maxHp * 100) - 15 + '%';
        bossHpBarDamage.style.top = '-20px';
        bossHpBarDamage.style.color = isCrit ? '#ff4444' : '#ffffff';
        bossHpBarDamage.innerText = (isCrit ? 'CRIT! ' : '') + '-' + Math.floor(damage);

        setTimeout(() => {
            bossHpBarDamage.innerHTML = '&nbsp;';
        }, infoTime);
    }

    const damageElement = showCardInfo(card.name, (isCrit ? 'CRIT! ' : '') + '-' + Math.floor(damage), isCrit, infoTime);
    if (damageElement) {
        setTimeout(() => damageElement.remove(), infoTime);
    }
}

export function startDeckContinuousAttacks() {
    clearAttackIntervals();

    gameState.deckCards.forEach((card, index) => {
        if (!card) return;

        const slotMod = gameState.deckModifiers[index] || '';
        const modStats = getModifiedStats(card, slotMod);
        const attackInterval = modStats.speed;

        if (attackInterval <= 0) return;

        cardAttackTimers.set(card.id, 0);

        const intervalId = setInterval(() => {
            attackWithCard(card);
            cardAttackTimers.set(card.id, 0);
        }, attackInterval);

        attackIntervals.push(intervalId);
    });

    requestAnimationFrame(updateAttackTimers);
}

function updateAttackTimers(timestamp) {
  if (gameState.combatPaused) {
    updateAttackTimers.last = timestamp;
    requestAnimationFrame(updateAttackTimers);
    return;
  }
  
  if (!updateAttackTimers.last) updateAttackTimers.last = timestamp;
  const delta = timestamp - updateAttackTimers.last;
  updateAttackTimers.last = timestamp;

  cardAttackTimers.forEach((time, cardId) => {
    const card = gameState.ownedCards.find(c => c.id === cardId);
    if (!card) return;

    const slotIndex = gameState.deckCards.findIndex(c => c === card);
    const slotMod = slotIndex !== -1 ? gameState.deckModifiers[slotIndex] : '';

    const modStats = getModifiedStats(card, slotMod);
    const modSpeed = modStats.speed;
    if (modSpeed <= 0) return;

    const newTime = Math.min(time + delta, modSpeed);
    cardAttackTimers.set(card.id, newTime);
    updateCardTooltipAttackTimer(card, newTime, modSpeed);
  });

  requestAnimationFrame(updateAttackTimers);
}

function updateCardTooltipAttackTimer(card, currentMs) {
  const tooltips = document.querySelectorAll('.card-tooltip');
  tooltips.forEach(tooltip => {
    if (!tooltip.textContent.includes(card.name)) return;

    const speedSpans = tooltip.querySelectorAll('.speed-timer');
    speedSpans.forEach(speedSpan => {
      speedSpan.textContent = `${(currentMs / 1000).toFixed(2)} /`;
    });
  });
}

function showCardInfo(cardName, displayText, isCrit = false, infoTime) {
  const cardElements = document.querySelectorAll('.slot-card.filled');
  for (const el of cardElements) {
    const img = el.querySelector('img.card-image');
    if (img && img.alt === cardName) {
      const damageDisplayCard = document.createElement('div');
      damageDisplayCard.className = 'info-display-card';

      const rect = el.getBoundingClientRect();
      damageDisplayCard.style.top = (rect.top + 30) + 'px';
      damageDisplayCard.style.left = (rect.left + rect.width / 2) + 'px';
      damageDisplayCard.style.color = isCrit ? '#ff4444' : '#ffffff';
      damageDisplayCard.innerText = displayText;

      document.body.appendChild(damageDisplayCard);

      damageDisplayCard.animate([
        { top: (rect.top + 30) + 'px', opacity: 1 },
        { top: (rect.top) + 'px', opacity: 0 }
      ], {
        duration: infoTime,
        easing: 'ease-out',
      });

      return damageDisplayCard;
    }
  }
  return null;
}
