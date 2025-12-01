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
        name: "Legendary Deck",
        description: "Have 8 Legendary cards in your deck",
        requirements: {
            type: "deck_rarity_count",
            rarity: "Legendary",
            count: 8
        }
    },
    {
        id: 3,
        name: "Ultimate Deck",
        description: "Have 8 Ultimate cards in your deck",
        requirements: {
            type: "deck_rarity_count",
            rarity: "Ultimate",
            count: 8
        }
    },
    {
        id: 4,
        name: "Odd Collection",
        description: "Have cards with IDs 1, 3, and 5 in your deck",
        requirements: {
            type: "deck_specific_cards",
            cardIds: [1, 3, 5]
        }
    },
    {
        id: 5,
        name: "First Three",
        description: "Have cards with IDs 1, 2, and 3 in your deck",
        requirements: {
            type: "deck_specific_cards",
            cardIds: [1, 2, 3]
        }
    },
    {
        id: 6,
        name: "Critical Force",
        description: "Achieve total deck critical DPS > 100",
        requirements: {
            type: "deck_total_crit_dps",
            minValue: 100
        }
    },
    {
        id: 7,
        name: "First Victory",
        description: "Defeat the first bosses",
        requirements: {
            type: "defeat_boss_category",
            categoryId: 1
        }
    },
    {
        id: 8,
        name: "Final Victory",
        description: "Defeat the final boss",
        requirements: {
            type: "defeat_boss_category",
            categoryId: 9
        }
    },
    {
        id: 9,
        name: "Cloning Beginner",
        description: "Clone your first card",
        requirements: {
            type: "clone_card_count",
            count: 1
        }
    },
    {
        id: 10,
        name: "Ultimate Clone",
        description: "Clone an Ultimate card",
        requirements: {
            type: "clone_card_rarity",
            rarity: "Ultimate"
        }
    },
    {
        id: 11,
        name: "Maxed Out",
        description: "Max out a card (62 copies)",
        requirements: {
            type: "max_card_count",
            count: 1
        }
    },
    {
        id: 12,
        name: "Ultimate Max",
        description: "Max out an Ultimate card",
        requirements: {
            type: "max_card_rarity",
            rarity: "Ultimate"
        }
    },
    {
        id: 24,
        name: "Base Builder",
        description: "Reach base level 5",
        requirements: {
            type: "base_level",
            level: 5
        }
    },
    {
        id: 25,
        name: "Base Master",
        description: "Reach base level 10",
        requirements: {
            type: "base_level",
            level: 10
        }
    },
    {
        id: 26,
        name: "Collection Master",
        description: "Have 20 maxed out cards",
        requirements: {
            type: "max_card_count",
            count: 20
        }
    }
];
