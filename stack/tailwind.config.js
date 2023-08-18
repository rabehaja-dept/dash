const plugin = require("tailwindcss/plugin");
const { fontFamily, screens } = require("tailwindcss/defaultTheme");

const global = {
  /**
   * These are base global design system colors
   * that can be applied to tailwind class names.
   * @see ./tailwind/README.md
   */
  neutral: {
    0: "#ffffff",
    50: "#f7f7f8",
    100: "#e4e4e7",
    200: "#C8C8D0",
    300: "#ADADB8",
    400: "#9292A0",
    500: "#777788",
    600: "#5F5F6D",
    700: "#474752",
    800: "#2F2F37",
    900: "#18181B",
    1000: "#000000",
  },
  hansBlue: {
    50: "#ede6fe",
    100: "#dacefd",
    200: "#b69dfb",
    300: "#916bfa",
    400: "#6d3af8",
    500: "#5115f7",
    600: "#3a07c5",
    700: "#2b0594",
    800: "#1d0462",
    900: "#0e0231",
  },
  specialty: {
    mint: "#b9d2c8",
    ocean: "#c4ced5",
    velvet: "#959ede",
    coral: "#f3cfce",
    sunrise: "#fbe3b3",
    smokey: "#cfbcb2",
  },
  alert: {
    error: { DEFAULT: "#e34949", light: "#FFE6EA" },
    warning: { DEFAULT: "#f59b15", light: "#FEF6DC", weak: "#FACC9E" },
    success: { DEFAULT: "#4caf50", light: "#E7FEF6" },
    info: { DEFAULT: "#31a0dc", light: "#E6F2FF" },
  },
};

/**
 * See: https://tailwindcss.com/docs/customizing-colors
 */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    screens: {
      xs: "320px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1920px",
      "3xl": "2560px",
      "4xl": "3840px",
      ...screens,
    },
    extend: {
      colors: {
        // Add global colors to tailwind
        ...global,
        // <-tokenized color config->
        primary: {
          DEFAULT: global.hansBlue[500],
          base: global.hansBlue[500],
          targeted: global.hansBlue[700],
          pressed: global.hansBlue[500],
          weak: global.hansBlue[50],
          hover: global.hansBlue[50],
          on: global.neutral[0],
        },
        "custom-green": "#32B553",
        "custom-blue": "#635BFF",
        background: {
          canvas: {
            DEFAULT: global.neutral[0],
            base: global.neutral[0],
            light: global.neutral[50],
            dark: global.neutral[900],
            translucent: `${global.neutral[0]}CC`,
          },
          weak: global.hansBlue[50],
          base: global.hansBlue[500],
          strong: global.hansBlue[800],
          translucent: `${global.hansBlue[500]}CC`,
          accent: {
            DEFAULT: global.hansBlue[50],
            base: global.neutral[50],
            primary: global.hansBlue[50],
          },
        },
        text: {
          DEFAULT: global.neutral[900],
          base: global.neutral[900],
          weak: global.neutral[600],
          light: global.neutral[0],
          accent: global.hansBlue[500],
          icon: {
            DEFAULT: global.neutral[700],
            base: global.neutral[700],
            accent: global.hansBlue[500],
            light: global.neutral[0],
          },
        },
        chip: {
          static: {
            DEFAULT: global.neutral[900],
            base: {
              DEFAULT: global.neutral[900],
              base: global.neutral[900],
              on: global.neutral[0],
            },
          },
          interactive: {
            DEFAULT: global.neutral[100],
            selected: {
              DEFAULT: global.neutral[900],
              base: global.neutral[900],
              on: global.neutral[0],
            },
            unselected: {
              DEFAULT: global.neutral[0],
              base: global.neutral[0],
              on: global.neutral[900],
              targeted: global.neutral[200],
            },
          },
        },
        border: {
          DEFAULT: global.neutral[300],
          base: global.neutral[300],
          weak: global.neutral[100],
          light: global.neutral[0],
          targeted: global.neutral[900],
        },
        shadow: global.neutral[900],
        banner: {
          DEFAULT: global.hansBlue[800],
          on: global.neutral[0],
        },

        alert: {
          error: global.alert.error,
          warning: global.alert.warning,
          success: global.alert.success,
          info: global.alert.info,
        },
        grey: {
          "dark-1": "#32393D",
          "dark-2": "#484B53",
          "light-1": "#F8F8FA",
          "light-2": "#F4F4FA",
          "light-3": "#E4E7F2",
          "light-4": "#BCC1D3",
        },
        link: {
          dark: "#000000",
          light: "#482FE9",
          DEFAULT: "#482FE9",
        },
        //  <!-tokenized color config->
      },
      borderWidth: {
        DEFAULT: "1px",
        base: "1px",
      },
      borderRadius: {
        none: "0px",
        input: "0px",
        full: "9999px",
      },
      padding: {
        min: "2px",
        small: "4px",
        base: "8px",
        double: "16px",
        triple: "24px",
        medium: "32px",
        large: "40px",
        xlarge: "48px",
        "2xlarge": "56px",
        "3xlarge": "64px",
        "4xlarge": "72px",
        max: "80px",
      },
      fontFamily: {
        ...fontFamily,
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        inter: ["Inter", "ui-sans-serif", "system-ui"],
        sourceCodePro: ["Source Code Pro", "ui-serif", "system-ui"],
      },
      fontSize: {
        // HEADLINES
        "headline-sm": [
          "48px",
          {
            lineHeight: "60px",
          },
        ],
        "headline-md": [
          "56px",
          {
            lineHeight: "70px",
          },
        ],
        "headline-lg": [
          "64px",
          {
            lineHeight: "80px",
          },
        ],
        // TITLES
        "title-sm": [
          "24px",
          {
            lineHeight: "30px",
          },
        ],
        "title-md": [
          "32px",
          {
            lineHeight: "40px",
          },
        ],
        "title-lg": [
          "40px",
          {
            lineHeight: "50px",
          },
        ],
        // BODY
        "body-sm": [
          "14px",
          {
            lineHeight: "24px",
          },
        ],
        "body-md": [
          "16px",
          {
            lineHeight: "28px",
          },
        ],
        "body-lg": [
          "20px",
          {
            lineHeight: "34px",
          },
        ],
        button: "18px",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".hide-webkit-cancel-button::-webkit-search-cancel-button": {
          appearance: "none",
        },
      });
    }),
    require("tailwindcss-radix")(),
  ],
};
