const { query, isDbConnected } = require('../config/db');

/**
 * CareBridge Multilingual Database Service
 * Manages entity translations, reviewed doctor transliterations,
 * localized facility information, and terminology dictionaries.
 */

// Supported 23 languages
const SUPPORTED_LOCALES = [
  'en', 'as', 'bn', 'brx', 'doi', 'gu', 'hi', 'kn', 'ks', 'kok',
  'mai', 'ml', 'mni', 'mr', 'ne', 'or', 'pa', 'sa', 'sat', 'sd',
  'ta', 'te', 'ur'
];

// In-memory cache & fallback dataset for doctors across languages
const DOCTOR_TRANSLITERATIONS = {
  // DB Doctor 1 & Mock Doctor
  'doc_salem_01': {
    name: {
      ta: 'டாக்டர் ஏ. சுந்தரராஜன்',
      hi: 'डॉ. ए. सुंदरराजन',
      te: 'డాక్టర్ ఎ. సుందరరాజన్',
      bn: 'ডা. এ. সুন্দররাজন',
      mr: 'डॉ. ए. सुंदरराजन',
      gu: 'ડૉ. એ. સુંદરરાજન',
      kn: 'ಡಾ. ಎ. ಸುಂದರರಾಜನ್',
      ml: 'ഡോ. എ. സുന്ദരരാജൻ',
      pa: 'ਡਾ. ਏ. ਸੁੰਦਰਰਾਜਨ',
      or: 'ଡା. ଏ. ସୁନ୍ଦରରାଜନ',
      ur: 'ڈاکٹر اے. سندر راجن',
      as: 'ডাঃ এ. সুন্দৰৰাজন',
      ks: 'ڈاکٹر اے. سندر راجن',
      sd: 'ڊاڪٽر اي. سندر راجن',
      kok: 'डॉ. ए. सुंदरराजन',
      mai: 'डॉ. ए. सुंदरराजन',
      ne: 'डा. ए. सुन्दरराजन',
      sa: 'डा. ए. सुन्दरराजन्',
      brx: 'डा. ए. सुन्दरराजन',
      doi: 'डा. ए. सुंदरराजन',
      mni: 'দা. এ. সুন্দররাজন',
      sat: 'ᱰᱟ. ᱮ. ᱥᱩᱱᱫᱚᱨᱨᱟᱡᱚᱱ'
    }
  },
  'doc_salem_02': {
    name: {
      ta: 'டாக்டர் மீனா தேவி',
      hi: 'डॉ. मीना देवी',
      te: 'డాక్టర్ మీనా దేవి',
      bn: 'ডা. মীনা দেবী',
      mr: 'डॉ. मीना देवी',
      gu: 'ડૉ. મીના દેવી',
      kn: 'ಡಾ. ಮೀನಾ ದೇವಿ',
      ml: 'ഡോ. മീനാ ദേവി',
      pa: 'ਡਾ. ਮੀਨਾ ਦੇਵੀ',
      or: 'ଡା. ମୀନା ଦେବୀ',
      ur: 'ڈاکٹر مینا دیوی',
      as: 'ডাঃ মীনা দেৱী',
      ks: 'ڈاکٹر مینا دیوی',
      sd: 'ڊاڪٽر مينا ديوي',
      kok: 'डॉ. मीना देवी',
      mai: 'डॉ. मीना देवी',
      ne: 'डा. मीना देवी',
      sa: 'डा. मीना देवी',
      brx: 'डा. मीना देबी',
      doi: 'डा. मीना देवी',
      mni: 'দা. মীনা দেবী',
      sat: 'ᱰᱟ. ᱢᱤᱱᱟ ᱫᱮᱵᱤ'
    }
  },
  'doc_salem_03': {
    name: {
      ta: 'டாக்டர் எஸ். மணிகண்டன்',
      hi: 'डॉ. एस. मणिकंदन',
      te: 'డాక్టర్ ఎస్. మణికంఠన్',
      bn: 'ডা. এস. মণিকন্দন',
      mr: 'डॉ. एस. मणिकंदन',
      gu: 'ડૉ. એસ. મણિકંદન',
      kn: 'ಡಾ. ಎಸ್. ಮಣಿಕಂಡನ್',
      ml: 'ഡോ. എസ്. മണികണ്ഠൻ',
      pa: 'ਡਾ. ਐੱਸ. ਮਣੀਕੰਦਨ',
      or: 'ଡା. ଏସ. ମଣିକନ୍ଦନ',
      ur: 'ڈاکٹر ایس. منی کندن',
      as: 'ডাঃ এছ. মণিকন্দন',
      ks: 'ڈاکٹر ایس. منی کندن',
      sd: 'ڊاڪٽر ايس. مڻي ڪندن',
      kok: 'डॉ. एस. मणिकंदन',
      mai: 'डॉ. एस. मणिकंदन',
      ne: 'डा. एस. मणिकन्दन',
      sa: 'डा. एस. मणिकण्ठन्',
      brx: 'डा. एस. मणिकन्दन',
      doi: 'डा. एस. मणिकंदन',
      mni: 'দা. এস. মণিকন্দন',
      sat: 'ᱰᱟ. ᱮᱥ. ᱢᱚᱬᱤᱠᱚᱱᱫᱚᱱ'
    }
  },
  'doc_salem_04': {
    name: {
      ta: 'டாக்டர் ஆர். செந்தமிழ்ச்செல்வன்',
      hi: 'डॉ. आर. सेंथमिळसेलवन',
      te: 'డాక్టర్ ఆర్. సెంథమిళ్‌సెల్వన్',
      bn: 'ডা. আর. সেন্থামিলসেলভান',
      mr: 'डॉ. आर. सेंथमिळसेलवन',
      gu: 'ડૉ. આર. સેન્થામિલસેલવન',
      kn: 'ಡಾ. ಆರ್. ಸೆಂಥಮಿಳ್‌ಸೆಲ್ವನ್',
      ml: 'ഡോ. ആർ. സെന്തമിഴ്സെൽവൻ',
      pa: 'ਡਾ. ਆਰ. ਸੈਂਥਾਮਿਲਸੈਲਵਨ',
      or: 'ଡା. ଆର. ସେନ୍ଥାମିଲସେଲଭାନ',
      ur: 'ڈاکٹر آر. سنتھمل سلوان',
      as: 'ডাঃ আৰ. চেন্দামিলচেলভান',
      ks: 'ڈاکٹر آر. سنتھمل سلوان',
      sd: 'ڊاڪٽر آر. سنٿامل سلوان',
      kok: 'डॉ. आर. सेंथमिळसेलवन',
      mai: 'डॉ. आर. सेंथमिळसेलवन',
      ne: 'डा. आर. सेन्थमिळसेलवन',
      sa: 'डा. आर. सेन्थमिळसेल्वन्',
      brx: 'डा. आर. सेंथमिळसेलवन',
      doi: 'डा. आर. सेंथमिळसेलवन',
      mni: 'দা. আর. সেন্থামিলসেলভান',
      sat: 'ᱰᱟ. ᱟᱨ. ᱥᱮᱱᱛᱷᱟᱢᱤᱞᱥᱮᱞᱵᱷᱟᱱ'
    }
  },
  // Mock Doctor IDs
  'doc_slm_1': {
    name: {
      ta: 'டாக்டர் கே. அருள்முருகன்',
      hi: 'डॉ. के. अरुलमुरुगन',
      te: 'డాక్టర్ ಕೆ. ಅರುಳ್‌ಮುರುಗನ್',
      bn: 'ডা. কে. অরুলমুরুগান',
      mr: 'डॉ. के. अरुलमुरुगन',
      gu: 'ડૉ. કે. અરુલમુરુગન',
      kn: 'ಡಾ. ಕೆ. ಅರುಳ್‌ಮುರುಗನ್',
      ml: 'ഡോ. കെ. അരുൾമുരുകൻ',
      pa: 'ਡਾ. ਕੇ. ਅਰੁਲਮੁਰੁਗਨ',
      or: 'ଡା. କେ. ଅରୁଲମୁରୁଗନ',
      ur: 'ڈاکٹر کے. ارول مروگن',
      as: 'ডাঃ কে. অৰুলমুৰুগান',
      ks: 'ڈاکٹر کے. ارول مروگن',
      sd: 'ڊاڪٽر ڪي. ارول مرگن',
      kok: 'डॉ. के. अरुलमुरुगन',
      mai: 'डॉ. के. अरुलमुरुगन',
      ne: 'डा. के. अरुलमुरुगन',
      sa: 'डा. के. अरुलमुरुगन्',
      brx: 'डा. के. अरुलमुरुगन',
      doi: 'डा. के. अरुलमुरुगन',
      mni: 'দা. কে. অরুলমুরুগান',
      sat: 'ᱰᱟ. ᱠᱮ. ᱟᱨᱩᱞᱢᱩᱨᱩᱜᱟᱱ'
    }
  },
  'doc_slm_2': {
    name: {
      ta: 'டாக்டர் எஸ். மீனாட்சி',
      hi: 'डॉ. एस. मीनाक्षी',
      te: 'డాక్టర్ ఎస్. మీనాక్షి',
      bn: 'ডা. এস. মীনাক্ষী',
      mr: 'डॉ. एस. मीनाक्षी',
      gu: 'ડૉ. એસ. મીનાક્ષી',
      kn: 'ಡಾ. ಎಸ್. ಮೀನಾಕ್ಷಿ',
      ml: 'ഡോ. എസ്. മീനാക്ഷി',
      pa: 'ਡਾ. ਐੱਸ. ਮੀਨਾਕਸ਼ੀ',
      or: 'ଡା. ଏସ. ମୀନାକ୍ଷୀ',
      ur: 'ڈاکٹر ایس. میناکشی',
      as: 'ডাঃ এছ. মীনাক্ষী',
      ks: 'ڈاکٹر ایس. میناکشی',
      sd: 'ڊاڪٽر ايس. ميناڪشي',
      kok: 'डॉ. एस. मीनाक्षी',
      mai: 'डॉ. एस. मीनाक्षी',
      ne: 'डा. एस. मीनाक्षी',
      sa: 'डा. एस. मीनाक्षी',
      brx: 'डा. एस. मीनाक्षी',
      doi: 'डा. एस. मीनाक्षी',
      mni: 'দা. এস. মীনাক্ষী',
      sat: 'ᱰᱟ. ᱮᱥ. ᱢᱤᱱᱟᱠᱥᱤ'
    }
  },
  'doc_slm_3': {
    name: {
      ta: 'டாக்டர் பி. ரமேஷ்',
      hi: 'डॉ. पी. रमेश',
      te: 'డాక్టర్ పి. రమేష్',
      bn: 'ডা. পি. রমেশ',
      mr: 'डॉ. पी. रमेश',
      gu: 'ડૉ. પી. રમેશ',
      kn: 'ಡಾ. ಪಿ. ರಮೇಶ್',
      ml: 'ഡോ. പി. രമേഷ്',
      pa: 'ਡਾ. ਪੀ. ਰਮੇਸ਼',
      or: 'ଡା. ପି. ରମେଶ',
      ur: 'ڈاکٹر پی. رمیش',
      as: 'ডাঃ পি. ৰমেশ',
      ks: 'ڈاکٹر پی. رمیش',
      sd: 'ڊاڪٽر پي. رميش',
      kok: 'डॉ. पी. रमेश',
      mai: 'डॉ. पी. रमेश',
      ne: 'डा. पी. रमेश',
      sa: 'डा. पी. रमेशः',
      brx: 'डा. पी. रमेश',
      doi: 'डा. पी. रमेश',
      mni: 'দা. পি. রমেশ',
      sat: 'ᱰᱟ. ᱯᱤ. ᱨᱚᱢᱮᱥ'
    }
  }
};

