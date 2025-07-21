// Game Constants
const GAME_CONSTANTS = {
  MAX_HEALTH: 200,
  MAX_GOLD: 9999,
  MAX_XP: 999,
  INITIAL_HEALTH: 100,
  INITIAL_GOLD: 50,
  INITIAL_XP: 0,
  HEALTH_COST: 10,
  HEALTH_GAIN: 10,
  WEAPON_COST: 30,
  WEAPON_SELL_PRICE: 15,
  EASTER_EGG_GOLD_REWARD: 20,
  EASTER_EGG_HEALTH_PENALTY: 10,
  WEAPON_BREAK_CHANCE: 0.1,
  HIT_CHANCE: 0.8,
  DODGE_SUCCESS_RATE: 0.5
};

// Utility Functions
function clampValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updatePlayerStats() {
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
}

function showMessage(message) {
  text.innerText = message;
}

function addGold(amount) {
  gold += amount;
  gold = Math.min(gold, GAME_CONSTANTS.MAX_GOLD);
}

function addXP(amount) {
  xp += amount;
  xp = Math.min(xp, GAME_CONSTANTS.MAX_XP);
}

function takeDamage(amount) {
  health -= amount;
  health = Math.max(0, health);
}

// Game State Variables
let xp = GAME_CONSTANTS.INITIAL_XP;
let health = GAME_CONSTANTS.INITIAL_HEALTH;
let gold = GAME_CONSTANTS.INITIAL_GOLD;
let currentWeaponIndex = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapon = [
  {name: "stick",power: 5},
  {name: "dagger",power: 12},
  {name: "claw_hammer",power: 25},
  {name: "sword",power: 50}
]

const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fanged_beast",
    level: 5,
    health: 35
  },
  {
    name: "dragon",
    level: 10,
    health: 100
  }
];

