import { LanguageCode } from '@/lib/enums';
import { toAbsoluteUrl } from '@/lib/helpers';
import enMessages from './messages/en.json';
import ndMessages from './messages/nd.json';
import snMessages from './messages/sn.json';
import { type Language } from './types';

const I18N_MESSAGES = {
  en: enMessages,
  sn: snMessages,
  nd: ndMessages,
};

const I18N_CONFIG_KEY = 'i18nConfig';

const I18N_LANGUAGES: Language[] = [
  {
    label: 'English',
    code: LanguageCode.EN,
    direction: 'ltr',
    flag: toAbsoluteUrl('/media/flags/zimbabwe.svg'),
    messages: I18N_MESSAGES.en,
  },
  {
    label: 'Shona',
    code: LanguageCode.SN,
    direction: 'ltr',
    flag: toAbsoluteUrl('/media/flags/zimbabwe.svg'),
    messages: I18N_MESSAGES.en,
  },
  {
    label: 'Ndebele',
    code: LanguageCode.ND,
    direction: 'ltr',
    flag: toAbsoluteUrl('/media/flags/zimbabwe.svg'),
    messages: I18N_MESSAGES.en,
  },
];

const I18N_DEFAULT_LANGUAGE: Language = I18N_LANGUAGES[0];

export {
  I18N_CONFIG_KEY,
  I18N_DEFAULT_LANGUAGE,
  I18N_LANGUAGES,
  I18N_MESSAGES,
};
