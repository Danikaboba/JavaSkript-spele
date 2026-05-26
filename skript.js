// --- ИГРОВОЕ СОСТОЯНИЕ (STATE) ---
let coins = 0;

let autoClickers = 0;
let autoClickerCost = 10;

let clickLevel = 1;
let clickUpgradeCost = 15;

let critChance = 1; 
let critUpgradeCost = 50;

let crystals = 0;
const REBIRTH_REQUIREMENT = 1000; 

// Переменные для отслеживания временных таймеров ошибок (чтобы надписи не накладывались)
let clickErrorTimeout, autoErrorTimeout, critErrorTimeout, rebirthErrorTimeout;

// --- DOM ЭЛЕМЕНТЫ ---
const coinsDisplay = document.getElementById('coins');
const cpsDisplay = document.getElementById('cps');
const cpcDisplay = document.getElementById('cpc');
const crystalsDisplay = document.getElementById('crystals');
const multiplierDisplay = document.getElementById('multiplier');

const clickBtn = document.getElementById('akmens_poga'); 

const buyAutoClickerBtn = document.getElementById('buy-auto-clicker');
const buyClickUpgradeBtn = document.getElementById('buy-click-upgrade');
const buyCritUpgradeBtn = document.getElementById('buy-crit-upgrade');
const rebirthBtn = document.getElementById('rebirth-btn');

const clickLevelDisplay = document.getElementById('click-level');
const autoCountDisplay = document.getElementById('upgrade-count');
const critChanceDisplay = document.getElementById('crit-chance');

// РАСЧЕТЫ
function getMultiplier() {
    return 1 + (crystals * 0.5);
}

function getClickPower() {
    return clickLevel * getMultiplier();
}

function getCps() {
    return autoClickers * getMultiplier();
}

// ОБЫЧНОЕ ОБНОВЛЕНИЕ ТЕКСТА КНОПОК
// Эта функция ставит стандартный текст (название + цена)
function updateUI() {
    coinsDisplay.textContent = Math.floor(coins);
    cpsDisplay.textContent = getCps().toFixed(1);
    cpcDisplay.textContent = getClickPower().toFixed(1);
    
    crystalsDisplay.textContent = crystals;
    multiplierDisplay.textContent = getMultiplier().toFixed(1);

    clickLevelDisplay.textContent = clickLevel;
    autoCountDisplay.textContent = autoClickers;
    critChanceDisplay.textContent = critChance;

    // Если прямо сейчас НЕ показывается ошибка нехватки денег, обновляем стандартную цену
    if (!clickErrorTimeout) {
        buyClickUpgradeBtn.textContent = `Klikšķis +1 (${clickUpgradeCost})`;
    }
    if (!autoErrorTimeout) {
        buyAutoClickerBtn.textContent = `Auto +1/s (${autoClickerCost})`;
    }
    if (!critErrorTimeout) {
        if (critChance >= 50) {
            buyCritUpgradeBtn.textContent = "MAX līmenis";
        } else {
            buyCritUpgradeBtn.textContent = `Krita iespēja +2% (${critUpgradeCost})`;
        }
    }
    if (!rebirthErrorTimeout) {
        rebirthBtn.textContent = `Rebirth (Maksā: ${REBIRTH_REQUIREMENT})`;
    }
}

//ОБРАБОТКА НАЖАТИЙ С ПРОВЕРКОЙ ВНУТРИ КЛИКА

// Клик по камню
clickBtn.addEventListener('click', () => {
    let currentClickPower = getClickPower();
    const isCrit = Math.floor(Math.random() * 100) + 1 <= critChance;
    
    if (isCrit) {
        currentClickPower = currentClickPower * 10; 
    }

    coins += currentClickPower;
    updateUI();
});

// Клик по прокачке клика
buyClickUpgradeBtn.addEventListener('click', () => {
    if (coins >= clickUpgradeCost) {
        // Если денег хватает — покупаем
        coins -= clickUpgradeCost;
        clickLevel += 1;
        clickUpgradeCost = Math.round(clickUpgradeCost * 1.5);
        updateUI();
    } else {
        // ЕСЛИ НЕ ХВАТАЕТ:
        let missing = clickUpgradeCost - Math.floor(coins);
        buyClickUpgradeBtn.textContent = `Trūkst ${missing} monētas!`; // Меняем текст на ошибку
        
        // Сбрасываем старый таймер, если игрок спамит кликами по кнопке
        clearTimeout(clickErrorTimeout); 
        
        // Через 1.5 секунды (1500 мс) возвращаем цену обратно
        clickErrorTimeout = setTimeout(() => {
            clickErrorTimeout = null;
            updateUI();
        }, 1500);
    }
});

// Клик по автокликеру
buyAutoClickerBtn.addEventListener('click', () => {
    if (coins >= autoClickerCost) {
        coins -= autoClickerCost;
        autoClickers += 1;
        autoClickerCost = Math.round(autoClickerCost * 1.4);
        updateUI();
    } else {
        let missing = autoClickerCost - Math.floor(coins);
        buyAutoClickerBtn.textContent = `Trūkst ${missing} monētas!`;
        clearTimeout(autoErrorTimeout);
        autoErrorTimeout = setTimeout(() => {
            autoErrorTimeout = null;
            updateUI();
        }, 1500);
    }
});

// Клик по прокачке крита
buyCritUpgradeBtn.addEventListener('click', () => {
    if (critChance >= 50) return; // Если макс уровень, ничего не делаем

    if (coins >= critUpgradeCost) {
        coins -= critUpgradeCost;
        critChance += 2; 
        critUpgradeCost = Math.round(critUpgradeCost * 2.2); 
        updateUI();
    } else {
        let missing = critUpgradeCost - Math.floor(coins);
        buyCritUpgradeBtn.textContent = `Trūkst ${missing} monētas!`;
        clearTimeout(critErrorTimeout);
        critErrorTimeout = setTimeout(() => {
            critErrorTimeout = null;
            updateUI();
        }, 1500);
    }
});

// Клик по кнопке Ребиртха
rebirthBtn.addEventListener('click', () => {
    if (coins >= REBIRTH_REQUIREMENT) {
        crystals += 1;
        coins = 0;
        autoClickers = 0;
        autoClickerCost = 10;
        clickLevel = 1;
        clickUpgradeCost = 15;
        alert("Tu esi veiksmīgi atdzimis! Saņemts 1 💎 Kristāls.");
        updateUI();
    } else {
        let missing = REBIRTH_REQUIREMENT - Math.floor(coins);
        rebirthBtn.textContent = `Trūkst ${missing} monētas!`;
        clearTimeout(rebirthErrorTimeout);
        rebirthErrorTimeout = setTimeout(() => {
            rebirthErrorTimeout = null;
            updateUI();
        }, 1500);
    }
});

// --- АВТО---
setInterval(() => {
    if (autoClickers > 0) {
        coins += getCps() / 10;
        updateUI(); // Это обновляет монеты на экране, не трогая текст ошибок
    }
}, 100);

updateUI();
