import { CatCard } from '../models/CatCard.js';

export const cardsData = [
    //1
    new CatCard(1, '1.1', 'James', 'Starter', 'Common', 20, 200000, 6, ['Fire','Water'], 0),
    new CatCard(2, '1.2', 'Emily', 'Starter', 'Common', 20, 200000, 6, ['Fire','Stone'], 0),
    new CatCard(3, '1.3', 'Oliver', 'Starter', 'Common', 20, 200000, 6, ['Fire','Plant'], 0),
    new CatCard(4, '1.4', 'Sophia', 'Starter', 'Common', 20, 200000, 6, ['Fire','Air'], 0),
    new CatCard(5, '1.5', 'Liam', 'Starter', 'Common', 20, 200000, 6, ['Fire','Electric'], 0),
    new CatCard(6, '1.6', 'Ava', 'Starter', 'Common', 20, 200000, 6, ['Fire','Ice'], 0),

    new CatCard(7, '1.7', 'Mason', 'Starter', 'Common', 20, 200000, 6, ['Water','Stone'], 0),
    new CatCard(8, '1.8', 'Isabella', 'Starter', 'Common', 20, 200000, 6, ['Water','Plant'], 0),
    new CatCard(9, '1.9', 'Jackson', 'Starter', 'Common', 20, 200000, 6, ['Water','Air'], 0),
    new CatCard(10, '1.10', 'Charlotte', 'Starter', 'Common', 20, 200000, 6, ['Water','Electric'], 0),
    new CatCard(11, '1.11', 'Ethan', 'Starter', 'Common', 20, 200000, 6, ['Water','Ice'], 0),

    new CatCard(12, '1.12', 'Amelia', 'Starter', 'Common', 20, 200000, 6, ['Stone','Plant'], 0),
    new CatCard(13, '1.13', 'Benjamin', 'Starter', 'Common', 20, 200000, 6, ['Stone','Air'], 0),
    new CatCard(14, '1.14', 'Mia', 'Starter', 'Common', 20, 200000, 6, ['Stone','Electric'], 0),
    new CatCard(15, '1.15', 'Sebastian', 'Starter', 'Common', 20, 200000, 6, ['Stone','Ice'], 0),

    new CatCard(16, '1.16', 'Olivia', 'Starter', 'Common', 20, 200000, 6, ['Plant','Air'], 0),
    new CatCard(17, '1.17', 'Alexander', 'Starter', 'Common', 20, 200000, 6, ['Plant','Electric'], 0),
    new CatCard(18, '1.18', 'Harper', 'Starter', 'Common', 20, 200000, 6, ['Plant','Ice'], 0),

    new CatCard(19, '1.19', 'William', 'Starter', 'Common', 20, 200000, 6, ['Air','Electric'], 0),
    new CatCard(20, '1.20', 'Lily', 'Starter', 'Common', 20, 200000, 6, ['Air','Ice'], 0),

    new CatCard(21, '1.21', 'Noah', 'Starter', 'Common', 20, 200000, 6, ['Electric','Ice'], 0),

    //2
    new CatCard(22, '2.1', 'Violetmane', 'Color', 'Uncommon', 40, 150000, 6, ['Fire','Water', 'Stone'], 0),
    new CatCard(23, '2.2', 'Bluetail', 'Color', 'Uncommon', 40, 150000, 6, ['Water','Stone', 'Plant'], 0),
    new CatCard(24, '2.3', 'Greenspire', 'Color', 'Uncommon', 40, 150000, 6, ['Stone','Plant', 'Air'], 0),
    new CatCard(25, '2.4', 'Yellowcrest', 'Color', 'Uncommon', 40, 150000, 6, ['Plant','Air', 'Electric'], 0),
    new CatCard(26, '2.5', 'Redburst', 'Color', 'Uncommon', 40, 150000, 6, ['Air','Electric', 'Ice'], 0),
    new CatCard(27, '2.6', 'Pinkflair', 'Color', 'Uncommon', 40, 150000, 6, ['Fire','Electric', 'Ice'], 0),
    new CatCard(28, '2.7', 'Rainbow', 'Color', 'Ultimate', 1000, 100000, 1, ['Fire','Water', 'Stone','Plant','Air','Electric', 'Ice'], 62),

    //3
    new CatCard(29, '3.1', 'Gold', 'Treasure', 'Legendary', 700, 300000, 10, ['Fire','Water','Plant','Air','Electric'], 0),
    new CatCard(30, '3.2', 'Silver', 'Treasure', 'Legendary', 700, 300000, 10, ['Water','Stone','Plant','Air','Ice'], 0),
    new CatCard(31, '3.3', 'Diamond', 'Treasure', 'Legendary', 700, 300000, 10, ['Fire','Stone','Air','Electric','Ice'], 0),
    new CatCard(32, '3.4', 'Ruby', 'Treasure', 'Legendary', 700, 300000, 10, ['Fire','Water','Stone','Air','Electric'], 0),
    new CatCard(33, '3.5', 'Sapphire', 'Treasure', 'Legendary', 700, 300000, 10, ['Water','Stone','Plant','Air','Ice'], 0),
    new CatCard(34, '3.6', 'Emerald', 'Treasure', 'Legendary', 700, 300000, 10, ['Stone','Plant','Air','Electric','Ice'], 0),
    new CatCard(35, '3.7', 'Amethyst', 'Treasure', 'Legendary', 700, 300000, 10, ['Fire','Plant','Air','Electric','Ice'], 0),
    new CatCard(36, '3.8', 'Amber', 'Treasure', 'Legendary', 700, 300000, 10, ['Fire','Water','Plant','Electric','Ice'], 0),

    //4
    new CatCard(37, '4.1', 'Santa Claus', 'Event', 'Ultimate', 1200, 100000, 5, ['Water','Air','Ice'], 0),
    new CatCard(38, '4.2', 'Christmas Tree', 'Event', 'Ultimate', 1300, 100000, 5, ['Stone','Plant','Electric'], 0),
    new CatCard(39, '4.3', 'Purple Gift', 'Event', 'Uncommon', 90, 300000, 10, ['Fire'], 0),
    new CatCard(40, '4.4', 'Blue Gift', 'Event', 'Uncommon', 90, 300000, 10, ['Water'], 0),
    new CatCard(41, '4.5', 'Green Gift', 'Event', 'Uncommon', 90, 300000, 10, ['Stone'], 0),
    new CatCard(42, '4.6', 'Yellow Gift', 'Event', 'Uncommon', 90, 300000, 10, ['Plant'], 0),
    new CatCard(43, '4.7', 'Red Gift', 'Event', 'Uncommon', 90, 300000, 10, ['Air'], 0),
    new CatCard(44, '4.8', 'Purple Firework', 'Event', 'Uncommon', 90, 300000, 10, ['Electric'], 0),
    new CatCard(45, '4.9', 'Blue Firework', 'Event', 'Uncommon', 90, 300000, 10, ['Ice'], 0),
    new CatCard(46, '4.10', 'Green Firework', 'Event', 'Uncommon', 90, 300000, 10, ['Fire'], 0),
    new CatCard(47, '4.11', 'Yellow Firework', 'Event', 'Uncommon', 90, 300000, 10, ['Water'], 0),
    new CatCard(48, '4.12', 'Red Firework', 'Event', 'Uncommon', 90, 300000, 10, ['Stone'], 0),
    new CatCard(49, '4.13', 'Shining Heart', 'Event', 'Ultimate', 1250, 100000, 5, ['Fire'], 0),
    new CatCard(50, '4.14', 'Vampir', 'Event', 'Ultimate', 1950, 150000, 5, ['Dark'], 0),

    //5
    new CatCard(51, '5.1', 'Sun', 'Celestial', 'Epic', 140, 100000, 10, ['Fire','Water','Stone','Plant','Air'], 0),
    new CatCard(52, '5.2', 'Mercury', 'Celestial', 'Epic', 140, 100000, 10, ['Fire','Stone','Air','Electric','Ice'], 0),
    new CatCard(53, '5.3', 'Venus', 'Celestial', 'Epic', 140, 100000, 10, ['Water','Stone','Plant','Air','Ice'], 0),
    new CatCard(54, '5.4', 'Earth', 'Celestial', 'Epic', 140, 100000, 10, ['Stone','Plant','Air','Electric','Ice'], 0),
    new CatCard(55, '5.5', 'Mars', 'Celestial', 'Epic', 140, 100000, 10, ['Fire','Water','Air','Electric','Ice'], 0),
    new CatCard(56, '5.6', 'Jupiter', 'Celestial', 'Epic', 140, 100000, 10, ['Fire','Plant','Air','Electric','Ice'], 0),
    new CatCard(57, '5.7', 'Saturn', 'Celestial', 'Epic', 140, 100000, 10, ['Water','Stone','Plant','Electric','Ice'], 0),
    new CatCard(58, '5.8', 'Uranus', 'Celestial', 'Epic', 140, 100000, 10, ['Water','Stone','Air','Electric','Ice'], 0),
    new CatCard(59, '5.9', 'Neptune', 'Celestial', 'Epic', 140, 100000, 10, ['Water','Plant','Air','Electric','Ice'], 0),
    new CatCard(60, '5.10', 'Moon', 'Celestial', 'Epic', 140, 100000, 10, ['Fire','Stone','Plant','Electric','Ice'], 0),
    new CatCard(61, '5.11', 'Satellite', 'Celestial', 'Epic', 140, 100000, 10, ['Fire','Water','Plant','Air','Electric'], 0),

    //6
    new CatCard(62, '6.1', 'Strawberry', 'Fruits & Veggies', 'Rare', 60, 100000, 10, ['Fire','Water','Stone','Plant'], 0),
    new CatCard(63, '6.2', 'Orange', 'Fruits & Veggies', 'Rare', 60, 100000, 10, ['Water', 'Stone','Plant','Air'], 0),
    new CatCard(64, '6.3', 'Banana', 'Fruits & Veggies', 'Rare', 60, 100000, 10, ['Stone','Plant','Air','Electric'], 0),
    new CatCard(65, '6.4', 'Pear', 'Fruits & Veggies', 'Rare', 60, 100000, 10, ['Plant','Air','Electric','Ice'], 0),
    new CatCard(66, '6.5', 'Apple', 'Fruits & Veggies', 'Rare', 60, 100000, 10, ['Fire','Air','Electric','Ice'], 0),
    new CatCard(67, '6.6', 'Cucumber', 'Fruits & Veggies', 'Rare', 60, 100000, 10, ['Fire','Water','Electric', 'Ice'], 0),
    new CatCard(68, '6.7', 'Carrot', 'Fruits & Veggies', 'Rare', 60, 100000, 10, ['Fire','Water','Stone', 'Ice'], 0),
    new CatCard(69, '6.8', 'Watermelon', 'Fruits & Veggies', 'Rare', 60, 100000, 10, ['Fire','Stone','Air','Ice'], 0),
    new CatCard(70, '6.9', 'Pineapple', 'Fruits & Veggies', 'Rare', 60, 100000, 10, ['Water','Plant','Electric', 'Ice'], 0),
    new CatCard(71, '6.10', 'Pumpkin', 'Fruits & Veggies', 'Rare', 60, 100000, 10, ['Fire','Plant','Air','Electric'], 0),
    new CatCard(72, '6.11', 'Potato', 'Fruits & Veggies', 'Rare', 60, 100000, 10, ['Water','Stone','Air','Ice'], 0),

    //7
    new CatCard(73, '7.1', 'Sword', 'Special', 'Ultimate', 5000, 383000, 10, ['Fire','Water','Stone','Plant'], 0),
    new CatCard(74, '7.2', 'Clock', 'Special', 'Ultimate', 265, 20000, 10, ['Stone','Plant','Air','Electric'], 0),
    new CatCard(75, '7.3', 'Happy', 'Special', 'Ultimate', 1300, 100000, 20, ['Plant','Air','Electric','Ice'], 0),
    new CatCard(76, '7.4', 'Angel', 'Special', 'Ultimate', 1000, 50000, 10, ['Holy'], 0),
    new CatCard(77, '7.5', 'Demon', 'Special', 'Ultimate', 1000, 50000, 10, ['Dark'], 0),
    new CatCard(78, '7.6', 'Invisible', 'Special', 'Ultimate', 800, 50000, 10, ['Holy','Dark'], 0),
];
