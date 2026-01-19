// Tailwind CSS Configuration
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            colors: {
                dark: {
                    bg: '#030014',
                    card: '#0f0c29',
                    border: '#2a2450'
                },
                primary: {
                    DEFAULT: '#7c3aed',
                    dark: '#6d28d9',
                },
                secondary: '#7c3aed',
                accent: '#00f0ff',
                'bg-deep': '#030014',
                'accent-purple': '#7c3aed',
                'accent-cyan': '#00f0ff',
                'glass-white': 'rgba(255, 255, 255, 0.03)',
                'glass-border': 'rgba(255, 255, 255, 0.08)',
            }
        }
    },
    safelist: [
        'text-accent-purple',
        'text-accent-cyan',
        'bg-accent-purple/20',
        'bg-accent-purple/30',
        'bg-accent-purple/5',
        'bg-accent-cyan/20',
        'bg-accent-cyan/30',
        'bg-accent-cyan/5',
        'border-accent-purple/30',
        'border-accent-purple/50',
        'border-accent-cyan/30',
        'border-accent-cyan/50',
        'hover:bg-accent-purple/30',
        'hover:bg-accent-cyan/30',
        'hover:bg-accent-purple/90',
        'hover:border-accent-purple/50',
        'hover:border-accent-cyan/50',
        'from-accent-purple/5',
        'from-accent-cyan/5',
        'from-accent-purple',
        'from-accent-cyan',
        'via-accent-cyan',
        'from-accent-cyan/30'
    ]
}

// Force Tailwind to generate classes by adding them to a hidden element
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        const hiddenDiv = document.createElement('div');
        hiddenDiv.className = 'hidden';
        hiddenDiv.innerHTML = `
            <span class="text-accent-purple text-accent-cyan"></span>
            <span class="bg-accent-purple/20 bg-accent-purple/30 bg-accent-purple/5"></span>
            <span class="bg-accent-cyan/20 bg-accent-cyan/30 bg-accent-cyan/5"></span>
            <span class="border-accent-purple/30 border-accent-purple/50"></span>
            <span class="border-accent-cyan/30 border-accent-cyan/50"></span>
            <span class="hover:bg-accent-purple/30 hover:bg-accent-cyan/30"></span>
            <span class="hover:bg-accent-purple/90 hover:border-accent-purple/50"></span>
            <span class="hover:border-accent-cyan/50 from-accent-purple/5"></span>
            <span class="from-accent-cyan/5 from-accent-purple from-accent-cyan"></span>
            <span class="via-accent-cyan from-accent-cyan/30"></span>
        `;
        document.body.appendChild(hiddenDiv);
    });
}
