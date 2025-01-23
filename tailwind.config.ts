import type {Config} from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./sanity/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            screens: {
                xs: "475px",
            },
            colors: {
                primary: {
                    "100": "#FFA570",
                    DEFAULT: "#FF6B00",
                },
                secondary: "#9B5DE5",
                black: {
                    "100": "#333333",
                    "200": "#1E1E1E",
                    "300": "#121212",
                    DEFAULT: "#000000",
                },
                white: {
                    "100": "#F4F4F4",
                    DEFAULT: "#FFFFFF",
                },
                accent: {
                    "100": "#A1FFF0",
                    DEFAULT: "#00F5D4",
                },
            },
            fontFamily: {
                "work-sans": ["var(--font-work-sans)"],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            boxShadow: {
                100: "4px 4px 0px 0px rgb(0, 0, 0)",
                200: "6px 6px 0px 2px rgb(0, 0, 0)",
                300: "6px 6px 0px 2px rgb(255, 107, 0)",
            },
        },
    },
    plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
