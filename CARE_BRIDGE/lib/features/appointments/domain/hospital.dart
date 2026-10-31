/// Hospital & Healthcare Facility entity with multilingual support,
/// preserving official registration names and coordinates while providing localized display.
class Hospital {
  final String id;
  final String name; // Official registration name
  final String districtId;
  final String locationName;
  final String type;
  final String contactNumber;
  final String address;
  final double? latitude;
  final double? longitude;
  final String hospitalType;
  final Map<String, String>? nameTranslations;
  final Map<String, String>? typeTranslations;

  bool get isGovernment => hospitalType.toLowerCase() == 'government';
  bool get isPrivate => hospitalType.toLowerCase() == 'private';

  const Hospital({
    required this.id,
    required this.name,
    required this.districtId,
    required this.locationName,
    required this.type,
    required this.contactNumber,
    required this.address,
    this.latitude,
    this.longitude,
    this.hospitalType = 'Government',
    this.nameTranslations,
    this.typeTranslations,
  });

  factory Hospital.fromJson(Map<String, dynamic> json) {
    return Hospital(
      id: json['hospital_id']?.toString() ?? json['id']?.toString() ?? '',
      name: json['official_name']?.toString() ?? json['name']?.toString() ?? '',
      districtId: json['district']?.toString() ?? 'dist_salem',
      locationName: json['city']?.toString() ?? json['location']?.toString() ?? 'Salem',
      type: json['display_type']?.toString() ?? json['type']?.toString() ?? 'Hospital',
      contactNumber: json['contact_phone']?.toString() ?? json['phone']?.toString() ?? '108',
      address: json['address']?.toString() ?? '',
      latitude: json['latitude'] is num ? (json['latitude'] as num).toDouble() : null,
      longitude: json['longitude'] is num ? (json['longitude'] as num).toDouble() : null,
      hospitalType: json['ownership_type']?.toString() ?? 'Government',
      nameTranslations: json['display_name'] != null && json['locale'] != null
          ? {json['locale'].toString(): json['display_name'].toString()}
          : null,
      typeTranslations: json['display_type'] != null && json['locale'] != null
          ? {json['locale'].toString(): json['display_type'].toString()}
          : null,
    );
  }

  /// Returns localized hospital name if available, otherwise official name
  String getDisplayName([String? languageCode]) {
    if (languageCode == null || languageCode == 'en') {
      return name;
    }
    final lang = languageCode.toLowerCase().split('_').first;
    if (nameTranslations != null && nameTranslations!.containsKey(lang)) {
      return nameTranslations![lang]!;
    }

    if (id.contains('salem_gh') || id.contains('slm_gh') || name.contains('Mohan Kumaramangalam')) {
      switch (lang) {
        case 'ta':
          return 'அரசு மோகன் குமாரமங்கலம் மருத்துவக் கல்லூரி மருத்துவமனை';
        case 'hi':
          return 'शासकीय मोहन कुमारमंगलम मेडिकल कॉलेज अस्पताल';
        case 'te':
          return 'ప్రభుత్వ మోహన్ కుమారమంగళం మెడికల్ కాలేజ్ హాస్పిటల్';
        case 'bn':
          return 'সরকারি মোহন কুমারমঙ্গলম মেডিকেল কলেজ হাসপাতাল';
        case 'mr':
          return 'शासकीय मोहन कुमारमंगलम मेडिकल कॉलेज रुग्णालय';
        case 'gu':
          return 'સરકારી મોહન કુમારમંગલમ મેડિકલ કોલેજ હોસ્પિટલ';
        case 'kn':
          return 'ಸರ್ಕಾರಿ ಮೋಹನ್ ಕುಮಾರಮಂಗಳಂ ವೈದ್ಯಕೀಯ ಕಾಲೇಜು ಆಸ್ಪತ್ರೆ';
        case 'ml':
          return 'ഗവൺമെന്റ് മോഹൻ കുമാരമംഗലം മെഡിക്കൽ കോളേജ് ഹോസ്പിറ്റൽ';
        case 'pa':
          return 'ਸਰਕਾਰੀ ਮੋਹਨ ਕੁਮਾਰਮੰਗਲਮ ਮੈਡੀਕਲ ਕਾਲਜ ਹਸਪਤਾਲ';
        case 'or':
          return 'ସରକାରୀ ମୋହନ କୁମାରମଙ୍ଗଳମ ମେଡିକାଲ କଲେଜ ଡାକ୍ତରଖାନା';
        case 'ur':
          return 'گورنمنٹ موہن کمار منگلم میڈیکل کالج ہسپتال';
        case 'as':
          return 'চৰকাৰী মোহন কুমাৰমংগলম মেডিকেল কলেজ হাস্পতাল';
        default:
          return name;
      }
    } else if (id.contains('phc') || name.contains('Primary Health Centre')) {
      switch (lang) {
        case 'ta':
          return 'ஆரம்ப சுகாதார நிலையம் - ஓமலூர்';
        case 'hi':
          return 'प्राथमिक स्वास्थ्य केंद्र - ओमलूर';
        case 'te':
          return 'ప్రాథమిక ఆరోగ్య కేంద్రం - ఓమలూర్';
        case 'bn':
          return 'প্রাথমিক স্বাস্থ্য কেন্দ্র - ওমালুর';
        case 'mr':
          return 'प्राथमिक आरोग्य केंद्र - ओमलूर';
        case 'gu':
          return 'પ્રાથમિક આરોગ્ય કેન્દ્ર - ઓમલૂર';
        case 'kn':
          return 'ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ - ಓಮಲೂರು';
        case 'ml':
          return 'പ്രാഥമിക ആരോഗ്യ കേന്ദ്രം - ഓമലൂർ';
        case 'pa':
          return 'ਮੁੱਢਲਾ ਸਿਹਤ ਕੇਂਦਰ - ਓਮਲੂਰ';
        case 'or':
          return 'ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର - ଓମାଲୁର';
        case 'ur':
          return 'پرائمری ہیلتھ سینٹر - اوملور';
        case 'as':
          return 'প্ৰাথমিক স্বাস্থ্য কেন্দ্ৰ - ওমালুৰ';
        default:
          return name;
      }
    } else if (name.contains('Rajiv Gandhi')) {
      switch (lang) {
        case 'ta':
          return 'ராஜீவ் காந்தி அரசு பொது மருத்துவமனை';
        case 'hi':
          return 'राजीव गांधी शासकीय सामान्य अस्पताल';
        case 'te':
          return 'రాజీవ్ గాంధీ ప్రభుత్వ జనరల్ హాస్పిటల్';
        case 'bn':
          return 'রাজীব গান্ধী সরকারি জেনারেল হাসপাতাল';
        case 'ur':
          return 'راجیو گاندھی گورنمنٹ جنرل ہسپتال';
        default:
          return name;
      }
    } else if (name.contains('Coimbatore Medical College')) {
      switch (lang) {
        case 'ta':
          return 'கோயம்புத்தூர் மருத்துவக் கல்லூரி மருத்துவமனை';
        case 'hi':
          return 'कोयंबटूर मेडिकल कॉलेज अस्पताल';
        case 'te':
          return 'కోయంబత్తూర్ మెడికల్ కాలేజ్ హాస్పిటల్';
        case 'bn':
          return 'কোয়েম্বাটোর মেডিকেল কলেজ হাসপাতাল';
        case 'ur':
          return 'کوئمبٹور میڈیکل کالج ہسپتال';
        default:
          return name;
      }
    }
    return name;
  }

