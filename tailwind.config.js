module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00d9ff',
          purple: '#c700eb',
          green: '#39ff14',
          pink: '#ff006e',
        },
        dark: {
          primary: '#0a0e27',
          secondary: '#1a1f3a',
          tertiary: '#2a3050',
        },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': {
            textShadow: '0 0 10px #00d9ff, 0 0 20px #c700eb',
          },
          '50%': {
            textShadow: '0 0 20px #00d9ff, 0 0 40px #c700eb',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
      },
    },
  },
  plugins: [],
}
