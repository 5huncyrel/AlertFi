import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'package:firebase_messaging/firebase_messaging.dart';

import '../services/api_service.dart'; 

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  void handleLogin() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    if (email.isEmpty || password.isEmpty) {
      _showAlert('Error', 'Please enter both email and password');
      return;
    }

    final response = await http.post(
      Uri.parse('${ApiService.baseUrl}/token/'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('access', data['access']);
      await prefs.setString('refresh', data['refresh']);

      // Save FCM token with ApiService
      await _saveFCMToken();

      // Navigate
      Navigator.pushReplacementNamed(context, '/detector');
    } else {
      // Decode backend message
      final body = jsonDecode(response.body);
      final msg = body['detail'] ?? body.toString();
      _showAlert('Login Failed', msg);

      // Optional: Navigate to verify email screen if not verified
      if (msg.contains('Email not verified')) {
        Navigator.pushNamed(context, '/verify-email', arguments: email);
      }
    }
  }

  Future<void> _saveFCMToken() async {
    try {
      final fcmToken = await FirebaseMessaging.instance.getToken();
      if (fcmToken == null) {
        print('⚠️ FCM token is null');
        return;
      }

      final response = await ApiService.authorizedPost(
        '/fcm/save-token/',
        {'token': fcmToken},
      );

      if (response.statusCode == 200) {
        print('✅ FCM token saved successfully');
      } else {
        print('❌ Failed to save FCM token. Status: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ Error saving FCM token: $e');
    }
  }

  void _showAlert(String title, String message) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('OK'))
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF8E1616),
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: const Text('Login', style: TextStyle(color: Colors.black)),
        automaticallyImplyLeading: false,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            Navigator.pushReplacementNamed(context, '/'); 
          },
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              const SizedBox(height: 30),
              const Text('Welcome Back!',
                  style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white)),
              const SizedBox(height: 4),
              const Text('Log in to AlertFi',
                  style: TextStyle(fontSize: 16, color: Color(0xFFFAF7F0))),
              const SizedBox(height: 30),
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                    color: Colors.white, borderRadius: BorderRadius.circular(16)),
                child: Column(
                  children: [
                    _buildInput(controller: _emailController, hint: 'Email', keyboard: TextInputType.emailAddress),
                    _buildInput(controller: _passwordController, hint: 'Password', obscureText: true),
                    const SizedBox(height: 10),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFF5733),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      onPressed: handleLogin,
                      child: const Text('Login',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Color(0xFF555555))),
                    ),
                    const SizedBox(height: 16),
                    GestureDetector(
                      onTap: () => Navigator.pushNamed(context, '/register'),
                      child: const Text.rich(
                        TextSpan(
                          text: 'Don’t have an account? ',
                          style: TextStyle(color: Colors.black54),
                          children: [
                            TextSpan(
                                text: 'Register',
                                style: TextStyle(color: Color(0xFFFF5733), fontWeight: FontWeight.bold))
                          ],
                        ),
                      ),
                    )
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInput({
    required TextEditingController controller,
    required String hint,
    TextInputType keyboard = TextInputType.text,
    bool obscureText = false,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: TextField(
        controller: controller,
        keyboardType: keyboard,
        obscureText: obscureText,
        decoration: InputDecoration(
          hintText: hint,
          filled: true,
          fillColor: const Color(0xFFF1F1F1),
          contentPadding: const EdgeInsets.symmetric(horizontal: 15, vertical: 12),
          border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
        ),
        style: const TextStyle(fontSize: 16, color: Colors.black87),
      ),
    );
  }
}