  /// Returns localized facility type
  String getDisplayType([String? languageCode]) {
    if (languageCode == null || languageCode == 'en') {
      return type;
    }
    final lang = languageCode.toLowerCase().split('_').first;
    if (typeTranslations != null && typeTranslations!.containsKey(lang)) {
      return typeTranslations![lang]!;
    }

    if (type.toLowerCase().contains('primary') || type.toLowerCase().contains('phc')) {
      switch (lang) {
        case 'ta':
          return 'ஆரம்ப சுகாதார நிலையம் (PHC)';
        case 'hi':
          return 'प्राथमिक स्वास्थ्य केंद्र (PHC)';
        case 'te':
          return 'ప్రాథమిక ఆరోగ్య కేంద్రం';
        case 'bn':
          return 'প্রাথমিক স্বাস্থ্য কেন্দ্র';
        case 'mr':
          return 'प्राथमिक आरोग्य केंद्र';
        case 'gu':
          return 'પ્રાથમિક આરોગ્ય કેન્દ્ર';
        case 'kn':
          return 'ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ';
        case 'ml':
          return 'പ്രാഥമിക ആരോഗ്യ കേന്ദ്രം';
        case 'pa':
          return 'ਮੁੱਢਲਾ ਸਿਹਤ ਕੇਂਦਰ';
        case 'or':
          return 'ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର';
        case 'ur':
          return 'پرائمری ہیلتھ سینٹر';
        case 'as':
          return 'প্ৰাথমিক স্বাস্থ্য কেন্দ্ৰ';
        default:
          return type;
      }
    } else {
      switch (lang) {
        case 'ta':
          return 'அரசு மருத்துவக் கல்லூரி மருத்துவமனை';
        case 'hi':
          return 'शासकीय मेडिकल कॉलेज अस्पताल';
        case 'te':
          return 'ప్రభుత్వ మెడికల్ కాలేజ్ హాస్పిటల్';
        case 'bn':
          return 'সরকারি মেডিকেল কলেজ হাসপাতাল';
        case 'mr':
          return 'शासकीय वैद्यकीय महाविद्यालय रुग्णालय';
        case 'gu':
          return 'સરકારી મેડિકલ કોલેજ હોસ્પિટલ';
        case 'kn':
          return 'ಸರ್ಕಾರಿ ವೈದ್ಯಕೀಯ ಕಾಲೇಜು ಆಸ್ಪತ್ರೆ';
        case 'ml':
          return 'ഗവൺമെന്റ് മെഡിക്കൽ കോളേജ് ഹോസ്പിറ്റൽ';
        case 'pa':
          return 'ਸਰਕਾਰੀ ਮੈਡੀਕਲ ਕਾਲਜ ਹਸਪਤਾਲ';
        case 'or':
          return 'ସରକାରୀ ମେଡିକାଲ କଲେଜ ଡାକ୍ତରଖାନା';
        case 'ur':
          return 'گورنمنٹ میڈیکل کالج ہسپتال';
        case 'as':
          return 'চৰকাৰী মেডিকেল কলেজ হাস্পতাল';
        default:
          return type;
      }
    }
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Hospital && runtimeType == other.runtimeType && id == other.id;

  @override
  int get hashCode => id.hashCode;
}
