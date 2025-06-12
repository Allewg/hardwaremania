
document.getElementById('openContactModal').addEventListener('click', () => {
    document.getElementById('contactModal').classList.remove('hidden');
});

document.getElementById('closeContactModal').addEventListener('click', () => {
    document.getElementById('contactModal').classList.add('hidden');
});

document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Obtener los valores del formulario
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Crear elementos para los mensajes
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg transition-opacity duration-500';
    successMessage.style.display = 'none';
    successMessage.textContent = '¡Mensaje enviado con éxito!';

    const errorMessage = document.createElement('div');
    errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded shadow-lg transition-opacity duration-500';
    errorMessage.style.display = 'none';
    errorMessage.textContent = 'Error al enviar el mensaje. Intente nuevamente.';

    document.body.appendChild(successMessage);
    document.body.appendChild(errorMessage);

    // Enviar el correo usando EmailJS
    emailjs.send('service_057yad5', 'template_hxpn3ax', {
        from_name: name,
        from_email: email,
        message: message
    }, 'RQXgchjC3s70hmgoT')
    .then(function(response) {
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
        document.getElementById('contactModal').classList.add('hidden');
        document.getElementById('contactForm').reset();
    }, function(error) {
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel > div');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    let currentIndex = 0;

    function updateCarousel() {
        const slideWidth = carousel.offsetWidth;
        const offset = -currentIndex * slideWidth;
        carousel.style.transform = `translateX(${offset}px)`;
        dots.forEach(dot => dot.classList.remove('bg-purple-500'));
        dots[currentIndex].classList.add('bg-purple-500');
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    }

    // Auto advance every 8 seconds
    let autoSlideInterval = setInterval(showNextImage, 8000);

    // Manual buttons
    nextBtn.addEventListener('click', () => {
        showNextImage();
        resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        showPrevImage();
        resetAutoSlide();
    });

    // Dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
            resetAutoSlide();
        });
    });

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(showNextImage, 8000);
    }

    // Handle window resize to ensure proper sizing
    window.addEventListener('resize', () => {
        updateCarousel();
    });

    // Initialize carousel
    updateCarousel();
});

document.addEventListener("DOMContentLoaded", () => {
    // Menú hamburguesa
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('hidden');
    });
});
