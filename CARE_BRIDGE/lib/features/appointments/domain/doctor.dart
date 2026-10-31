/// Doctor domain entity with multilingual support,
/// maintaining official legal registration names and reviewed local-script transliterations.
class Doctor {
  final String id;
  final String name; // Official name preserved for legal, audit, and search
  final String hospitalId;
  final String specialization;
  final String qualification;
  final int experienceYears;
  final bool isAvailable;
  final Map<String, String>? nameTranslations;
  final Map<String, String>? specializationTranslations;

  const Doctor({
    required this.id,
    required this.name,
    required this.hospitalId,
    required this.specialization,
    required this.qualification,
    required this.experienceYears,
    this.isAvailable = true,
    this.nameTranslations,
    this.specializationTranslations,
  });

  /// Factory constructor from JSON (supports API response with localized fields)
  factory Doctor.fromJson(Map<String, dynamic> json) {
    return Doctor(
      id: json['doctor_id']?.toString() ?? json['id']?.toString() ?? '',
      name: json['official_name']?.toString() ?? json['name']?.toString() ?? '',
      hospitalId: json['hospital_id']?.toString() ?? '',
      specialization: json['specialization']?.toString() ?? '',
      qualification: json['qualification']?.toString() ?? 'MBBS',
      experienceYears: json['experience_years'] is int
          ? json['experience_years'] as int
          : int.tryParse(json['experience_years']?.toString() ?? '5') ?? 5,
      isAvailable: json['status'] == null || json['status'] == 'Active' || json['status'] == 'Available',
      nameTranslations: json['display_name'] != null && json['locale'] != null
          ? {json['locale'].toString(): json['display_name'].toString()}
          : null,
      specializationTranslations: json['display_specialization'] != null && json['locale'] != null
          ? {json['locale'].toString(): json['display_specialization'].toString()}
          : null,
    );
  }

  /// Returns localized display name if available, otherwise official name
  String getDisplayName([String? languageCode]) {
    if (languageCode == null || languageCode == 'en') {
      return name;
    }
    final lang = languageCode.toLowerCase().split('_').first;
    if (nameTranslations != null && nameTranslations!.containsKey(lang)) {
      return nameTranslations![lang]!;
    }

    // Standard transliterations for mock/core doctor records
    switch (id) {
      case 'doc_salem_01':
      case 'doc_slm_1':
        switch (lang) {
          case 'ta':
            return 'டாக்டர் கே. அருள்முருகன்';
          case 'hi':
            return 'डॉ. के. अरुलमुरुगन';
          case 'te':
            return 'డాక్టర్ కె. అరుళ్‌మురుగన్';
          case 'bn':
            return 'ডা. কে. অরুলমুরুগান';
          case 'mr':
            return 'डॉ. के. अरुलमुरुगन';
          case 'gu':
            return 'ડૉ. કે. અરુલમુરુગન';
          case 'kn':
            return 'ಡಾ. ಕೆ. ಅರುಳ್‌ಮುರುಗನ್';
          case 'ml':
            return 'ഡോ. കെ. അരുൾമുരുകൻ';
          case 'pa':
            return 'ਡਾ. ਕੇ. ਅਰੁਲਮੁਰੁਗਨ';
          case 'or':
            return 'ଡା. କେ. ଅରୁଲମୁରୁଗନ';
          case 'ur':
            return 'ڈاکٹر کے. ارول مروگن';
          case 'as':
            return 'ডাঃ কে. অৰুলমুৰুগান';
          default:
            return name;
        }
      case 'doc_salem_02':
      case 'doc_slm_2':
        switch (lang) {
          case 'ta':
            return 'டாக்டர் எஸ். மீனாட்சி';
          case 'hi':
            return 'डॉ. एस. मीनाक्षी';
          case 'te':
            return 'డాక్టర్ ఎస్. మీనాక్షి';
          case 'bn':
            return 'ডা. এস. মীনাক্ষী';
          case 'mr':
            return 'डॉ. एस. मीनाक्षी';
          case 'gu':
            return 'ડૉ. એસ. મીનાક્ષી';
          case 'kn':
            return 'ಡಾ. ಎಸ್. ಮೀನಾಕ್ಷಿ';
          case 'ml':
            return 'ഡോ. എസ്. മീനാക്ഷി';
          case 'pa':
            return 'ਡਾ. ਐੱਸ. ਮੀਨਾਕਸ਼ੀ';
          case 'or':
            return 'ଡା. ଏସ. ମୀନାକ୍ଷୀ';
          case 'ur':
            return 'ڈاکٹر ایس. میناکشی';
          case 'as':
            return 'ডাঃ এছ. মীনাক্ষী';
          default:
            return name;
        }
      case 'doc_salem_03':
      case 'doc_slm_3':
        switch (lang) {
          case 'ta':
            return 'டாக்டர் பி. ரமேஷ்';
          case 'hi':
            return 'डॉ. पी. रमेश';
          case 'te':
            return 'డాక్టర్ పి. రమేష్';
          case 'bn':
            return 'ডা. পি. রমেশ';
          case 'mr':
            return 'डॉ. पी. रमेश';
          case 'gu':
            return 'ડૉ. પી. રમેશ';
          case 'kn':
            return 'ಡಾ. ಪಿ. ರಮೇಶ್';
          case 'ml':
            return 'ഡോ. പി. രമേഷ്';
          case 'pa':
            return 'ਡਾ. ਪੀ. ਰਮੇਸ਼';
          case 'or':
            return 'ଡା. ପି. ରମେଶ';
          case 'ur':
            return 'ڈاکٹر پی. رمیش';
          case 'as':
            return 'ডাঃ পি. ৰমেশ';
          default:
            return name;
        }
      default:
        return name;
    }
  }

