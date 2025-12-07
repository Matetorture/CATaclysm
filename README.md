# CATaclysm  
*A strategic card-collecting game built with pure HTML, CSS, and JavaScript.*

<img src="README_img/9.gif" alt="CATaclysm cards showcase" width="70%"/>

## 📚 Table of Contents

- [🎮 Overview](#🎮-overview)
- [🧩 Gameplay Features](#🧩-gameplay-features)
  - [Basics](#basics)
  - [Open Cards](#open-cards)
  - [Deck Building](#deck-building)
  - [Combat](#combat)
  - [Boss System](#boss-system)
  - [Base Upgrades](#base-upgrades)
  - [Card Cloning](#card-cloning)
  - [Modifiers](#modifiers)
- [🖼️ Visuals and Audio](#🖼️-visuals-and-audio)
  - [🎵 Background Music](#🎵-background-music)
- [💻 Author](#💻-author)
- [⚡ Try It Out](#⚡-try-it-out)
- [⚖️ License](#⚖️-license)

## 🎮 Overview
**CATaclysm** is a lightweight browser-based card game focused on deck-building, boss battles, and base progression.  
Players collect cats as cards, enhance their stats, unlock modifiers, and upgrade their base to face increasingly challenging bosses.

The project is fully handcrafted — from gameplay logic to visuals and audio assets — and is optimized to run smoothly even on lower-end setups.  

🔗 **Play it here:** [webtochange.github.io/cataclysm/](webtochange.github.io/cataclysm/)

---

## 🧩 Gameplay Features

### Basics
- Learn through built-in tutorials in `.gif` format for faster loading.  
- Collect cats, assemble powerful decks, and defeat bosses to progress.  
- Earn **Money ($)** to unlock deck slots, pull new cards, and upgrade your base. 

<img src="README_img/0.png" alt="Game introduction tutorial" width="30%"/>

### Open Cards
Cards are obtained by opening pulls in the **OPEN**.  
There you can **randomly pull** new cards or select **guaranteed cards** at appropriate pulls for strategic picks.

<img src="README_img/1.gif" alt="Card open tutorial" width="70%"/>

### Deck Building
Place cards into the **deck slots** by **dragging** or **clicking** them.  
Once inserted, cards become **active** and start attacking automatically based on their Speed.

<img src="README_img/2.gif" alt="Card usage tutorial" width="70%"/>

### Combat
- Cards have 4 main stats: **Attack**, **Speed**, **Crit Rate**, and **Attack Type**.  
- Collect duplicates to level up cards (each level doubles the card's stats).  

<img src="README_img/3.gif" alt="Combat attack tutorial" width="70%"/>

### Boss System
- Cards attack automatically based on their Speed.  
- **Critical hits** deal double damage.  
- Exploit **Type Advantage** to deal 2× damage against enemy weaknesses.  
- Defeat boss categories to unlock the next tier and earn rewards.

<img src="README_img/5.gif" alt="Boss selection tutorial" width="70%"/>

### Base Upgrades
- Expand and improve your base to unlock new features like cloning and modifiers.  
- Upgrade speed depends on your cats' **Crit DPS**:
- New Time = Base Time ÷ Total Crit DPS

<img src="README_img/6.gif" alt="Base upgrade tutorial" width="70%"/>

### Card Cloning
Place the **card to clone** in the **cloning slot**.  
It will automatically clone and upgrade its level. Cloning speed unlocks and improves through base upgrades.

<img src="README_img/7.gif" alt="Card cloning tutorial" width="70%"/>

### Modifiers
Unlock powerful **slot modifiers** through base upgrades to supercharge your cards:

| Modifier | Effect |
|----------|--------|
| **B (Bloody)** | **Attack** ×3 |
| **S (Shiny)** | **Speed** ÷3 (faster attacks) |
| **L (Lucky)** | **Crit** ×3 (more critical hits) |
| **R (Rainbow)** | **Attack** ×2, **Speed** ÷2, **Crit** ×1.5 |
| **N (Negative)** | Changes attack type to boss weakness |

<img src="README_img/8.gif" alt="Modifiers tutorial" width="70%"/>

---

## 🖼️ Visuals and Audio

| Asset Type | Description |
|-------------|--------------|
| **Graphics** | Hand-drawn in **GIMP** |
| **Sound Effects** | Recorded and edited in **Audacity** |
| **Code Editor** | Written entirely in **VS Code** |
| **Language Stack** | Pure **HTML + CSS + JavaScript (no libraries)** |

### 🎵 Background Music
Music licensed under **Creative Commons CC BY 3.0**, used with attribution.

- **Sakura Girl** – Cat Walk, Daisy, Yay, Lights  
[Sakura Girl SoundCloud](https://soundcloud.com/sakuragirl_official)  
[Promoted by Chosic](https://www.chosic.com/free-music/all/)  
- **Loyalty Freak Music** – Go To The Picnic, Yippee!  
[Go To The Picnic](https://www.chosic.com/download-audio/59280/)  
[Yippee!](https://www.chosic.com/download-audio/24224/)

---

## 💻 Author
**All code, design, and content by [Przemysław Pytlarz](https://github.com/Matetorture)**.  
Everything has been created manually without external libraries or prebuilt engines.

---

## ⚡ Try It Out
You can play and test **CATaclysm** directly on its hosted version:  
🔗 [webtochange.github.io/cataclysm/](webtochange.github.io/cataclysm/)

If you want to run it locally:
1. Clone the repository.  
2. Open `index.html` in your browser.  
3. Enjoy the chaos of cats and cards!

---

## ⚖️ License
All original code, visuals, and sound effects © 2025 Przemysław Pytlarz.  
External music licensed under [Creative Commons CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).