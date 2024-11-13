document.addEventListener('DOMContentLoaded', () => {
    const text = document.querySelector('.text');
    const bonus = document.getElementById('bonus');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const highScoreDisplay = document.getElementById('high-score');
    const freezeBtn = document.getElementById('freeze-btn');
    const clickSound = document.getElementById('click-sound');
    const loseLifeSound = document.getElementById('lose-life-sound');
    const bonusSound = document.getElementById('bonus-sound');
    
    let score = 0;
    let lives = 3;
    let highScore = localStorage.getItem('highScore') || 0;
    let speed = 2000;
    let countdown = 3;
    let countdownInterval;
    let moveInterval;
    let freezeAvailable = true;
    let freezeCooldown = 10;
    let bonusInterval;

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
                loseLife();
            }
        }, 1000);
    }

    function loseLife() {
        lives--;
        livesDisplay.textContent = `Vidas: ${lives}`;
        loseLifeSound.play();
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
        freezeAvailable = true;
        scoreDisplay.textContent = `Puntos: ${score}`;
        livesDisplay.textContent = `Vidas: ${lives}`;
        freezeBtn.textContent = 'Congelar (Recarga en: 0s)';
        clearInterval(bonusInterval);
        bonus.style.display = 'none';
        startGame();
    }

    function startGame() {
        moveText();
        startCountdown();
        clearInterval(moveInterval);
        moveInterval = setInterval(moveText, speed);

        // Mostrar bono aleatorio cada 10 segundos
        bonusInterval = setInterval(showBonus, 10000);
    }

    // Evento de clic en el texto para incrementar el puntaje
    text.addEventListener('click', () => {
        score++;
        scoreDisplay.textContent = `Puntos: ${score}`;
        clickSound.play();
        
        // Aumenta la velocidad después de cada clic y reduce el intervalo de movimiento
        speed *= 0.95;
        clearInterval(moveInterval);
        moveInterval = setInterval(moveText, speed);

        moveText();
        startCountdown();

        // Incrementa la dificultad después de cada 10 puntos
        if (score % 10 === 0) {
            increaseDifficulty();
        }
    });

    // Evento de clic en el bono para puntos extra y sonido
    bonus.addEventListener('click', () => {
        score += 5; // Bono de 5 puntos
        scoreDisplay.textContent = `Puntos: ${score}`;
        bonusSound.play();
        bonus.style.display = 'none';
    });

    // Botón de congelación para pausar el movimiento del texto
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
                    freezeBtn.textContent = 'Congelar (Disponible)';
                    moveInterval = setInterval(moveText, speed);
                }
            }, 1000);
        }
    });

    function increaseDifficulty() {
        speed *= 0.9; // Reduce el intervalo para acelerar el movimiento
        text.style.fontSize = `${3 - score * 0.02}rem`; // Reduce el tamaño del texto
        clearInterval(moveInterval);
        moveInterval = setInterval(moveText, speed);
    }

    // Inicia el juego al cargar la página
    startGame();
});

