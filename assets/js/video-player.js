// ============================================================
// SMART AUDIO - VIDEO PLAYER
// ============================================================
// Smart Audio se encarga de:
//   → Mutear cuando el video sale del viewport (scroll)
//   → Mutear cuando se cambia de tab o minimiza la ventana
//   → Desmutear automáticamente al volver al video
// Soporta: #gemelo-iframe, #posicionamiento-iframe
// ============================================================

(function () {
    'use strict';

    function loadVimeoSdk(callback) {
        if (typeof Vimeo !== 'undefined') {
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://player.vimeo.com/api/player.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    function setupSmartAudioPlayer(iframe) {
        if (!iframe || !iframe.src) return;

        const player = new Vimeo.Player(iframe);

        let videoIsVisible = false;
        let windowFocused = !document.hidden;

        const muteNow = async () => {
            try { await player.setMuted(true); } catch (_) {}
        };

        const unmuteNow = async () => {
            try {
                await player.setMuted(false);
                await player.setVolume(1);
            } catch (_) {}
        };

        const syncAudio = async () => {
            if (videoIsVisible && windowFocused) {
                await unmuteNow();
            } else {
                await muteNow();
            }
        };

        const container = iframe.closest('.relative') || iframe;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                videoIsVisible = entry.isIntersecting;
                syncAudio();
            });
        }, { threshold: 0.25 });
        observer.observe(container);

        document.addEventListener('visibilitychange', () => {
            windowFocused = !document.hidden;
            syncAudio();
        });

        window.addEventListener('blur', () => {
            windowFocused = false;
            muteNow();
        });

        window.addEventListener('focus', () => {
            windowFocused = true;
            syncAudio();
        });

        player.ready().then(() => {
            const rect = container.getBoundingClientRect();
            videoIsVisible = rect.top < window.innerHeight && rect.bottom > 0;
            syncAudio();
        }).catch(() => {});
    }

    function initSmartAudioPlayer(selector, options = {}) {
        const { pollForSrc = false } = options;

        function tryInit() {
            const iframe = document.querySelector(selector);
            if (!iframe) {
                if (pollForSrc) setTimeout(tryInit, 200);
                return;
            }
            if (!iframe.src || iframe.src === 'about:blank' || !iframe.src.includes('vimeo.com')) {
                if (pollForSrc) setTimeout(tryInit, 200);
                return;
            }
            loadVimeoSdk(() => setupSmartAudioPlayer(iframe));
        }

        tryInit();
    }

    function startInit() {
        if (typeof Alpine === 'undefined' || document.readyState === 'loading') {
            setTimeout(startInit, 50);
            return;
        }
        setTimeout(() => {
            initSmartAudioPlayer('#gemelo-iframe', { pollForSrc: true });
            initSmartAudioPlayer('#posicionamiento-iframe');
        }, 300);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startInit);
    } else {
        startInit();
    }
})();


// ============================================================
// DEMO VIDEO (#demo-video-iframe)
// Always muted. Plays when visible, pauses when not.
// ============================================================
(function () {
    'use strict';

    function initDemoVideo() {
        const iframe = document.querySelector('#demo-video-iframe');
        if (!iframe || !iframe.src) {
            setTimeout(initDemoVideo, 200);
            return;
        }

        if (typeof Vimeo === 'undefined') {
            const script = document.createElement('script');
            script.src   = 'https://player.vimeo.com/api/player.js';
            script.onload = () => setupDemo(iframe);
            document.head.appendChild(script);
        } else {
            setupDemo(iframe);
        }
    }

    function setupDemo(iframe) {
        const player  = new Vimeo.Player(iframe);
        let isPlaying = false;

        const play = async () => {
            if (isPlaying) return;
            try {
                await player.setMuted(true);
                await player.play();
                isPlaying = true;
            } catch (_) {}
        };

        const pause = async () => {
            if (!isPlaying) return;
            try {
                await player.pause();
                isPlaying = false;
            } catch (_) {}
        };

        new IntersectionObserver((entries) => {
            entries.forEach(e => e.isIntersecting ? play() : pause());
        }, { threshold: 0.3 }).observe(iframe);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) pause();
        });

        player.ready().then(() => {
            const r = iframe.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom > 0) play();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDemoVideo);
    } else {
        initDemoVideo();
    }
})();
