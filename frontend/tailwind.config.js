/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        amazon: { orange: '#FF9900', darkOrange: '#E88B00', blue: '#232F3E', darkBlue: '#131921', lightBlue: '#37475A', teal: '#008296' }
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'bounce-in': 'bounceIn 0.5s ease-out',
      },
      keyframes: {
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        bounceIn: { '0%': { transform: 'scale(0.9)', opacity: '0' }, '50%': { transform: 'scale(1.02)' }, '100%': { transform: 'scale(1)', opacity: '1' } }
      }
    },
  },
  plugins: [],
};
