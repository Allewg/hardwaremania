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
    }
}
