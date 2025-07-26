/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0094A1",
          50: "#AADBE0",
          100: "#80C9D0",
          200: "#66B8C2",
          300: "#4DA6B3",
          400: "#3394A5",
          500: "#007B86",
          600: "#006B76",
          700: "#004A51",

        },
        black: {
          200: "#888888",
          50: "#D0D0D0",
          100: "#B0B0B0",
          500: "#121212"
        },
        secondary: "#72BF45",
        danger: "#FF0000",
        bgGradLeft: "#0094A1",
        bgGradRight: "#003136",
        lightgray: "#666666",
        nuseryRed: "#FFE6E6",
        "nurseryBlue-10": "#E6F4F6",
        lessEmphasis: "#5976A1",
        errorMain: "#EA4336",
        "error-500": "#FF2B2B",
        "textGray": "#666666",
        "alternateBlack": "#001928",

        "nurseryGreen-10": "#F1F9EC",
        "gray": "#374B58",
        "gray-300": "#B0B0B0",
        "gray-200": "#E3E3E3",


      },
      width: {
        "33rem": "33rem"
      },
      backgroundImage: {
        'login-image': "url('/images/Section.svg')",
        'signup-image': "url('/images/signup.png')"
      },
      keyframes: {
        fadeOutPulse: {
          "0%": {
            opacity: "1",
            transform: "scale(1)"
          },
          "50%": {
            opacity: "0.5",
            transform: "scale(1.1)"
          },
          "100%": {
            opacity: "0",
            transform: "scale(1.2)"
          }
        }
      },
      animation: {
        pulseLoad: "fadeOutPulse 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite"
      },
      gridTemplateColumns: {
        '3': 'repeat(3, minmax(0, 1fr))',
      },


    },
  },
  plugins: [],
}

