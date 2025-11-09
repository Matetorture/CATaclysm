export function sortCardsById(cards) {
  return cards.slice().sort((a, b) => a.id - b.id);
}

export function sortCardsByDPSWithCrit(cards) {
  return cards.slice().sort((a, b) => {
    const dpsA = parseFloat(a.getDPS().dpsWithCrit);
    const dpsB = parseFloat(b.getDPS().dpsWithCrit);
    return dpsB - dpsA;
  });
}

export function filterCardsByAttackType(cards, type) {
  return cards.filter(card => 
    card.attackType.some(cardType => cardType.toLowerCase() === type.toLowerCase())
  );
}

export function filterCardsByRarity(cards, rarity) {
  return cards.filter(card => card.rarity.toLowerCase() === rarity.toLowerCase());
}
