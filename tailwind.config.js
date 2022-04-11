const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
  
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter var", ...defaultTheme.fontFamily.sans],
                title: ["Roboto"],
            },
            colors: {
                grape: colors.purple,
                gray: colors.stone,
                green: colors.emerald,
                blue: colors.blue,
                red: colors.red,
                pink: colors.fuschia,
                'apple-blue': '#306FDB',
                'apple-blue-light': 'rgb(51,117,229)',
            },
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/typography"),
    ],
};