// Standard Medical Specializations in 23 languages
const SPECIALIZATION_TRANSLATIONS = {
  'general medicine': {
    ta: 'பொது மருத்துவம்',
    hi: 'सामान्य चिकित्सा',
    te: 'సాధారణ వైద్యం',
    bn: 'সাধারণ চিকিৎসা',
    mr: 'सामान्य औषधोपचार',
    gu: 'સામાન્ય દવા',
    kn: 'ಸಾಮಾನ್ಯ ಔಷಧಿ',
    ml: 'ജനറൽ മെഡിസിൻ',
    pa: 'ਆਮ ਦਵਾਈ',
    or: 'ସାଧାରଣ ଔଷଧ',
    ur: 'عمومی ادویات',
    as: 'সাধাৰণ চিকিৎসা',
    ks: 'عمومی دوا',
    sd: 'عام دوا',
    kok: 'सामान्य वखदां',
    mai: 'सामान्य चिकित्सा',
    ne: 'सामान्य चिकित्सा',
    sa: 'सामान्यचिकित्सा',
    brx: 'गासैबो मुलि',
    doi: 'आम दवाई',
    mni: 'অচম্বা হীদাক',
    sat: 'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱨᱟᱱ'
  },
  'cardiology': {
    ta: 'இதயவியல்',
    hi: 'हृदय रोग विज्ञान',
    te: 'హృద్రోగ విభాగం',
    bn: 'হৃদরোগ বিজ্ঞান',
    mr: 'हृदयरोगतज्ज्ञ',
    gu: 'કાર્ડિયોલોજી (હૃદય રોગ)',
    kn: 'ಹೃದ್ರೋಗ ಶಾಸ್ತ್ರ',
    ml: 'ഹൃദ്രോഗവിഭാഗം',
    pa: 'ਦਿਲ ਰੋਗ ਵਿਗਿਆਨ',
    or: 'ହୃଦରୋଗ ବିଭାଗ',
    ur: 'امراض قلب',
    as: 'হৃদৰোগ বিজ্ঞান',
    ks: 'امراض دل',
    sd: 'دل جا مرض',
    kok: 'काळीज विकार',
    mai: 'हृदय रोग विज्ञान',
    ne: 'मुटुरोग विज्ञान',
    sa: 'हृद्रोगविज्ञानम्',
    brx: 'खौरां मुलि',
    doi: 'दिल दे रोग',
    mni: 'থৌনাগী লাপ্না',
    sat: 'ᱫᱤᱞ ᱨᱟᱱ'
  },
  'pediatrics': {
    ta: 'குழந்தை மருத்துவம்',
    hi: 'बाल रोग विज्ञान',
    te: 'శిశువైద్యం',
    bn: 'শিশুচিকিৎসা',
    mr: 'बालरोगतज्ज्ञ',
    gu: 'બાળરોગ વિભાગ',
    kn: 'ಮಕ್ಕಳ ಚಿಕಿತ್ಸೆ',
    ml: 'ശിശുരോഗ വിഭാഗം',
    pa: 'ਬਾਲ ਰੋਗ ਵਿਭਾਗ',
    or: 'ଶିଶୁ ଚିକିତ୍ସା ବିଭାଗ',
    ur: 'امراض اطفال',
    as: 'শিশু চিকিৎসা',
    ks: 'امراض اطفال',
    sd: 'ٻارن جا مرض',
    kok: 'भुरग्यांचे विकार',
    mai: 'शिशु रोग',
    ne: 'बालरोग विज्ञान',
    sa: 'बालचिकित्सा',
    brx: 'गथौ मुलि',
    doi: 'बच्चें दे रोग',
    mni: 'অঙাংগী হীদাক',
    sat: 'ᱜᱤᱫᱽᱨᱟᱹ ᱨᱟᱱ'
  },
  'paediatrics': {
    ta: 'குழந்தை மருத்துவம்',
    hi: 'बाल रोग विज्ञान',
    te: 'శిశువైద్యం',
    bn: 'শিশুচিকিৎসা',
    mr: 'बालरोगतज्ज्ञ',
    gu: 'બાળરોગ વિભાગ',
    kn: 'ಮಕ್ಕಳ ಚಿಕಿತ್ಸೆ',
    ml: 'ശിശുരോഗ വിഭാഗം',
    pa: 'ਬਾਲ ਰੋਗ ਵਿਭਾਗ',
    or: 'ଶିଶୁ ଚିକିତ୍ସା ବିଭାଗ',
    ur: 'امراض اطفال',
    as: 'শিশু চিকিৎসা',
    ks: 'امراض اطفال',
    sd: 'ٻارن جا مرض',
    kok: 'भुरग्यांचे विकार',
    mai: 'शिशु रोग',
    ne: 'बालरोग विज्ञान',
    sa: 'बालचिकित्सा',
    brx: 'गथौ मुलि',
    doi: 'बच्चें दे रोग',
    mni: 'অঙাংগী হীদাক',
    sat: 'ᱜᱤᱫᱽᱨᱟᱹ ᱨᱟᱱ'
  },
  'orthopedics': {
    ta: 'எலும்பியல்',
    hi: 'अस्थि रोग विज्ञान',
    te: 'ఎముకల వైద్యం',
    bn: 'অর্থোপেডিকস (হাড়ের চিকিৎসা)',
    mr: 'अस्थिरोगतज्ज्ञ',
    gu: 'હાડકાના રોગ',
    kn: 'ಮೂಳೆ ರೋಗ ಚಿಕಿತ್ಸೆ',
    ml: 'അസ്ഥിരോഗ വിഭാഗം',
    pa: 'ਹੱਡੀਆਂ ਦੇ ਰੋਗ',
    or: 'ଅସ୍ଥିଶଲ୍ୟ ବିଭାଗ',
    ur: 'امراض ہڈی',
    as: 'হাড়ৰ চিকিৎসা',
    ks: 'ہڈیوں کے امراض',
    sd: 'هڏين جا مرض',
    kok: 'हाडांचे विकार',
    mai: 'हड्डी रोग',
    ne: 'हाडजोर्नी रोग',
    sa: 'अस्थिरोगविज्ञानम्',
    brx: 'बेगेँ मुलि',
    doi: 'हड्डियें दे रोग',
    mni: 'শরু হীদাক',
    sat: 'ᱡᱟᱝ ᱨᱟᱱ'
  },
  'neurology': {
    ta: 'நரம்பியல்',
    hi: 'तंत्रिका रोग विज्ञान (न्यूरोलॉजी)',
    te: 'నాడీ సంబంధిత వైద్యం',
    bn: 'নিউরোলজি (স্নায়ুরোগ)',
    mr: 'मज्जारोगतज्ज्ञ',
    gu: 'ચેતાતંત્રના રોગ',
    kn: 'ನರರೋಗ ಶಾಸ್ತ್ರ',
    ml: 'ന്യൂറോളജി (നാഡീരോഗം)',
    pa: 'ਨਾੜੀ ਰੋਗ ਵਿਗਿਆਨ',
    or: 'ସ୍ନାୟୁ ରୋଗ ବିଭାଗ',
    ur: 'امراض اعصاب',
    as: 'স্নায়ু ৰোগ বিজ্ঞান',
    ks: 'امراض اعصاب',
    sd: 'نسن جا مرض',
    kok: 'शिर विकार',
    mai: 'तंत्रिका रोग',
    ne: 'नसारोग विज्ञान',
    sa: 'नाडीरोगविज्ञानम्',
    brx: 'रौ मुलि',
    doi: 'नाड़ी दे रोग',
    mni: 'শাগোন হীদাক',
    sat: 'ᱥᱤᱨ ᱨᱟᱱ'
  },
  'general surgery': {
    ta: 'பொது அறுவை சிகிச்சை',
    hi: 'सामान्य शल्य चिकित्सा',
    te: 'సాధారణ శస్త్రచికిత్స',
    bn: 'সাধারণ শল্যচিকিৎসা',
    mr: 'सामान्य शस्त्रक्रिया',
    gu: 'સામાન્ય સર્જરી',
    kn: 'ಸಾಮಾನ್ಯ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ',
    ml: 'ജനറൽ സർജറി',
    pa: 'ਜਨਰਲ ਸਰਜਰੀ',
    or: 'ସାଧାରଣ ଶଲ୍ୟଚିକିତ୍ସା',
    ur: 'عمومی سرجری',
    as: 'সাধাৰণ অস্ত্ৰোপচাৰ',
    ks: 'عمومی سرجری',
    sd: 'عام سرجري',
    kok: 'सामान्य शस्त्रक्रिया',
    mai: 'शल्य चिकित्सा',
    ne: 'सामान्य शल्यक्रिया',
    sa: 'शल्यचिकित्सा',
    brx: 'सार्जरी मुलि',
    doi: 'जनरल सर्जरी',
    mni: 'অচম্বা ওপরেসন',
    sat: 'ᱥᱟᱫᱷᱟᱨᱚᱱ ᱚᱯᱟᱨᱮᱥᱚᱱ'
  },
  'pulmonology': {
    ta: 'நுரையீரல் மருத்துவம்',
    hi: 'श्वसन एवं फुफ्फुस रोग',
    te: 'శ్వాసకోశ వైద్యం',
    bn: 'বক্ষব্যাধি চিকিৎসা',
    mr: 'श्वसनविकारतज्ज्ञ',
    gu: 'ફેફસાં અને શ્વાસના રોગ',
    kn: 'ಶ್ವಾಸಕೋಶ ರೋಗ ಶಾಸ್ತ್ರ',
    ml: 'ശ്വാസകോശ വിഭാഗം',
    pa: 'ਫੇਫੜਿਆਂ ਦੇ ਰੋਗ',
    or: 'ଫୁସଫୁସ ରୋଗ ବିଭାଗ',
    ur: 'امراض پھیپھڑے',
    as: 'বক্ষ ৰোগ',
    ks: 'امراض پھیپھڑے',
    sd: 'ڦڦڙن جا مرض',
    kok: 'श्वास विकार',
    mai: 'फेफड़ा रोग',
    ne: 'श्वासप्रश्वास रोग',
    sa: 'फुफ्फुसरोगविज्ञानम्',
    brx: 'हां मुलि',
    doi: 'फेफड़े दे रोग',
    mni: 'শাগুম হীদাক',
    sat: 'ᱯᱷᱮᱯᱷᱲᱟ ᱨᱟᱱ'
  },
  'obstetrics & gynaecology': {
    ta: 'மகப்பேறு மற்றும் மகளிர் நலம்',
    hi: 'प्रसूति एवं स्त्री रोग',
    te: 'ప్రసూతి మరియు స్త్రీ జననేంద్రియ వైద్యం',
    bn: 'প্রসূতি ও স্ত্রীরোগ',
    mr: 'स्त्रीरोग व प्रसूतीशास्त्र',
    gu: 'સ્ત્રીરોગ અને પ્રસુતિશાસ્ત્ર',
    kn: 'ಪ್ರಸೂತಿ ಮತ್ತು ಸ್ತ್ರೀರೋಗ ಶಾಸ್ತ್ರ',
    ml: 'സ്ത്രീരോഗ പ്രസവചികിത്സ വിഭാഗം',
    pa: 'ਔਰਤਾਂ ਅਤੇ ਜਣੇਪਾ ਰੋਗ',
    or: 'ପ୍ରସୂତି ଓ ସ୍ତ୍ରୀରୋଗ ବିଭାଗ',
    ur: 'امراض نسواں و زچگی',
    as: 'প্ৰসূতি আৰু স্ত্ৰীৰোগ',
    ks: 'امراض نسواں',
    sd: 'عورتن جا مرض',
    kok: 'बायलांचे विकार',
    mai: 'स्त्री रोग',
    ne: 'प्रसूति तथा स्त्रीरोग',
    sa: 'प्रसूतिस्त्रीरोगविज्ञानम्',
    brx: 'हिनजाव मुलि',
    doi: 'जनाना रोग',
    mni: 'নুপি হীদাক',
    sat: 'ᱛᱤᱨᱞᱟᱹ ᱨᱟᱱ'
  }
};

