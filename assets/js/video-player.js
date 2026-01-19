// Alpine.js Data - Video Player Logic
function hardwaremania() {
    return {
        menuOpen: false,
        scrolled: false,
        videoUrl: '',
        init() {
            window.addEventListener('scroll', () => {
                this.scrolled = window.scrollY > 50;
            });

            // 1. Configuración de URL para Autoplay Visual Garantizado
            // muted=1 es CRÍTICO para que arranque en móviles y desktop sin interacción previa.
            const baseUrl = "https://player.vimeo.com/video/1148040991";
            const params = "?autoplay=1&loop=1&autopause=0&controls=0&title=0&byline=0&portrait=0&dnt=1&playsinline=1&transparent=0&muted=1";
            this.videoUrl = baseUrl + params;

            // 2. Cargar Vimeo SDK para gestionar SmartPlay con Audio Inteligente
            const script = document.createElement('script');
            script.src = "https://player.vimeo.com/api/player.js";
            script.onload = () => {
                const iframe = document.querySelector('#gemelo-iframe');
                const player = new Vimeo.Player(iframe);

                let isPlaying = false;
                let audioEnabled = false;
                let hasUserInteracted = false;

                // Función SmartPlay: Reproduce el video cuando tiene focus o está visible
                const smartPlay = async () => {
                    if (isPlaying) return;

                    try {
                        // Intentar reproducir con audio si el usuario ya interactuó
                        if (hasUserInteracted && audioEnabled) {
                            await player.setMuted(false);
                            await player.setVolume(1);
                            await player.play();
                        } else {
                            // Reproducir silenciado por defecto
                            await player.setMuted(true);
                            await player.play();
                        }
                        isPlaying = true;
                    } catch (error) {
                        // Si falla, forzar mute y reproducir
                        try {
                            await player.setMuted(true);
                            await player.play();
                            isPlaying = true;
                        } catch (e) {
                            console.log('SmartPlay: Video no disponible aún');
                        }
                    }
                };

                // Función SmartPause: Pausa cuando pierde focus y visibilidad
                const smartPause = async () => {
                    if (!isPlaying) return;

                    try {
                        await player.pause();
                        isPlaying = false;
                    } catch (error) {
                        console.log('SmartPause: Error al pausar');
                    }
                };

                // A. Gestión de Visibilidad con IntersectionObserver
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            smartPlay();
                        } else {
                            // Solo pausar si no tiene focus
                            if (document.activeElement !== iframe && !iframe.matches(':focus-within')) {
                                smartPause();
                            }
                        }
                    });
                }, { threshold: 0.1 });
                observer.observe(iframe);

                // B. Gestión de Focus para SmartPlay
                const handleFocus = () => {
                    smartPlay();
                };

                const handleBlur = () => {
                    // Solo pausar si no está visible
                    const rect = iframe.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                    if (!isVisible) {
                        smartPause();
                    }
                };

                // Eventos de focus en el iframe y su contenedor
                iframe.addEventListener('focus', handleFocus, true);
                iframe.addEventListener('blur', handleBlur, true);

                // También manejar focus en el contenedor padre
                const videoContainer = iframe.closest('.relative');
                if (videoContainer) {
                    videoContainer.addEventListener('focusin', handleFocus);
                    videoContainer.addEventListener('focusout', handleBlur);
                }

                // C. SmartPlay Audio: Gestión inteligente del audio
                const audioIndicator = document.getElementById('audio-indicator');

                const hideAudioIndicator = () => {
                    if (audioIndicator) {
                        audioIndicator.style.opacity = '0';
                        audioIndicator.style.pointerEvents = 'none';
                        // Ocultar completamente después de la transición
                        setTimeout(() => {
                            if (audioIndicator) {
                                audioIndicator.style.display = 'none';
                            }
                        }, 300);
                    }
                };

                const showAudioIndicator = () => {
                    if (audioIndicator) {
                        audioIndicator.style.display = 'flex';
                        audioIndicator.style.opacity = '1';
                        audioIndicator.style.pointerEvents = 'auto';
                    }
                };

                const enableSmartAudio = async (hideIndicator = false) => {
                    if (audioEnabled) return;

                    hasUserInteracted = true;

                    try {
                        await player.setMuted(false);
                        await player.setVolume(1);
                        audioEnabled = true;

                        // Ocultar indicador solo si se especifica
                        if (hideIndicator) {
                            hideAudioIndicator();
                        }

                        // Si el video está visible o tiene focus, reproducir con audio
                        const rect = iframe.getBoundingClientRect();
                        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                        const hasFocus = document.activeElement === iframe || iframe.matches(':focus-within');

                        if (isVisible || hasFocus) {
                            await smartPlay();
                        }
                    } catch (error) {
                        console.log('SmartAudio: Error al activar audio', error);
                    }
                };

                // Inicializar indicador visual (mostrar porque audioEnabled es false inicialmente)
                setTimeout(() => {
                    showAudioIndicator();
                }, 100);

                // Detectar si es un dispositivo táctil
                const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

                // Variable para evitar doble ejecución en móvil (touchstart + click)
                let touchHandled = false;

                // Activar audio solo con click o touchstart
                const initializeAudio = (e) => {
                    // En móvil, si ya se manejó el touchstart, ignorar el click
                    if (isTouchDevice && e.type === 'click' && touchHandled) {
                        touchHandled = false; // Reset para el próximo ciclo
                        return;
                    }

                    // Marcar como manejado si es touchstart
                    if (e.type === 'touchstart') {
                        touchHandled = true;
                    }

                    // Verificar si el click/touch fue en el indicador
                    if (audioIndicator && audioIndicator.contains(e.target)) {
                        // Click/touch en el indicador: activar audio y ocultar indicador
                        enableSmartAudio(true);
                    } else {
                        // Click/touch fuera del indicador: activar audio pero mantener indicador visible
                        enableSmartAudio(false);
                    }
                };

                // Agregar eventos de click y touchstart al documento (solo una vez para activar audio)
                // En móvil, touchstart tiene prioridad
                if (isTouchDevice) {
                    document.addEventListener('touchstart', initializeAudio, { once: true, passive: true });
                    // Click como respaldo (pero será ignorado si touchstart ya se ejecutó)
                    document.addEventListener('click', initializeAudio, { once: true, passive: true });
                } else {
                    document.addEventListener('click', initializeAudio, { once: true, passive: true });
                }

                // Evento permanente en el indicador para ocultarlo cuando el usuario lo seleccione
                if (audioIndicator) {
                    let indicatorTouchHandled = false;

                    // Función para manejar la interacción con el indicador
                    const handleIndicatorInteraction = () => {
                        // Si el audio ya está activado, solo ocultar el indicador
                        if (audioEnabled) {
                            hideAudioIndicator();
                        } else {
                            // Si no está activado, activarlo y ocultar el indicador
                            enableSmartAudio(true);
                        }
                    };

                    // Manejar touchstart (móvil) - prioridad sobre click
                    audioIndicator.addEventListener('touchstart', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        indicatorTouchHandled = true;
                        handleIndicatorInteraction();
                    }, { passive: false });

                    // Manejar click (desktop y como respaldo en móvil)
                    audioIndicator.addEventListener('click', (e) => {
                        // En móvil, si ya se manejó el touchstart, ignorar el click
                        if (isTouchDevice && indicatorTouchHandled) {
                            e.stopPropagation();
                            e.preventDefault();
                            indicatorTouchHandled = false;
                            return;
                        }

                        // Para desktop o si no se manejó touchstart
                        e.stopPropagation();
                        e.preventDefault();
                        handleIndicatorInteraction();
                    }, { passive: false });

                    // Manejar touchend para prevenir el click que viene después en móvil
                    audioIndicator.addEventListener('touchend', (e) => {
                        e.stopPropagation();
                        if (isTouchDevice) {
                            e.preventDefault();
                        }
                    }, { passive: false });
                }

                // Inicializar: Intentar reproducir al cargar si está visible
                setTimeout(() => {
                    const rect = iframe.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                    if (isVisible) {
                        smartPlay();
                    }
                }, 500);
            };
            document.head.appendChild(script);
        }
    }
}
