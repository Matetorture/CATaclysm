const tutorials = [
    {
        name: 'Introduction',
        desc: 'Cataclysm is a strategic card game. Learn the basics of gameplay, interface, and game objectives. <span class="red">Note that tutorials are in .gif format for better optimization, so they may not have the best quality.</span>',
        src: 'img/0.png'
    },
    {
        name: 'Card Acquisition',
        desc: 'Cards are obtained by opening them in the opening window. <span class="gold">You can also select guaranteed cards at appropriate pulls.</span>',
        src: 'img/1.gif'
    },
    {
        name: 'Card Usage',
        desc: 'Place a card into the deck by <span class="indigo">dragging</span> or <span class="indigo">clicking</span> it, then the card becomes <span class="green">active</span>.',
        src: 'img/2.gif'
    },
    {
        name: 'Attack',
        desc: 'After the <span class="orange">time</span> shown in the card tooltip (appears on <span class="indigo">hover</span>), the card deals <span class="red">damage</span> to the <span class="gray">boss</span>. Pay attention to <span class="gold">weaknesses</span> and match them to each <span class=gray>boss</span> for greater <span class="red">damage</span>.',
        src: 'img/3.gif'
    },
    {
        name: 'Pause',
        desc: 'In the top-left corner, you can <span class="gold">pause</span> the game. Pausing isn\'t required to perform actions, but it was added for endgame players since things get <span class="red">intense</span> and pausing may be needed.',
        src: 'img/4.gif'
    },
    {
        name: 'Bosses',
        desc: 'Next to the currently attacked <span class="gray">boss</span>, <span class="indigo">click</span> <span class="gold">BOSS LIST</span> to open the <span class="gray">boss</span> list, scroll, and select another <span class="gold">boss category</span> if unlocked (to unlock the next category, defeat all <span class="gray">bosses</span> from the previous one).',
        src: 'img/5.gif'
    },
    {
        name: 'Base',
        desc: 'After expanding the bottom panel in the lower-left corner, you can <span class="gold">upgrade the base</span>. Base upgrades can be <span class="gold">accelerated</span> with <span class="gold">cards</span> (upgrade time shortens based on <span class="red">crit DPS</span> of the inserted card). Bases unlock by completing boss categories <span class="gray">(base levels and benefits found in other tutorials).</span>',
        src: 'img/6.gif'
    },
    {
        name: 'Cloning',
        desc: 'In the expanded lower-left bottom panel, you can clone cards. Place the <span class="gold">card to clone</span> in the <span class="gold">cloning slot</span> and it will automatically clone and upgrade its level. Cloning and its speed unlock through base upgrades.',
        src: 'img/7.gif'
    },
    {
        name: 'Modifiers',
        desc: '<span class="gold">Modifiers</span> are <span class="gold">multipliers or enhancements</span> for the card placed there <span class="gray">(each modifier\'s function found in other tutorials)</span>. Modifiers unlock through base upgrades.',
        src: 'img/8.gif'
    },
    {
        name: 'CATaclysm',
        desc: '<b>CATaclysm</b> features over <span class="gold">70 cards</span> for <span class="indigo">endless fun</span> - enjoy the game and <span class="green">good luck!</span>',
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
    desc.innerHTML = tut.desc;
    content.appendChild(desc);
}

showTutorial(0);