// Hospital localized names & facility types
const HOSPITAL_TRANSLATIONS = {
  'fac_gh_salem': {
    name: {
      ta: 'அரசு மோகன் குமாரமங்கலம் மருத்துவக் கல்லூரி மருத்துவமனை',
      hi: 'शासकीय मोहन कुमारमंगलम मेडिकल कॉलेज अस्पताल',
      te: 'ప్రభుత్వ మోహన్ కుమారమంగళం మెడికల్ కాలేజ్ హాస్పిటల్',
      bn: 'সরকারি মোহন কুমারমঙ্গলম মেডিকেল কলেজ হাসপাতাল',
      mr: 'शासकीय मोहन कुमारमंगलम मेडिकल कॉलेज रुग्णालय',
      gu: 'સરકારી મોહન કુમારમંગલમ મેડિકલ કોલેજ હોસ્પિટલ',
      kn: 'ಸರ್ಕಾರಿ ಮೋಹನ್ ಕುಮಾರಮಂಗಳಂ ವೈದ್ಯಕೀಯ ಕಾಲೇಜು ಆಸ್ಪತ್ರೆ',
      ml: 'ഗവൺമെന്റ് മോഹൻ കുമാരമംഗലം മെഡിക്കൽ കോളേജ് ഹോസ്പിറ്റൽ',
      pa: 'ਸਰਕਾਰੀ ਮੋਹਨ ਕੁਮਾਰਮੰਗਲਮ ਮੈਡੀਕਲ ਕਾਲਜ ਹਸਪਤਾਲ',
      or: 'ସରକାରୀ ମୋହନ କୁମାରମଙ୍ଗଳମ ମେଡିକାଲ କଲେଜ ଡାକ୍ତରଖାନା',
      ur: 'گورنمنٹ موہن کمار منگلم میڈیکل کالج ہسپتال',
      as: 'চৰকাৰী মোহন কুমাৰমংগলম মেডিকেল কলেজ হাস্পতাল'
    }
  },
  'fac_phc_salem': {
    name: {
      ta: 'ஆரம்ப சுகாதார நிலையம் - சூரமங்கலம்',
      hi: 'प्राथमिक स्वास्थ्य केंद्र - सूरमंगलम',
      te: 'ప్రాథమిక ఆరోగ్య కేంద్రం - సూరమంగళం',
      bn: 'প্রাথমিক স্বাস্থ্য কেন্দ্র - সুরমঙ্গলাম',
      mr: 'प्राथमिक आरोग्य केंद्र - सुरमंगलम',
      gu: 'પ્રાથમિક આરોગ્ય કેન્દ્ર - સુરમંગલમ',
      kn: 'ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ - ಸೂರಮಂಗಲಂ',
      ml: 'പ്രാഥമിക ആരോഗ്യ കേന്ദ്രം - സൂരമംഗലം',
      pa: 'ਮੁੱਢਲਾ ਸਿਹਤ ਕੇਂਦਰ - ਸੂਰਮੰਗਲਮ',
      or: 'ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର - ସୁରମଙ୍ଗଳମ',
      ur: 'پرائمری ہیلتھ سینٹر - سورمنگلم'
    }
  },
  'fac_gh_omalur': {
    name: {
      ta: 'ஓமலூர் வட்டார அரசு மருத்துவமனை',
      hi: 'ओमलूर उप-जिला सरकारी अस्पताल',
      te: 'ఓమలూర్ ఉప జిల్లా ప్రభుత్వ ఆసుపత్రి',
      bn: 'ওমালুর মহকুমা সরকারি হাসপাতাল',
      mr: 'ओमलूर उप-जिल्हा शासकीय रुग्णालय',
      ur: 'اوملور سب ڈسٹرکٹ سرکاری ہسپتال'
    }
  },
  'fac_gh_cbe': {
    name: {
      ta: 'கோயம்புத்தூர் மருத்துவக் கல்லூரி மருத்துவமனை (CMCH)',
      hi: 'कोयंबटूर मेडिकल कॉलेज अस्पताल (सीएमसीएच)',
      te: 'కోయంబత్తూర్ మెడికల్ కాలేజ్ హాస్పిటల్',
      bn: 'কোয়েম্বাটোর মেডিকেল কলেজ হাসপাতাল',
      mr: 'कोईम्बतूर मेडिकल कॉलेज रुग्णालय',
      ur: 'کوئمبٹور میڈیکل کالج ہسپتال'
    }
  },
  'fac_gh_chn': {
    name: {
      ta: 'ராஜீவ் காந்தி அரசு பொது மருத்துவமனை',
      hi: 'राजीव गांधी शासकीय सामान्य अस्पताल',
      te: 'రాజీవ్ గాంధీ ప్రభుత్వ జనరల్ హాస్పిటల్',
      bn: 'রাজীব গান্ধী সরকারি জেনারেল হাসপাতাল',
      mr: 'राजीव गांधी शासकीय सामान्य रुग्णालय',
      ur: 'راجیو گاندھی گورنمنٹ جنرل ہسپتال'
    }
  }
};

