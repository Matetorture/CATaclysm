import { CatCard } from '../models/CatCard.js';

export const cardsData = [
    new CatCard(1, '1.1', 'Fire Kitten', 'Starter', 'Common', 10, 20000, 5, ['Fire'], 3),
    new CatCard(2, '1.2', 'Water Paw', 'Starter', 'Uncommon', 8, 20000, 4, ['Water', 'Stone', 'Plant'], 2),
    new CatCard(3, '1.3', 'Stone Tiger', 'Starter', 'Rare', 12, 20000, 6, ['Water', 'Stone', 'Plant', 'Electric', 'Ice', 'Fire'], 6),
    new CatCard(4, '2.1', 'Plant Guardian', 'Forest', 'Epic', 9, 20000, 5, ['Plant'], 1),
    new CatCard(5, '2.2', 'Air Dancer', 'Sky', 'Legendary', 11, 20000, 7, ['Air'], 14),
    new CatCard(6, '2.3', 'Electric Spark', 'Thunder', 'Legendary', 13, 20000, 8, ['Electric'], 30),
    new CatCard(7, '2.4', 'Frost Whisker', 'Frozen', 'Ultimate', 14, 20000, 6, ['Ice'], 62),
    new CatCard(8, '2.5', 'Legendary Beast', 'Legendary', 'Legendary', 20, 20000, 10, ['Fire'], 5),
];
