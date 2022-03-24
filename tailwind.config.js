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
                blue: colors.sky,
                red: colors.red,
                pink: colors.fuschia,
            },
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/typography"),
    ],
};
