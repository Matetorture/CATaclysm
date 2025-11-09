export const basesData = [
    {
        id: 1,
        name: "Wooden Shelter",
        unlocked: true
    },
    {
        id: 2,
        name: "Stone Fortress",
        baseBuildTime: 60, // seconds
        cost: 500,
        unlocked: false
    },
    {
        id: 3,
        name: "Iron Citadel",
        baseBuildTime: 300, // seconds
        cost: 5000,
        unlocked: false
    },
    {
        id: 4,
        name: "Crystal Palace",
        baseBuildTime: 600, // seconds
        cost: 15000,
        unlocked: false
    },
    {
        id: 5,
        name: "Mystic Tower",
        baseBuildTime: 900, // seconds
        cost: 50000,
        unlocked: false
    }
];

// Time required to clone cards based on rarity (in seconds)
export const cloneTimeByRarity = {
    'Common': 30,
    'Uncommon': 60,
    'Rare': 120,
    'Epic': 300,
    'Legendary': 600,
    'Ultimate': 1200
};
