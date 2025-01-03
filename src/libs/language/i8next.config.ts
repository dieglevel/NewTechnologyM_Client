import i18n, { Resource } from "i18next";
import { initReactI18next } from "react-i18next";

import { en, vi } from "./languages";

const resources: Resource = {
	vi,
	en,
};

i18n.use(initReactI18next).init({
	resources,
	lng: "vi",
	fallbackLng: "vi",
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
