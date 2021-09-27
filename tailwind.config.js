const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
  
module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter var', ...defaultTheme.fontFamily.sans],
                title: ['Roboto']
            },
            colors: {
                grape: colors.purple,
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),    
    ],
}
