// Internationalization configuration for Wolves Game
const i18n = {
    // Current language (default: Czech)
    currentLanguage: 'cs',
    
    // Available languages
    languages: {
        cs: 'Čeština',
        en: 'English',
        de: 'Deutsch',
        es: 'Español',
        fr: 'Français'
    },
    
    // Translations
    translations: {
        cs: {
            // Game title and headers
            title: 'VLCI',
            welcome: 'AHOJ VLKU',
            
            // Stats
            score: 'Skóre',
            lives: 'Životy',
            
            // Wolf customization
            selectFurColor: 'Vyber barvu srsti vlka:',
            addSpots: 'Přidat fleky vlkovi',
            selectSpotsColor: 'Vyber barvu fleků:',
            selectBackground: 'Vyber pozadí:',
            forest: 'Les',
            desert: 'Poušť',
            snow: 'SNÍCH',
            night: 'NOC',
            ocean: 'MOŘE',
            
            // Color names
            gray: 'Šedá',
            brown: 'Hnědá',
            green: 'Zelená',
            red: 'Červená',
            blue: 'Modrá',
            yellow: 'Žlutá',
            pink: 'Růžová',
            purple: 'Fialová',
            white: 'Bílá',
            black: 'Černá',
            
            // Controls
            start: 'Start',
            restart: 'Restart',
            instructions: 'Ovládání: Šipkami (← →) pohybujete vlkem, mezerníkem skáčete',
            mobileInstructions: 'Ovládání: Šipkami (← →) pohybujete vlkem, mezerníkem skáčete',
            
            // Game messages
            gameOver: 'KONEC HRY',
            finalScore: 'Konečné skóre',
            youWon: 'VYHRÁL JSI!',
            pressStart: 'Stiskněte "Start" pro zahájení hry',
            collectBones: 'Sbírej kosti pro body!',
            
            // Game elements
            meat: 'Maso',
            
            // Language selector
            selectLanguage: 'Vyber jazyk:'
        },
        
        en: {
            // Game title and headers
            title: 'WOLVES',
            welcome: 'HELLO WOLF',
            
            // Stats
            score: 'Score',
            lives: 'Lives',
            
            // Wolf customization
            selectFurColor: 'Select wolf fur color:',
            addSpots: 'Add spots to wolf',
            selectSpotsColor: 'Select spots color:',
            selectBackground: 'Select background:',
            forest: 'Forest',
            desert: 'Desert',
            snow: 'Snow',
            night: 'Night',
            ocean: 'Ocean',
            
            // Color names
            gray: 'Gray',
            brown: 'Brown',
            green: 'Green',
            red: 'Red',
            blue: 'Blue',
            yellow: 'Yellow',
            pink: 'Pink',
            purple: 'Purple',
            white: 'White',
            black: 'Black',
            
            // Controls
            start: 'Start',
            restart: 'Restart',
            instructions: 'Controls: Arrow keys (← →) move the wolf, Spacebar to jump',
            mobileInstructions: 'Controls: Arrow keys (← →) move the wolf, Spacebar to jump',
            
            // Game messages
            gameOver: 'GAME OVER',
            finalScore: 'Final Score',
            youWon: 'YOU WON!',
            pressStart: 'Press "Start" to begin the game',
            collectBones: 'Collect bones for points!',
            
            // Game elements
            meat: 'Meat',
            
            // Language selector
            selectLanguage: 'Select language:'
        },
        
        de: {
            // Game title and headers
            title: 'WÖLFE',
            welcome: 'HALLO WOLF',
            
            // Stats
            score: 'Punkte',
            lives: 'Leben',
            
            // Wolf customization
            selectFurColor: 'Wähle die Fellfarbe des Wolfs:',
            addSpots: 'Flecken zum Wolf hinzufügen',
            selectSpotsColor: 'Wähle die Fleckenfarbe:',
            selectBackground: 'Wähle den Hintergrund:',
            forest: 'Wald',
            desert: 'Wüste',
            snow: 'Schnee',
            night: 'Nacht',
            ocean: 'Ozean',
            
            // Color names
            gray: 'Grau',
            brown: 'Braun',
            green: 'Grün',
            red: 'Rot',
            blue: 'Blau',
            yellow: 'Gelb',
            pink: 'Rosa',
            purple: 'Lila',
            white: 'Weiß',
            black: 'Schwarz',
            
            // Controls
            start: 'Start',
            restart: 'Neustart',
            instructions: 'Steuerung: Pfeiltasten (← →) bewegen den Wolf, Leertaste zum Springen',
            mobileInstructions: 'Steuerung: Pfeiltasten (← →) bewegen den Wolf, Leertaste zum Springen',
            
            // Game messages
            gameOver: 'SPIEL VORBEI',
            finalScore: 'Endpunktzahl',
            youWon: 'DU HAST GEWONNEN!',
            pressStart: 'Drücke "Start" um das Spiel zu beginnen',
            collectBones: 'Sammle Knochen für Punkte!',
            
            // Game elements
            meat: 'Fleisch',
            
            // Language selector
            selectLanguage: 'Sprache wählen:'
        },
        
        es: {
            // Game title and headers
            title: 'LOBOS',
            welcome: 'HOLA LOBO',
            
            // Stats
            score: 'Puntuación',
            lives: 'Vidas',
            
            // Wolf customization
            selectFurColor: 'Selecciona el color del pelaje del lobo:',
            addSpots: 'Añadir manchas al lobo',
            selectSpotsColor: 'Selecciona el color de las manchas:',
            selectBackground: 'Selecciona el fondo:',
            forest: 'Bosque',
            desert: 'Desierto',
            snow: 'Nieve',
            night: 'Noche',
            ocean: 'Océano',
            
            // Color names
            gray: 'Gris',
            brown: 'Marrón',
            green: 'Verde',
            red: 'Rojo',
            blue: 'Azul',
            yellow: 'Amarillo',
            pink: 'Rosa',
            purple: 'Morado',
            white: 'Blanco',
            black: 'Negro',
            
            // Controls
            start: 'Iniciar',
            restart: 'Reiniciar',
            instructions: 'Controles: Teclas de flecha (← →) mueven al lobo, Barra espaciadora para saltar',
            mobileInstructions: 'Controles: Teclas de flecha (← →) mueven al lobo, Barra espaciadora para saltar',
            
            // Game messages
            gameOver: 'FIN DEL JUEGO',
            finalScore: 'Puntuación Final',
            youWon: '¡HAS GANADO!',
            pressStart: 'Presiona "Iniciar" para comenzar el juego',
            collectBones: '¡Recoge huesos para puntos!',
            
            // Game elements
            meat: 'Carne',
            
            // Language selector
            selectLanguage: 'Selecciona idioma:'
        },
        
        fr: {
            // Game title and headers
            title: 'LOUPS',
            welcome: 'BONJOUR LOUP',
            
            // Stats
            score: 'Score',
            lives: 'Vies',
            
            // Wolf customization
            selectFurColor: 'Sélectionne la couleur de la fourrure du loup:',
            addSpots: 'Ajouter des taches au loup',
            selectSpotsColor: 'Sélectionne la couleur des taches:',
            selectBackground: 'Sélectionne l\'arrière-plan:',
            forest: 'Forêt',
            desert: 'Désert',
            snow: 'Neige',
            night: 'Nuit',
            ocean: 'Océan',
            
            // Color names
            gray: 'Gris',
            brown: 'Marron',
            green: 'Vert',
            red: 'Rouge',
            blue: 'Bleu',
            yellow: 'Jaune',
            pink: 'Rose',
            purple: 'Violet',
            white: 'Blanc',
            black: 'Noir',
            
            // Controls
            start: 'Commencer',
            restart: 'Recommencer',
            instructions: 'Contrôles: Flèches (← →) déplacent le loup, Barre d\'espace pour sauter',
            mobileInstructions: 'Contrôles: Flèches (← →) déplacent le loup, Barre d\'espace pour sauter',
            
            // Game messages
            gameOver: 'FIN DE PARTIE',
            finalScore: 'Score Final',
            youWon: 'TU AS GAGNÉ!',
            pressStart: 'Appuie sur "Commencer" pour commencer le jeu',
            collectBones: 'Ramasse les os pour des points!',
            
            // Game elements
            meat: 'Viande',
            
            // Language selector
            selectLanguage: 'Sélectionne la langue:'
        }
    },
    
    // Get translation for current key
    t: function(key) {
        const currentTranslations = this.translations[this.currentLanguage];
        if (!currentTranslations) {
            console.warn(`No translations found for language: ${this.currentLanguage}`);
            return key;
        }
        
        const translation = currentTranslations[key];
        if (!translation) {
            console.warn(`Translation missing for key: ${key} in language: ${this.currentLanguage}`);
            return key;
        }
        
        return translation;
    },
    
    // Change language
    changeLanguage: function(languageCode) {
        if (this.translations[languageCode]) {
            this.currentLanguage = languageCode;
            this.updatePageLanguage();
            this.updateAllTexts();
            
            // Save language preference
            localStorage.setItem('wolvesGameLanguage', languageCode);
            
            // Update HTML lang attribute
            document.documentElement.lang = languageCode;
            
            // Dispatch custom event for language change
            const event = new CustomEvent('languageChanged', {
                detail: { language: languageCode }
            });
            document.dispatchEvent(event);
        }
    },
    
    // Update page language attribute
    updatePageLanguage: function() {
        document.documentElement.lang = this.currentLanguage;
    },
    
    // Update all texts on the page
    updateAllTexts: function() {
        // Update title
        document.title = this.t('title');
        
        // Update main heading
        const mainHeading = document.querySelector('h1');
        if (mainHeading) mainHeading.textContent = this.t('welcome');
        
        // Update stats - safer approach that preserves HTML structure
        const scoreLabel = document.querySelector('.score');
        if (scoreLabel) {
            const scoreSpan = scoreLabel.querySelector('#score');
            if (scoreSpan) {
                // Update only the text before the span
                const textNode = scoreLabel.firstChild;
                if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                    textNode.textContent = `${this.t('score')}: `;
                }
            }
        }
        
        const livesLabel = document.querySelector('.lives');
        if (livesLabel) {
            const heartsSpan = livesLabel.querySelector('#hearts');
            if (heartsSpan) {
                // Update only the text before the span
                const textNode = livesLabel.firstChild;
                if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                    textNode.textContent = `${this.t('lives')}: `;
                }
            }
        }
        
        // Update wolf customization
        const wolfCustomizationHeading = document.querySelector('.wolf-customization h3');
        if (wolfCustomizationHeading) wolfCustomizationHeading.textContent = this.t('selectFurColor');
        
        // Update color button labels
        const colorButtons = document.querySelectorAll('.color-btn');
        colorButtons.forEach(button => {
            const color = button.getAttribute('data-color');
            const colorKey = this.getColorKey(color);
            if (colorKey) {
                button.textContent = this.t(colorKey);
            }
        });
        
        // Update spots options
        const spotsToggleSpan = document.querySelector('.spots-toggle span');
        if (spotsToggleSpan) spotsToggleSpan.textContent = this.t('addSpots');
        
        const spotsColorHeading = document.querySelector('.spots-color-selection h4');
        if (spotsColorHeading) spotsColorHeading.textContent = this.t('selectSpotsColor');
        
        // Update background options
        const backgroundHeading = document.querySelector('.background-options h4');
        if (backgroundHeading) backgroundHeading.textContent = this.t('selectBackground');
        
        const backgroundButtons = document.querySelectorAll('.background-btn');
        backgroundButtons.forEach(button => {
            const background = button.getAttribute('data-background');
            const backgroundKey = this.getBackgroundKey(background);
            if (backgroundKey) {
                button.textContent = this.t(backgroundKey);
            }
        });
        
        // Update controls
        const startButton = document.getElementById('startButton');
        if (startButton) {
            if (startButton.textContent === 'Restart' || startButton.textContent === 'Restart') {
                startButton.textContent = this.t('restart');
            } else {
                startButton.textContent = this.t('start');
            }
        }
        
        const instructions = document.querySelector('.instructions');
        if (instructions) instructions.textContent = this.t('instructions');
        
        // Update language selector
        const languageSelector = document.getElementById('languageSelector');
        if (languageSelector) {
            languageSelector.innerHTML = `<option value="">${this.t('selectLanguage')}</option>`;
            Object.entries(this.languages).forEach(([code, name]) => {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = name;
                if (code === this.currentLanguage) {
                    option.selected = true;
                }
                languageSelector.appendChild(option);
            });
        }
    },
    
    // Get color key for translation
    getColorKey: function(color) {
        const colorMap = {
            '#7f8c8d': 'gray',
            '#8B4513': 'brown',
            '#2E8B57': 'green',
            '#FF6B6B': 'red',
            '#4ECDC4': 'blue',
            '#FFE66D': 'yellow',
            '#FF69B4': 'pink',
            '#9B59B6': 'purple',
            '#FFFFFF': 'white',
            '#000000': 'black'
        };
        return colorMap[color];
    },
    
    // Get background key for translation
    getBackgroundKey: function(background) {
        const backgroundMap = {
            'forest': 'forest',
            'desert': 'desert',
            'snow': 'snow',
            'night': 'night',
            'ocean': 'ocean'
        };
        return backgroundMap[background];
    },
    
    // Initialize i18n
    init: function() {
        // Load saved language preference
        const savedLanguage = localStorage.getItem('wolvesGameLanguage');
        if (savedLanguage && this.translations[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        }
        
        // Update page language
        this.updatePageLanguage();
        
        // Update all texts
        this.updateAllTexts();
        
        // Set up language selector event listener
        const languageSelector = document.getElementById('languageSelector');
        if (languageSelector) {
            languageSelector.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = i18n;
}
