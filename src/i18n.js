import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

const language = localStorage.getItem('I18N_LANGUAGE');
if (!language) {
  localStorage.setItem('I18N_LANGUAGE', 'en');
}

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(
    resourcesToBackend((language, namespace, callback) => {
      import(`./locales/${language}/${namespace}.json`)
        .then(resources => callback(null, resources))
        .catch(error => callback(error, null));
    }),
  )
  .init({
    ns: [
      'common',
      'dashboard',
      'myprofile',
      'fireAlerts',
      'events',
      'dataLayers',
      'reports',
      'socialMonitor',
      'inSitu',
      'dataLayerDashboard',
      'chatBot',
    ],
    defaultNS: 'common',
    lng: localStorage.getItem('I18N_LANGUAGE') || 'en',
    fallbackLng: 'en', // use en if detected lng is not available
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
    react: {
      useSuspense: false,
    },
    keySeparator: false, // we do not use keys in form messages.welcome
  });

export default i18n;
