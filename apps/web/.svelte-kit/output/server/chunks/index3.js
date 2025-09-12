import { r as registerLocaleLoader, i as init, b as $locale } from "./runtime.js";
const defaultLocale = "en";
registerLocaleLoader("en", () => import("./en.js"));
registerLocaleLoader("nl", () => import("./nl.js"));
function getInitialLocale() {
  return defaultLocale;
}
init({
  fallbackLocale: defaultLocale,
  initialLocale: getInitialLocale()
});
$locale.set(getInitialLocale());
