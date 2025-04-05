// Získání canvasu a jeho kontextu
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Herní prvky
const startButton = document.getElementById('startButton');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');

// Herní proměnné
let score = 0;
let lives = 3;
let gameRunning = false;
let animationId;

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
    draw: function() {
        // Tělo vlka
        ctx.fillStyle = '#7f8c8d';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.width / 2, this.height / 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Nohy
        ctx.fillStyle = '#6c7a7a';
        // Přední noha 1
        ctx.fillRect(this.x + 20, this.y + 10, 6, 30);
        // Zadní noha 2
        ctx.fillRect(this.x - 25, this.y + 10, 6, 30);
        
        // Hlava
        ctx.fillStyle = '#95a5a6';
        ctx.beginPath();
        ctx.ellipse(this.x + 25, this.y - 10, 25, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Uši
        ctx.fillStyle = '#7f8c8d';
        // Levé ucho
        ctx.beginPath();
        ctx.moveTo(this.x + 15, this.y - 25);
        ctx.lineTo(this.x + 5, this.y - 40);
        ctx.lineTo(this.x + 25, this.y - 25);
        ctx.fill();
        // Pravé ucho
        ctx.beginPath();
        ctx.moveTo(this.x + 35, this.y - 25);
        ctx.lineTo(this.x + 45, this.y - 40);
        ctx.lineTo(this.x + 50, this.y - 25);
        ctx.fill();
        
        // Nos
        ctx.fillStyle = '#34495e';
        ctx.beginPath();
        ctx.ellipse(this.x + 50, this.y - 10, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Oči
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(this.x + 35, this.y - 15, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Ocas
        ctx.fillStyle = '#7f8c8d';
        ctx.beginPath();
        ctx.moveTo(this.x - 30, this.y);
        ctx.lineTo(this.x - 45, this.y - 15);
        ctx.lineTo(this.x - 25, this.y);
        ctx.fill();
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
    }
};

// Překážky
const obstacles = [];
const obstacleInterval = 1500; // Interval mezi překážkami v ms
let lastObstacleTime = 0;

function createObstacle() {
    const height = Math.random() * 50 + 30;
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
    Space: false
};

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') keys.ArrowLeft = true;
    if (e.key === 'ArrowRight') keys.ArrowRight = true;
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
        
        // Vykreslení překážky
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Posun překážky
        obstacle.x -= 5;
        
        // Kontrola kolize
        if (checkCollision(wolf, obstacle)) {
            lives--;
            livesElement.textContent = lives;
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
    // Reset herních proměnných
    score = 0;
    lives = 3;
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    
    // Reset vlka
    wolf.x = 50;
    wolf.y = canvas.height - 100;
    wolf.jumping = false;
    wolf.velocityY = 0;
    
    // Vyčištění překážek a potravy
    obstacles.length = 0;
    foods.length = 0;
    
    // Spuštění hry
    gameRunning = true;
    lastObstacleTime = 0;
    lastFoodTime = 0;
    
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    animationId = requestAnimationFrame(gameLoop);
    
    // Změna textu tlačítka
    startButton.textContent = "Restart";
}

// Konec hry
function gameOver() {
    gameRunning = false;
    
    // Vykreslení oznámení "Konec hry"
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#e74c3c';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Konec hry!', canvas.width / 2, canvas.height / 2 - 24);
    
    ctx.fillStyle = '#f1c40f';
    ctx.font = '28px Arial';
    ctx.fillText(`Konečné skóre: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
}

// Poslech události kliknutí na tlačítko start
startButton.addEventListener('click', startGame);

// Zabránění výchozí akce na mezerník pro celý dokument
document.addEventListener('keydown', function(e) {
    if (e.key === ' ') {
        e.preventDefault();
    }
}, { passive: false });

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
    ctx.fillText('Sbírej kosti pro body!', boneX, boneY + 30);
    
    // Text
    ctx.fillStyle = '#ecf0f1';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Stiskněte "Start" pro zahájení hry', canvas.width / 2, canvas.height / 2);
}

// Počáteční vykreslení
drawInitialScene(); 