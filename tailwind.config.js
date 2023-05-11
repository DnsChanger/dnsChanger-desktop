module.exports = {
    content: [
        "./src/renderer/**/*.{js,jsx,ts,tsx}",
        "node_modules/daisyui/dist/**/*.js",
        "node_modules/react-daisyui/dist/**/*.js",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#0066ff",
                secondary: "#161B25",
                ctaGradientStart: "#176ae5",
                ctaGradientEnd: "#0066ff",
            },
            keyframes: {
                fadeIn: {
                    from: {
                        opacity: "0",
                    },
                    to: {
                        opacity: "1",
                    },
                },
            },
            animation: {
                fadeIn: "fadeIn 0.3s ease-in-out",
            },
        },
    },
    daisyui: {
        styled: true,
        base: true,
        utils: true,
        logs: false,
        rtl: true,

        themes: [
            "light",
            "dark",
        ],
    },

    plugins: [require("daisyui"), require("tailwindcss-flip")],
};


// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}"
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }


const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
        "node_modules/daisyui/dist/**/*.js",
        "node_modules/react-daisyui/dist/**/*.js",
    ],

    theme: {
        extend: {
            colors: {
                primary: "#0066ff",
                secondary: "#161B25",
                ctaGradientStart: "#176ae5",
                ctaGradientEnd: "#0066ff",
            },
            keyframes: {
                fadeIn: {
                    from: {
                        opacity: "0",
                    },
                    to: {
                        opacity: "1",
                    },
                },
            },
            animation: {
                fadeIn: "fadeIn 0.3s ease-in-out",
            },
        },
    },
    daisyui: {
        styled: true,
        base: true,
        utils: true,
        logs: false,
        rtl: true,

        themes: [
            "light",
            "dark",
        ],
    },

    plugins: [require("daisyui"), require("tailwindcss-flip")],
});