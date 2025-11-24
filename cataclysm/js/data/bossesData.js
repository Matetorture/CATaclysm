import { Boss, BossCategory } from '../models/Boss.js';

export const bossCategories = [
    new BossCategory(1, 'Toys', 'img/bosses/1.png', [
        new Boss(1, 'Yarn Ball', 100, [], false, 1000000000),
        new Boss(2, 'Wool String', 100, [], false, 1000),
        new Boss(3, 'Plush Mouse', 100, [], false, 1000),
        new Boss(4, 'Rubber Ball', 100, [], false, 1000),
        new Boss(5, 'Feather Toy', 100, [], false, 1000),
        new Boss(6, 'Chirping Bird Toy', 100, [], false, 1000),
        new Boss(7, 'Laser Pointer', 100, [], false, 1000)
    ]),

    new BossCategory(2, 'House Items', 'img/bosses/13.png', [
        new Boss(8, 'Ceramic Mug', 100, [], false, 1000),
        new Boss(9, 'Hair Dryer', 100, [], false, 1000),
        new Boss(10, 'Broom', 100, [], false, 1000),
        new Boss(11, 'Chair', 100, [], false, 1000),
        new Boss(12, 'Vacuum Cleaner', 100, [], false, 1000),
        new Boss(13, 'Washing Machine', 100, [], false, 1000)
    ]),

    new BossCategory(3, 'Buildings', 'img/bosses/16.png', [
        new Boss(14, 'House', 100, [], false, 1000),
        new Boss(15, 'Skyscraper', 100, [], false, 1000),
        new Boss(16, 'City', 100, [], false, 1000)
    ]),

    new BossCategory(4, 'Large Geographies', 'img/bosses/19.png', [
        new Boss(17, 'Mountain', 100, [], false, 1000),
        new Boss(18, 'Ocean', 100, [], false, 1000),
        new Boss(19, 'Continent', 100, [], false, 1000)
    ]),

    new BossCategory(5, 'Earth', 'img/bosses/20.png', [
        new Boss(20, 'Earth', 100, [], false, 1000)
    ]),

    new BossCategory(6, 'Solar System', 'img/bosses/21.png', [
        new Boss(21, 'Solar System', 100, [], false, 1000)
    ]),

    new BossCategory(7, 'Black Hole', 'img/bosses/22.png', [
        new Boss(22, 'Black Hole', 100, [], false, 1000)
    ]),

    new BossCategory(8, 'Milky Way', 'img/bosses/23.png', [
        new Boss(23, 'Milky Way', 100, [], false, 1000)
    ]),

    new BossCategory(9, 'Universe', 'img/bosses/24.png', [
        new Boss(24, 'Universe', 100, [], false, 1000)
    ])
];