const FACILITY_TYPE_TRANSLATIONS = {
  'Hospital': {
    ta: 'மருத்துவமனை',
    hi: 'अस्पताल',
    te: 'ఆసుపత్రి',
    bn: 'হাসপাতাল',
    mr: 'रुग्णालय',
    gu: 'હોસ્પિટલ',
    kn: 'ಆಸ್ಪತ್ರೆ',
    ml: 'ആശുപത്രി',
    pa: 'ਹਸਪਤਾਲ',
    or: 'ଡାକ୍ତରଖାନା',
    ur: 'ہسپتال',
    as: 'হাস্পতাল'
  },
  'PHC': {
    ta: 'ஆரம்ப சுகாதார நிலையம்',
    hi: 'प्राथमिक स्वास्थ्य केंद्र (PHC)',
    te: 'ప్రాథమిక ఆరోగ్య కేంద్రం',
    bn: 'প্রাথমিক স্বাস্থ্য কেন্দ্র',
    mr: 'प्राथमिक आरोग्य केंद्र',
    gu: 'પ્રાથમિક આરોગ્ય કેન્દ્ર',
    kn: 'ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ',
    ml: 'പ്രാഥമിക ആരോഗ്യ കേന്ദ്രം',
    pa: 'ਮੁੱਢਲਾ ਸਿਹਤ ਕੇਂਦਰ',
    or: 'ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର',
    ur: 'پرائمری ہیلتھ سینٹر',
    as: 'প্ৰাথমিক স্বাস্থ্য কেন্দ্ৰ'
  }
};

