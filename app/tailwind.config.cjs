/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				"roboto-mono": ['"Roboto Mono"', "monospace"],
			},
			colors: {
				primary: "#03467b",
				hoverPrimary: "#02243e",
			},
		},
	},
	plugins: [],
};
