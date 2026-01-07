/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',
  content: [
    "./Components/**/*.html",
    "./Pages/**/*.html",
    "./Emails/**/*.html",
    "./Snippets/**/*.html",
    "./Assets/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        // Cores Principais - Base do Projeto Base
        primary: {
          100: '#E3F2FD',
          200: '#90CAF9',
          300: '#42A5F5',
          400: '#1E88E5',
          500: '#002945', // Cor primária principal
          600: '#134a6b', // Cor primária escura
          700: '#0D3654',
          800: '#08243D',
          900: '#041526',       
        },
        // Cor Secundária - Roxo/Pink
        secondary: {
          50: '#FCF4FF',
          100: '#F4E8FF', // Cor secundária clara
          200: '#EDD4FF',
          300: '#E5BFFF',
          400: '#DD9FFF',
          500: '#CA69F5', // Cor secundária principal
          600: '#B854E8',
          700: '#A541D6',
          800: '#8B35B4',
          900: '#6D2A8F',
        },
        // Cor de Destaque - Verde
        accent: {
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50', // Cor de destaque
          600: '#45a049', // Cor de destaque escura
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },
        // Cores de Fundo
        mainBg: '#F5F5F5',
        lightBg: '#f8f9fa',
        darkBg: '#2c3e50',
        
        // Cores de Texto
        textPrimary: '#333333',
        textSecondary: '#666666',
        textLight: '#999999',
        textWhite: '#ffffff',
        
        // Cores de Borda
        borderLight: '#e9ecef',
        borderMedium: '#dddddd',
        borderDark: '#34495e',
        
        // Cores de Estado
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545',
        info: '#17a2b8',
        
        // Cores Auxiliares
        lightBlue: '#00B0FF',
        lightGreen: '#81C784',
        facebook: '#1877F2',
        gray: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#bdc3c7',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
          1000: '#1E1E1E'
        }
      },
      // Espaçamentos personalizados
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      // Border Radius personalizados
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      // Sombras personalizadas
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      // Transições personalizadas
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
      },
      // Z-index personalizados
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'loading': '99999',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
  safelist: [
    {
      pattern: /^wake-.*/,
    }
  ]
}