const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text:"You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store."
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters."
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster."
  },
  {
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Secret game"],
    "button functions": [goTown, goTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. &#x2620;"
  },
  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;"
  },
  {
    name: "easter egg",
    "button text": ["Pick 2", "Pick 8", "Go to town square"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. One random number will be chosen between 0 and 10. If your number matches, you win!"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// Load game on startup
loadGame();

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if(gold >= GAME_CONSTANTS.HEALTH_COST){
    if(health >= GAME_CONSTANTS.MAX_HEALTH){
      text.innerText = "You already have maximum health!";
    }else{
      gold -= GAME_CONSTANTS.HEALTH_COST;
      health = Math.min(health + GAME_CONSTANTS.HEALTH_GAIN, GAME_CONSTANTS.MAX_HEALTH);
      goldText.innerText = gold;
      healthText.innerText = health;
      saveGame();
    }
  }else{
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentWeaponIndex < weapon.length - 1) {
    if (gold >= GAME_CONSTANTS.WEAPON_COST) {
      gold -= GAME_CONSTANTS.WEAPON_COST;
      currentWeaponIndex++;
      currentWeaponIndex = Math.min(currentWeaponIndex, weapon.length - 1);
      goldText.innerText = gold;
      let newWeapon = weapon[currentWeaponIndex].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
      saveGame();
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  }else{
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += GAME_CONSTANTS.WEAPON_SELL_PRICE;
    gold = Math.min(gold, GAME_CONSTANTS.MAX_GOLD);
    goldText.innerText = gold;
    currentWeaponIndex--;
    currentWeaponIndex = Math.max(0, currentWeaponIndex);
    let currentWeapon = inventory.pop();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
    saveGame();
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight(){
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "You attack the " + monsters[fighting].name + " with your " + weapon[currentWeaponIndex].name + ".";
  
  if (isMonsterHit()) {
    const baseDamage = weapon[currentWeaponIndex].power;
    const bonusDamage = Math.floor(Math.random() * xp) + 1;
    const totalDamage = baseDamage + bonusDamage;
    monsterHealth -= totalDamage;
    text.innerText += ` You deal ${totalDamage} damage! (${baseDamage} + ${bonusDamage} bonus)`;
  } else {
    text.innerText += " You miss.";
  }
  
  monsterHealthText.innerText = Math.max(0, monsterHealth);
  
  if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
    return;
  }
  
  const monsterDamage = getMonsterAttackValue(monsters[fighting].level);
  text.innerText += ` The ${monsters[fighting].name} attacks you for ${monsterDamage} damage.`;
  health -= monsterDamage;
  health = Math.max(0, health);
  healthText.innerText = health;
  
  if (health <= 0) {
    lose();
    return;
  }
  
  if (Math.random() <= GAME_CONSTANTS.WEAPON_BREAK_CHANCE && inventory.length !== 1 && currentWeaponIndex < inventory.length) {
    let brokenWeapon = inventory[currentWeaponIndex];
    text.innerText += " Your " + brokenWeapon + " breaks.";
    inventory.splice(currentWeaponIndex, 1);
    currentWeaponIndex = Math.min(currentWeaponIndex, inventory.length - 1);
    currentWeaponIndex = Math.max(0, currentWeaponIndex);
    saveGame();
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > (1 - GAME_CONSTANTS.HIT_CHANCE);
}

function dodge() {
  text.innerText = "You attempt to dodge the attack from the " + monsters[fighting].name + ".";
  
  if (Math.random() < GAME_CONSTANTS.DODGE_SUCCESS_RATE) {
    text.innerText += " You successfully avoided all damage!";
  } else {
    const partialDamage = Math.floor(getMonsterAttackValue(monsters[fighting].level) / 2);
    text.innerText += ` You couldn't dodge completely and take ${partialDamage} damage.`;
    health -= partialDamage;
    health = Math.max(0, health);
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}

function defeatMonster() {
  const goldReward = Math.floor(monsters[fighting].level * 8 + Math.random() * 10);
  const xpReward = monsters[fighting].level * 2;
  
  gold += goldReward;
  gold = Math.min(gold, GAME_CONSTANTS.MAX_GOLD);
  xp += xpReward;
  xp = Math.min(xp, GAME_CONSTANTS.MAX_XP);
  
  goldText.innerText = gold;
  xpText.innerText = xp;
  
  // Store rewards for display
  const currentLocation = locations[4];
  currentLocation.text = `The ${monsters[fighting].name} screams "Arg!" as it dies. You gain ${xpReward} experience points and find ${goldReward} gold!`;
  
  saveGame();
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart(){
  xp = GAME_CONSTANTS.INITIAL_XP;
  health = GAME_CONSTANTS.INITIAL_HEALTH;
  gold = GAME_CONSTANTS.INITIAL_GOLD;
  currentWeaponIndex = 0;
  inventory = ["stick"];
  updatePlayerStats();
  saveGame();
  goTown();
}

function saveGame() {
  const gameData = {
    xp: xp,
    health: health,
    gold: gold,
    currentWeaponIndex: currentWeaponIndex,
    inventory: inventory,
    savedAt: new Date().toLocaleString()
  };
  localStorage.setItem('dragonRepellerSave', JSON.stringify(gameData));
}

function loadGame() {
  const savedData = localStorage.getItem('dragonRepellerSave');
  if (savedData) {
    try {
      const gameData = JSON.parse(savedData);
      xp = gameData.xp || GAME_CONSTANTS.INITIAL_XP;
      health = gameData.health || GAME_CONSTANTS.INITIAL_HEALTH;
      gold = gameData.gold || GAME_CONSTANTS.INITIAL_GOLD;
      currentWeaponIndex = gameData.currentWeaponIndex || 0;
      inventory = gameData.inventory || ["stick"];
      
      // Boundary checks for loaded data
      health = Math.min(Math.max(1, health), GAME_CONSTANTS.MAX_HEALTH);
      gold = Math.min(Math.max(0, gold), GAME_CONSTANTS.MAX_GOLD);
      xp = Math.min(Math.max(0, xp), GAME_CONSTANTS.MAX_XP);
      currentWeaponIndex = Math.min(Math.max(0, currentWeaponIndex), weapon.length - 1);
      
      // Update UI
      updatePlayerStats();
      
      text.innerText = `Game loaded! Last saved: ${gameData.savedAt || 'Unknown time'}`;
    } catch (error) {
      console.log('Failed to load save data, starting fresh game');
    }
  }
}

function easterEgg(){
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess){
  const randomNumber = Math.floor(Math.random() * 11);
  text.innerText = `You picked ${guess}. The random number is: ${randomNumber}\n`;
  
  if(randomNumber === guess){
    text.innerText += `🎉 Right! You win ${GAME_CONSTANTS.EASTER_EGG_GOLD_REWARD} gold! Lucky guess!`;
    gold += GAME_CONSTANTS.EASTER_EGG_GOLD_REWARD;
    gold = Math.min(gold, GAME_CONSTANTS.MAX_GOLD);
    goldText.innerText = gold;
    saveGame();
  } else {
    text.innerText += `💔 Wrong! The odds were against you (${guess} vs ${randomNumber}). You lose ${GAME_CONSTANTS.EASTER_EGG_HEALTH_PENALTY} health!`;
    health -= GAME_CONSTANTS.EASTER_EGG_HEALTH_PENALTY;
    health = Math.max(0, health);
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    } else {
      saveGame();
    }
  }
}
