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
// Y forzar aplicación de colores Tailwind como fallback
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

        // Función para aplicar colores como fallback si Tailwind no los generó
        function applyColorFallbacks() {
            // Text colors
            desarrolloSection.querySelectorAll('.text-accent-purple').forEach(el => {
                if (getComputedStyle(el).color === 'rgb(0, 0, 0)' || 
                    getComputedStyle(el).color === 'rgba(0, 0, 0, 0)' ||
                    !el.style.color) {
                    el.style.color = '#7c3aed';
                }
            });
            
            desarrolloSection.querySelectorAll('.text-accent-cyan').forEach(el => {
                if (getComputedStyle(el).color === 'rgb(0, 0, 0)' || 
                    getComputedStyle(el).color === 'rgba(0, 0, 0, 0)' ||
                    !el.style.color) {
                    el.style.color = '#00f0ff';
                }
            });

            // Background colors
            desarrolloSection.querySelectorAll('[class*="bg-accent-purple/20"]').forEach(el => {
                const bgColor = getComputedStyle(el).backgroundColor;
                if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent' || !bgColor.includes('124')) {
                    el.style.backgroundColor = 'rgba(124, 58, 237, 0.2)';
                }
            });

            desarrolloSection.querySelectorAll('[class*="bg-accent-purple/30"]').forEach(el => {
                const bgColor = getComputedStyle(el).backgroundColor;
                if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent' || !bgColor.includes('124')) {
                    el.style.backgroundColor = 'rgba(124, 58, 237, 0.3)';
                }
            });

            desarrolloSection.querySelectorAll('[class*="bg-accent-purple/5"]').forEach(el => {
                const bgColor = getComputedStyle(el).backgroundColor;
                if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent' || !bgColor.includes('124')) {
                    el.style.backgroundColor = 'rgba(124, 58, 237, 0.05)';
                }
            });

            desarrolloSection.querySelectorAll('[class*="bg-accent-cyan/20"]').forEach(el => {
                const bgColor = getComputedStyle(el).backgroundColor;
                if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
                    el.style.backgroundColor = 'rgba(0, 240, 255, 0.2)';
                }
            });

            desarrolloSection.querySelectorAll('[class*="bg-accent-cyan/30"]').forEach(el => {
                const bgColor = getComputedStyle(el).backgroundColor;
                if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
                    el.style.backgroundColor = 'rgba(0, 240, 255, 0.3)';
                }
            });

            desarrolloSection.querySelectorAll('[class*="bg-accent-cyan/5"]').forEach(el => {
                const bgColor = getComputedStyle(el).backgroundColor;
                if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
                    el.style.backgroundColor = 'rgba(0, 240, 255, 0.05)';
                }
            });

            // Border colors
            desarrolloSection.querySelectorAll('[class*="border-accent-purple/30"]').forEach(el => {
                const borderColor = getComputedStyle(el).borderColor;
                if (borderColor === 'rgba(0, 0, 0, 0)' || borderColor === 'transparent' || !borderColor.includes('124')) {
                    el.style.borderColor = 'rgba(124, 58, 237, 0.3)';
                }
            });

            desarrolloSection.querySelectorAll('[class*="border-accent-purple/50"]').forEach(el => {
                const borderColor = getComputedStyle(el).borderColor;
                if (borderColor === 'rgba(0, 0, 0, 0)' || borderColor === 'transparent' || !borderColor.includes('124')) {
                    el.style.borderColor = 'rgba(124, 58, 237, 0.5)';
                }
            });

            desarrolloSection.querySelectorAll('[class*="border-accent-cyan/30"]').forEach(el => {
                const borderColor = getComputedStyle(el).borderColor;
                if (borderColor === 'rgba(0, 0, 0, 0)' || borderColor === 'transparent') {
                    el.style.borderColor = 'rgba(0, 240, 255, 0.3)';
                }
            });

            desarrolloSection.querySelectorAll('[class*="border-accent-cyan/50"]').forEach(el => {
                const borderColor = getComputedStyle(el).borderColor;
                if (borderColor === 'rgba(0, 0, 0, 0)' || borderColor === 'transparent') {
                    el.style.borderColor = 'rgba(0, 240, 255, 0.5)';
                }
            });
        }

        // Aplicar fallbacks después de un pequeño delay para que Tailwind termine de procesar
        setTimeout(applyColorFallbacks, 100);
        setTimeout(applyColorFallbacks, 500);
        setTimeout(applyColorFallbacks, 1000);
    }
});
