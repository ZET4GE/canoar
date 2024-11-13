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
        startGame();
    }

    function startGame() {
        moveText();
        startCountdown();
        clearInterval(moveInterval);
        moveInterval = setInterval(moveText, speed);

        // Mostrar bono aleatorio cada 10
