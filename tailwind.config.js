const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
    "node_modules/daisyui/dist/**/*.js",
    "node_modules/react-daisyui/dist/**/*.js",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {},
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
    rtl: false,

    themes: ["light", "dark"],
  },

  plugins: [require("daisyui"), require("tailwindcss-flip")],
});
