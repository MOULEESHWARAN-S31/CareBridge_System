import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../../app/theme/app_dimensions.dart';
import '../../app/theme/app_text_styles.dart';
import '../../core/localization/app_localizations.dart';
import '../../core/localization/supported_locales.dart';
import '../../core/services/api_service.dart';

class ChatMessage {
  final String text;
  final bool isUser;
  final DateTime timestamp;

  ChatMessage({
    required this.text,
    required this.isUser,
    DateTime? timestamp,
  }) : timestamp = timestamp ?? DateTime.now();
}

/// Interactive multilingual CareBridge Assistant Sheet
class CareBridgeAssistantSheet extends StatefulWidget {
  final AppLocalizations loc;

  const CareBridgeAssistantSheet({
    super.key,
    required this.loc,
  });

  static Future<void> show(BuildContext context, AppLocalizations loc) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => CareBridgeAssistantSheet(loc: loc),
    );
  }

  @override
  State<CareBridgeAssistantSheet> createState() => _CareBridgeAssistantSheetState();
}

class _CareBridgeAssistantSheetState extends State<CareBridgeAssistantSheet> {
  final TextEditingController _inputController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<ChatMessage> _messages = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _initGreeting();
  }

  void _initGreeting() {
    final langCode = widget.loc.locale.languageCode;
    String greeting;
    switch (langCode) {
      case 'ta':
        greeting = 'வணக்கம்! நான் உங்கள் CareBridge சுகாதார உதவியாளர். மருத்துவ சந்திப்பு, அவசர உதவி அல்லது ABHA பற்றி என்னிடம் கேளுங்கள்.';
        break;
      case 'hi':
        greeting = 'नमस्ते! मैं आपका केयरब्रिज स्वास्थ्य सहायक हूँ। अपॉइंटमेंट, आपातकालीन सेवा या आभा (ABHA) के बारे में पूछें।';
        break;
      case 'te':
        greeting = 'నమస్కారం! నేను మీ CareBridge ఆరోగ్య సహాయకుడిని. అపాయింట్‌మెంట్లు లేదా ABHA గురించి నన్ను అడగండి.';
        break;
      case 'kn':
        greeting = 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ CareBridge ಆರೋಗ್ಯ ಸಹಾಯಕ. ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು ಅಥವಾ ABHA ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಿ.';
        break;
      case 'ml':
        greeting = 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ CareBridge ആരോഗ്യ സഹായിയാണ്. അപ്പോയിന്റ്മെന്റുകൾ അല്ലെങ്കിൽ ABHA സംബന്ധിച്ച് ചോദിക്കാം.';
        break;
      case 'mr':
        greeting = 'नमस्कार! मी तुमचा केअरब्रिज आरोग्य सहाय्यक आहे. अपॉइंटमेंट किंवा ABHA बद्दल मला विचारा.';
        break;
      case 'bn':
        greeting = 'নমস্কার! আমি আপনার কেয়ারব্রিজ স্বাস্থ্য সহকারী। অ্যাপয়েন্টমেন্ট বা এবিএইচএ সম্পর্কে জিজ্ঞাসা করুন।';
        break;
      case 'gu':
        greeting = 'નમસ્તે! હું તમારો કેરબ્રિજ આરોગ્ય સહાયક છું. એપોઇન્ટમેન્ટ અથવા ABHA વિશે મને પૂછો.';
        break;
      case 'pa':
        greeting = 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਕੇਅਰਬ੍ਰਿਜ ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ। ਮੁਲਾਕਾਤਾਂ ਜਾਂ ABHA ਬਾਰੇ ਮੈਨੂੰ ਪੁੱਛੋ।';
        break;
      case 'ur':
        greeting = 'آداب! میں آپ کا کیئر برج ہیلتھ اسسٹنٹ ہوں۔ اپائنٹمنٹ، ایمرجنسی یا آیوشمان بھارت (ABHA) کے بارے میں سوال پوچھیں۔';
        break;
      default:
        greeting = 'Hello! I am your CareBridge Healthcare Assistant. How can I assist you with appointments, doctors, or your ABHA health record today?';
        break;
    }

    _messages.add(ChatMessage(text: greeting, isUser: false));
  }

  @override
  void dispose() {
    _inputController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _sendMessage(String text) async {
    final trimmed = text.trim();
    if (trimmed.isEmpty) return;

    final langCode = widget.loc.locale.languageCode;
    setState(() {
      _messages.add(ChatMessage(text: trimmed, isUser: true));
      _isLoading = true;
    });
    _inputController.clear();
    _scrollToBottom();

    String replyText;
    try {
      final response = await ApiService.instance.post(
        '/assistant/chat',
        body: {
          'message': trimmed,
          'targetLanguage': langCode,
        },
      );

      if (response != null && response['response'] != null) {
        replyText = response['response'].toString();
      } else {
        replyText = _getOfflineFallback(trimmed, langCode);
      }
    } catch (_) {
      replyText = _getOfflineFallback(trimmed, langCode);
    }

    if (mounted) {
      setState(() {
        _messages.add(ChatMessage(text: replyText, isUser: false));
        _isLoading = false;
      });
      _scrollToBottom();
    }
  }

  String _getOfflineFallback(String query, String langCode) {
    final lower = query.toLowerCase();
    final isUrdu = langCode == 'ur';
    final isTamil = langCode == 'ta';
    final isHindi = langCode == 'hi';

    if (lower.contains('108') || lower.contains('emerg') || lower.contains('அவசர') || lower.contains('आपात')) {
      if (isTamil) {
        return '🚨 அவசர மருத்துவ உதவிக்கு உடனடியாக 108 ஐ அழைக்கவும். CareBridge அவசர வசதி அருகிலுள்ள ஆம்புலன்ஸுடன் உங்களை இணைக்கும்.';
      }
      if (isHindi) {
        return '🚨 आपातकालीन चिकित्सा सहायता के लिए तुरंत 108 पर कॉल करें। केयरब्रिज आपातकालीन सेवा आपको नजदीकी एम्बुलेंस से जोड़ देगी।';
      }
      if (isUrdu) {
        return '🚨 ہنگامی طبی امداد کے لیے فوری طور پر 108 ڈائل کریں۔ کیئر برج آپ کو قریبی ایمبولینس سروس سے جوڑ دے گا۔';
      }
      return '🚨 For medical emergencies, immediately dial 108. CareBridge Emergency services will connect you to the nearest hospital.';
    }

    if (isTamil) {
      return 'CareBridge வழிகாட்டல்: உங்கள் மருத்துவ சந்திப்பை பதிவு செய்ய "Book Appointment" என்பதைப் பயன்படுத்தவும் அல்லது உங்கள் ABHA ஐடியை சுயவிவரத்தில் சரிபார்க்கவும்.\n\n⚠️ மருத்துவ அவசரநிலைக்கு மருத்துவரை அணுகவும்.';
    }
    if (isHindi) {
      return 'केयरब्रिज सहायता: अपॉइंटमेंट बुक करने के लिए "Book Appointment" चुनें या अपनी ABHA आईडी प्रोफाइल में जांचें।\n\n⚠️ किसी भी गंभीर समस्या के लिए योग्य चिकित्सक से परामर्श लें।';
    }
    if (isUrdu) {
      return 'کیئر برج رہنمائی: ڈاکٹر کی اپائنٹمنٹ حاصل کرنے کے لیے "Book Appointment" پر جائیں یا پروفائل میں اپنی ABHA کی تفصیلات دیکھیں۔\n\n⚠️ ہنگامی طبی مشورے کے لیے مستند ڈاکٹر سے رجوع کریں۔';
    }

    return 'CareBridge Guidance: You can book an appointment using the Book Appointment tab or view your health records in the Profile section.\n\n⚠️ For diagnosis or medication, always consult a qualified healthcare professional.';
  }

  List<String> _getQuickPrompts(String langCode) {
    switch (langCode) {
      case 'ta':
        return ['மருத்துவ சந்திப்பு பதிவு', 'அவசர உதவி 108', 'ABHA ஐடி என்றால் என்ன?'];
      case 'hi':
        return ['अपॉइंटमेंट कैसे बुक करें?', 'आपातकालीन सहायता 108', 'ABHA कार्ड जानकारी'];
      case 'ur':
        return ['اپائنٹمنٹ بک کریں', 'ہنگامی امداد 108', 'ABHA کارڈ کی معلومات'];
      case 'te':
        return ['అపాయింట్‌మెంట్ బుకింగ్', 'ఎమర్జెన్సీ 108', 'ABHA వివరాలు'];
      case 'kn':
        return ['ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕಿಂಗ್', 'ತುರ್ತು ಸಹಾಯ 108', 'ABHA ಮಾಹಿತಿ'];
      case 'ml':
        return ['അപ്പോയിന്റ്മെന്റ് ബുക്കിംഗ്', 'അടിയന്തര സഹായം 108', 'ABHA വിവരങ്ങൾ'];
      case 'bn':
        return ['অ্যাপয়েন্টমেন্ট বুকিং', 'জরুরি সাহায্য 108', 'ABHA কার্ড তথ্য'];
      default:
        return ['How to book appointment?', 'Emergency 108', 'What is ABHA ID?'];
    }
  }

  @override
  Widget build(BuildContext context) {
    final locale = widget.loc.locale;
    final langCode = locale.languageCode;
    final isRtl = SupportedLocales.isRtl(locale);
    final nativeName = SupportedLocales.getNativeName(locale);

    return Directionality(
      textDirection: isRtl ? TextDirection.rtl : TextDirection.ltr,
      child: Container(
        height: MediaQuery.of(context).size.height * 0.82,
        decoration: const BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
        ),
        child: Column(
          children: [
            // Header Handle
            Container(
              margin: const EdgeInsets.only(top: 10, bottom: 6),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppDimensions.space16, vertical: 8.0),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(AppDimensions.space8),
                    decoration: const BoxDecoration(
                      color: AppColors.primaryLight,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.support_agent_rounded,
                      color: AppColors.primary,
                      size: AppDimensions.iconMedium,
                    ),
                  ),
                  const SizedBox(width: AppDimensions.space12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.loc.assistantCardTitle,
                          style: AppTextStyles.heading2.copyWith(fontSize: 17.0),
                        ),
                        Text(
                          '$nativeName • 24x7 Multilingual',
                          style: AppTextStyles.caption.copyWith(color: AppColors.primary),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),
            // Chat Message List
            Expanded(
              child: ListView.builder(
                controller: _scrollController,
                padding: const EdgeInsets.all(AppDimensions.space16),
                itemCount: _messages.length,
                itemBuilder: (ctx, index) {
                  final msg = _messages[index];
                  return _buildMessageBubble(msg);
                },
              ),
            ),
            // Loading indicator
            if (_isLoading)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
                child: Row(
                  children: [
                    const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'CareBridge Assistant typing...',
                      style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),
            // Quick prompts
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 6.0),
              child: Row(
                children: _getQuickPrompts(langCode).map((prompt) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: ActionChip(
                      label: Text(
                        prompt,
                        style: AppTextStyles.caption.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      backgroundColor: AppColors.primaryLight.withValues(alpha: 0.6),
                      side: const BorderSide(color: AppColors.primary, width: 0.5),
                      onPressed: () => _sendMessage(prompt),
                    ),
                  );
                }).toList(),
              ),
            ),
            // Input Bar
            Container(
              padding: EdgeInsets.only(
                left: 12.0,
                right: 12.0,
                top: 8.0,
                bottom: MediaQuery.of(context).viewInsets.bottom + 8.0,
              ),
              decoration: const BoxDecoration(
                color: AppColors.surface,
                border: Border(top: BorderSide(color: AppColors.borderLight)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _inputController,
                      textInputAction: TextInputAction.send,
                      onSubmitted: _sendMessage,
                      decoration: InputDecoration(
                        hintText: widget.loc.assistantCardSubtitle,
                        hintStyle: AppTextStyles.bodySmall.copyWith(color: AppColors.textMuted),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        filled: true,
                        fillColor: AppColors.background,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24.0),
                          borderSide: const BorderSide(color: AppColors.borderLight),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24.0),
                          borderSide: const BorderSide(color: AppColors.borderLight),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24.0),
                          borderSide: const BorderSide(color: AppColors.primary),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8.0),
                  CircleAvatar(
                    backgroundColor: AppColors.primary,
                    radius: 20,
                    child: IconButton(
                      icon: const Icon(Icons.send_rounded, size: 18, color: Colors.white),
                      onPressed: () => _sendMessage(_inputController.text),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMessageBubble(ChatMessage msg) {
    return Align(
      alignment: msg.isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12.0),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.78,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 10.0),
        decoration: BoxDecoration(
          color: msg.isUser ? AppColors.primary : AppColors.surface,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16.0),
            topRight: const Radius.circular(16.0),
            bottomLeft: Radius.circular(msg.isUser ? 16.0 : 4.0),
            bottomRight: Radius.circular(msg.isUser ? 4.0 : 16.0),
          ),
          border: Border.all(
            color: msg.isUser ? AppColors.primary : AppColors.borderLight,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Text(
          msg.text,
          style: AppTextStyles.body.copyWith(
            color: msg.isUser ? AppColors.textOnPrimary : AppColors.textPrimary,
            height: 1.35,
          ),
        ),
      ),
    );
  }
}
