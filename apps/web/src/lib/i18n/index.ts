import { browser } from '$app/environment';
import { init, register, locale } from 'svelte-i18n';

const defaultLocale = 'en';

register('en', () => import('./locales/en.json'));
register('nl', () => import('./locales/nl.json'));

// Get initial locale from localStorage or use default
function getInitialLocale() {
	if (browser) {
		const stored = localStorage.getItem('locale');
		if (stored && ['en', 'nl'].includes(stored)) {
			return stored;
		}
		// Fallback to browser language if it's supported
		const browserLang = window.navigator.language.split('-')[0];
		if (['en', 'nl'].includes(browserLang)) {
			return browserLang;
		}
	}
	return defaultLocale;
}

init({
	fallbackLocale: defaultLocale,
	initialLocale: getInitialLocale(),
});

// Set the locale immediately
locale.set(getInitialLocale());

export { locale };