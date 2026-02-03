/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2D5016',      // Deep Green
                secondary: '#FF8C42',    // Warm Orange
                accent: '#8B4513',       // Earth Brown
                background: '#FFF8F0',   // Soft Cream
                dark: '#1A1A1A',         // Dark Text
            },
            fontFamily: {
                heading: ['Fraunces', 'serif'],
                body: ['Public Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
