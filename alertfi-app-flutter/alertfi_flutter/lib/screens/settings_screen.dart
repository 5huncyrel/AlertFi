import 'package:flutter/material.dart';

class SettingsScreen extends StatefulWidget {
  @override
  _SettingsScreenState createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool notificationsEnabled = true;
  TextEditingController emailController = TextEditingController(text: "user@gmail.com");
  TextEditingController passwordController = TextEditingController();
  TextEditingController confirmPasswordController = TextEditingController();

  void handleEmailUpdate() {
    final email = emailController.text.trim();
    if (!email.contains('@')) {
      _showAlert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    _showAlert("Success", "Your email has been updated.");
  }

  void handlePasswordChange() {
    final password = passwordController.text;
    final confirmPassword = confirmPasswordController.text;

    if (password.length < 6) {
      _showAlert("Weak Password", "Password must be at least 6 characters.");
      return;
    }
    if (password != confirmPassword) {
      _showAlert("Mismatch", "Passwords do not match.");
      return;
    }
    passwordController.clear();
    confirmPasswordController.clear();
    _showAlert("Success", "Password has been changed.");
  }

  void _showAlert(String title, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: Text("OK")),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Settings")),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _sectionHeader("Account"),
            _card(
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Email Address", style: _labelStyle()),
                  TextField(
                    controller: emailController,
                    keyboardType: TextInputType.emailAddress,
                    decoration: InputDecoration(hintText: "Enter your email"),
                  ),
                  SizedBox(height: 10),
                  ElevatedButton(
                    style: _buttonStyle(Colors.green),
                    onPressed: handleEmailUpdate,
                    child: Text("Save Email"),
                  ),
                ],
              ),
            ),
            _sectionHeader("Alert Notification"),
            _card(
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text("Enable Notifications", style: _labelStyle()),
                  Switch(
                    value: notificationsEnabled,
                    onChanged: (val) => setState(() => notificationsEnabled = val),
                    activeColor: Colors.green,
                  ),
                ],
              ),
            ),
            _sectionHeader("Change Password"),
            _card(
              Column(
                children: [
                  TextField(
                    controller: passwordController,
                    decoration: InputDecoration(hintText: "New Password"),
                    obscureText: true,
                  ),
                  TextField(
                    controller: confirmPasswordController,
                    decoration: InputDecoration(hintText: "Confirm Password"),
                    obscureText: true,
                  ),
                  SizedBox(height: 10),
                  ElevatedButton(
                    style: _buttonStyle(Colors.blue),
                    onPressed: handlePasswordChange,
                    child: Text("Change Password"),
                  ),
                ],
              ),
            ),
            _sectionHeader("About"),
            _card(
              Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text("AlertFi", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  SizedBox(height: 6),
                  Text("Version 1.0.0", style: TextStyle(color: Colors.grey)),
                  Text("Developed by QUALI-5", style: TextStyle(color: Colors.grey)),
                  Text("quali5@gmail.com", style: TextStyle(color: Colors.grey)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _sectionHeader(String text) => Padding(
        padding: const EdgeInsets.only(top: 24, bottom: 12),
        child: Text(text, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      );

  Widget _card(Widget child) => Container(
        margin: EdgeInsets.only(bottom: 16),
        padding: EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 6,
              offset: Offset(0, 3),
            ),
          ],
        ),
        child: child,
      );

  TextStyle _labelStyle() => TextStyle(fontSize: 15, fontWeight: FontWeight.w500);

  ButtonStyle _buttonStyle(Color color) => ElevatedButton.styleFrom(
        backgroundColor: color,
        padding: EdgeInsets.symmetric(vertical: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        textStyle: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
      );
}
