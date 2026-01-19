// Video Player Logic - Initializes after DOM and Alpine.js are ready
(function() {
    'use strict';
    
    // Wait for DOM and Alpine.js to be ready
    function initVideoPlayer() {
        // Check if Alpine.js is loaded and the iframe exists with a valid src
        const iframe = document.querySelector('#gemelo-iframe');
        if (!iframe || !iframe.src || iframe.src === 'about:blank') {
            // Retry after a short delay if iframe is not ready
            setTimeout(initVideoPlayer, 100);
            return;
        }

        // 1. Cargar Vimeo SDK para gestionar SmartPlay con Audio Inteligente
        const script = document.createElement('script');
        script.src = "https://player.vimeo.com/api/player.js";
        script.onload = () => {
                const iframe = document.querySelector('#gemelo-iframe');
                if (!iframe || !iframe.src) {
                    console.log('Video Player: Iframe no encontrado o sin src');
                    return;
                }
                
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
                
                if (!audioIndicator) {
                    console.log('Video Player: Indicador de audio no encontrado');
                    return;
                }
                
                console.log('Video Player: Indicador de audio encontrado, inicializando event listeners...');

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
                    if (audioEnabled) {
                        console.log('Audio ya está activado');
                        return;
                    }

                    console.log('Activando audio...');
                    hasUserInteracted = true;

                    try {
                        await player.setMuted(false);
                        await player.setVolume(1);
                        audioEnabled = true;
                        console.log('Audio activado correctamente');

                        // Ocultar indicador solo si se especifica
                        if (hideIndicator) {
                            console.log('Ocultando indicador de audio');
                            hideAudioIndicator();
                        }

                        // Si el video está visible o tiene focus, reproducir con audio
                        const rect = iframe.getBoundingClientRect();
                        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                        const hasFocus = document.activeElement === iframe || iframe.matches(':focus-within');

                        if (isVisible || hasFocus) {
                            console.log('Reproduciendo video con audio');
                            await smartPlay();
                        }
                    } catch (error) {
                        console.error('SmartAudio: Error al activar audio', error);
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

                // Función para manejar la interacción con el indicador
                const handleIndicatorInteraction = async (e) => {
                    if (e) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    
                    console.log('Audio indicator clicked, audioEnabled:', audioEnabled);
                    
                    // Si el audio ya está activado, solo ocultar el indicador
                    if (audioEnabled) {
                        hideAudioIndicator();
                    } else {
                        // Si no está activado, activarlo y ocultar el indicador
                        console.log('Activating audio...');
                        await enableSmartAudio(true);
                        console.log('Audio activated:', audioEnabled);
                    }
                };

                // Evento permanente en el indicador para activar audio
                if (audioIndicator) {
                    // Usar event delegation para capturar clicks en cualquier parte del indicador
                    audioIndicator.addEventListener('click', handleIndicatorInteraction, { passive: false });
                    audioIndicator.addEventListener('touchstart', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleIndicatorInteraction(e);
                    }, { passive: false });
                    
                    // También agregar mousedown como respaldo
                    audioIndicator.addEventListener('mousedown', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleIndicatorInteraction(e);
                    }, { passive: false });

                    // Activar audio con cualquier interacción fuera del indicador (solo una vez)
                    let documentInteractionHandled = false;
                    const handleDocumentInteraction = (e) => {
                        // Si el click fue en el indicador, no hacer nada (el indicador lo maneja)
                        if (audioIndicator && audioIndicator.contains(e.target)) {
                            return;
                        }
                        
                        if (documentInteractionHandled) return;
                        documentInteractionHandled = true;
                        
                        // Click/touch fuera del indicador: activar audio pero mantener indicador visible
                        enableSmartAudio(false);
                    };

                    // Agregar eventos al documento (solo una vez para activar audio fuera del indicador)
                    if (isTouchDevice) {
                        document.addEventListener('touchstart', handleDocumentInteraction, { once: true, passive: true });
                        document.addEventListener('click', handleDocumentInteraction, { once: true, passive: true });
                    } else {
                        document.addEventListener('click', handleDocumentInteraction, { once: true, passive: true });
                    }
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

    // Initialize when DOM and Alpine.js are ready
    function startInit() {
        // Wait for Alpine.js to be initialized and DOM to be ready
        if (typeof Alpine === 'undefined' || document.readyState === 'loading') {
            setTimeout(startInit, 50);
            return;
        }
        
        // Wait for Alpine to finish initializing and the iframe to have a src
        function checkAlpineReady() {
            const iframe = document.querySelector('#gemelo-iframe');
            // Check if Alpine has initialized the iframe with src
            if (iframe && iframe.src && iframe.src !== 'about:blank' && iframe.src.includes('vimeo.com')) {
                initVideoPlayer();
            } else {
                // Retry after a short delay
                setTimeout(checkAlpineReady, 100);
            }
        }
        
        // Start checking after a small delay to let Alpine initialize
        setTimeout(checkAlpineReady, 300);
    }
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startInit);
    } else {
        startInit();
    }
})();

// Video Demostrativo - Smart Play/Pause Logic
(function() {
    'use strict';
    
    function initDemoVideo() {
        const demoIframe = document.querySelector('#demo-video-iframe');
        if (!demoIframe || !demoIframe.src) {
            setTimeout(initDemoVideo, 100);
            return;
        }

        // Cargar Vimeo SDK si no está cargado
        if (typeof Vimeo === 'undefined') {
            const script = document.createElement('script');
            script.src = "https://player.vimeo.com/api/player.js";
            script.onload = () => {
                initDemoVideoPlayer(demoIframe);
            };
            document.head.appendChild(script);
        } else {
            initDemoVideoPlayer(demoIframe);
        }
    }

    function initDemoVideoPlayer(iframe) {
        const player = new Vimeo.Player(iframe);
        let isPlaying = false;

        const smartPlay = async () => {
            if (isPlaying) return;
            try {
                await player.setMuted(true);
                await player.play();
                isPlaying = true;
            } catch (error) {
                console.log('Demo Video: Error al reproducir', error);
            }
        };

        const smartPause = async () => {
            if (!isPlaying) return;
            try {
                await player.pause();
                isPlaying = false;
            } catch (error) {
                console.log('Demo Video: Error al pausar', error);
            }
        };

        // Gestión de Visibilidad con IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    smartPlay();
                } else {
                    if (document.activeElement !== iframe && !iframe.matches(':focus-within')) {
                        smartPause();
                    }
                }
            });
        }, { threshold: 0.3 });
        observer.observe(iframe);

        // Gestión de Focus
        const handleFocus = () => {
            smartPlay();
        };

        const handleBlur = () => {
            const rect = iframe.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (!isVisible) {
                smartPause();
            }
        };

        iframe.addEventListener('focus', handleFocus, true);
        iframe.addEventListener('blur', handleBlur, true);

        const videoContainer = iframe.closest('.relative');
        if (videoContainer) {
            videoContainer.addEventListener('focusin', handleFocus);
            videoContainer.addEventListener('focusout', handleBlur);
        }

        // Inicializar: Intentar reproducir al cargar si está visible
        setTimeout(() => {
            const rect = iframe.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (isVisible) {
                smartPlay();
            }
        }, 500);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDemoVideo);
    } else {
        initDemoVideo();
    }
})();
