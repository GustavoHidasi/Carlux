let currentIndex = 0;
const track = document.getElementById('carrosselTrack');
const images = document.querySelectorAll('.carrossel-img');
const totalImages = images.length;

function createIndicators() {
    const indicatorsContainer = document.getElementById('indicators');
    indicatorsContainer.innerHTML = '';

    for (let i = 0; i < totalImages; i++) {
        const indicator = document.createElement('span');
        indicator.className = 'indicator';
        if (i === 0) indicator.classList.add('active');
        indicator.onclick = () => goToSlide(i);
        indicatorsContainer.appendChild(indicator);
    }
}

function updateCarrossel() {
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
    updateIndicators();
}

function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
    });
}

function moveCarrossel(direction) {
    currentIndex += direction;

    if (currentIndex < 0) currentIndex = totalImages - 1;
    if (currentIndex >= totalImages) currentIndex = 0;

    updateCarrossel();
}

function goToSlide(index) {
    currentIndex = index;
    updateCarrossel();
}

// Auto-play
let autoPlayInterval = setInterval(() => {
    moveCarrossel(1);
}, 4000);

// Pausar auto-play ao passar o mouse
const carrosselContainer = document.querySelector('.carrossel-container');
carrosselContainer.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
});

carrosselContainer.addEventListener('mouseleave', () => {
    autoPlayInterval = setInterval(() => {
        moveCarrossel(1);
    }, 4000);
});

// Inicializar
createIndicators();