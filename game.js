// Získání canvasu a jeho kontextu
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Herní prvky
const startButton = document.getElementById('startButton');
const scoreElement = document.getElementById('score');
const heartsElement = document.getElementById('hearts');

// Herní proměnné
let score = 0;
let lives = 3;
let gameRunning = false;
let animationId;
let wolfFurColor = '#7f8c8d'; // Výchozí barva srsti

// Funkce pro vykreslení srdcí
function updateHearts() {
    heartsElement.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        heartsElement.innerHTML += '❤️';
    }
}

// Inicializace srdcí
updateHearts();

// Funkce pro změnu barvy srsti vlka
function changeWolfFurColor(color) {
    console.log('Měním barvu srsti na:', color);
    wolfFurColor = color;
    
    // Odstranění předchozího výběru
    const allButtons = document.querySelectorAll('.color-btn');
    console.log('Odstraňuji výběr ze všech tlačítek:', allButtons.length);
    allButtons.forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Označení nově vybrané barvy
    if (event && event.target) {
        event.target.classList.add('selected');
        console.log('Označuji nově vybranou barvu');
    }
    
    console.log(`Barva srsti změněna na: ${color}`);
    console.log('Aktuální wolfFurColor:', wolfFurColor);
    
    // Okamžité překreslení vlka s novou barvou
    if (!gameRunning) {
        // Pokud hra neběží, překreslíme celou scénu s novou barvou
        drawInitialScene();
    }
}

// Funkce pro zobrazení barevných tlačítek
function showColorButtons() {
    const wolfCustomization = document.querySelector('.wolf-customization');
    if (wolfCustomization) {
        wolfCustomization.classList.remove('hidden', 'fade-out');
        console.log('Barevná tlačítka zobrazena');
    }
}

// Funkce pro skrytí barevných tlačítek
function hideColorButtons() {
    const wolfCustomization = document.querySelector('.wolf-customization');
    if (wolfCustomization) {
        wolfCustomization.classList.add('fade-out');
        setTimeout(() => {
            wolfCustomization.classList.add('hidden');
        }, 500);
        console.log('Barevná tlačítka skryta');
    }
}

