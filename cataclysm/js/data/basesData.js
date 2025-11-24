export const basesData = [
    {
        id: 1,
        name: "Cardboard",
        unlocked: true,
        maxDeckSlots: 1,
        unlockedModifiers: 0,
        cloneSlots: 0,
        cloneSpeedMultiplier: 1
    },
    {
        id: 2,
        name: "Bucket",
        baseBuildTime: 600,
        cost: 1000,
        unlocked: false,
        maxDeckSlots: 2,
        unlockedModifiers: 0,
        cloneSlots: 0,
        cloneSpeedMultiplier: 1
    },
    {
        id: 3,
        name: "Cat Bed",
        baseBuildTime: 6000,
        cost: 2500,
        unlocked: false,
        maxDeckSlots: 3,
        unlockedModifiers: 0,
        cloneSlots: 1,
        cloneSpeedMultiplier: 1
    },
    {
        id: 4,
        name: "Scratching Post",
        baseBuildTime: 10000,
        cost: 15000,
        unlocked: false,
        maxDeckSlots: 4,
        unlockedModifiers: 3,
        cloneSlots: 1,
        cloneSpeedMultiplier: 2
    },
    {
        id: 5,
        name: "Cat Tower",
        baseBuildTime: 20000,
        cost: 30000,
        unlocked: false,
        maxDeckSlots: 6,
        unlockedModifiers: 4,
        cloneSlots: 1,
        cloneSpeedMultiplier: 3
    },
    {
        id: 6,
        name: "Cat Castle",
        baseBuildTime: 40000,
        cost: 75000,
        unlocked: false,
        maxDeckSlots: 8,
        unlockedModifiers: 5,
        cloneSlots: 2,
        cloneSpeedMultiplier: 4
    },
    {
        id: 7,
        name: "Cat Fortress",
        baseBuildTime: 60000,
        cost: 200000,
        unlocked: false,
        maxDeckSlots: 8,
        unlockedModifiers: 5,
        cloneSlots: 4,
        cloneSpeedMultiplier: 5
    },
    {
        id: 8,
        name: "Capsule",
        baseBuildTime: 100000,
        cost: 500000,
        unlocked: false,
        maxDeckSlots: 8,
        unlockedModifiers: 5,
        cloneSlots: 4,
        cloneSpeedMultiplier: 7
    },
    {
        id: 9,
        name: "Control Panel",
        baseBuildTime: 1000000,
        cost: 1000000,
        unlocked: false,
        maxDeckSlots: 8,
        unlockedModifiers: 5,
        cloneSlots: 4,
        cloneSpeedMultiplier: 10
    },
    {
        id: 10,
        name: "Everything",
        baseBuildTime: 10000000,
        cost: 10000000,
        unlocked: false,
        maxDeckSlots: 8,
        unlockedModifiers: 5,
        cloneSlots: 4,
        cloneSpeedMultiplier: 16
    }
];

// Time required to clone cards based on rarity (in seconds)
export const cloneTimeByRarity = {
    'Common': 100,
    'Uncommon': 200,
    'Rare': 500,
    'Epic': 2000,
    'Legendary': 4000,
    'Ultimate': 10000
};

export function getCurrentBaseConfig(baseId) {
    const base = basesData.find(b => b.id === baseId);
    if (!base) return basesData[0]; // Fallback to base 1
    return base;
}

export function getEffectiveCloneTime(rarity, baseId) {
    const baseConfig = getCurrentBaseConfig(baseId);
    const baseTime = cloneTimeByRarity[rarity];
    return Math.floor(baseTime / baseConfig.cloneSpeedMultiplier);
}
