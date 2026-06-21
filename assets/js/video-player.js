// ============================================================
// SMART AUDIO - VIDEO PLAYER
// ============================================================
// El video del hero arranca CON audio (el usuario hizo clic en Play).
// Smart Audio se encarga de:
//   → Mutear cuando el video sale del viewport (scroll)
//   → Mutear cuando se cambia de tab o minimiza la ventana
//   → Desmutear automáticamente al volver al video
// ============================================================

(function () {
    'use strict';

    /* ─── HERO VIDEO (#gemelo-iframe) ─────────────────────── */

    function initVideoPlayer() {
        const iframe = document.querySelector('#gemelo-iframe');
        if (!iframe || !iframe.src || iframe.src === 'about:blank') {
            setTimeout(initVideoPlayer, 100);
            return;
        }

        // Load Vimeo SDK if not already loaded
        if (typeof Vimeo !== 'undefined') {
            setupHeroPlayer(iframe);
        } else {
            const script = document.createElement('script');
            script.src = 'https://player.vimeo.com/api/player.js';
            script.onload = () => setupHeroPlayer(iframe);
            document.head.appendChild(script);
        }
    }

    function setupHeroPlayer(iframe) {
        if (!iframe || !iframe.src) return;

        const player = new Vimeo.Player(iframe);

        // State
        let videoIsVisible = false;  // IntersectionObserver
        let windowFocused  = !document.hidden;

        console.log('[SmartAudio] Hero player init');

        /* ── Mute / Unmute ───────────────────────────────── */
        const muteNow = async () => {
            try { await player.setMuted(true); } catch (_) {}
        };

        const unmuteNow = async () => {
            try {
                await player.setMuted(false);
                await player.setVolume(1);
            } catch (_) {}
        };

        /* ── Sync: the one function that decides audio state ─ */
        // Audio ON  = video visible + window/tab focused
        // Audio OFF = anything else
        const syncAudio = async () => {
            if (videoIsVisible && windowFocused) {
                console.log('[SmartAudio] → UNMUTE (visible + focused)');
                await unmuteNow();
            } else {
                console.log('[SmartAudio] → MUTE (not visible or not focused)');
                await muteNow();
            }
        };

        /* ── IntersectionObserver: track viewport visibility ── */
        const container = iframe.closest('.relative') || iframe;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                videoIsVisible = entry.isIntersecting;
                console.log('[SmartAudio] Visible:', videoIsVisible);
                syncAudio();
            });
        }, { threshold: 0.25 });
        observer.observe(container);

        /* ── Tab / Window focus ──────────────────────────── */
        document.addEventListener('visibilitychange', () => {
            windowFocused = !document.hidden;
            console.log('[SmartAudio] Tab active:', windowFocused);
            syncAudio();
        });

        window.addEventListener('blur', () => {
            windowFocused = false;
            console.log('[SmartAudio] Window blur');
            muteNow(); // instant mute
        });

        window.addEventListener('focus', () => {
            windowFocused = true;
            console.log('[SmartAudio] Window focus');
            syncAudio();
        });

        /* ── Initial state once Vimeo is ready ───────────── */
        player.ready().then(() => {
            console.log('[SmartAudio] Vimeo player ready');
            // Check if visible right now
            const rect = container.getBoundingClientRect();
            videoIsVisible = rect.top < window.innerHeight && rect.bottom > 0;
            syncAudio();
        }).catch(err => {
            console.log('[SmartAudio] Player error:', err.message);
        });
    }

    /* ─── Wait for Alpine to set the iframe src ──────────── */
    function startInit() {
        if (typeof Alpine === 'undefined' || document.readyState === 'loading') {
            setTimeout(startInit, 50);
            return;
        }

        function poll() {
            const iframe = document.querySelector('#gemelo-iframe');
            if (iframe && iframe.src && iframe.src !== 'about:blank' && iframe.src.includes('vimeo.com')) {
                console.log('[SmartAudio] Detected Vimeo URL, starting init');
                initVideoPlayer();
            } else {
                setTimeout(poll, 200);
            }
        }
        setTimeout(poll, 300);
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
