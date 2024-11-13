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

    highScoreDisplay.textContent = `Mejor Puntuación: ${highScore}`;

    function moveText() {
        const x = Math.random() * (window.innerWidth - text.offsetWidth);
        const y = Math.random() * (window.innerHeight - text.offsetHeight);
        text.style.transform = `translate(${x}px, ${y}px)`;
    }

    function showBonus() {
        const x = Math.random() * (window.innerWidth - bonus.offsetWidth);
        const y = Math.random() * (window.innerHeight - bonus.offsetHeight);
        bonus.style.transform = `translate(${x}px, ${y}px)`;
        bonus.style.display = 'block';

        setTimeout(() => bonus.style.display = 'none', 3000);
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
        startGame();
    }

    function startGame() {
        moveText();
        startCountdown();
        clearInterval(moveInterval);
        moveInterval = setInterval(moveText, speed);
        setInterval(showBonus, 10000);
    }

    text.addEventListener('click', () => {
        score += multiplier; // Aplica el multiplicador
        consecutiveHits++;
        if (consecutiveHits % 5 === 0) multiplier++; // Incrementa el multiplicador cada 5 aciertos consecutivos
        scoreDisplay.textContent = `Puntos: ${score}`;
        clickSound.play();
        
        speed *= 0.95;
        clearInterval(moveInterval);
        moveInterval = setInterval(moveText, speed);

        moveText();
        startCountdown();
    });

    bonus.addEventListener('click', () => {
        score += 5 * multiplier; // Aplica el multiplicador al bono
        scoreDisplay.textContent = `Puntos: ${score}`;
        bonusSound.play();
        bonus.style.display = 'none';
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


