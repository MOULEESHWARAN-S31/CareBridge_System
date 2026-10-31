const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, '../../CARE_BRIDGE/lib/l10n/seed_translations.json');
const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

// Additional UI keys identified during full screen audit
const extraKeys = {
  notificationsAndAlerts: {
    en: 'Notifications & Health Alerts',
    ta: 'அறிவிப்புகள் & சுகாதார எச்சரிக்கைகள்',
    hi: 'सूचनाएं और स्वास्थ्य अलर्ट',
    te: 'నోటిఫికేషన్‌లు & ఆరోగ్య హెచ్చరికలు',
    kn: 'ಅಧಿಸೂಚನೆಗಳು ಮತ್ತು ಆರೋಗ್ಯ ಎಚ್ಚರಿಕೆಗಳು',
    ml: 'അറിയിപ്പുകളും ആരോഗ്യ മുന്നറിയിപ്പുകളും',
    bn: 'বিজ্ঞপ্তি এবং স্বাস্থ্য সতর্কতা',
    mr: 'सूचना आणि आरोग्य सूचना',
    gu: 'સૂચનાઓ અને આરોગ્ય ચેતવણીઓ',
    pa: 'ਸੂਚਨਾਵਾਂ ਅਤੇ ਸਿਹਤ ਚੇਤਾਵਨੀਆਂ',
    ur: 'اطلاعات اور صحت کے انتباہات',
    or: 'ବିଜ୍ଞପ୍ତି ଏବଂ ସ୍ୱାସ୍ଥ୍ୟ ସତର୍କତା',
    as: 'অধিসূচনা আৰু স্বাস্থ্য সতৰ্কবাণী'
  },
  consentAndPrivacy: {
    en: 'Consent & Privacy',
    ta: 'ஒப்புதல் & தனியுரிமை',
    hi: 'सहमति और गोपनीयता',
    te: 'సమ్మతి & గోప్యత',
    kn: 'ಸಮ್ಮತಿ ಮತ್ತು ಗೌಪ್ಯತೆ',
    ml: 'സമ്മതവും സ്വകാര്യതയും',
    bn: 'সম্মতি এবং গোপনীয়তা',
    mr: 'संमती आणि गोपनीयता',
    gu: 'સંમતિ અને ગોપનીયતા',
    pa: 'ਸਹਿਮਤੀ ਅਤੇ ਗੋਪਨੀਯਤਾ',
    ur: 'رضامندی اور رازداری',
    or: 'ସମ୍ମତି ଏବଂ ଗୋପନୀୟତା',
    as: 'সন্মতি আৰু গোপনীয়তা'
  },
  notificationsConfiguredMsg: {
    en: 'Notifications settings configured.',
    ta: 'அறிவிப்புகள் அமைக்கப்பட்டன.',
    hi: 'अधिसूचना सेटिंग्स कॉन्फ़िगर की गईं।',
    te: 'నోటిఫికేషన్ సెట్టింగ్‌లు కాన్ఫిగర్ చేయబడ్డాయి.',
    bn: 'বিজ্ঞপ্তি সেটিংস কনফিগার করা হয়েছে।'
  },
  consentConfiguredMsg: {
    en: 'Consent & Privacy configured.',
    ta: 'ஒப்புதல் மற்றும் தனியுரிமை அமைக்கப்பட்டது.',
    hi: 'सहमति और गोपनीयता कॉन्फ़िगर की गई।',
    te: 'సమ్మతి మరియు గోప్యత కాన్ఫిగర్ చేయబడింది.',
    bn: 'সম্মতি এবং গোপনীয়তা কনফিগার করা হয়েছে।'
  },
  resetFilters: {
    en: 'Reset Filters',
    ta: 'வடிகட்டிகளை மீட்டமை',
    hi: 'फ़िल्टर रीसेट करें',
    te: 'ఫిల్టర్‌లను రీసెట్ చేయండి',
    kn: 'ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ',
    ml: 'ഫിൽട്ടറുകൾ പുനഃസജ്ജമാക്കുക',
    bn: 'ফিল্টার রিসেট করুন',
    mr: 'फिल्टर्स रीसेट करा',
    gu: 'ફિલ્ટર્સ રીસેટ કરો',
    pa: 'ਫਿਲਟਰ ਰੀਸੈੱਟ ਕਰੋ',
    ur: 'فلٹرز کو دوبارہ ترتیب دیں',
    or: 'ଫିଲ୍ଟର୍ ରିସେଟ୍ କରନ୍ତୁ',
    as: 'ফিল্টাৰ ৰিচেট কৰক'
  },
  primaryHealthcareFacility: {
    en: 'Primary Healthcare Facility',
    ta: 'ஆரம்ப சுகாதார வசதி',
    hi: 'प्राथमिक स्वास्थ्य सुविधा',
    te: 'ప్రాథమిక ఆరోగ్య సంరక్షణ సదుపాయం',
    kn: 'ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಸೌಲಭ್ಯ',
    ml: 'പ്രാഥമിക ആരോഗ്യ സംരക്ഷണ കേന്ദ്രം',
    bn: 'প্রাথমিক স্বাস্থ্যসেবা সুবিধা',
    mr: 'प्राथमिक आरोग्य सुविधा',
    gu: 'પ્રાથમિક આરોગ્ય સુવિધા',
    pa: 'ਮੁੱਢਲੀ ਸਿਹਤ ਸਹੂਲਤ',
    ur: 'پرائمری ہیلتھ کیئر کی سہولت',
    or: 'ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ ସେବା କେନ୍ଦ୍ର',
    as: 'প্ৰাথমিক স্বাস্থ্য সেৱা কেন্দ্ৰ'
  },
  nearbyHealthcareSetup: {
    en: 'Nearby Healthcare Setup',
    ta: 'அருகிலுள்ள சுகாதார அமைப்பு',
    hi: 'निकटवर्ती स्वास्थ्य सेवा सेटअप',
    te: 'సమీప ఆరోగ్య సంరక్షణ సెటప్',
    kn: 'ಹತ್ತಿರದ ಆರೋಗ್ಯ ರಕ್ಷಣಾ ಸೆಟಪ್',
    ml: 'സമീപമുള്ള ആരോഗ്യ സംരക്ഷണ സജ്ജീകരണം',
    bn: 'কাছাকাছি স্বাস্থ্যসেবা সেটআপ',
    mr: 'जवळपास आरोग्य सेवा सेटअप',
    gu: 'નજીકનું આરોગ્ય સંભાળ સેટઅપ',
    pa: 'ਨੇੜਲੀ ਸਿਹਤ ਸੰਭਾਲ ਸੈੱਟਅੱਪ',
    ur: 'قریبی ہیلتھ کیئر سیٹ اپ',
    or: 'ନିକଟସ୍ଥ ସ୍ୱାସ୍ଥ୍ୟ ସେବା ସେଟଅପ୍',
    as: 'ওচৰৰ স্বাস্থ্য সেৱা ব্যৱস্থা'
  },
  patientAccess: {
    en: 'Patient Access',
    ta: 'நோயாளி அணுகல்',
    hi: 'रोगी प्रवेश',
    te: 'రోగి ప్రవేశం',
    kn: 'ರೋಗಿಯ ಪ್ರವೇಶ',
    ml: 'രോഗി പ്രവേശനം',
    bn: 'রোগীর প্রবেশাধিকার',
    mr: 'रुग्ण प्रवेश',
    gu: 'દર્દી પ્રવેશ',
    pa: 'ਮਰੀਜ਼ ਪਹੁੰਚ',
    ur: 'مریض کی رسائی',
    or: 'ରୋଗୀ ପ୍ରବେଶ',
    as: 'ৰোগী প্ৰৱেশ'
  },
  connectAbhaCard: {
    en: 'Connect ABHA Card',
    ta: 'ஆபா அட்டையை இணைக்கவும்',
    hi: 'आभा कार्ड कनेक्ट करें',
    te: 'ఆభా కార్డును అనుసంధానించండి',
    kn: 'ಆಭಾ ಕಾರ್ಡ್ ಸಂಪರ್ಕಿಸಿ',
    ml: 'ആഭ കാർഡ് ബന്ധിപ്പിക്കുക',
    bn: 'আভা কার্ড সংযুক্ত করুন',
    mr: 'आभा कार्ड कनेक्ट करा',
    gu: 'આભા કાર્ડ કનેક્ટ કરો',
    pa: 'ਆਭਾ ਕਾਰਡ ਕਨੈਕਟ ਕਰੋ',
    ur: 'آبھا کارڈ منسلک کریں',
    or: 'ଆଭା କାର୍ଡ ସଂଯୋଗ କରନ୍ତୁ',
    as: 'আভা কাৰ্ড সংযোগ কৰক'
  },
  couldNotOpenAbhaUrl: {
    en: 'Could not open ABHA registration page',
    ta: 'ஆபா பதிவு பக்கத்தைத் திறக்க முடியவில்லை',
    hi: 'आभा पंजीकरण पृष्ठ नहीं खोला जा सका',
    te: 'ఆభా నమోదు పేజీని తెరవలేకపోయాము',
    bn: 'আভা নিবন্ধন পৃষ্ঠা খোলা যায়নি'
  },
  loadingDoctorsMsg: {
    en: 'Loading doctors...',
    ta: 'மருத்துவர்கள் பட்டியல் ஏற்றப்படுகிறது...',
    hi: 'डॉक्टरों की सूची लोड हो रही है...',
    te: 'వైద్యుల వివరాలు లోడ్ అవుతున్నాయి...',
    bn: 'ডাক্তারদের তথ্য লোড হচ্ছে...',
    mr: 'डॉक्टरांची माहिती लोड होत आहे...',
    ur: 'ڈاکٹروں کی تفصیلات لوڈ ہو رہی ہیں...'
  },
  noDoctorsAvailable: {
    en: 'No Doctors Available',
    ta: 'மருத்துவர்கள் கிடைக்கவில்லை',
    hi: 'कोई डॉक्टर उपलब्ध नहीं है',
    te: 'వైద్యులు అందుబాటులో లేరు',
    bn: 'কোনো ডাক্তার উপলব্ধ নেই',
    mr: 'कोणतेही डॉक्टर उपलब्ध नाहीत',
    ur: 'کوئی ڈاکٹر دستیاب نہیں ہے'
  },
  noDoctorsAvailableDesc: {
    en: 'No available doctors found for this hospital.',
    ta: 'இந்த மருத்துவமனைக்கு தற்போது மருத்துவர்கள் கிடைக்கவில்லை.',
    hi: 'इस अस्पताल के लिए कोई डॉक्टर उपलब्ध नहीं मिला।',
    te: 'ఈ ఆసుపత్రికి వైద్యులు అందుబాటులో లేరు.',
    bn: 'এই হাসপাতালের জন্য কোনো উপলব্ধ ডাক্তার পাওয়া যায়নি।'
  },
  yearsExpLabel: {
    en: 'years experience',
    ta: 'ஆண்டுகள் அனுபவம்',
    hi: 'वर्षों का अनुभव',
    te: 'సంవత్సరాల అనుభవం',
    kn: 'ವರ್ಷಗಳ ಅನುಭವ',
    ml: 'വർഷത്തെ പരിചയം',
    bn: 'বছরের অভিজ্ঞতা',
    mr: 'वर्षांचा अनुभव',
    gu: 'વર્ષોનો અનુભવ',
    pa: 'ਸਾਲਾਂ ਦਾ ਤਜਰਬਾ',
    ur: 'سال کا تجربہ',
    or: 'ବର୍ଷର ଅଭିଜ୍ଞତା',
    as: 'বছৰৰ অভিজ্ঞতা'
  },
  stepOfProgress: {
    en: 'Step',
    ta: 'படி',
    hi: 'चरण',
    te: 'దశ',
    kn: 'ಹಂತ',
    ml: 'ഘട്ടം',
    bn: 'ধাপ',
    mr: 'टप्पा',
    gu: 'પગલું',
    pa: 'ਕਦਮ',
    ur: 'مرحلہ',
    or: 'ପଦକ୍ଷେପ',
    as: 'পদক্ষেপ'
  },
  selectDoctorAt: {
    en: 'Select Doctor at',
    ta: 'மருத்துவரைத் தேர்ந்தெடுக்கவும்:',
    hi: 'डॉक्टर चुनें:',
    te: 'వైద్యుడిని ఎంచుకోండి:',
    bn: 'ডাক্তার নির্বাচন করুন:'
  },
  englishLang: {
    en: 'English',
    ta: 'ஆங்கிலம்',
    hi: 'अंग्रेज़ी',
    te: 'ఆంగ్లం',
    kn: 'ಇಂಗ್ಲಿಷ್',
    ml: 'ഇംഗ്ലീഷ്',
    bn: 'ইংরেজি',
    mr: 'इंग्रजी',
    gu: 'અંગ્રેજી',
    pa: 'ਅੰਗਰੇਜ਼ੀ',
    ur: 'انگریزی',
    or: 'ଇଂରାଜୀ',
    as: 'ইংৰাজী'
  },
  tamilLang: {
    en: 'Tamil',
    ta: 'தமிழ்',
    hi: 'तमिल',
    te: 'తమిళం',
    kn: 'ತಮಿಳು',
    ml: 'തമിഴ്',
    bn: 'তামিল',
    mr: 'तमिळ',
    gu: 'તમિલ',
    pa: 'ਤਮਿਲ',
    ur: 'تامل',
    or: 'ତାମିଲ',
    as: 'তামিল'
  },
  hindiLang: {
    en: 'Hindi',
    ta: 'இந்தி',
    hi: 'हिन्दी',
    te: 'హిందీ',
    kn: 'ಹಿಂದಿ',
    ml: 'ഹിന്ദി',
    bn: 'হিন্দি',
    mr: 'हिंदी',
    gu: 'હિન્દી',
    pa: 'ਹਿੰਦੀ',
    ur: 'ہندی',
    or: 'ହିନ୍ଦୀ',
    as: 'হিন্দী'
  },
  languageSelectorTitle: {
    en: 'Select Language',
    ta: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    hi: 'भाषा चुनें',
    te: 'భాషను ఎంచుకోండి',
    kn: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    ml: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    bn: 'ভাষা নির্বাচন করুন',
    mr: 'भाषा निवडा',
    gu: 'ભાષા પસંદ કરો',
    pa: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    ur: 'زبان منتخب کریں',
    or: 'ଭାଷା ଚୟନ କରନ୍ତୁ',
    as: 'ভাষা বাছনি কৰক'
  },
  languageSelectorSubtitle: {
    en: 'Choose your preferred language for CareBridge',
    ta: 'CareBridge-க்கான உங்கள் விருப்ப மொழியைத் தேர்வுசெய்யவும்',
    hi: 'केयरब्रिज के लिए अपनी पसंदीदा भाषा चुनें',
    te: 'కేర్‌బ్రిడ్జ్ కోసం మీకు నచ్చిన భాషను ఎంచుకోండి',
    kn: 'ಕೇರ್‌ಬ್ರಿಡ್ಜ್‌ಗಾಗಿ ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    ml: 'കെയർബ്രിഡ്ജിനായി നിങ്ങളുടെ ഇഷ്ടഭാഷ തിരഞ്ഞെടുക്കുക',
    bn: 'কেয়ারব্রিজের জন্য আপনার পছন্দের ভাষা নির্বাচন করুন',
    mr: 'केअरब्रिजसाठी तुमची पसंतीची भाषा निवडा',
    gu: 'કેરબ્રિજ માટે તમારી પસંદગીની ભાષા પસંદ કરો',
    pa: 'ਕੇਅਰਬ੍ਰਿਜ ਲਈ ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ',
    ur: 'کیئر برج کے لیے اپنی پسندیدہ زبان منتخب کریں',
    or: 'କେୟାରବ୍ରିଜ୍ ପାଇଁ ଆପଣଙ୍କ ପସନ୍ଦର ଭାଷା ବାଛନ୍ତୁ',
    as: 'কেয়াৰব্ৰিজৰ বাবে আপোনাৰ পছন্দৰ ভাষা বাছক'
  },
  languageSearchHint: {
    en: 'Search language...',
    ta: 'மொழியைத் தேடுக...',
    hi: 'भाषा खोजें...',
    te: 'భాషను శోధించండి...',
    kn: 'ಭಾಷೆಯನ್ನು ಹುಡುಕಿ...',
    ml: 'ഭാഷ തിരയുക...',
    bn: 'ভাষা খুঁজুন...',
    mr: 'भाषा शोधा...',
    gu: 'ભાષા શોધો...',
    pa: 'ਭਾਸ਼ਾ ਖੋਜੋ...',
    ur: 'زبان تلاش کریں...',
    or: 'ଭାଷା ଖୋଜନ୍ତୁ...',
    as: 'ভাষা সন্ধান কৰক...'
  }
};

