document.addEventListener('DOMContentLoaded', () => {
    const text = document.querySelector('.text');
    const scoreDisplay = document.getElementById('score');
    let score = 0;
    let initialSpeed = 2000; // Velocidad inicial en ms
    let speed = initialSpeed; 
    let countdown = 3; // Tiempo en segundos antes de perder
    let countdownInterval;
    let moveInterval;

    // Función para mover el texto a una posición aleatoria
    function moveText() {
        const x = Math.random() * (window.innerWidth - text.offsetWidth);
        const y = Math.random() * (window.innerHeight - text.offsetHeight);
        text.style.transform = `translate(${x}px, ${y}px)`;
    }

    // Función de temporizador para la condición de derrota
    function startCountdown() {
        countdown = 3; // Reinicia el tiempo
        clearInterval(countdownInterval); // Limpia el intervalo anterior, si existe
        countdownInterval = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                clearInterval(moveInterval);
                alert("¡Perdiste! Puntuación final: " + score);
                resetGame(); // Reinicia el juego
            }
        }, 1000);
    }

    // Función para reiniciar el juego
    function resetGame() {
        score = 0;
        speed = initialSpeed; // Restablece la velocidad inicial
        scoreDisplay.textContent = `Puntos: ${score}`;
        startGame();
    }

    // Función para iniciar el juego
    function startGame() {
        moveText();
        startCountdown();
        clearInterval(moveInterval); // Limpia cualquier intervalo anterior de movimiento
        moveInterval = setInterval(moveText, speed);
    }

    // Evento de clic en el texto
    text.addEventListener('click', () => {
        score++;
        scoreDisplay.textContent = `Puntos: ${score}`;
        
        // Aumenta la dificultad incrementando la velocidad
        speed *= 0.9; // Reduce el intervalo en un 10%
        clearInterval(moveInterval); // Limpia el intervalo de movimiento anterior
        moveInterval = setInterval(moveText, speed); // Inicia un nuevo intervalo con la nueva velocidad

        // Mueve el texto inmediatamente y reinicia el temporizador
        moveText();
        startCountdown();
    });

    // Inicia el juego al cargar
    startGame();
});