/**
 * Normalizes input locale string into language code (e.g. 'ta_IN' -> 'ta')
 */
function normalizeLocale(rawLocale) {
  if (!rawLocale) return 'en';
  const clean = rawLocale.trim().toLowerCase().split(',')[0].split(';')[0];
  const langCode = clean.split('-')[0].split('_')[0];
  return SUPPORTED_LOCALES.includes(langCode) ? langCode : 'en';
}

/**
 * Ensures entity_translations table exists in PostgreSQL
 */
async function ensureSchema() {
  if (!isDbConnected()) return;

  try {
    await query(`
      CREATE TABLE IF NOT EXISTS entity_translations (
        id SERIAL PRIMARY KEY,
        entity_type VARCHAR(50) NOT NULL,
        entity_id VARCHAR(100) NOT NULL,
        field_name VARCHAR(50) NOT NULL,
        locale VARCHAR(10) NOT NULL,
        translated_value TEXT NOT NULL,
        translation_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED',
        reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_entity_translation UNIQUE (entity_type, entity_id, field_name, locale)
      );

      CREATE INDEX IF NOT EXISTS idx_entity_trans_lookup 
        ON entity_translations (entity_type, entity_id, locale);
      CREATE INDEX IF NOT EXISTS idx_entity_trans_locale 
        ON entity_translations (locale);
    `);
  } catch (err) {
    console.warn('[DB TRANSLATIONS] Schema setup skipped or existing:', err.message);
  }
}

