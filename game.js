// Získání canvasu a jeho kontextu
const canvas = document.getElementById('gameCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

// Kontrola, zda canvas existuje
if (!canvas || !ctx) {
    console.error('Canvas nebyl nalezen nebo není podporován!');
}

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
let wolfHasSpots = false; // Má vlk fleky?
let wolfSpotsColor = '#8B4513'; // Výchozí barva fleků
let selectedBackground = 'forest'; // Vybrané pozadí
let isMobileDevice = false; // Je to mobilní zařízení?

// Funkce pro vykreslení pozadí podle vybraného stylu
function drawEnvironmentBackground() {
    // Vykreslení pozadí podle vybraného stylu
    if (selectedBackground === 'desert') {
        // Velké pouštní duny jako hory
        ctx.fillStyle = '#f4d03f';
        for (let i = 0; i < 4; i++) {
            const duneX = i * 200 + 100;
            const duneHeight = 120 + Math.sin(i) * 40; // Mnohem větší výška
            const duneWidth = 150 + Math.sin(i * 1.5) * 30; // Širší duny
            
            // Hlavní duna - velká jako hora
            ctx.beginPath();
            ctx.ellipse(duneX, canvas.height - 50, duneWidth, duneHeight, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Stín na duně
            ctx.fillStyle = '#e67e22';
            ctx.beginPath();
            ctx.ellipse(duneX - 40, canvas.height - 50, duneWidth * 0.7, duneHeight * 0.8, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Vrátíme původní barvu
            ctx.fillStyle = '#f4d03f';
        }
        
        // Střední duny
        ctx.fillStyle = '#f39c12';
        for (let i = 0; i < 6; i++) {
            const hillX = i * 120 + 50;
            const hillHeight = 60 + Math.random() * 40;
            const hillWidth = 80 + Math.random() * 20;
            
            ctx.beginPath();
            ctx.ellipse(hillX, canvas.height - 45, hillWidth, hillHeight, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        
    } else if (selectedBackground === 'snow') {
        // Zasněžené stromy
        // Jehličnaté stromy se sněhem
        for (let i = 0; i < 10; i++) {
            const baseX = i * 80;
            // Kmen
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(baseX + 20, canvas.height - 130, 10, 80);
            
            // Sníh na kmeni
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(baseX + 22, canvas.height - 130, 6, 20);
            
            // Koruna se sněhem
            ctx.fillStyle = '#2ecc71';
            ctx.beginPath();
            ctx.moveTo(baseX, canvas.height - 130);
            ctx.lineTo(baseX + 25, canvas.height - 200);
            ctx.lineTo(baseX + 50, canvas.height - 130);
            ctx.fill();
            
            // Sníh na koruně
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(baseX + 5, canvas.height - 140);
            ctx.lineTo(baseX + 20, canvas.height - 180);
            ctx.lineTo(baseX + 35, canvas.height - 140);
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(baseX, canvas.height - 160);
            ctx.lineTo(baseX + 25, canvas.height - 230);
            ctx.lineTo(baseX + 50, canvas.height - 160);
            ctx.fill();
            
            // Sníh na druhé vrstvě
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(baseX + 5, canvas.height - 170);
            ctx.lineTo(baseX + 20, canvas.height - 210);
            ctx.lineTo(baseX + 35, canvas.height - 170);
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(baseX, canvas.height - 190);
            ctx.lineTo(baseX + 25, canvas.height - 260);
            ctx.lineTo(baseX + 50, canvas.height - 190);
            ctx.fill();
            
            // Sníh na třetí vrstvě
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(baseX + 5, canvas.height - 200);
            ctx.lineTo(baseX + 20, canvas.height - 240);
            ctx.lineTo(baseX + 35, canvas.height - 200);
            ctx.fill();
        }
        
        
        // Sněhové koule na zemi
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 12; i++) {
            const snowX = i * 70 + 30;
            ctx.beginPath();
            ctx.arc(snowX, canvas.height - 45, 8 + Math.random() * 5, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (selectedBackground === 'ocean') {
        // Oceán – vodní plocha a vlny
        // Voda (větší výška než země v jiných biomech)
        const waterTop = canvas.height - 180;
        const waterBottom = canvas.height - 50;
        const gradient = ctx.createLinearGradient(0, waterTop, 0, waterBottom);
        gradient.addColorStop(0, '#1e90ff');
        gradient.addColorStop(1, '#0066cc');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, waterTop, canvas.width, waterBottom - waterTop);

        // Vlnky – několik vodorovných čar s jemným křivkováním
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        for (let y = waterTop + 20; y < waterBottom; y += 30) {
            ctx.beginPath();
            for (let x = 0; x <= canvas.width; x += 40) {
                const waveHeight = 6 + Math.random() * 3;
                const ctrlX = x + 20;
                const ctrlY = y - waveHeight;
                const endX = x + 40;
                const endY = y;
                if (x === 0) ctx.moveTo(0, y);
                ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
            }
            ctx.stroke();
        }

        // Písečná pláž (přechod u pobřeží)
        const beachHeight = 18;
        const beachTop = waterBottom - beachHeight;
        const sandGradient = ctx.createLinearGradient(0, beachTop, 0, waterBottom);
        sandGradient.addColorStop(0, '#f9e79f'); // světlejší písek
        sandGradient.addColorStop(1, '#f4d03f'); // sytější písek
        ctx.fillStyle = sandGradient;
        ctx.fillRect(0, beachTop, canvas.width, beachHeight);

        // Pěna na rozhraní voda–písek
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 30) {
            const offset = Math.sin(x * 0.05) * 4;
            const y = beachTop - 2 + offset;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Kamínky (malé ovály v odstínech šedé) na pláži
        const pebbleColors = ['#b2bec3', '#95a5a6', '#7f8c8d'];
        for (let p = 0; p < 12; p++) {
            const px = Math.random() * canvas.width;
            const py = beachTop + 4 + Math.random() * (beachHeight - 6);
            const prx = 3 + Math.random() * 4; // poloměr X
            const pry = 2 + Math.random() * 3; // poloměr Y
            ctx.fillStyle = pebbleColors[Math.floor(Math.random() * pebbleColors.length)];
            ctx.beginPath();
            ctx.ellipse(px, py, prx, pry, Math.random() * 0.6, 0, Math.PI * 2);
            ctx.fill();
        }

        // Mušle (půlkruhy s rýhováním) na pláži
        for (let s = 0; s < 7; s++) {
            const sx = 20 + Math.random() * (canvas.width - 40);
            const sy = beachTop + 3 + Math.random() * (beachHeight - 10);
            const r = 6 + Math.random() * 4;
            // základ mušle
            const shellGrad = ctx.createLinearGradient(sx, sy - r, sx, sy + r);
            shellGrad.addColorStop(0, '#FFE9C4');
            shellGrad.addColorStop(1, '#F7D7A6');
            ctx.fillStyle = shellGrad;
            ctx.beginPath();
            ctx.moveTo(sx - r, sy);
            ctx.arc(sx, sy, r, Math.PI, 0);
            ctx.closePath();
            ctx.fill();
            // obrys mušle
            ctx.strokeStyle = 'rgba(160, 120, 60, 0.6)';
            ctx.lineWidth = 1;
            ctx.stroke();
            // rýhování
            ctx.strokeStyle = 'rgba(160, 120, 60, 0.45)';
            for (let k = 1; k <= 3; k++) {
                const t = k / 3;
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.quadraticCurveTo(
                    sx - r * 0.8 * (1 - t), sy - r * 0.6 * t,
                    sx - r * (1 - t), sy
                );
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.quadraticCurveTo(
                    sx + r * 0.8 * (1 - t), sy - r * 0.6 * t,
                    sx + r * (1 - t), sy
                );
                ctx.stroke();
            }
        }

        // Písečné ostrovy s palmami (styl blízký emoji 🏝️)
        const islandCount = 3;
        for (let i = 0; i < islandCount; i++) {
            const baseX = 140 + i * 240; // rozprostření po šířce
            const baseY = waterTop + 60 + (i % 2 === 0 ? 10 : -5); // mírná variace výšky
            const islandWidth = 85 + (i % 2) * 18; // kulatější ostrov
            const islandHeight = 30 + (i % 3) * 5;

            // Ostrov (písek) – syté barvy jako emoji
            const islandGrad = ctx.createLinearGradient(0, baseY - islandHeight, 0, baseY + islandHeight);
            islandGrad.addColorStop(0, '#FFD56B');
            islandGrad.addColorStop(1, '#F4C542');
            ctx.fillStyle = islandGrad;
            ctx.beginPath();
            ctx.ellipse(baseX, baseY, islandWidth, islandHeight, 0, 0, Math.PI * 2);
            ctx.fill();
            // Obrys ostrova
            ctx.strokeStyle = 'rgba(150, 110, 30, 0.6)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Pěna kolem ostrova
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            for (let a = 0; a <= Math.PI * 2; a += Math.PI / 12) {
                const rX = islandWidth + 6 + Math.sin(a * 3) * 2;
                const rY = islandHeight + 4 + Math.cos(a * 2) * 1.5;
                const px = baseX + Math.cos(a) * rX;
                const py = baseY + Math.sin(a) * rY;
                if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();

            // Kamínky na ostrově (po obvodu elipsy ostrova)
            const islandPebbleColors = ['#b2bec3', '#95a5a6', '#7f8c8d'];
            for (let ip = 0; ip < 5; ip++) {
                const ang = Math.random() * Math.PI * 2;
                const rf = 0.65 + Math.random() * 0.3; // blízko okraje ostrova
                const px = baseX + Math.cos(ang) * islandWidth * rf;
                const py = baseY + Math.sin(ang) * islandHeight * rf;
                const prx = 2.5 + Math.random() * 3.5;
                const pry = 2 + Math.random() * 2.5;
                ctx.fillStyle = islandPebbleColors[Math.floor(Math.random() * islandPebbleColors.length)];
                ctx.beginPath();
                ctx.ellipse(px, py, prx, pry, Math.random() * 0.6, 0, Math.PI * 2);
                ctx.fill();
            }

            // Mušle na ostrově (půlkruhy s jemným rýhováním)
            for (let is = 0; is < 3; is++) {
                // orientace mušle směrem ven z ostrova
                const ang = (Math.random() * Math.PI) + Math.PI / 2; // spíše spodní/pobřežní část
                const rf = 0.55 + Math.random() * 0.35;
                const sx = baseX + Math.cos(ang) * islandWidth * rf;
                const sy = baseY + Math.sin(ang) * islandHeight * rf;
                const r = 5 + Math.random() * 3;
                const shellGrad2 = ctx.createLinearGradient(sx, sy - r, sx, sy + r);
                shellGrad2.addColorStop(0, '#FFE9C4');
                shellGrad2.addColorStop(1, '#F7D7A6');
                ctx.fillStyle = shellGrad2;
                ctx.beginPath();
                ctx.moveTo(sx - r, sy);
                ctx.arc(sx, sy, r, Math.PI, 0);
                ctx.closePath();
                ctx.fill();
                // obrys mušle
                ctx.strokeStyle = 'rgba(160, 120, 60, 0.6)';
                ctx.lineWidth = 1;
                ctx.stroke();
                // rýhování
                ctx.strokeStyle = 'rgba(160, 120, 60, 0.45)';
                for (let k = 1; k <= 3; k++) {
                    const t = k / 3;
                    ctx.beginPath();
                    ctx.moveTo(sx, sy);
                    ctx.quadraticCurveTo(
                        sx - r * 0.8 * (1 - t), sy - r * 0.6 * t,
                        sx - r * (1 - t), sy
                    );
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(sx, sy);
                    ctx.quadraticCurveTo(
                        sx + r * 0.8 * (1 - t), sy - r * 0.6 * t,
                        sx + r * (1 - t), sy
                    );
                    ctx.stroke();
                }
            }

            // Palma na ostrově (stylizace jako emoji 🌴)
            const palmBaseX = baseX + (i % 2 === 0 ? -10 : 10);
            const palmBaseY = baseY - islandHeight + 4;
            const trunkHeight = 68 + (i % 2) * 8;
            const trunkThickness = 12;

            // Kmen – zakřivený s přechodem
            const trunkTopX = palmBaseX + (i % 2 === 0 ? 18 : -18);
            const trunkTopY = palmBaseY - trunkHeight;
            const trunkGradient = ctx.createLinearGradient(palmBaseX, palmBaseY, trunkTopX, trunkTopY);
            trunkGradient.addColorStop(0, '#8E5A2B');
            trunkGradient.addColorStop(1, '#B2763A');
            ctx.fillStyle = trunkGradient;
            ctx.beginPath();
            // levá hrana kmene (Bezier)
            ctx.moveTo(palmBaseX - trunkThickness / 2, palmBaseY);
            ctx.bezierCurveTo(
                palmBaseX - trunkThickness * 0.8, palmBaseY - trunkHeight * 0.35,
                trunkTopX - trunkThickness * 0.9, palmBaseY - trunkHeight * 0.7,
                trunkTopX - trunkThickness / 2, trunkTopY
            );
            // pravá hrana kmene (zpět dolů)
            ctx.bezierCurveTo(
                trunkTopX + trunkThickness * 0.6, palmBaseY - trunkHeight * 0.7,
                palmBaseX + trunkThickness * 0.8, palmBaseY - trunkHeight * 0.35,
                palmBaseX + trunkThickness / 2, palmBaseY
            );
            ctx.closePath();
            ctx.fill();
            // Obrys kmene pro „emoji“ kontrast
            ctx.strokeStyle = '#5C3B1E';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Prstence na kmeni
            ctx.strokeStyle = 'rgba(0,0,0,0.18)';
            ctx.lineWidth = 1.5;
            for (let ry = 0; ry < trunkHeight; ry += 10) {
                const t = ry / trunkHeight;
                const ringX = palmBaseX + (trunkTopX - palmBaseX) * t;
                const ringY = palmBaseY - ry;
                ctx.beginPath();
                ctx.moveTo(ringX - trunkThickness * 0.6, ringY);
                ctx.lineTo(ringX + trunkThickness * 0.6, ringY);
                ctx.stroke();
            }

            // Koruna – široké, jednoduché a sytě zelené listy jako emoji
            const crownX = trunkTopX;
            const crownY = trunkTopY;
            const leafFill = '#34C759';
            const leafStroke = '#1F7A3C';
            const leafAngles = [-0.9, -0.45, 0, 0.45, 0.9];
            for (let li = 0; li < leafAngles.length; li++) {
                const ang = leafAngles[li];
                const len = 52;
                ctx.fillStyle = leafFill;
                ctx.beginPath();
                ctx.moveTo(crownX, crownY);
                ctx.quadraticCurveTo(
                    crownX + Math.cos(ang) * (len * 0.55),
                    crownY + Math.sin(ang) * (len * 0.55) - 6,
                    crownX + Math.cos(ang) * len,
                    crownY + Math.sin(ang) * len
                );
                ctx.quadraticCurveTo(
                    crownX + Math.cos(ang) * (len * 0.55) + 8,
                    crownY + Math.sin(ang) * (len * 0.55) + 6,
                    crownX,
                    crownY
                );
                ctx.fill();
                // obrys listu
                ctx.strokeStyle = leafStroke;
                ctx.lineWidth = 1.2;
                ctx.stroke();
            }

            // Kokosy (2–3 kuličky u koruny)
            const coconutCount = 2 + (i % 2);
            ctx.fillStyle = '#5C3B1E';
            for (let c = 0; c < coconutCount; c++) {
                const cx = crownX - 6 + c * 8;
                const cy = crownY + 6 + (c % 2) * 4;
                ctx.beginPath();
                ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
                ctx.fill();
                // malý lesk na kokosu
                ctx.fillStyle = 'rgba(255,255,255,0.6)';
                ctx.beginPath();
                ctx.arc(cx - 1.5, cy - 1.5, 1, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#5C3B1E';
            }
        }
    } else {
        // Lesní pozadí - různé velikosti a typy stromů
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
    }
}

// Jednoduché vykreslení pozadí podle vybraného stylu
function drawBackground() {
    let ground = '#27ae60';
    let sky = '#3498db';
    let sunMoonColor = '#f1c40f';
    let isNight = false;

    switch (selectedBackground) {
        case 'desert':
            ground = '#f39c12';
            sky = '#e67e22';
            break;
        case 'snow':
            ground = '#ecf0f1';
            sky = '#bdc3c7';
            break;
        case 'night':
            ground = '#2c3e50';
            sky = '#1a252f';
            isNight = true;
            sunMoonColor = '#ecf0f1';
            break;
        case 'ocean':
            ground = '#f4d03f';
            sky = '#3498db';
            break;
        case 'forest':
        default:
            ground = '#27ae60';
            sky = '#3498db';
    }

    // Obloha + zem
    ctx.fillStyle = ground;
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height - 50);

    // Slunce / Měsíc
    ctx.fillStyle = sunMoonColor;
    ctx.beginPath();
    ctx.arc(700, 80, isNight ? 30 : 40, 0, Math.PI * 2);
    ctx.fill();

    // Hvězdy v noci
    if (isNight) {
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 80; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * (canvas.height - 100);
            const r = Math.random() * 2 + 1;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

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

// Funkce pro přepnutí fleků
function toggleWolfSpots() {
    wolfHasSpots = !wolfHasSpots;
    console.log('Fleky přepnuty:', wolfHasSpots);
    
    // Zobrazení/skrytí výběru barvy fleků
    const spotsColorSelection = document.getElementById('spotsColorSelection');
    if (spotsColorSelection) {
        spotsColorSelection.style.display = wolfHasSpots ? 'block' : 'none';
    }
    
    // Okamžité překreslení vlka
    if (!gameRunning) {
        drawInitialScene();
    }
}

// Funkce pro změnu barvy fleků
function changeWolfSpotsColor(color) {
    console.log('Měním barvu fleků na:', color);
    wolfSpotsColor = color;
    
    // Odstranění předchozího výběru
    const allSpotsButtons = document.querySelectorAll('.spots-color-btn');
    allSpotsButtons.forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Označení nově vybrané barvy
    if (event && event.target) {
        event.target.classList.add('selected');
    }
    
    console.log(`Barva fleků změněna na: ${color}`);
    
    // Okamžité překreslení vlka
    if (!gameRunning) {
        drawInitialScene();
    }
}

// Funkce pro změnu pozadí
function changeBackground(background) {
    console.log('Měním pozadí na:', background);
    selectedBackground = background;
    
    // Odstranění předchozího výběru
    const allBackgroundButtons = document.querySelectorAll('.background-btn');
    allBackgroundButtons.forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Označení nově vybraného pozadí
    if (event && event.target) {
        event.target.classList.add('selected');
    }
    
    console.log(`Pozadí změněno na: ${background}`);
    
    // Okamžité překreslení scény
    if (!gameRunning) {
        drawInitialScene();
    }
}

// Funkce pro detekci mobilního zařízení
function detectMobileDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    isMobileDevice = isMobile || isTouchDevice;
    console.log('Mobilní zařízení detekováno:', isMobileDevice);
    
    // Zobrazení/skrytí mobilního ovládání
    const mobileControls = document.getElementById('mobileControls');
    if (mobileControls) {
        if (isMobileDevice) {
            mobileControls.classList.add('visible');
        } else {
            mobileControls.classList.remove('visible');
        }
    }
    
    return isMobileDevice;
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
        ctx.fillStyle = this.hitAnimation ? '#c0392b' : wolfFurColor;
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
        ctx.fillStyle = this.hitAnimation ? '#d35400' : wolfFurColor;
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
        
        // Fleky (pokud jsou povoleny)
        if (wolfHasSpots) {
            ctx.fillStyle = wolfSpotsColor;
            
            if (this.lying) {
                // Fleky na ležícím vlkovi
                // Flek na těle
                ctx.beginPath();
                ctx.ellipse(this.x, currentY - 5, 8, 5, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Flek na hlavě
                ctx.beginPath();
                ctx.ellipse(this.x + 45, currentY - 8, 6, 4, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Flek na ocasu
                ctx.beginPath();
                ctx.ellipse(this.x - 25, currentY - 2, 7, 4, 0, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Fleky na stojícím vlkovi
                // Flek na těle
                ctx.beginPath();
                ctx.ellipse(this.x, currentY - 5, 8, 5, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Flek na hlavě
                ctx.beginPath();
                ctx.ellipse(this.x + 35, currentY - 12, 6, 4, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Flek na ocasu
                ctx.beginPath();
                ctx.ellipse(this.x - 35, currentY - 8, 7, 4, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Flek na noze
                ctx.beginPath();
                ctx.ellipse(this.x + 20, currentY + 15, 5, 3, 0, 0, Math.PI * 2);
                ctx.fill();
            }
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
    // Různé typy překážek podle prostředí
    let height;
    let obstacleType = 'spikes'; // Výchozí typ

    // Pro sněhové prostředí vytvoříme ledové překážky (standardní výška)
    if (selectedBackground === 'snow') {
        obstacleType = 'ice';
        // Led bude mít variabilní, obecně větší výšku (srovnatelnou s ostny)
        if (Math.random() < 0.5) {
            height = Math.random() * 40 + 70; // 70–110
        } else {
            height = Math.random() * 50 + 110; // 110–160
        }
    } else if (selectedBackground === 'desert') {
        // V poušti použijeme vysoké kaktusy – větší, srovnatelné s ostny
        obstacleType = 'cactus';
        height = Math.random() * 80 + 90; // vysoké kaktusy
    } else if (selectedBackground === 'ocean') {
        // V oceánu použijeme ananas jako překážku – variabilní výšky
        obstacleType = 'pineapple';
        // Preferujeme menší ananasy (snadněji přeskočitelné), občas vyšší
        if (Math.random() < 0.65) {
            height = Math.random() * 40 + 60; // 60–100
        } else {
            height = Math.random() * 30 + 90; // 90–120 (stále přeskočitelné)
        }
    } else {
        // Ostatní prostředí: ostny se standardní výškou
        height = Math.random() * 40 + 30;
    }

    obstacles.push({
        x: canvas.width,
        y: canvas.height - height,
        width: 30,
        height: height,
        passed: false,
        type: obstacleType
    });
}

// Potravy
const foods = [];
const foodInterval = 2500; // Interval mezi potravou v ms
let lastFoodTime = 0;

function createFood() {
    // Náhodně rozhodneme, jestli se objeví kost nebo maso
    const isMeat = Math.random() < 0.3; // 30% šance na maso
    
    foods.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - 200) + 150,
        radius: 10,
        collected: false,
        type: isMeat ? 'meat' : 'bone' // Typ předmětu
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
    
    // Vykreslení pozadí dle zvoleného stylu
    drawBackground();
    
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
    
    // Vykreslení pozadí dle zvoleného stylu
    drawBackground();
    
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
    
    // Slunce/Měsíc se kreslí uvnitř drawBackground()
    
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
    
    // Vykreslení pozadí podle vybraného stylu
    drawEnvironmentBackground();
    
    // Keře a podrost (pouze pro lesní pozadí)
    if (selectedBackground !== 'desert' && selectedBackground !== 'snow' && selectedBackground !== 'ocean') {
        for (let i = 0; i < 15; i++) {
            ctx.fillStyle = '#1e8449';
            ctx.beginPath();
            ctx.arc(i * 60 + 30, canvas.height - 45, 15, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Vysoká tráva (pouze pro lesní pozadí)
    if (selectedBackground !== 'desert' && selectedBackground !== 'snow' && selectedBackground !== 'ocean') {
        ctx.fillStyle = '#27ae60';
        for (let i = 0; i < 40; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 20 + 10, canvas.height - 50);
            ctx.lineTo(i * 20 + 10, canvas.height - 65 - Math.random() * 10);
            ctx.lineTo(i * 20 + 15, canvas.height - 50);
            ctx.fill();
        }
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
        
        // Vykreslení překážky podle typu
        if (obstacle.type === 'cactus') {
            // Vykreslení kaktusu
            ctx.fillStyle = '#27ae60';
            
            // Hlavní stonek kaktusu
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            
            // Boční ramena kaktusu
            ctx.fillRect(obstacle.x - 8, obstacle.y + 10, 8, 20);
            ctx.fillRect(obstacle.x + obstacle.width, obstacle.y + 5, 8, 15);
            
            // Trny na kaktusu
            ctx.fillStyle = '#2c3e50';
            for (let j = 0; j < 3; j++) {
                ctx.fillRect(obstacle.x + 2, obstacle.y + 5 + j * 8, 2, 2);
                ctx.fillRect(obstacle.x + obstacle.width - 4, obstacle.y + 5 + j * 8, 2, 2);
            }
        } else if (obstacle.type === 'ice') {
            // Vykreslení ledové překážky pro sněhové prostředí
            // Základna ledu
            ctx.fillStyle = '#87CEEB'; // Světle modrá
            ctx.fillRect(obstacle.x, obstacle.y + obstacle.height - 15, obstacle.width, 15);
            
            // Ledové krystaly - průhledné s bílým leskem
            ctx.fillStyle = '#E0F6FF'; // Velmi světle modrá
            const crystalCount = 4;
            const crystalWidth = obstacle.width / crystalCount;
            
            for (let j = 0; j < crystalCount; j++) {
                // Ledový krystal ve tvaru diamantu
                ctx.beginPath();
                ctx.moveTo(obstacle.x + j * crystalWidth + crystalWidth / 2, obstacle.y + obstacle.height - 15);
                ctx.lineTo(obstacle.x + j * crystalWidth, obstacle.y + obstacle.height - 40);
                ctx.lineTo(obstacle.x + j * crystalWidth + crystalWidth / 2, obstacle.y + obstacle.height - 65);
                ctx.lineTo(obstacle.x + (j + 1) * crystalWidth, obstacle.y + obstacle.height - 40);
                ctx.closePath();
                ctx.fill();
                
                // Bílý lesk na krystalu
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.moveTo(obstacle.x + j * crystalWidth + crystalWidth / 2, obstacle.y + obstacle.height - 15);
                ctx.lineTo(obstacle.x + j * crystalWidth + crystalWidth / 4, obstacle.y + obstacle.height - 30);
                ctx.lineTo(obstacle.x + j * crystalWidth + crystalWidth / 2, obstacle.y + obstacle.height - 45);
                ctx.lineTo(obstacle.x + j * crystalWidth + crystalWidth * 3/4, obstacle.y + obstacle.height - 30);
                ctx.closePath();
                ctx.fill();
                
                // Vrátíme původní barvu
                ctx.fillStyle = '#E0F6FF';
            }
            
            // Ledové odlesky
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            for (let k = 0; k < 3; k++) {
                const sparkleX = obstacle.x + Math.random() * obstacle.width;
                const sparkleY = obstacle.y + obstacle.height - 30 - Math.random() * 20;
                ctx.beginPath();
                ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (obstacle.type === 'pineapple') {
            // Vykreslení ananasové překážky pro oceánské prostředí
            // Tělo ananasu
            ctx.fillStyle = '#F4C542';
            ctx.beginPath();
            ctx.ellipse(
                obstacle.x + obstacle.width / 2,
                obstacle.y + obstacle.height / 2,
                obstacle.width * 0.5,
                obstacle.height * 0.45,
                0, 0, Math.PI * 2
            );
            ctx.fill();

            // Vzor mřížky na ananasu
            ctx.strokeStyle = '#C6922E';
            ctx.lineWidth = 2;
            for (let dy = -obstacle.height * 0.4; dy <= obstacle.height * 0.4; dy += 12) {
                ctx.beginPath();
                ctx.moveTo(obstacle.x, obstacle.y + obstacle.height / 2 + dy);
                ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height / 2 + dy);
                ctx.stroke();
            }
            for (let dx = obstacle.x; dx <= obstacle.x + obstacle.width; dx += 10) {
                ctx.beginPath();
                ctx.moveTo(dx, obstacle.y + obstacle.height * 0.2);
                ctx.lineTo(dx, obstacle.y + obstacle.height - 10);
                ctx.stroke();
            }

            // Zelené listy nahoře
            const crownX = obstacle.x + obstacle.width / 2;
            const crownY = obstacle.y + 10;
            ctx.fillStyle = '#2ECC71';
            for (let li = 0; li < 5; li++) {
                ctx.beginPath();
                ctx.moveTo(crownX, crownY);
                ctx.quadraticCurveTo(
                    crownX - 10 - li * 2,
                    crownY - 20 - li * 6,
                    crownX - 25 - li * 3,
                    crownY - 5
                );
                ctx.quadraticCurveTo(
                    crownX - 6 - li * 2,
                    crownY - 8 - li * 4,
                    crownX,
                    crownY
                );
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(crownX, crownY);
                ctx.quadraticCurveTo(
                    crownX + 10 + li * 2,
                    crownY - 20 - li * 6,
                    crownX + 25 + li * 3,
                    crownY - 5
                );
                ctx.quadraticCurveTo(
                    crownX + 6 + li * 2,
                    crownY - 8 - li * 4,
                    crownX,
                    crownY
                );
                ctx.fill();
            }
        } else {
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
        
        // Vykreslení potravy podle typu
        if (food.type === 'meat') {
            // Vykreslení masa
            ctx.fillStyle = '#e74c3c'; // Červená barva masa
            
            // Hlavní část masa (ovál)
            ctx.beginPath();
            ctx.ellipse(food.x, food.y, 12, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Žilky na masu
            ctx.strokeStyle = '#8b0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(food.x - 8, food.y - 3);
            ctx.lineTo(food.x + 8, food.y + 3);
            ctx.moveTo(food.x - 6, food.y + 2);
            ctx.lineTo(food.x + 6, food.y - 2);
            ctx.stroke();
            
            // Bílá tečka (tuk)
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(food.x - 3, food.y - 2, 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Vykreslení kosti
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
        }
        
        // Posun potravy
        food.x -= 3;
        
        // Kontrola sběru potravy
        if (checkFoodCollision(wolf, food)) {
            food.collected = true;
            
            if (food.type === 'meat') {
                // Maso regeneruje životy
                if (lives < 3) {
                    lives++;
                    updateHearts();
                    console.log(`Sebráno maso! Životy: ${lives}`);
                }
                score += 10; // Maso dává více bodů
            } else {
                // Kost dává jen body
                score += 5;
            }
            
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
    
    // Fleky se zachovají (ne resetují se)
    
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

// Event listenery pro barevná tlačítka a fleky
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
    
    // Inicializace fleků
    initializeSpotsOptions();
}

// Inicializace možností fleků
function initializeSpotsOptions() {
    console.log('Inicializuji možnosti fleků...');
    
    // Event listener pro checkbox fleků
    const spotsToggle = document.getElementById('spotsToggle');
    if (spotsToggle) {
        spotsToggle.addEventListener('change', toggleWolfSpots);
        console.log('Checkbox fleků inicializován');
    }
    
    // Event listenery pro barvy fleků
    const spotsColorButtons = document.querySelectorAll('.spots-color-btn');
    spotsColorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            console.log('Kliknuto na barvu fleků:', color);
            changeWolfSpotsColor(color);
        });
    });
    
    // Označení výchozí barvy fleků
    const defaultSpotsButton = document.querySelector('.spots-color-btn[data-color="#8B4513"]');
    if (defaultSpotsButton) {
        defaultSpotsButton.classList.add('selected');
        console.log('Výchozí barva fleků označena');
    }
    
    console.log('Možnosti fleků inicializovány!');
    
    // Inicializace pozadí
    initializeBackgroundOptions();
}

// Inicializace možností pozadí
function initializeBackgroundOptions() {
    console.log('Inicializuji možnosti pozadí...');
    
    // Event listenery pro pozadí
    const backgroundButtons = document.querySelectorAll('.background-btn');
    backgroundButtons.forEach(button => {
        button.addEventListener('click', function() {
            const background = this.getAttribute('data-background');
            console.log('Kliknuto na pozadí:', background);
            changeBackground(background);
        });
    });
    
    // Označení výchozího pozadí
    const defaultBackgroundButton = document.querySelector('.background-btn[data-background="forest"]');
    if (defaultBackgroundButton) {
        defaultBackgroundButton.classList.add('selected');
        console.log('Výchozí pozadí označeno');
    }
    
    console.log('Možnosti pozadí inicializovány!');
    
    // Inicializace mobilního ovládání
    initializeMobileControls();
}

// Inicializace mobilního ovládání
function initializeMobileControls() {
    console.log('Inicializuji mobilní ovládání...');
    
    // Detekce mobilního zařízení
    detectMobileDevice();
    
    // Event listenery pro mobilní tlačítka
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const jumpBtn = document.getElementById('jumpBtn');
    const downBtn = document.getElementById('downBtn');
    
    if (leftBtn) {
        leftBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            keys.ArrowLeft = true;
        });
        leftBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            keys.ArrowLeft = false;
        });
        leftBtn.addEventListener('mousedown', function(e) {
            e.preventDefault();
            keys.ArrowLeft = true;
        });
        leftBtn.addEventListener('mouseup', function(e) {
            e.preventDefault();
            keys.ArrowLeft = false;
        });
    }
    
    if (rightBtn) {
        rightBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            keys.ArrowRight = true;
        });
        rightBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            keys.ArrowRight = false;
        });
        rightBtn.addEventListener('mousedown', function(e) {
            e.preventDefault();
            keys.ArrowRight = true;
        });
        rightBtn.addEventListener('mouseup', function(e) {
            e.preventDefault();
            keys.ArrowRight = false;
        });
    }
    
    if (jumpBtn) {
        jumpBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            if (gameRunning) wolf.jump();
        });
        jumpBtn.addEventListener('mousedown', function(e) {
            e.preventDefault();
            if (gameRunning) wolf.jump();
        });
    }
    
    if (downBtn) {
        downBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            keys.ArrowDown = true;
        });
        downBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            keys.ArrowDown = false;
        });
        downBtn.addEventListener('mousedown', function(e) {
            e.preventDefault();
            keys.ArrowDown = true;
        });
        downBtn.addEventListener('mouseup', function(e) {
            e.preventDefault();
            keys.ArrowDown = false;
        });
    }
    
    console.log('Mobilní ovládání inicializováno!');
}

// Spustíme inicializaci až po načtení DOMu
document.addEventListener('DOMContentLoaded', function() {
    // Kontrola, zda canvas existuje
    if (!canvas || !ctx) {
        console.error('Canvas nebyl nalezen nebo není podporován!');
        return;
    }
    
    // Inicializace barevných tlačítek
    initializeColorButtons();
    
    // Inicializace i18n
    if (typeof i18n !== 'undefined') {
        i18n.init();
    }
    
    // Vykreslení úvodní scény
    drawInitialScene();
});

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

// Event listener pro změnu jazyka
document.addEventListener('languageChanged', function() {
    redrawSceneForLanguage();
});

// Event listener pro změnu velikosti okna
window.addEventListener('resize', function() {
    detectMobileDevice();
});

// Úvodní vykreslení scény
function drawInitialScene() {
    // Vyčištění canvasu
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Vykreslení pozadí dle zvoleného stylu
    drawBackground();
    
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
    
    // Vykreslení pozadí podle vybraného stylu
    drawEnvironmentBackground();
    
    // Keře a podrost (pouze pro lesní pozadí)
    if (selectedBackground !== 'desert' && selectedBackground !== 'snow' && selectedBackground !== 'ocean') {
        for (let i = 0; i < 15; i++) {
            ctx.fillStyle = '#1e8449';
            ctx.beginPath();
            ctx.arc(i * 60 + 30, canvas.height - 45, 15, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Vysoká tráva (pouze pro lesní pozadí)
    if (selectedBackground !== 'desert' && selectedBackground !== 'snow' && selectedBackground !== 'ocean') {
        ctx.fillStyle = '#27ae60';
        for (let i = 0; i < 40; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 20 + 10, canvas.height - 50);
            ctx.lineTo(i * 20 + 10, canvas.height - 65 - Math.random() * 10);
            ctx.lineTo(i * 20 + 15, canvas.height - 50);
            ctx.fill();
        }
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
    
    // Ukázková kost a maso
    const boneX = canvas.width / 2 - 40;
    const boneY = canvas.height / 2 + 70;
    const meatX = canvas.width / 2 + 40;
    const meatY = canvas.height / 2 + 70;
    
    // Kost
    ctx.fillStyle = '#f5f5f5';
    ctx.beginPath();
    ctx.rect(boneX - 15, boneY - 4, 30, 8);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(boneX - 15, boneY, 7, 0, Math.PI * 2);
    ctx.arc(boneX + 15, boneY, 7, 0, Math.PI * 2);
    ctx.fill();
    
    // Maso
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.ellipse(meatX, meatY, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8b0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(meatX - 8, meatY - 3);
    ctx.lineTo(meatX + 8, meatY + 3);
    ctx.moveTo(meatX - 6, meatY + 2);
    ctx.lineTo(meatX + 6, meatY - 2);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(meatX - 3, meatY - 2, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Popisky
    ctx.fillStyle = '#ecf0f1';
    ctx.font = '14px Arial';
    ctx.fillText('Kosti = body', boneX, boneY + 25);
    ctx.fillText('Maso = životy', meatX, meatY + 25);
    
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