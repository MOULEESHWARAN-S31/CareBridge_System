import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

/// Unified API Service for CareBridge Flutter App
class ApiService {
  static final ApiService instance = ApiService._();
  ApiService._();
  factory ApiService() => instance;

  /// Configurable base URL
  static String? customBaseUrl;

  static String get baseUrl {
    if (customBaseUrl != null && customBaseUrl!.isNotEmpty) {
      return customBaseUrl!;
    }
    // Android emulator connects to host via 10.0.2.2
    if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:5000/api';
    }
    // Web, Windows, macOS, iOS, Linux default
    return 'http://localhost:5000/api';
  }

  static const Duration defaultTimeout = Duration(seconds: 4);

  Map<String, String> _buildHeaders({String? token}) {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  /// Check if backend server is online and reachable
  Future<bool> isBackendHealthy() async {
    try {
      final uri = Uri.parse('$baseUrl/health');
      final response = await http.get(uri).timeout(const Duration(seconds: 2));
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  /// Perform HTTP GET
  Future<dynamic> get(String endpoint, {Map<String, String>? queryParams, String? token}) async {
    try {
      String url = '$baseUrl$endpoint';
      if (queryParams != null && queryParams.isNotEmpty) {
        final uri = Uri.parse(url).replace(queryParameters: queryParams);
        url = uri.toString();
      }
      final response = await http
          .get(Uri.parse(url), headers: _buildHeaders(token: token))
          .timeout(defaultTimeout);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return jsonDecode(response.body);
      } else {
        throw Exception('API error ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      debugPrint('ApiService.get failed on $endpoint: $e');
      rethrow;
    }
  }

  /// Perform HTTP POST
  Future<dynamic> post(String endpoint, {dynamic body, String? token}) async {
    try {
      final url = '$baseUrl$endpoint';
      final response = await http
          .post(
            Uri.parse(url),
            headers: _buildHeaders(token: token),
            body: body != null ? jsonEncode(body) : null,
          )
          .timeout(defaultTimeout);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return jsonDecode(response.body);
      } else {
        throw Exception('API error ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      debugPrint('ApiService.post failed on $endpoint: $e');
      rethrow;
    }
  }
}
