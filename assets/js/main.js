// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Animate sections on scroll (excluyendo desarrollo-web-section para que siempre esté visible)
gsap.utils.toArray('section').forEach(section => {
    // Excluir la sección de desarrollo web de las animaciones
    if (section.id === 'desarrollo-web-section') {
        // Forzar visibilidad de todos los elementos en esta sección
        const elementos = section.querySelectorAll('*');
        elementos.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.translate = 'none';
            el.style.rotate = 'none';
            el.style.scale = 'none';
        });
        return;
    }
    gsap.from(section.children, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });
});

// Asegurar que la sección de desarrollo web siempre esté visible después de cargar
document.addEventListener('DOMContentLoaded', () => {
    const desarrolloSection = document.getElementById('desarrollo-web-section');
    if (desarrolloSection) {
        // Forzar visibilidad inmediata
        desarrolloSection.style.opacity = '1';
        desarrolloSection.style.visibility = 'visible';
        
        // Forzar visibilidad de todos los elementos hijos
        const elementos = desarrolloSection.querySelectorAll('*');
        elementos.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.translate = 'none';
            el.style.rotate = 'none';
            el.style.scale = 'none';
        });
    }
});