  /// Returns localized specialization
  String getDisplaySpecialization([String? languageCode]) {
    if (languageCode == null || languageCode == 'en') {
      return specialization;
    }
    final lang = languageCode.toLowerCase().split('_').first;
    if (specializationTranslations != null && specializationTranslations!.containsKey(lang)) {
      return specializationTranslations![lang]!;
    }

    final specLower = specialization.toLowerCase().trim();
    if (specLower.contains('medicine')) {
      switch (lang) {
        case 'ta':
          return 'பொது மருத்துவம்';
        case 'hi':
          return 'सामान्य चिकित्सा';
        case 'te':
          return 'సాధారణ వైద్యం';
        case 'bn':
          return 'সাধারণ চিকিৎসা';
        case 'mr':
          return 'सामान्य औषधोपचार';
        case 'gu':
          return 'સામાન્ય દવા';
        case 'kn':
          return 'ಸಾಮಾನ್ಯ ಔಷಧಿ';
        case 'ml':
          return 'ജനറൽ മെഡിസിൻ';
        case 'pa':
          return 'ਆਮ ਦਵਾਈ';
        case 'or':
          return 'ସାଧାରଣ ଔଷଧ';
        case 'ur':
          return 'عمومی ادویات';
        case 'as':
          return 'সাধাৰণ চিকিৎসা';
        default:
          return specialization;
      }
    } else if (specLower.contains('cardiology')) {
      switch (lang) {
        case 'ta':
          return 'இதயவியல்';
        case 'hi':
          return 'हृदय रोग विज्ञान';
        case 'te':
          return 'హృద్రోగ విభాగం';
        case 'bn':
          return 'হৃদরোগ বিজ্ঞান';
        case 'mr':
          return 'हृदयरोगतज्ज्ञ';
        case 'gu':
          return 'કાર્ડિયોલોજી';
        case 'kn':
          return 'ಹೃದ್ರೋಗ ಶಾಸ್ತ್ರ';
        case 'ml':
          return 'ഹൃദ്രോഗവിഭാഗം';
        case 'pa':
          return 'ਦਿਲ ਰੋਗ ਵਿਗਿਆਨ';
        case 'or':
          return 'ହୃଦରୋଗ ବିଭାଗ';
        case 'ur':
          return 'امراض قلب';
        case 'as':
          return 'হৃদৰোগ বিজ্ঞান';
        default:
          return specialization;
      }
    } else if (specLower.contains('paediatrics') || specLower.contains('pediatrics')) {
      switch (lang) {
        case 'ta':
          return 'குழந்தை மருத்துவம்';
        case 'hi':
          return 'बाल रोग विज्ञान';
        case 'te':
          return 'శిశువైద్యం';
        case 'bn':
          return 'শিশুচিকিৎসা';
        case 'mr':
          return 'बालरोगतज्ज्ञ';
        case 'gu':
          return 'બાળરોગ';
        case 'kn':
          return 'ಮಕ್ಕಳ ಚಿಕಿತ್ಸೆ';
        case 'ml':
          return 'ശിശുരോഗ വിഭാഗം';
        case 'pa':
          return 'ਬਾਲ ਰੋਗ ਵਿਭਾਗ';
        case 'or':
          return 'ଶିଶୁ ଚିକିତ୍ସା';
        case 'ur':
          return 'امراض اطفال';
        case 'as':
          return 'শিশু চিকিৎসা';
        default:
          return specialization;
      }
    } else if (specLower.contains('gynaecology') || specLower.contains('obstetrics')) {
      switch (lang) {
        case 'ta':
          return 'மகப்பேறு மற்றும் மகளிர் நலம்';
        case 'hi':
          return 'प्रसूति एवं स्त्री रोग';
        case 'te':
          return 'ప్రసూతి మరియు స్త్రీ జననేంద్రియ వైద్యం';
        case 'bn':
          return 'প্রসূতি ও স্ত্রীরোগ';
        case 'mr':
          return 'स्त्रीरोग व प्रसूतीशास्त्र';
        case 'gu':
          return 'સ્ત્રીરોગ અને પ્રસુતિશાસ્ત્ર';
        case 'kn':
          return 'ಪ್ರಸೂತಿ ಮತ್ತು ಸ್ತ್ರೀರೋಗ ಶಾಸ್ತ್ರ';
        case 'ml':
          return 'സ്ത്രീരോഗ വിഭാഗം';
        case 'pa':
          return 'ਔਰਤਾਂ ਅਤੇ ਜਣੇਪਾ ਰੋਗ';
        case 'or':
          return 'ପ୍ରସୂତି ଓ ସ୍ତ୍ରୀରୋଗ';
        case 'ur':
          return 'امراض نسواں';
        case 'as':
          return 'প্ৰসূতি আৰু স্ত্ৰীৰোগ';
        default:
          return specialization;
      }
    } else if (specLower.contains('orthopedics')) {
      switch (lang) {
        case 'ta':
          return 'எலும்பியல்';
        case 'hi':
          return 'अस्थि रोग विज्ञान';
        case 'te':
          return 'ఎముకల వైద్యం';
        case 'bn':
          return 'অর্থোপেডিকস';
        case 'mr':
          return 'अस्थिरोगतज्ज्ञ';
        case 'gu':
          return 'હાડકાના રોગ';
        case 'kn':
          return 'ಮೂಳೆ ರೋಗ ಚಿಕಿತ್ಸೆ';
        case 'ml':
          return 'അസ്ഥിരോഗ വിഭാഗം';
        case 'pa':
          return 'ਹੱਡੀਆਂ ਦੇ ਰੋਗ';
        case 'or':
          return 'ଅସ୍ଥିଶଲ୍ୟ ବିଭାଗ';
        case 'ur':
          return 'امراض ہڈی';
        case 'as':
          return 'হাড়ৰ চিকিৎসা';
        default:
          return specialization;
      }
    }
    return specialization;
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Doctor && runtimeType == other.runtimeType && id == other.id;

  @override
  int get hashCode => id.hashCode;
}