// Add extra keys to seed en, ta, hi
for (const [k, v] of Object.entries(extraKeys)) {
  seed.en[k] = v.en;
  seed.ta[k] = v.ta || v.en;
  seed.hi[k] = v.hi || v.en;
}

// 23 Locales configuration
const ALL_LOCALES = [
  'en', 'as', 'bn', 'brx', 'doi', 'gu', 'hi', 'kn', 'ks', 'kok',
  'mai', 'ml', 'mni', 'mr', 'ne', 'or', 'pa', 'sa', 'sat', 'sd',
  'ta', 'te', 'ur'
];

// Helper to produce locale translations
function getTranslation(key, loc) {
  if (loc === 'en') return seed.en[key] || key;
  if (loc === 'ta') return seed.ta[key] || seed.en[key] || key;
  if (loc === 'hi') return seed.hi[key] || seed.en[key] || key;

  // Check extra keys first
  if (extraKeys[key] && extraKeys[key][loc]) {
    return extraKeys[key][loc];
  }

  // Devanagari script family fallback to Hindi reviewed translations
  if (['brx', 'doi', 'kok', 'mai', 'mr', 'ne', 'sa'].includes(loc)) {
    return seed.hi[key] || seed.en[key] || key;
  }

  // Bengali script family fallback to Bengali reviewed translations
  if (['as', 'mni'].includes(loc)) {
    return (extraKeys[key] && extraKeys[key].bn) || seed.hi[key] || seed.en[key] || key;
  }

  // Urdu script family fallback
  if (['ks', 'sd'].includes(loc)) {
    return (extraKeys[key] && extraKeys[key].ur) || seed.hi[key] || seed.en[key] || key;
  }

  // Dravidian script family
  if (['te', 'kn', 'ml'].includes(loc)) {
    return (extraKeys[key] && extraKeys[key][loc]) || seed.ta[key] || seed.en[key] || key;
  }

  // Indo-Aryan script family
  if (['gu', 'pa', 'or', 'bn', 'ur'].includes(loc)) {
    return (extraKeys[key] && extraKeys[key][loc]) || seed.hi[key] || seed.en[key] || key;
  }

  return seed.en[key] || key;
}

const l10nDir = path.join(__dirname, '../../CARE_BRIDGE/lib/l10n');
if (!fs.existsSync(l10nDir)) {
  fs.mkdirSync(l10nDir, { recursive: true });
}

console.log('Writing ARB files for all 23 locales into:', l10nDir);

const keysList = Object.keys(seed.en);
console.log('Total keys per ARB:', keysList.length);

for (const loc of ALL_LOCALES) {
  const arbData = {
    '@@locale': loc
  };

  for (const k of keysList) {
    arbData[k] = getTranslation(k, loc);
  }

  const arbPath = path.join(l10nDir, `app_${loc}.arb`);
  fs.writeFileSync(arbPath, JSON.stringify(arbData, null, 2), 'utf8');
  console.log(`[✓] Generated ${path.basename(arbPath)} (${Object.keys(arbData).length - 1} strings)`);
}

console.log('\n[✓] All 23 ARB files generated successfully!');
