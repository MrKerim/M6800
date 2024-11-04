/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#03467b",
				hoverPrimary: "#02243e",
			},
		},
	},
	plugins: [],
};
