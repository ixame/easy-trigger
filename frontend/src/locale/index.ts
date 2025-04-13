import i18next from "i18next";
import {initReactI18next} from "react-i18next";

import enUS from "@/locale/en-US";
import zhCN from "@/locale/zh-CN";

const resources = {
  'zh-CN': {
    translation: zhCN
  },
  'en-US': {
    translation: enUS
  },
};


i18next

    .use(initReactI18next)
    .init({
      // debug: true,
      lng: 'en-US',
      resources: resources,
      fallbackLng: 'en-US',
      interpolation: {
        escapeValue: false
      },
    })
    .then((t) => {
      t('menu.welcome');
    });

export default i18next;