/**
 * Localizes a Doctor object preserving official English record while
 * attaching reviewed localized transliteration and specialization.
 */
function localizeDoctor(doc, rawLocale) {
  if (!doc) return doc;
  const locale = normalizeLocale(rawLocale);
  if (locale === 'en') {
    return {
      ...doc,
      official_name: doc.name,
      display_name: doc.name,
      display_specialization: doc.specialization,
      locale: 'en'
    };
  }

  // 1. Resolve localized name (transliteration)
  const idKey = doc.doctor_id || (doc.id ? `doc_${doc.id}` : null);
  let localizedName = doc.name;
  if (idKey && DOCTOR_TRANSLITERATIONS[idKey]?.name?.[locale]) {
    localizedName = DOCTOR_TRANSLITERATIONS[idKey].name[locale];
  } else if (DOCTOR_TRANSLITERATIONS[doc.name]?.name?.[locale]) {
    localizedName = DOCTOR_TRANSLITERATIONS[doc.name].name[locale];
  }

  // 2. Resolve localized specialization
  let localizedSpec = doc.specialization;
  if (doc.specialization) {
    const specLower = doc.specialization.trim().toLowerCase();
    if (SPECIALIZATION_TRANSLATIONS[specLower]?.[locale]) {
      localizedSpec = SPECIALIZATION_TRANSLATIONS[specLower][locale];
    }
  }

  return {
    ...doc,
    official_name: doc.name, // Preserved for legal, audit, and identification
    display_name: localizedName,
    display_specialization: localizedSpec,
    locale
  };
}

