/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/apps/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			backgroundColor: {
				DEFAULT: "#F8F8F8",
				icon: {
					active: "#0074E0",
					inactive: "#0084FF",
				},
				second: "#F9F9F9",
				body: "#FFFFFF",
				"chat-me": "#DBEBFF",
				third: "#D9D9D9",
				reply: "#ADD2FF",
				sidebar: "#0084FF",
			},
			colors: {
				icon: {
					DEFAULT: "#000000",
					active: "#FFFFFF",
					inactive: "#D9D9D9",
					second: "#575757",
				},
				text: {
					DEFAULT: "#0C0C0C",
					second: "#D9D9D9",
					seen: "#343434",
				},
			},
			borderColor: {
				DEFAULT: "#D9D9D9",
			},
		},
	},
	plugins: [],
};
