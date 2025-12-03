const tutorials = [
    {
        name: 'Introduction',
        desc: 'Cataclysm is a strategic card game. Learn the basics of gameplay, interface, and game objectives. Note that tutorials are in .gif format for better optimization, so they may not have the best quality.',
        src: 'img/0.png'
    },
    {
        name: 'Card Acquisition',
        desc: 'Cards are obtained by opening them in the opening window. You can also select guaranteed cards at appropriate pulls.',
        src: 'img/1.gif'
    },
    {
        name: 'Card Usage',
        desc: 'Place a card into the deck by dragging or clicking it, then the card becomes active.',
        src: 'img/2.gif'
    },
    {
        name: 'Attack',
        desc: 'After the time shown in the card tooltip (appears on hover), the card deals damage to the boss. Pay attention to weaknesses and match them to each boss for greater damage.',
        src: 'img/3.gif'
    },
    {
        name: 'Pause',
        desc: 'In the top-left corner, you can pause the game. Pausing isn\'t required to perform actions, but it was added for endgame players since things get intense and pausing may be needed.',
        src: 'img/4.gif'
    },
    {
        name: 'Bosses',
        desc: 'Next to the currently attacked boss, click "BOSS LIST" to open the boss list, scroll, and select another boss category if unlocked (to unlock the next category, defeat all bosses from the previous one).',
        src: 'img/5.gif'
    },
    {
        name: 'Base',
        desc: 'After expanding the bottom panel in the lower-left corner, you can upgrade the base. Base upgrades can be accelerated with cards (upgrade time shortens based on crit DPS of the inserted card). Bases unlock by completing boss categories (base levels and benefits found in other tutorials).',
        src: 'img/6.gif'
    },
    {
        name: 'Cloning',
        desc: 'In the expanded lower-left bottom panel, you can clone cards. Place the card to clone in the cloning slot and it will automatically clone and upgrade its level. Cloning and its speed unlock through base upgrades.',
        src: 'img/7.gif'
    },
    {
        name: 'Modifiers',
        desc: 'Modifiers are multipliers or enhancements for the card placed there (each modifier\'s function found in other tutorials). Modifiers unlock through base upgrades.',
        src: 'img/8.gif'
    },
    {
        name: 'CATaclysm',
        desc: 'CATaclysm features over 70 cards for endless fun - enjoy the game and good luck!',
        src: 'img/9.gif'
    }
];

const nav = document.getElementById('tutorialsNav');
tutorials.forEach((tut, i) => {
    const btn = document.createElement('button');
    btn.textContent = `${tut.name}`;
    btn.onclick = () => showTutorial(i);
    btn.id = 'tutorialBtn' + i;
    nav.appendChild(btn);
});

function showTutorial(idx) {
    tutorials.forEach((_, i) => {
        document.getElementById('tutorialBtn' + i).classList.toggle('active', i === idx);
    });
    const tut = tutorials[idx];
    const content = document.getElementById('tutorialsContent');
    content.innerHTML = '';
    const img = document.createElement('img');
    img.className = 'tutorials-img';
    img.src = tut.src;
    img.alt = tut.name;
    content.appendChild(img);
    const desc = document.createElement('div');
    desc.className = 'tutorials-desc';
    desc.textContent = tut.desc;
    content.appendChild(desc);
}

showTutorial(0);