/**
 * Localizes a Hospital object preserving official registration name while
 * providing localized display name, facility type, and department descriptions.
 */
function localizeHospital(hosp, rawLocale) {
  if (!hosp) return hosp;
  const locale = normalizeLocale(rawLocale);
  if (locale === 'en') {
    return {
      ...hosp,
      official_name: hosp.name,
      display_name: hosp.name,
      display_type: hosp.type,
      locale: 'en'
    };
  }

  const hospId = hosp.hospital_id || (hosp.id ? `fac_${hosp.id}` : null);
  let localizedName = hosp.name;
  if (hospId && HOSPITAL_TRANSLATIONS[hospId]?.name?.[locale]) {
    localizedName = HOSPITAL_TRANSLATIONS[hospId].name[locale];
  }

  let localizedType = hosp.type;
  if (hosp.type && FACILITY_TYPE_TRANSLATIONS[hosp.type]?.[locale]) {
    localizedType = FACILITY_TYPE_TRANSLATIONS[hosp.type][locale];
  }

  return {
    ...hosp,
    official_name: hosp.name,
    display_name: localizedName,
    display_type: localizedType,
    locale
  };
}

/**
 * Query entity translation from database with fallback to memory
 */
async function getEntityTranslation(entityType, entityId, fieldName, rawLocale) {
  const locale = normalizeLocale(rawLocale);
  if (locale === 'en') return null;

  if (isDbConnected()) {
    try {
      const res = await query(
        `SELECT translated_value FROM entity_translations 
         WHERE entity_type = $1 AND entity_id = $2 AND field_name = $3 AND locale = $4 
         LIMIT 1;`,
        [entityType, entityId, fieldName, locale]
      );
      if (res.rows.length > 0) {
        return res.rows[0].translated_value;
      }
    } catch (_) {}
  }

  // Fallback checks
  if (entityType === 'doctor' && fieldName === 'name') {
    return DOCTOR_TRANSLITERATIONS[entityId]?.name?.[locale] || null;
  }
  if (entityType === 'specialization') {
    return SPECIALIZATION_TRANSLATIONS[entityId.toLowerCase()]?.[locale] || null;
  }
  if (entityType === 'hospital' && fieldName === 'name') {
    return HOSPITAL_TRANSLATIONS[entityId]?.name?.[locale] || null;
  }

  return null;
}

module.exports = {
  SUPPORTED_LOCALES,
  normalizeLocale,
  ensureSchema,
  localizeDoctor,
  localizeHospital,
  getEntityTranslation,
  DOCTOR_TRANSLITERATIONS,
  SPECIALIZATION_TRANSLATIONS,
  HOSPITAL_TRANSLATIONS,
  FACILITY_TYPE_TRANSLATIONS
};
