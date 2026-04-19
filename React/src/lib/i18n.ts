import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ptCommon from '../assets/locales/pt/common.json';
import ptNav from '../assets/locales/pt/navigation.json';
import ptDashboard from '../assets/locales/pt/dashboard.json';
import ptReservations from '../assets/locales/pt/reservations.json';
import ptAuth from '../assets/locales/pt/auth.json';
import ptCourts from '../assets/locales/pt/courts.json';
import ptProfile from '../assets/locales/pt/profile.json';
import ptSchedule from '../assets/locales/pt/schedule.json';
import enCommon from '../assets/locales/en/common.json';
import enNav from '../assets/locales/en/navigation.json';
import enDashboard from '../assets/locales/en/dashboard.json';
import enReservations from '../assets/locales/en/reservations.json';
import enAuth from '../assets/locales/en/auth.json';
import enCourts from '../assets/locales/en/courts.json';
import enProfile from '../assets/locales/en/profile.json';
import enSchedule from '../assets/locales/en/schedule.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: {
        common: ptCommon,
        navigation: ptNav,
        dashboard: ptDashboard,
        reservations: ptReservations,
        auth: ptAuth,
        courts: ptCourts,
        profile: ptProfile,
        schedule: ptSchedule,
        translation: ptCommon
      },
      en: {
        common: enCommon,
        navigation: enNav,
        dashboard: enDashboard,
        reservations: enReservations,
        auth: enAuth,
        courts: enCourts,
        profile: enProfile,
        schedule: enSchedule,
        translation: enCommon
      },
    },
    ns: ['common', 'navigation', 'dashboard', 'reservations', 'auth', 'courts', 'profile', 'schedule'],
    defaultNS: 'common',
    lng: 'pt',
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;
