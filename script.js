document.addEventListener('DOMContentLoaded', () => {
    const text = document.querySelector('.text');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const clickSound = document.getElementById('click-sound');
    const loseLifeSound = document.getElementById('lose-life-sound');
    
    let score = 0;
    let lives = 3;
    let initialSpeed = 2000; // Velocidad inicial en ms
    let speed = initialSpeed;
    let countdown = 3;
    let countdownInterval;
    let moveInterval;
    let level = 1;
    let consecutiveClicks = 0; // Para el multiplicador

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
                loseLife();
            }
        }, 1000);
    }

    function loseLife() {
        lives--;
        livesDisplay.textContent = `Vidas: ${lives}`;
        loseLifeSound.play();
        if (lives <= 0) {
            alert("¡Perdiste! Puntuación final: " + score);
            resetGame();
        } else {
            startGame();
        }
    }

    function resetGame() {
        score = 0;
        lives = 3;
        speed = initialSpeed;
        level = 1;
        consecutiveClicks = 0;
        scoreDisplay.textContent = `Puntos: ${score}`;
        livesDisplay.textContent = `Vidas: ${lives}`;
        startGame();
    }

    function increaseDifficulty() {
        level++;
        speed *= 0.9;
        text.style.fontSize = `${3 - level * 0.2}rem`; // Reduce el tamaño del texto
        clearInterval(moveInterval);
        moveInterval = setInterval(moveText, speed);
    }

    function startGame() {
        moveText();
        startCountdown();
        clearInterval(moveInterval);
        moveInterval = setInterval(moveText, speed);
    }

    text.addEventListener('click', () => {
        score += (1 + consecutiveClicks); // Aumenta el puntaje según el multiplicador
        consecutiveClicks++; // Incrementa el multiplicador de clics
        scoreDisplay.textContent = `Puntos: ${score}`;
        clickSound.play();
        
        if (speed > 500) speed *= 0.95; // Aumenta la velocidad después de cada clic
        clearInterval(moveInterval);
        moveInterval = setInterval(moveText, speed);

        moveText();
        startCountdown();

        // Incrementa la dificultad después de cada 10 puntos
        if (score % 10 === 0) {
            increaseDifficulty();
        }
    });

    startGame();
});

