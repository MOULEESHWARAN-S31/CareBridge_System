import 'package:url_launcher/url_launcher.dart';
import '../domain/phone_call_service.dart';

class PhoneCallServiceImpl implements PhoneCallService {
  const PhoneCallServiceImpl();

  @override
  Future<bool> makeCall(String phoneNumber, {String? hospitalName}) async {
    final cleanNumber = phoneNumber.replaceAll(RegExp(r'[^\d+]'), '');
    if (cleanNumber.isEmpty) return false;

    final Uri phoneUri = Uri(scheme: 'tel', path: cleanNumber);
    try {
      if (await canLaunchUrl(phoneUri)) {
        return await launchUrl(phoneUri);
      } else {
        return false;
      }
    } catch (_) {
      return false;
    }
  }
}
