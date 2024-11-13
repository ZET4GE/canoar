document.addEventListener('DOMContentLoaded', () => {
    const text = document.querySelector('.text');
    const scoreDisplay = document.getElementById('score');
    let score = 0;
    let speed = 2000;  // Intervalo inicial en ms

    function moveText() {
        // Genera una posición aleatoria
        const x = Math.random() * (window.innerWidth - text.offsetWidth);
        const y = Math.random() * (window.innerHeight - text.offsetHeight);
        
        // Mueve el texto a la nueva posición
        text.style.transform = `translate(${x}px, ${y}px)`;
    }

    text.addEventListener('click', () => {
        score++;
        scoreDisplay.textContent = `Puntos: ${score}`;
        
        // Aumenta la dificultad (reduce el tiempo de movimiento)
        if (speed > 500) speed -= 100;

        // Mueve el texto inmediatamente después de hacer clic
        moveText();
    });

    // Movimiento automático del texto
    setInterval(moveText, speed);

    // Mueve el texto la primera vez
    moveText();
});
