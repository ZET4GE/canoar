document.addEventListener('DOMContentLoaded', () => {
    const text = document.querySelector('.text');
    const bonus = document.getElementById('bonus');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const highScoreDisplay = document.getElementById('high-score');
    const freezeBtn = document.getElementById('freeze-btn');
    const shieldBtn = document.getElementById('shield-btn');
    const clickSound = document.getElementById('click-sound');
    const loseLifeSound = document.getElementById('lose-life-sound');
    const bonusSound = document.getElementById('bonus-sound');
    const shieldSound = document.getElementById('shield-sound');
    
    let score = 0;
    let lives = 3;
    let highScore = localStorage.getItem('highScore') || 0;
    let speed = 2000;
    let countdown = 3;
    let countdownInterval;
    let moveInterval;
    let freezeAvailable = true;
    let shieldAvailable = true;
    let freezeCooldown = 10;
    let shieldCooldown = 15;
    let multiplier = 1;
    let consecutiveHits = 0;
    let eventActive = false;

    highScoreDisplay.textContent = `Mejor Puntuación: ${highScore}`;

    function moveText() {
        const x = Math.random() * (window.innerWidth - text.offsetWidth);
        const y = Math.random() * (window.innerHeight - text.offsetHeight);
        text.style.transform = `translate(${x}px, ${y}px)`;
    }

    function startCountdown() {
        countdown = 3;
        clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                clearInterval(moveInterval);
                if (shieldAvailable) {
                    activateShield();
                } else {
                    loseLife();
                }
            }
        }, 1000);
    }

    function activateShield() {
        shieldAvailable = false;
        shieldSound.play();
        shieldBtn.classList.add('shield-active');
        shieldBtn.textContent = 'Escudo Activo';
        setTimeout(() => {
            shieldBtn.classList.remove('shield-active');
            shieldBtn.textContent = 'Escudo (Recarga en: 0s)';
            let cooldown = shieldCooldown;
            const shieldInterval = setInterval(() => {
                shieldBtn.textContent = `Escudo (Recarga en: ${cooldown--}s)`;
                if (cooldown < 0) {
                    clearInterval(shieldInterval);
                    shieldAvailable = true;
                    shieldBtn.textContent = 'Escudo Disponible';
                }
            }, 1000);
        }, 2000);
    }

    function loseLife() {
        lives--;
        livesDisplay.textContent = `Vidas: ${lives}`;
        loseLifeSound.play();
        multiplier = 1; // Restablece el multiplicador en cada vida perdida
        consecutiveHits = 0;
        if (lives <= 0) {
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);
                highScoreDisplay.textContent = `Mejor Puntuación: ${highScore}`;
            }
            alert("¡Perdiste! Puntuación final: " + score);
            resetGame();
        } else {
            startGame();
        }
    }

    function resetGame() {
        score = 0;
        lives = 3;
        speed = 2000;
        multiplier = 1;
        consecutiveHits = 0;
        freezeAvailable = true;
        shieldAvailable = true;
        scoreDisplay.textContent = `Puntos: ${score}`;
        livesDisplay.textContent = `Vidas: ${lives}`;
        freezeBtn.textContent = 'Congelar (Recarga en: 0s)';
        shieldBtn.textContent = 'Escudo (Recarga en: 0s)';
        clearInterval(moveInterval);
        startGame();
    }

    function startGame() {
        moveText();
        startCountdown();
        clearInterval(moveInterval);
        moveInterval = setInterval(moveText, speed);
        
        setInterval(() => {
            if (!eventActive) triggerRandomEvent();
        }, 15000); // Lanza un evento aleatorio cada 15 segundos
    }

    function triggerRandomEvent() {
        eventActive = true;
        const eventType = Math.floor(Math.random() * 3); // Tres tipos de eventos aleatorios

        switch (eventType) {
            case 0: // Lluvia de puntos
                text.style.color = "#ffff00";
                alert("¡Lluvia de Puntos! Haz clic rápido para obtener puntos extra");
                let pointRainInterval = setInterval(() => {
                    score += 1 * multiplier;
                    scoreDisplay.textContent = `Puntos: ${score}`;
                }, 500);
                setTimeout(() => {
                    clearInterval(pointRainInterval);
                    text.style.color = "#ff00ff";
                    eventActive = false;
                }, 5000);
                break;
            
            case 1: // Velocidad variable
                alert("¡Velocidad Variable! El texto cambiará de velocidad");
                speed = Math.random() * 1500 + 500; // Cambia la velocidad aleatoriamente
                clearInterval(moveInterval);
                moveInterval = setInterval(moveText, speed);
                setTimeout(() => {
                    speed = 2000; // Restablece la velocidad normal
                    clearInterval(moveInterval);
                    moveInterval = setInterval(moveText, speed);
                    eventActive = false;
                }, 5000);
                break;

            case 2: // Inversión de controles
                alert("¡Inversión de Movimiento! El texto se moverá de forma impredecible");
                moveText = function () { // Invierte el movimiento del texto
                    const x = -Math.random() * (window.innerWidth - text.offsetWidth);
                    const y = -Math.random() * (window.innerHeight - text.offsetHeight);
                    text.style.transform = `translate(${x}px, ${y}px)`;
                };
                setTimeout(() => {
                    moveText = function () {
                        const x = Math.random() * (window.innerWidth - text.offsetWidth);
                        const y = Math.random() * (window.innerHeight - text.offsetHeight);
                        text.style.transform = `translate(${x}px, ${y}px)`;
                    };
                    eventActive = false;
                }, 5000);
                break;
        }
    }

    text.addEventListener('click', () => {
        score += multiplier;
        consecutiveHits++;
        if (consecutiveHits % 5 === 0) multiplier++;
        scoreDisplay.textContent = `Puntos: ${score}`;
        clickSound.play();
        
        speed *= 0.95;
        clearInterval(moveInterval);
        moveInterval = setInterval(moveText, speed);

        moveText();
        startCountdown();
    });

    freezeBtn.addEventListener('click', () => {
        if (freezeAvailable) {
            clearInterval(moveInterval);
            freezeAvailable = false;
            let cooldown = freezeCooldown;
            const freezeInterval = setInterval(() => {
                freezeBtn.textContent = `Congelar (Recarga en: ${cooldown--}s)`;
                if (cooldown < 0) {
                    clearInterval(freezeInterval);
                    freezeAvailable = true;
                    freezeBtn.textContent = 'Congelar Disponible';
                    moveInterval = setInterval(moveText, speed);
                }
            }, 1000);
        }
    });

    startGame();
});

