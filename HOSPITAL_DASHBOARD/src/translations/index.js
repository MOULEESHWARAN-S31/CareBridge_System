import en from './en';
import hi from './hi';
import pa from './pa';
import ta from './ta';
import te from './te';
import kn from './kn';
import ml from './ml';
import mr from './mr';
import bn from './bn';
import gu from './gu';
import ur from './ur';
import { or, as_lang, sa, kok, ks, ne, sd, mni, brx, doi, mai, sat } from './others';

// All supported languages
export const translations = { en, hi, pa, ta, te, kn, ml, mr, bn, gu, ur, or, as: as_lang, sa, kok, ks, ne, sd, mni, brx, doi, mai, sat };

// Language metadata (code → display info)
export const LANGUAGES = [
  { code: 'en',  name: 'English',     native: 'English',    rtl: false },
  { code: 'hi',  name: 'Hindi',       native: 'हिन्दी',      rtl: false },
  { code: 'ta',  name: 'Tamil',       native: 'தமிழ்',       rtl: false },
  { code: 'te',  name: 'Telugu',      native: 'తెలుగు',      rtl: false },
  { code: 'kn',  name: 'Kannada',     native: 'ಕನ್ನಡ',       rtl: false },
  { code: 'ml',  name: 'Malayalam',   native: 'മലയാളം',     rtl: false },
  { code: 'mr',  name: 'Marathi',     native: 'मराठी',       rtl: false },
  { code: 'bn',  name: 'Bengali',     native: 'বাংলা',       rtl: false },
  { code: 'gu',  name: 'Gujarati',    native: 'ગુજરાતી',    rtl: false },
  { code: 'pa',  name: 'Punjabi',     native: 'ਪੰਜਾਬੀ',     rtl: false },
  { code: 'ur',  name: 'Urdu',        native: 'اردو',        rtl: true  },
  { code: 'or',  name: 'Odia',        native: 'ଓଡ଼ିଆ',       rtl: false },
  { code: 'as',  name: 'Assamese',    native: 'অসমীয়া',     rtl: false },
  { code: 'sa',  name: 'Sanskrit',    native: 'संस्कृत',      rtl: false },
  { code: 'kok', name: 'Konkani',     native: 'कोंकणी',      rtl: false },
  { code: 'ks',  name: 'Kashmiri',    native: 'کٲشُر',       rtl: true  },
  { code: 'ne',  name: 'Nepali',      native: 'नेपाली',      rtl: false },
  { code: 'sd',  name: 'Sindhi',      native: 'سنڌي',        rtl: true  },
  { code: 'mni', name: 'Manipuri',    native: 'মৈতৈলোন',    rtl: false },
  { code: 'brx', name: 'Bodo',        native: 'बड़ो',         rtl: false },
  { code: 'doi', name: 'Dogri',       native: 'डोगरी',       rtl: false },
  { code: 'mai', name: 'Maithili',    native: 'मैथिली',      rtl: false },
  { code: 'sat', name: 'Santali',     native: 'ᱥᱟᱱᱛᱟᱲᱤ',   rtl: false },
];

// RTL language codes
export const RTL_LANGS = ['ur', 'ks', 'sd'];

export default translations;
