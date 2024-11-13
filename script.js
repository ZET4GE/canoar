document.addEventListener('DOMContentLoaded', () => {
    const texts = document.querySelectorAll('.text');
    texts.forEach(text => {
        text.style.left = `${Math.random() * 100}vw`;
        text.style.top = `${Math.random() * 100}vh`;
    });
});
