module.exports = {
	purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		boxShadow: {
			xl: "0 0px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
		},
		extend: {
			spacing: {
				"1/2": "50%",
				"1/3": "33.333333%",
				"2/3": "66.666667%",
				"1/4": "25%",
				"2/4": "50%",
				"3/4": "75%",
				"1/5": "20%",
				"2/5": "40%",
				"3/5": "60%",
				"4/5": "80%",
				"1/6": "16.666667%",
				"2/6": "33.333333%",
				"3/6": "50%",
				"4/6": "66.666667%",
				"5/6": "83.333333%",
				"1/12": "8.333333%",
				"2/12": "16.666667%",
				"3/12": "25%",
				"4/12": "33.333333%",
				"5/12": "41.666667%",
				"6/12": "50%",
				"7/12": "58.333333%",
				"8/12": "66.666667%",
				"9/12": "75%",
				"10/12": "83.333333%",
				"11/12": "91.666667%",
				"1/1": "100%",
			},
		},
	},
	variants: {
		extend: {
			opacity: ["disabled"],
			cursor: ["hover", "focus"],
		},
	},
	plugins: [
		require("@tailwindcss/forms"),
		require("@tailwindcss/line-clamp"),
	],
};
