document.addEventListener('DOMContentLoaded', () => {
    const text = document.querySelector('.text');
    const scoreDisplay = document.getElementById('score');
    let score = 0;
    let speed = 2000; // Intervalo inicial en ms
    let countdown = 3; // Tiempo en segundos antes de perder
    let countdownInterval;
    let moveInterval;

    // Función para mover el texto
    function moveText() {
        const x = Math.random() * (window.innerWidth - text.offsetWidth);
        const y = Math.random() * (window.innerHeight - text.offsetHeight);
        text.style.transform = `translate(${x}px, ${y}px)`;
    }

    // Función de temporizador para la condición de derrota
    function startCountdown() {
        countdown = 3; // Reinicia el tiempo
        clearInterval(countdownInterval); // Borra el intervalo anterior, si existe
        countdownInterval = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                clearInterval(moveInterval);
                alert("¡Perdiste! Puntuación final: " + score);
            }
        }, 1000);
    }

    // Evento de clic en el texto
    text.addEventListener('click', () => {
        score++;
        scoreDisplay.textContent = `Puntos: ${score}`;
        
        // Aumenta la dificultad reduciendo el intervalo de movimiento
        if (speed > 500) speed -= 100;
        clearInterval(moveInterval);
        moveInterval = setInterval(moveText, speed);

        // Mueve el texto inmediatamente y reinicia el temporizador
        moveText();
        startCountdown();
    });

    // Movimiento automático inicial y primer temporizador
    moveInterval = setInterval(moveText, speed);
    startCountdown();

    // Mueve el texto la primera vez
    moveText();
});

