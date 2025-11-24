import { Boss, BossCategory } from '../models/Boss.js';

export const bossCategories = [
    new BossCategory(1, 'Toys', 'img/bosses/1.png', [
        new Boss(1, 'Yarn Ball', 100, ['Fire'], false, 25),
        new Boss(2, 'Wool String', 120, ['Water'], false, 40),
        new Boss(3, 'Plush Mouse', 140, ['Stone'], false, 70),
        new Boss(4, 'Rubber Ball', 160, ['Plant'], false, 100),
        new Boss(5, 'Feather Toy', 180, ['Air'], false, 130),
        new Boss(6, 'Chirping Bird Toy', 200, ['Electric'], false, 160),
        new Boss(7, 'Laser Pointer', 220, ['Ice'], false, 200)
    ]),

    new BossCategory(2, 'House Items', 'img/bosses/13.png', [
        new Boss(8, 'Ceramic Mug', 10000, ['Fire','Water'], true, 250),
        new Boss(9, 'Hair Dryer', 15000, ['Water','Stone'], true, 300),
        new Boss(10, 'Broom', 20000, ['Stone','Plant'], true, 350),
        new Boss(11, 'Chair', 30000, ['Plant','Air'], true, 400),
        new Boss(12, 'Vacuum Cleaner', 40000, ['Air','Electric'], true, 450),
        new Boss(13, 'Washing Machine', 50000, ['Electric','Ice'], true, 500)
    ]),

    new BossCategory(3, 'Buildings', 'img/bosses/16.png', [
        new Boss(14, 'House', 4000000, ['Fire'], true, 1000),
        new Boss(15, 'Skyscraper', 4500000, ['Air'], true, 1500),
        new Boss(16, 'City', 5000000, ['Electric'], true, 2500)
    ]),

    new BossCategory(4, 'Large Geographies', 'img/bosses/19.png', [
        new Boss(17, 'Mountain', 5000000, ['Stone'], true, 5000),
        new Boss(18, 'Ocean', 5000000, ['Water'], true, 5000),
        new Boss(19, 'Continent', 6000000, ['Water','Stone','Plant','Air'], true, 10000)
    ]),

    new BossCategory(5, 'Earth', 'img/bosses/20.png', [
        new Boss(20, 'Earth', 10000000, ['Water', 'Stone', 'Plant', 'Air', 'Holy', 'Dark'], true, 50000)
    ]),

    new BossCategory(6, 'Solar System', 'img/bosses/21.png', [
        new Boss(21, 'Solar System', 7000000, ['Stone','Holy'], true, 100000)
    ]),

    new BossCategory(7, 'Black Hole', 'img/bosses/22.png', [
        new Boss(22, 'Black Hole', 8000000, ['Air','Dark'], true, 250000)
    ]),

    new BossCategory(8, 'Milky Way', 'img/bosses/23.png', [
        new Boss(23, 'Milky Way', 9000000, ['Fire','Holy','Dark'], true, 500000)
    ]),

    new BossCategory(9, 'Universe', 'img/bosses/24.png', [
        new Boss(24, 'Universe', 10000000, ['Ice','Holy','Dark'], true, 1000000)
    ])
];