import { Boss, BossCategory } from '../models/Boss.js';

export const bossCategories = [
    new BossCategory(1, 'Fire Lords', 'img/bosses/1.png', [
        new Boss(101, 'Fire Dragon', 500, ['Ice'], false, 1120),
        new Boss(102, 'Lava Beast', 550, ['Water'], false, 754),
        new Boss(103, 'Blazing Phoenix', 480, ['Water'], false, 1014),
        new Boss(104, 'Magma Giant', 600, ['Water', 'Ice'], true, 1104),
        new Boss(105, 'Flame Wraith', 400, ['Stone'], false, 721),
        new Boss(106, 'Inferno Hound', 510, ['Water'], false, 855),
        new Boss(107, 'Scorching Serpent', 530, ['Ice'], false, 1164),
        new Boss(108, 'Fire Elemental', 470, ['Water'], false, 1232),
        new Boss(109, 'Cinder Lord', 620, ['Water'], false, 1313),
        new Boss(110, 'Ashen King', 640, ['Water'], false, 1263)
    ]),
    new BossCategory(2, 'Stone Titans', 'img/bosses/2.png', [
        new Boss(201, 'Stone Golem', 7000, ['Water', 'Electric'], false, 10275),
        new Boss(202, 'Granite Beast', 7200, ['Water'], false, 9562),
        new Boss(203, 'Rock Giant', 7400, ['Plant'], false, 10555),
        new Boss(204, 'Earth Colossus', 7600, ['Air'], false, 11382),
        new Boss(205, 'Boulder King', 7800, ['Water'], false, 9974),
        new Boss(206, 'Crag Beast', 7500, ['Water', 'Electric'], false, 10652),
        new Boss(207, 'Stone Guardian', 7100, ['Water'], false, 9405),
        new Boss(208, 'Rock Titan', 7900, ['Water'], false, 10844),
        new Boss(209, 'Stone Lord', 8000, ['Electric'], false, 10406),
        new Boss(210, 'Crystal Hulk', 8200, ['Water', 'Electric'], true, 10351)
    ]),
    new BossCategory(3, 'Shadow Phantoms', 'img/bosses/3.png', [
        new Boss(301, 'Shadow Wraith', 3500, ['Plant'], false, 7056),
        new Boss(302, 'Dark Specter', 3600, ['Holy'], false, 6831),
        new Boss(303, 'Night Stalker', 3700, ['Light'], false, 6867),
        new Boss(304, 'Phantom Lord', 3800, ['Holy'], true, 7297),
        new Boss(305, 'Ethereal Beast', 3900, ['Holy'], false, 6633),
        new Boss(306, 'Ghastly Reaper', 4000, ['Holy'], false, 7119),
        new Boss(307, 'Soul Hunter', 4100, ['Plant'], false, 6480),
        new Boss(308, 'Deathshade', 4200, ['Holy'], false, 6682),
        new Boss(309, 'Wraith King', 4300, ['Plant'], false, 6934),
        new Boss(310, 'Dark Emperor', 4400, ['Holy'], true, 6833)
    ])
];
