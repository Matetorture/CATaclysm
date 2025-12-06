export const achievementsData = [
  {
    id: 1,
    name: "Slot Master",
    description: "Unlock all 8 deck slots",
    requirements: {
      type: "all_slots_unlocked"
    }
  },
  {
    id: 2,
    name: "Common Pair",
    description: "Have 2 Common cards in your deck",
    requirements: {
      type: "deck_rarity_count",
      rarity: "Common",
      count: 2
    }
  },
  {
    id: 3,
    name: "Common Army",
    description: "Have 8 Common cards in your deck",
    requirements: {
      type: "deck_rarity_count",
      rarity: "Common",
      count: 8
    }
  },
  {
    id: 4,
    name: "Uncommon Lineup",
    description: "Have 4 Uncommon cards in your deck",
    requirements: {
      type: "deck_rarity_count",
      rarity: "Uncommon",
      count: 4
    }
  },
  {
    id: 5,
    name: "Rare Squad",
    description: "Have 6 Rare cards in your deck",
    requirements: {
      type: "deck_rarity_count",
      rarity: "Rare",
      count: 6
    }
  },
  {
    id: 6,
    name: "Epic Ensemble",
    description: "Have 8 Epic cards in your deck",
    requirements: {
      type: "deck_rarity_count",
      rarity: "Epic",
      count: 8
    }
  },
  {
    id: 7,
    name: "Legendary Line",
    description: "Have 8 Legendary cards in your deck",
    requirements: {
      type: "deck_rarity_count",
      rarity: "Legendary",
      count: 8
    }
  },
  {
    id: 8,
    name: "First Ultimate",
    description: "Have 1 Ultimate card in your deck",
    requirements: {
      type: "deck_rarity_count",
      rarity: "Ultimate",
      count: 1
    }
  },
  {
    id: 9,
    name: "Ultimate Quartet",
    description: "Have 4 Ultimate cards in your deck",
    requirements: {
      type: "deck_rarity_count",
      rarity: "Ultimate",
      count: 4
    }
  },
  {
    id: 10,
    name: "Ultimate Deck",
    description: "Have 8 Ultimate cards in your deck",
    requirements: {
      type: "deck_rarity_count",
      rarity: "Ultimate",
      count: 8
    }
  },
  {
    id: 11,
    name: "Starter",
    description: "Reach total deck critical DPS > 100",
    requirements: {
      type: "deck_total_crit_dps",
      minValue: 100
    }
  },
  {
    id: 12,
    name: "Sharp",
    description: "Reach total deck critical DPS > 1 000",
    requirements: {
      type: "deck_total_crit_dps",
      minValue: 1000
    }
  },
  {
    id: 13,
    name: "Critical",
    description: "Reach total deck critical DPS > 10 000",
    requirements: {
      type: "deck_total_crit_dps",
      minValue: 10000
    }
  },
  {
    id: 14,
    name: "Deadly",
    description: "Reach total deck critical DPS > 20 000",
    requirements: {
      type: "deck_total_crit_dps",
      minValue: 20000
    }
  },
  {
    id: 15,
    name: "CATaclysm",
    description: "Reach total deck critical DPS > 35 000",
    requirements: {
      type: "deck_total_crit_dps",
      minValue: 35000
    }
  },
  {
    id: 16,
    name: "First Conquest",
    description: "Defeat the first boss category",
    requirements: {
      type: "defeat_boss_category",
      categoryId: 1
    }
  },
  {
    id: 17,
    name: "Ultimate Conquest",
    description: "Defeat the final boss category",
    requirements: {
      type: "defeat_boss_category",
      categoryId: 9
    }
  },
  {
    id: 18,
    name: "Common Master",
    description: "Max out a Common card",
    requirements: {
      type: "max_card_rarity",
      rarity: "Common"
    }
  },
  {
    id: 19,
    name: "Uncommon Master",
    description: "Max out an Uncommon card",
    requirements: {
      type: "max_card_rarity",
      rarity: "Uncommon"
    }
  },
  {
    id: 20,
    name: "Rare Master",
    description: "Max out a Rare card",
    requirements: {
      type: "max_card_rarity",
      rarity: "Rare"
    }
  },
  {
    id: 21,
    name: "Epic Master",
    description: "Max out an Epic card",
    requirements: {
      type: "max_card_rarity",
      rarity: "Epic"
    }
  },
  {
    id: 22,
    name: "Legendary Master",
    description: "Max out a Legendary card",
    requirements: {
      type: "max_card_rarity",
      rarity: "Legendary"
    }
  },
  {
    id: 23,
    name: "Ultimate Master",
    description: "Max out an Ultimate card",
    requirements: {
      type: "max_card_rarity",
      rarity: "Ultimate"
    }
  },
  {
    id: 24,
    name: "First Perfection",
    description: "Max out 1 card",
    requirements: {
      type: "max_card_count",
      count: 1
    }
  },
  {
    id: 25,
    name: "Small Collection",
    description: "Max out 5 cards",
    requirements: {
      type: "max_card_count",
      count: 5
    }
  },
  {
    id: 26,
    name: "Growing Collection",
    description: "Max out 10 cards",
    requirements: {
      type: "max_card_count",
      count: 10
    }
  },
  {
    id: 27,
    name: "Big Collection",
    description: "Max out 20 cards",
    requirements: {
      type: "max_card_count",
      count: 20
    }
  },
  {
    id: 28,
    name: "Mass Collection",
    description: "Max out 50 cards",
    requirements: {
      type: "max_card_count",
      count: 50
    }
  },
  {
    id: 29,
    name: "Complete Collection",
    description: "Max out all 78 cards",
    requirements: {
      type: "max_card_count",
      count: 78
    }
  },
  {
    id: 30,
    name: "Base",
    description: "Reach base level 2",
    requirements: {
      type: "base_level",
      level: 2
    }
  },
  {
    id: 31,
    name: "Real Base",
    description: "Reach base level 4",
    requirements: {
      type: "base_level",
      level: 4
    }
  },
  {
    id: 32,
    name: "Base Builder",
    description: "Reach base level 7",
    requirements: {
      type: "base_level",
      level: 7
    }
  },
  {
    id: 33,
    name: "Everything Owner",
    description: "Reach base level 10",
    requirements: {
      type: "base_level",
      level: 10
    }
  },
  {
    id: 34,
    name: "Color Rainbow",
    description: "Have cards with IDs 22, 23, 24, 25, 26, 27, 28 in your deck",
    requirements: {
        type: "deck_specific_cards",
        cardIds: [22, 23, 24, 25, 26, 27, 28]
    }
  },
  {
    id: 35,
    name: "Gift Collector",
    description: "Have cards with IDs 39, 40, 41, 42, 43 in your deck",
    requirements: {
        type: "deck_specific_cards",
        cardIds: [39, 40, 41, 42, 43]
    }
  },
  {
    id: 36,
    name: "Firework Show",
    description: "Have cards with IDs 44, 45, 46, 47 and 48 in your deck",
    requirements: {
        type: "deck_specific_cards",
        cardIds: [44, 45, 46, 47, 48]
    }
  },
  {
    id: 37,
    name: "Solar System",
    description: "Have cards with IDs 51, 54, 60 and 61 in your deck",
    requirements: {
        type: "deck_specific_cards",
        cardIds: [51, 54, 60, 61]
    }
  },
  {
    id: 38,
    name: "Treasure Hoarder",
    description: "Have cards with IDs 29, 30, 31, 32, 33, 34, 35, 36 in your deck",
    requirements: {
        type: "deck_specific_cards",
        cardIds: [29, 30, 31, 32, 33, 34, 35, 36]
    }
  },
  {
    id: 39,
    name: "Holiday Spirit",
    description: "Have cards with IDs 37 and 38 in your deck",
    requirements: {
        type: "deck_specific_cards",
        cardIds: [37, 38]
    }
  },
  {
    id: 40,
    name: "Holiday Spirit",
    description: "Have cards with IDs 37 and 38 in your deck",
    requirements: {
        type: "deck_specific_cards",
        cardIds: [37, 38]
    }
  },
  {
    id: 41,
    name: "Heaven and Hell",
    description: "Have cards with IDs 76 and 77 in your deck",
    requirements: {
        type: "deck_specific_cards",
        cardIds: [76, 77]
    }
  },
  {
    id: 42,
    name: "You Can't See Me",
    description: "Have card with ID 78 in your deck",
    requirements: {
        type: "deck_specific_cards",
        cardIds: [78]
    }
  }
];