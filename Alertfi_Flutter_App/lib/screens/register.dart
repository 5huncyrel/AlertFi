import 'dart:convert';
import 'package:flutter/material.dart';
import 'verify_email.dart';
import 'package:http/http.dart' as http;

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nameController = TextEditingController();
  final _addressController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmController = TextEditingController();

  final String apiUrl = 'https://alertfi.onrender.com/api/register/';
  bool isLoading = false;

  void handleRegister() async {
    final name = _nameController.text.trim();
    final address = _addressController.text.trim();
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();
    final confirm = _confirmController.text.trim();

    if ([name, address, email, password, confirm].any((e) => e.isEmpty)) {
      _showAlert('Error', 'Please fill in all fields');
      return;
    }

    if (password != confirm) {
      _showAlert('Error', 'Passwords do not match');
      return;
    }

    setState(() => isLoading = true);

    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': email,
          'email': email,
          'password': password,
          'full_name': name,
          'address': address,
        }),
      );

      print("REGISTER RESPONSE: ${response.body}");

      if (response.statusCode == 201) {
        // Success: email was sent
        _showAlert(
          'Success',
          'Account created! A verification code has been sent to your email.',
          onOk: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (_) => VerifyEmailScreen(email: email),
              ),
            );
          },
        );
      } else {
        // Backend error: show detailed message
        final body = jsonDecode(response.body);
        String message = '';
        body.forEach((key, value) {
          if (value is List) {
            message += '$key: ${value.join(", ")}\n';
          } else {
            message += '$key: $value\n';
          }
        });
        _showAlert('Registration Failed', message.trim());
      }
    } catch (e) {
      _showAlert('Error', 'Failed to register: $e');
    } finally {
      setState(() => isLoading = false);
    }
  }

  void _showAlert(String title, String message, {VoidCallback? onOk}) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              if (onOk != null) onOk();
            },
            child: const Text('OK'),
          )
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
        title: const Text('Register', style: TextStyle(color: Colors.black)),
        iconTheme: const IconThemeData(color: Colors.black),
        elevation: 2,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              const SizedBox(height: 30),
              const Text(
                'Create an Account',
                style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.white),
              ),
              const SizedBox(height: 30),
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                    color: Colors.white, borderRadius: BorderRadius.circular(16)),
                child: Column(
                  children: [
                    _buildInput(controller: _nameController, hint: 'Full Name'),
                    _buildInput(controller: _addressController, hint: 'Address'),
                    _buildInput(controller: _emailController, hint: 'Email', keyboard: TextInputType.emailAddress),
                    _buildInput(controller: _passwordController, hint: 'Password', obscureText: true),
                    _buildInput(controller: _confirmController, hint: 'Confirm Password', obscureText: true),
                    const SizedBox(height: 10),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFF5733),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      onPressed: isLoading ? null : handleRegister,
                      child: isLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                color: Colors.white,
                                strokeWidth: 2,
                              ),
                            )
                          : const Text(
                              'Register',
                              style: TextStyle(
                                  color: Color(0xFF555555),
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600),
                            ),
                    ),
                    const SizedBox(height: 16),
                    GestureDetector(
                      onTap: () => Navigator.pushNamed(context, '/login'),
                      child: const Text.rich(
                        TextSpan(
                          text: 'Already have an account? ',
                          style: TextStyle(color: Colors.black54),
                          children: [
                            TextSpan(
                              text: 'Login',
                              style: TextStyle(
                                  color: Color(0xFFFF5733),
                                  fontWeight: FontWeight.bold),
                            )
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
