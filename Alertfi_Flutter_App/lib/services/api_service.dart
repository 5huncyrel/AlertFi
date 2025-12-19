import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl = 'https://alertfi.onrender.com/api';

  // GET with auto-refresh
  static Future<http.Response> authorizedGet(String endpoint) async {
    final prefs = await SharedPreferences.getInstance();
    String? access = prefs.getString('access');

    final response = await http.get(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Authorization': 'Bearer $access',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 401) {
      final refreshed = await _refreshToken();
      if (refreshed) {
        access = prefs.getString('access');
        return await http.get(
          Uri.parse('$baseUrl$endpoint'),
          headers: {
            'Authorization': 'Bearer $access',
            'Content-Type': 'application/json',
          },
        );
      }
    }

    return response;
  }

  // PUT with auto-refresh ✅
  static Future<http.Response> authorizedPut(
      String endpoint, Map<String, dynamic> body) async {
    final prefs = await SharedPreferences.getInstance();
    String? access = prefs.getString('access');

    final response = await http.put(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Authorization': 'Bearer $access',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(body),
    );

    if (response.statusCode == 401) {
      final refreshed = await _refreshToken();
      if (refreshed) {
        access = prefs.getString('access');
        return await http.put(
          Uri.parse('$baseUrl$endpoint'),
          headers: {
            'Authorization': 'Bearer $access',
            'Content-Type': 'application/json',
          },
          body: jsonEncode(body),
        );
      }
    }

    return response;
  }

  // POST with auto-refresh
  static Future<http.Response> authorizedPost(
      String endpoint, Map<String, dynamic> body) async {
    final prefs = await SharedPreferences.getInstance();
    String? access = prefs.getString('access');

    final response = await http.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Authorization': 'Bearer $access',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(body),
    );

    if (response.statusCode == 401) {
      final refreshed = await _refreshToken();
      if (refreshed) {
        access = prefs.getString('access');
        return await http.post(
          Uri.parse('$baseUrl$endpoint'),
          headers: {
            'Authorization': 'Bearer $access',
            'Content-Type': 'application/json',
          },
          body: jsonEncode(body),
        );
      }
    }

    return response;
  }


  // PATCH with auto-refresh ✅
  static Future<http.Response> authorizedPatch(
      String endpoint, Map<String, dynamic> body) async {
    final prefs = await SharedPreferences.getInstance();
    String? access = prefs.getString('access');

    final response = await http.patch(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Authorization': 'Bearer $access',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(body),
    );

    if (response.statusCode == 401) {
      final refreshed = await _refreshToken();
      if (refreshed) {
        access = prefs.getString('access');
        return await http.patch(
          Uri.parse('$baseUrl$endpoint'),
          headers: {
            'Authorization': 'Bearer $access',
            'Content-Type': 'application/json',
          },
          body: jsonEncode(body),
        );
      }
    }

    return response;
  }

  // DELETE with auto-refresh
  static Future<http.Response> authorizedDelete(String endpoint) async {
    final prefs = await SharedPreferences.getInstance();
    String? access = prefs.getString('access');

    final response = await http.delete(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Authorization': 'Bearer $access',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 401) {
      final refreshed = await _refreshToken();
      if (refreshed) {
        access = prefs.getString('access');
        return await http.delete(
          Uri.parse('$baseUrl$endpoint'),
          headers: {
            'Authorization': 'Bearer $access',
            'Content-Type': 'application/json',
          },
        );
      }
    }

    return response;
  }

  // Token refresh helper
  static Future<bool> _refreshToken() async {
    final prefs = await SharedPreferences.getInstance();
    final refresh = prefs.getString('refresh');

    if (refresh == null) return false;

    final response = await http.post(
      Uri.parse('$baseUrl/token/refresh/'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'refresh': refresh}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      await prefs.setString('access', data['access']);
      return true;
    } else {
      await prefs.remove('access');
      await prefs.remove('refresh');
      return false;
    }
  }
}
