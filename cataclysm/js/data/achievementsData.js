export const achievementsData = [
    {
        id: 1,
        name: "Slot Master",
        description: "Unlock all 8 deck slots",
        img: "img/achievements/slot_master.png",
        requirements: {
            type: "all_slots_unlocked"
        }
    },
    {
        id: 2,
        name: "Legendary Deck",
        description: "Have 8 Legendary cards in your deck",
        img: "img/achievements/legendary_deck.png",
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
        img: "img/achievements/ultimate_deck.png",
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
        img: "img/achievements/odd_collection.png",
        requirements: {
            type: "deck_specific_cards",
            cardIds: [1, 3, 5]
        }
    },
    {
        id: 5,
        name: "First Three",
        description: "Have cards with IDs 1, 2, and 3 in your deck",
        img: "img/achievements/first_three.png",
        requirements: {
            type: "deck_specific_cards",
            cardIds: [1, 2, 3]
        }
    },
    {
        id: 6,
        name: "Critical Force",
        description: "Achieve total deck critical DPS > 100",
        img: "img/achievements/critical_force.png",
        requirements: {
            type: "deck_total_crit_dps",
            minValue: 100
        }
    },
    {
        id: 7,
        name: "First Victory",
        description: "Defeat the first boss (Category 1)",
        img: "img/achievements/first_victory.png",
        requirements: {
            type: "defeat_boss_category",
            categoryId: 1
        }
    },
    {
        id: 8,
        name: "Final Victory",
        description: "Defeat the final boss (Category 13)",
        img: "img/achievements/final_victory.png",
        requirements: {
            type: "defeat_boss_category",
            categoryId: 13
        }
    },
    {
        id: 9,
        name: "Cloning Beginner",
        description: "Clone your first card",
        img: "img/achievements/cloning_beginner.png",
        requirements: {
            type: "clone_card_count",
            count: 1
        }
    },
    {
        id: 10,
        name: "Ultimate Clone",
        description: "Clone an Ultimate card",
        img: "img/achievements/ultimate_clone.png",
        requirements: {
            type: "clone_card_rarity",
            rarity: "Ultimate"
        }
    },
    {
        id: 11,
        name: "Maxed Out",
        description: "Max out a card (62 copies)",
        img: "img/achievements/maxed_out.png",
        requirements: {
            type: "max_card_count",
            count: 1
        }
    },
    {
        id: 12,
        name: "Ultimate Max",
        description: "Max out an Ultimate card",
        img: "img/achievements/ultimate_max.png",
        requirements: {
            type: "max_card_rarity",
            rarity: "Ultimate"
        }
    },
    {
        id: 14,
        name: "First Card",
        description: "Unlock your first card",
        img: "img/achievements/first_card.png",
        requirements: {
            type: "unlock_card_count",
            count: 1
        }
    },
    {
        id: 15,
        name: "Growing Collection",
        description: "Unlock 20 different cards",
        img: "img/achievements/growing_collection.png",
        requirements: {
            type: "unlock_card_count",
            count: 20
        }
    },
    {
        id: 16,
        name: "Large Collection",
        description: "Unlock 50 different cards",
        img: "img/achievements/large_collection.png",
        requirements: {
            type: "unlock_card_count",
            count: 50
        }
    },
    {
        id: 17,
        name: "Master Collector",
        description: "Unlock 100 different cards",
        img: "img/achievements/master_collector.png",
        requirements: {
            type: "unlock_card_count",
            count: 100
        }
    },
    {
        id: 18,
        name: "Common Start",
        description: "Unlock a Common card",
        img: "img/achievements/common_start.png",
        requirements: {
            type: "unlock_card_rarity",
            rarity: "Common"
        }
    },
    {
        id: 19,
        name: "Uncommon Find",
        description: "Unlock an Uncommon card",
        img: "img/achievements/uncommon_find.png",
        requirements: {
            type: "unlock_card_rarity",
            rarity: "Uncommon"
        }
    },
    {
        id: 20,
        name: "Rare Discovery",
        description: "Unlock a Rare card",
        img: "img/achievements/rare_discovery.png",
        requirements: {
            type: "unlock_card_rarity",
            rarity: "Rare"
        }
    },
    {
        id: 21,
        name: "Epic Find",
        description: "Unlock an Epic card",
        img: "img/achievements/epic_find.png",
        requirements: {
            type: "unlock_card_rarity",
            rarity: "Epic"
        }
    },
    {
        id: 22,
        name: "Legendary Discovery",
        description: "Unlock a Legendary card",
        img: "img/achievements/legendary_discovery.png",
        requirements: {
            type: "unlock_card_rarity",
            rarity: "Legendary"
        }
    },
    {
        id: 23,
        name: "Ultimate Discovery",
        description: "Unlock an Ultimate card",
        img: "img/achievements/ultimate_discovery.png",
        requirements: {
            type: "unlock_card_rarity",
            rarity: "Ultimate"
        }
    },
    {
        id: 24,
        name: "Clone Master",
        description: "Unlock all 4 cloning slots",
        img: "img/achievements/clone_master.png",
        requirements: {
            type: "all_clone_slots_unlocked"
        }
    },
    {
        id: 25,
        name: "Modifier Collector",
        description: "Unlock 5 deck slot modifiers",
        img: "img/achievements/modifier_collector.png",
        requirements: {
            type: "modifier_count",
            count: 5
        }
    },
    {
        id: 26,
        name: "Collection Master",
        description: "Have 20 maxed out cards",
        img: "img/achievements/collection_master.png",
        requirements: {
            type: "max_card_count",
            count: 20
        }
    }
];