// Vlk
const wolf = {
    x: 50,
    y: canvas.height - 100,
    width: 70,
    height: 50,
    speed: 5,
    jumping: false,
    jumpHeight: 15,
    gravity: 0.6,
    velocityY: 0,
    hitAnimation: false,
    lying: false,     // Nová proměnná pro ležení
    originalHeight: 50, // Původní výška pro obnovení
    draw: function() {
        // Červená barva při zásahu
        if (this.hitAnimation) {
            ctx.fillStyle = '#e74c3c'; // Červená barva pro tělo při zásahu
        } else if (this.regenerationEffect) {
            ctx.fillStyle = '#2ecc71'; // Zelená barva při regeneraci
        } else {
            ctx.fillStyle = wolfFurColor; // Vybraná barva srsti
            // Debugování barvy
            if (Math.random() < 0.01) { // Pouze občas pro debugování
                console.log('Vykresluji vlka s barvou:', wolfFurColor);
            }
        }
        
        // Přidáme text pro maso a progress bar
        if (this.lying && lives < 3) {
            ctx.fillStyle = '#e74c3c';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(i18n.t('meat'), this.x, this.y - 60);
            
            // Progress bar pro regeneraci (vypadá jako maso)
            if (this.regenerationTimer) {
                const elapsed = Date.now() - this.regenerationTimer;
                const progress = Math.min(elapsed / 8, 1); // 8 milisekund = 100%
                
                // Pozadí progress baru (tmavé)
                ctx.fillStyle = 'rgba(139, 69, 19, 0.8)';
                ctx.fillRect(this.x - 25, this.y - 45, 50, 8);
                
                // Progress bar (červené maso)
                ctx.fillStyle = '#e74c3c';
                ctx.fillRect(this.x - 25, this.y - 45, 50 * progress, 8);
                
                // Rám progress baru (hnědý)
                ctx.strokeStyle = '#8b4513';
                ctx.lineWidth = 1;
                ctx.strokeRect(this.x - 25, this.y - 45, 50, 8);
                
                // Přidáme žilky na maso
                if (progress > 0.3) {
                    ctx.strokeStyle = '#8b0000';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(this.x - 20, this.y - 42);
                    ctx.lineTo(this.x - 15, this.y - 40);
                    ctx.stroke();
                    
                    ctx.beginPath();
                    ctx.moveTo(this.x + 10, this.y - 42);
                    ctx.lineTo(this.x + 15, this.y - 40);
                    ctx.stroke();
                }
            }
        }
        
        // Pokud vlk leží, upravíme jeho pozici a rozměry
        const currentHeight = this.lying ? this.height : this.height; // Stejná výška
        const currentY = this.lying ? this.y + this.height / 4 : this.y;
        
        // Tělo vlka
        ctx.beginPath();
        if (this.lying) {
            // Ležící vlk - protáhlé tělo
            ctx.ellipse(this.x, currentY, this.width / 2, currentHeight / 3, 0, 0, Math.PI * 2);
        } else {
            // Stojící vlk - normální tělo
            ctx.ellipse(this.x, currentY, this.width / 2, currentHeight / 3, 0, 0, Math.PI * 2);
        }
        ctx.fill();
        
        // Nohy
        ctx.fillStyle = this.hitAnimation ? '#c0392b' : '#6c7a7a';
        if (this.lying) {
            // Ležící vlk - přední nohy dopředu, zadní dozadu
            // Přední nohy (natažené dopředu k hlavě)
            ctx.fillRect(this.x + 35, currentY + 10, 15, 6);
            ctx.fillRect(this.x + 45, currentY + 10, 15, 6);
            // Zadní nohy (natažené dozadu k ocasu)
            ctx.fillRect(this.x - 30, currentY + 10, 15, 6);
            ctx.fillRect(this.x - 40, currentY + 10, 15, 6);
        } else {
            // Stojící vlk - normální nohy
            ctx.fillRect(this.x + 20, currentY + 10, 6, 30);
            ctx.fillRect(this.x - 25, currentY + 10, 6, 30);
        }
        
        // Hlava
        ctx.fillStyle = this.hitAnimation ? '#d35400' : '#95a5a6';
        if (this.lying) {
            // Ležící vlk - hlava natažená dopředu
            ctx.beginPath();
            ctx.ellipse(this.x + 35, currentY - 5, 25, 20, 0, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Stojící vlk - normální hlava
            ctx.beginPath();
            ctx.ellipse(this.x + 25, currentY - 10, 25, 20, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Uši
        ctx.fillStyle = wolfFurColor;
        if (this.lying) {
            // Ležící vlk - uši natažené do stran
            ctx.beginPath();
            ctx.moveTo(this.x + 25, currentY - 20);
            ctx.lineTo(this.x + 15, currentY - 35);
            ctx.lineTo(this.x + 35, currentY - 20);
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(this.x + 45, currentY - 20);
            ctx.lineTo(this.x + 55, currentY - 35);
            ctx.lineTo(this.x + 60, currentY - 20);
            ctx.fill();
        } else {
            // Stojící vlk - normální uši
            ctx.beginPath();
            ctx.moveTo(this.x + 15, currentY - 25);
            ctx.lineTo(this.x + 5, currentY - 40);
            ctx.lineTo(this.x + 25, currentY - 25);
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(this.x + 35, currentY - 25);
            ctx.lineTo(this.x + 45, currentY - 40);
            ctx.lineTo(this.x + 50, currentY - 25);
            ctx.fill();
        }
        
        // Nos
        ctx.fillStyle = '#000000';
        if (this.lying) {
            ctx.beginPath();
            ctx.arc(this.x + 60, currentY - 5, 6, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(this.x + 50, currentY - 10, 6, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Oči
        ctx.fillStyle = '#000000';
        if (this.lying) {
            ctx.beginPath();
            ctx.arc(this.x + 45, currentY - 10, 5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(this.x + 35, currentY - 15, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Bílá tečka v oku (lesk)
        ctx.fillStyle = '#ffffff';
        if (this.lying) {
            ctx.beginPath();
            ctx.arc(this.x + 47, currentY - 12, 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(this.x + 37, currentY - 17, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Ocas
        ctx.fillStyle = wolfFurColor;
        if (this.lying) {
            // Ležící vlk - ocas natažený dozadu
            ctx.beginPath();
            ctx.moveTo(this.x - 20, currentY);
            ctx.lineTo(this.x - 35, currentY - 10);
            ctx.lineTo(this.x - 15, currentY);
            ctx.fill();
        } else {
            // Stojící vlk - normální ocas
            ctx.beginPath();
            ctx.moveTo(this.x - 30, currentY);
            ctx.lineTo(this.x - 45, currentY - 15);
            ctx.lineTo(this.x - 25, currentY);
            ctx.fill();
        }
    },
    update: function() {
        // Gravitace pro skok
        if (this.jumping) {
            this.velocityY += this.gravity;
            this.y += this.velocityY;
            
            // Dopad na zem
            if (this.y > canvas.height - 100) {
                this.y = canvas.height - 100;
                this.jumping = false;
                this.velocityY = 0;
            }
        }
    },
    jump: function() {
        if (!this.jumping) {
            this.jumping = true;
            this.velocityY = -this.jumpHeight;
        }
    },
    lieDown: function() {
        if (!this.jumping && !this.lying) {
            this.lying = true;
            // this.height = this.originalHeight / 2; // Necháme stejnou výšku
        }
    },
    standUp: function() {
        if (this.lying) {
            this.lying = false;
            // this.height = this.originalHeight; // Necháme stejnou výšku
        }
    },
    regenerateHealth: function() {
        // Regenerace životů když vlk leží a nedotýká se ostnů
        if (this.lying && lives < 3) {
            // Kontrola, zda se vlk nedotýká ostnů
            let touchingObstacle = false;
            for (let obstacle of obstacles) {
                if (checkCollision(this, obstacle)) {
                    touchingObstacle = true;
                    break;
                }
            }
            
            // Pokud se nedotýká ostnů, regeneruje životy
            if (!touchingObstacle) {
                // Regenerace každých 8 milisekund (8ms) - extrémně rychlá regenerace
                if (!this.regenerationTimer) {
                    this.regenerationTimer = Date.now();
                    console.log('Začínám regeneraci...');
                } else if (Date.now() - this.regenerationTimer > 8) {
                    lives = Math.min(lives + 1, 3); // Maximálně 3 životy
                    updateHearts();
                    this.regenerationTimer = Date.now();
                    
                    // Vizuální efekt regenerace
                    this.regenerationEffect = true;
                    setTimeout(() => {
                        this.regenerationEffect = false;
                    }, 1000);
                    
                    // Přidáme console.log pro debugování
                    console.log(`Regenerován život! Aktuální životy: ${lives}`);
                }
            } else {
                // Reset timeru když se dotýká překážky
                this.regenerationTimer = null;
                console.log('Regenerace přerušena - dotýkám se překážky');
            }
        } else {
            // Reset timeru když vlk neleží
            this.regenerationTimer = null;
        }
    }
};

// Překážky
const obstacles = [];
const obstacleInterval = 1500; // Interval mezi překážkami v ms
let lastObstacleTime = 0;

function createObstacle() {
    const height = Math.random() * 40 + 30; // Menší výška překážek
    obstacles.push({
        x: canvas.width,
        y: canvas.height - height,
        width: 30,
        height: height,
        passed: false
    });
}

// Potravy
const foods = [];
const foodInterval = 2500; // Interval mezi potravou v ms
let lastFoodTime = 0;

function createFood() {
    foods.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - 200) + 150,
        radius: 10,
        collected: false
    });
}

// Ovládání
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowDown: false,  // Přidáme šipku dolů
    Space: false
};

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') keys.ArrowLeft = true;
    if (e.key === 'ArrowRight') keys.ArrowRight = true;
    if (e.key === 'ArrowDown') {
        e.preventDefault(); // Zabrání posouvání stránky dolů
        keys.ArrowDown = true;
    }
    if (e.key === ' ') {
        // Přidání preventDefault, aby mezerník nezpůsobil kliknutí na tlačítko
        e.preventDefault();
        keys.Space = true;
        if (gameRunning) wolf.jump();
    }
});

document.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowLeft') keys.ArrowLeft = false;
    if (e.key === 'ArrowRight') keys.ArrowRight = false;
    if (e.key === 'ArrowDown') keys.ArrowDown = false;  // Přidáme šipku dolů
    if (e.key === ' ') keys.Space = false;
});

// Kolize
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

function checkFoodCollision(wolf, food) {
    const distance = Math.sqrt(
        Math.pow(wolf.x - food.x, 2) + 
        Math.pow(wolf.y - food.y, 2)
    );
    return distance < wolf.width / 2 + food.radius;
}

// Herní smyčka
function gameLoop(timestamp) {
    // Vyčištění canvasu
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Pohyb vlka
    if (keys.ArrowLeft && wolf.x > 0) wolf.x -= wolf.speed;
    if (keys.ArrowRight && wolf.x < canvas.width - wolf.width) wolf.x += wolf.speed;
    
    // Ležení vlka
    if (keys.ArrowDown) {
        wolf.lieDown();
    } else {
        wolf.standUp();
    }
    
    // Regenerace zdraví
    wolf.regenerateHealth();
    
    wolf.update();
    
    // Vykreslení země
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    
    // Vykreslení oblohy
    ctx.fillStyle = '#3498db';
    ctx.fillRect(0, 0, canvas.width, canvas.height - 50);
    
    // Vykreslení mraků
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(100, 80, 30, 0, Math.PI * 2);
    ctx.arc(130, 70, 40, 0, Math.PI * 2);
    ctx.arc(160, 80, 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(500, 60, 40, 0, Math.PI * 2);
    ctx.arc(540, 50, 50, 0, Math.PI * 2);
    ctx.arc(580, 60, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Vykreslení slunce
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(700, 80, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Vykreslení vzdálených hor
    ctx.fillStyle = '#34495e';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 150);
    ctx.lineTo(200, canvas.height - 250);
    ctx.lineTo(400, canvas.height - 170);
    ctx.lineTo(600, canvas.height - 220);
    ctx.lineTo(800, canvas.height - 180);
    ctx.lineTo(800, canvas.height - 50);
    ctx.lineTo(0, canvas.height - 50);
    ctx.fill();
    
    // Vykreslení lesa v pozadí - různé velikosti a typy stromů
    // Jehličnaté stromy
    for (let i = 0; i < 8; i++) {
        // Kmen
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(i * 100 + 20, canvas.height - 130, 10, 80);
        
        // Koruna
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.moveTo(i * 100, canvas.height - 130);
        ctx.lineTo(i * 100 + 25, canvas.height - 200);
        ctx.lineTo(i * 100 + 50, canvas.height - 130);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(i * 100, canvas.height - 160);
        ctx.lineTo(i * 100 + 25, canvas.height - 230);
        ctx.lineTo(i * 100 + 50, canvas.height - 160);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(i * 100, canvas.height - 190);
        ctx.lineTo(i * 100 + 25, canvas.height - 260);
        ctx.lineTo(i * 100 + 50, canvas.height - 190);
        ctx.fill();
    }
    
    // Listnaté stromy
    for (let i = 0; i < 5; i++) {
        // Kmen
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(i * 160 + 70, canvas.height - 120, 15, 70);
        
        // Koruna
        ctx.fillStyle = '#27ae60';
        ctx.beginPath();
        ctx.arc(i * 160 + 75, canvas.height - 170, 40, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Keře a podrost
    for (let i = 0; i < 15; i++) {
        ctx.fillStyle = '#1e8449';
        ctx.beginPath();
        ctx.arc(i * 60 + 30, canvas.height - 45, 15, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Vysoká tráva
    ctx.fillStyle = '#27ae60';
    for (let i = 0; i < 40; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 20 + 10, canvas.height - 50);
        ctx.lineTo(i * 20 + 10, canvas.height - 65 - Math.random() * 10);
        ctx.lineTo(i * 20 + 15, canvas.height - 50);
        ctx.fill();
    }
    
    // Lesní zvířata (ptáci)
    ctx.fillStyle = '#7f8c8d';
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = 100 + Math.random() * 100;
        
        // Pták ve tvaru "V"
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 5, y - 5);
        ctx.lineTo(x, y - 3);
        ctx.lineTo(x + 5, y - 5);
        ctx.lineTo(x, y);
        ctx.fill();
    }
    
    // Malé kameny
    ctx.fillStyle = '#95a5a6';
    for (let i = 0; i < 8; i++) {
        const x = i * 100 + 50;
        ctx.beginPath();
        ctx.arc(x, canvas.height - 45, 5 + Math.random() * 5, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Vykreslení vlka
    wolf.draw();
    
    // Generování a vykreslení překážek
    if (timestamp - lastObstacleTime > obstacleInterval) {
        createObstacle();
        lastObstacleTime = timestamp;
    }
    
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        
        // Vykreslení překážky jako ostny
        ctx.fillStyle = '#27ae60';
        
        // Základna ostnů
        ctx.fillRect(obstacle.x, obstacle.y + obstacle.height - 10, obstacle.width, 10);
        
        // Vykreslení ostrých hrotů (ostnů)
        ctx.fillStyle = '#f5f5f5';
        const ostnuCount = 3; // Počet ostnů
        const ostnuWidth = obstacle.width / ostnuCount;
        
        for (let j = 0; j < ostnuCount; j++) {
            ctx.beginPath();
            ctx.moveTo(obstacle.x + j * ostnuWidth, obstacle.y + obstacle.height - 10);
            ctx.lineTo(obstacle.x + j * ostnuWidth + ostnuWidth / 2, obstacle.y + obstacle.height - 90); // Větší ostny
            ctx.lineTo(obstacle.x + (j + 1) * ostnuWidth, obstacle.y + obstacle.height - 10);
            ctx.fill();
        }
        
        // Posun překážky
        obstacle.x -= 5;
        
        // Kontrola kolize
        if (checkCollision(wolf, obstacle)) {
            lives--;
            updateHearts();
            
            // Vizuální efekt při ztrátě života
            wolf.hitAnimation = true;
            setTimeout(function() {
                wolf.hitAnimation = false;
            }, 500);
            
            // Odebrání překážky po kolizi
            obstacles.splice(i, 1);
            i--;
            
            if (lives <= 0) {
                gameOver();
                return;
            }
        }
        
        // Přidání skóre při překonání překážky
        if (!obstacle.passed && obstacle.x + obstacle.width < wolf.x) {
            obstacle.passed = true;
            score++;
            scoreElement.textContent = score;
            
            // Kontrola výhry při dosažení 100 bodů
            if (score >= 100) {
                winGame();
                return;
            }
        }
        
        // Odstranění překážek, které opustily obrazovku
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(i, 1);
            i--;
        }
    }
    
    // Generování a vykreslení potravy
    if (timestamp - lastFoodTime > foodInterval) {
        createFood();
        lastFoodTime = timestamp;
    }
    
    for (let i = 0; i < foods.length; i++) {
        const food = foods[i];
        
        // Vykreslení potravy jako kost
        ctx.fillStyle = '#f5f5f5';
        
        // Hlavní část kosti
        ctx.beginPath();
        ctx.rect(food.x - 15, food.y - 4, 30, 8);
        ctx.fill();
        
        // Konce kosti (kulaté)
        ctx.beginPath();
        ctx.arc(food.x - 15, food.y, 7, 0, Math.PI * 2);
        ctx.arc(food.x + 15, food.y, 7, 0, Math.PI * 2);
        ctx.fill();
        
        // Posun potravy
        food.x -= 3;
        
        // Kontrola sběru potravy
        if (checkFoodCollision(wolf, food)) {
            food.collected = true;
            score += 5;
            scoreElement.textContent = score;
            // Odebrání potravy po sběru
            foods.splice(i, 1);
            i--;
            
            // Kontrola výhry při dosažení 100 bodů
            if (score >= 100) {
                winGame();
                return;
            }
        }
        
        // Odstranění potravy, která opustila obrazovku
        if (food.x + 20 < 0) {
            foods.splice(i, 1);
            i--;
        }
    }
    
    // Pokračování hry
    if (gameRunning) {
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Spuštění/restart hry
function startGame() {
    // Skrytí barevných tlačítek během hry
    hideColorButtons();
    
    // Reset herních proměnných
    score = 0;
    lives = 3;
    scoreElement.textContent = score;
    updateHearts();
    
    // Reset vlka
    wolf.x = 50;
    wolf.y = canvas.height - 100;
    wolf.jumping = false;
    wolf.velocityY = 0;
    wolf.lying = false; // Reset ležení
    wolf.height = 50; // Reset výšky
    wolf.regenerationTimer = null; // Reset regenerace
    wolf.regenerationEffect = false; // Reset efektu regenerace
    wolf.hitAnimation = false; // Reset animace zásahu
    
    // Vyčištění překážek a potravy
    obstacles.length = 0;
    foods.length = 0;
    
    // Kontrola, zda jde o restart nebo první spuštění
    if (startButton.textContent === i18n.t('restart')) {
        // Je to restart, hra se nespustí automaticky
        gameRunning = false;
        
        // Zobrazení barevných tlačítek zpět
        showColorButtons();
        
        // Vyčištění canvasu
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Vykreslení scény
        drawInitialScene();
        
        // Změna textu tlačítka zpět na Start
        startButton.textContent = i18n.t('start');
    } else {
        // První spuštění, hra se spustí
        gameRunning = true;
        lastObstacleTime = 0;
        lastFoodTime = 0;
        
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        animationId = requestAnimationFrame(gameLoop);
        
        // Změna textu tlačítka
        startButton.textContent = i18n.t('restart');
    }
}

// Konec hry
function gameOver() {
    gameRunning = false;
    
    // Zobrazení barevných tlačítek zpět
    showColorButtons();
    
    // Vykreslení oznámení "Konec hry"
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#e74c3c';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(i18n.t('gameOver'), canvas.width / 2, canvas.height / 2 - 24);
    
    ctx.fillStyle = '#f1c40f';
    ctx.font = '28px Arial';
    ctx.fillText(`${i18n.t('finalScore')}: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
}

// Poslech události kliknutí na tlačítko start
startButton.addEventListener('click', startGame);

// Event listenery pro barevná tlačítka
function initializeColorButtons() {
    console.log('Inicializuji barevná tlačítka...');
    const colorButtons = document.querySelectorAll('.color-btn');
    console.log('Našel jsem tlačítka:', colorButtons.length);
    
    if (colorButtons.length === 0) {
        console.log('Žádná tlačítka nenalezena, zkouším znovu za 100ms...');
        setTimeout(initializeColorButtons, 100);
        return;
    }
    
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            console.log('Kliknuto na barvu:', color);
            changeWolfFurColor(color);
        });
    });
    
    // Označení výchozí barvy
    const defaultButton = document.querySelector('[data-color="#7f8c8d"]');
    if (defaultButton) {
        defaultButton.classList.add('selected');
        console.log('Výchozí barva označena');
    }
    
    console.log('Barevná tlačítka inicializována!');
}

// Spustíme inicializaci hned a také po načtení DOMu
initializeColorButtons();
document.addEventListener('DOMContentLoaded', initializeColorButtons);

// Zabránění výchozí akce na mezerník pro celý dokument
document.addEventListener('keydown', function(e) {
    if (e.key === ' ') {
        e.preventDefault();
    }
}, { passive: false });

// Přidat funkci pro překreslení scény při změně jazyka
function redrawSceneForLanguage() {
    if (!gameRunning) {
        // Pokud hra neběží, překreslíme úvodní scénu
        drawInitialScene();
    }
    // Pokud hra běží, texty se aktualizují v příštím snímku gameLoop
}

// Úvodní vykreslení scény
function drawInitialScene() {
    // Vykreslení země
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    
    // Vykreslení oblohy
    ctx.fillStyle = '#3498db';
    ctx.fillRect(0, 0, canvas.width, canvas.height - 50);
    
    // Vykreslení mraků
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(100, 80, 30, 0, Math.PI * 2);
    ctx.arc(130, 70, 40, 0, Math.PI * 2);
    ctx.arc(160, 80, 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(500, 60, 40, 0, Math.PI * 2);
    ctx.arc(540, 50, 50, 0, Math.PI * 2);
    ctx.arc(580, 60, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Vykreslení slunce
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(700, 80, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Vykreslení vzdálených hor
    ctx.fillStyle = '#34495e';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 150);
    ctx.lineTo(200, canvas.height - 250);
    ctx.lineTo(400, canvas.height - 170);
    ctx.lineTo(600, canvas.height - 220);
    ctx.lineTo(800, canvas.height - 180);
    ctx.lineTo(800, canvas.height - 50);
    ctx.lineTo(0, canvas.height - 50);
    ctx.fill();
    
    // Vykreslení lesa v pozadí - různé velikosti a typy stromů
    // Jehličnaté stromy
    for (let i = 0; i < 8; i++) {
        // Kmen
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(i * 100 + 20, canvas.height - 130, 10, 80);
        
        // Koruna
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.moveTo(i * 100, canvas.height - 130);
        ctx.lineTo(i * 100 + 25, canvas.height - 200);
        ctx.lineTo(i * 100 + 50, canvas.height - 130);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(i * 100, canvas.height - 160);
        ctx.lineTo(i * 100 + 25, canvas.height - 230);
        ctx.lineTo(i * 100 + 50, canvas.height - 160);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(i * 100, canvas.height - 190);
        ctx.lineTo(i * 100 + 25, canvas.height - 260);
        ctx.lineTo(i * 100 + 50, canvas.height - 190);
        ctx.fill();
    }
    
    // Listnaté stromy
    for (let i = 0; i < 5; i++) {
        // Kmen
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(i * 160 + 70, canvas.height - 120, 15, 70);
        
        // Koruna
        ctx.fillStyle = '#27ae60';
        ctx.beginPath();
        ctx.arc(i * 160 + 75, canvas.height - 170, 40, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Keře a podrost
    for (let i = 0; i < 15; i++) {
        ctx.fillStyle = '#1e8449';
        ctx.beginPath();
        ctx.arc(i * 60 + 30, canvas.height - 45, 15, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Vysoká tráva
    ctx.fillStyle = '#27ae60';
    for (let i = 0; i < 40; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 20 + 10, canvas.height - 50);
        ctx.lineTo(i * 20 + 10, canvas.height - 65 - Math.random() * 10);
        ctx.lineTo(i * 20 + 15, canvas.height - 50);
        ctx.fill();
    }
    
    // Lesní zvířata (ptáci)
    ctx.fillStyle = '#7f8c8d';
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = 100 + Math.random() * 100;
        
        // Pták ve tvaru "V"
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 5, y - 5);
        ctx.lineTo(x, y - 3);
        ctx.lineTo(x + 5, y - 5);
        ctx.lineTo(x, y);
        ctx.fill();
    }
    
    // Malé kameny
    ctx.fillStyle = '#95a5a6';
    for (let i = 0; i < 8; i++) {
        const x = i * 100 + 50;
        ctx.beginPath();
        ctx.arc(x, canvas.height - 45, 5 + Math.random() * 5, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Vykreslení vlka
    wolf.draw();
    
    // Ukázková kost
    const boneX = canvas.width / 2;
    const boneY = canvas.height / 2 + 70;
    
    ctx.fillStyle = '#f5f5f5';
    // Hlavní část kosti
    ctx.beginPath();
    ctx.rect(boneX - 15, boneY - 4, 30, 8);
    ctx.fill();
    
    // Konce kosti (kulaté)
    ctx.beginPath();
    ctx.arc(boneX - 15, boneY, 7, 0, Math.PI * 2);
    ctx.arc(boneX + 15, boneY, 7, 0, Math.PI * 2);
    ctx.fill();
    
    // Popisek kosti
    ctx.fillStyle = '#ecf0f1';
    ctx.font = '16px Arial';
    ctx.fillText(i18n.t('collectBones'), boneX, boneY + 30);
    
    // Text
    ctx.fillStyle = '#ecf0f1';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(i18n.t('pressStart'), canvas.width / 2, canvas.height / 2);
}

// Funkce pro výhru
function winGame() {
    gameRunning = false;
    
    // Zobrazení barevných tlačítek zpět
    showColorButtons();
    
    // Vykreslení oznámení "Výhra"
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#2ecc71';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(i18n.t('youWon'), canvas.width / 2, canvas.height / 2 - 24);
    
    ctx.fillStyle = '#f1c40f';
    ctx.font = '28px Arial';
    ctx.fillText(`${i18n.t('finalScore')}: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    
    // Přidání ohňostroje
    drawFireworks();
}

// Funkce pro kreslení ohňostroje
function drawFireworks() {
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height / 2);
        const radius = 30 + Math.random() * 20;
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        
        // Centrální výbuch
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius / 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Paprsky
        for (let j = 0; j < 12; j++) {
            const angle = j * (Math.PI / 6);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(
                x + Math.cos(angle) * radius,
                y + Math.sin(angle) * radius
            );
            ctx.stroke();
            
            // Malé jiskry na konci paprsků
            ctx.beginPath();
            ctx.arc(
                x + Math.cos(angle) * radius,
                y + Math.sin(angle) * radius, 
                2, 0, Math.PI * 2
            );
            ctx.fill();
        }
    }
}

// Počáteční vykreslení
drawInitialScene(); 