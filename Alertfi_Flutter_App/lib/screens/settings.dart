import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:provider/provider.dart';
import '../providers/theme_provider.dart';
import '../services/api_service.dart';

class SettingsScreen extends StatefulWidget {
  @override
  _SettingsScreenState createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool notificationsEnabled = true;
  String currentEmail = "";

  final TextEditingController newEmailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();

  final FocusNode emailFocusNode = FocusNode();
  final FocusNode passwordFocusNode = FocusNode();
  final FocusNode confirmPasswordFocusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    fetchUserProfile();
  }

  void showSnack(String message, {Color color = Colors.green}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: color,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  Future<void> fetchUserProfile() async {
    final res = await ApiService.authorizedGet('/user/');

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      setState(() {
        currentEmail = data['email'] ?? "";
        notificationsEnabled = data['notifications_enabled'] ?? true;
      });
    }
  }

  Future<void> handleEmailUpdate() async {
    final newEmail = newEmailController.text.trim();
    final isValid = RegExp(r"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$").hasMatch(newEmail);

    if (newEmail.isEmpty || !isValid || newEmail == currentEmail) {
      showSnack("Invalid or same email.", color: Colors.red);
      return;
    }

    final res = await ApiService.authorizedPut(
      '/user/update-email/',
      {'email': newEmail},
    );

    if (res.statusCode == 200) {
      setState(() {
        currentEmail = newEmail;
      });
      newEmailController.clear();
      emailFocusNode.unfocus();
      showSnack("Email updated successfully.");
    } else {
      showSnack("Failed to update email.", color: Colors.red);
    }
  }

  Future<void> handlePasswordChange() async {
    final password = passwordController.text.trim();
    final confirm = confirmPasswordController.text.trim();

    if (password.length < 6 || password != confirm) {
      showSnack("Invalid or mismatched password.", color: Colors.red);
      return;
    }

    final res = await ApiService.authorizedPut(
      '/user/change-password/',
      {'password': password},
    );

    if (res.statusCode == 200) {
      passwordController.clear();
      confirmPasswordController.clear();
      passwordFocusNode.unfocus();
      confirmPasswordFocusNode.unfocus();
      showSnack("Password changed successfully.");
    } else {
      showSnack("Failed to change password.", color: Colors.red);
    }
  }

  Future<void> toggleNotifications(bool value) async {
    final res = await ApiService.authorizedPatch('/user/toggle-notifications/', {});

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      setState(() {
        notificationsEnabled = data['notifications_enabled'] ?? value;
      });
      showSnack("Notifications ${notificationsEnabled ? "enabled" : "disabled"}.");
    } else {
      showSnack("Failed to update notifications.", color: Colors.red);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;
    final bg = isDark ? const Color(0xFF121214) : Colors.grey[100];
    final card = isDark ? const Color(0xFF1e1e22) : Colors.white;
    final txt = isDark ? Colors.white : Colors.black87;
    final subTxt = isDark ? Colors.grey[300]! : Colors.grey[700]!;

    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      child: Scaffold(
        backgroundColor: bg,
        appBar: AppBar(
          title: const Text("Settings"),
          backgroundColor: const Color(0xFF8E1616),
          foregroundColor: Colors.white,
          elevation: 3,
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            sectionTitle("Account", txt),
            settingsCard(card, [
              Text("Current Email: $currentEmail", style: TextStyle(color: txt)),
              const SizedBox(height: 10),
              TextField(
                controller: newEmailController,
                focusNode: emailFocusNode,
                keyboardType: TextInputType.emailAddress,
                style: TextStyle(color: txt),
                decoration: inputDecoration("Enter new email", isDark),
              ),
              const SizedBox(height: 12),
              saveButton("Update Email", handleEmailUpdate, Colors.green),
            ]),
            divider(),
            sectionTitle("Notifications", txt),
            settingsCard(card, [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text("Enable Notifications", style: TextStyle(color: txt, fontSize: 16)),
                  Switch(
                    value: notificationsEnabled,
                    onChanged: (val) {
                      toggleNotifications(val);
                    },
                    activeColor: Colors.green,
                  ),
                ],
              ),
            ]),
            divider(),
            sectionTitle("Change Password", txt),
            settingsCard(card, [
              passwordInput("New Password", passwordController, isDark, passwordFocusNode),
              const SizedBox(height: 10),
              passwordInput("Confirm Password", confirmPasswordController, isDark, confirmPasswordFocusNode),
              const SizedBox(height: 10),
              saveButton("Change Password", handlePasswordChange, Colors.blue),
            ]),
            divider(),
            sectionTitle("About", txt),
            aboutCard(card, txt, subTxt),
          ]),
        ),
      ),
    );
  }

  InputDecoration inputDecoration(String label, bool isDark) => InputDecoration(
        labelText: label,
        prefixIcon: Icon(Icons.email, color: isDark ? Colors.grey[300] : Colors.grey[700]),
        labelStyle: TextStyle(color: isDark ? Colors.grey[400] : Colors.grey[700]),
        filled: true,
        fillColor: isDark ? const Color(0xFF2b2b2f) : Colors.white,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
      );

  Widget passwordInput(String label, TextEditingController controller, bool isDark, FocusNode node) => TextField(
        controller: controller,
        focusNode: node,
        obscureText: true,
        style: TextStyle(color: isDark ? Colors.white : Colors.black),
        decoration: inputDecoration(label, isDark).copyWith(prefixIcon: const Icon(Icons.lock)),
      );

  Widget sectionTitle(String text, Color color) => Padding(
        padding: const EdgeInsets.only(bottom: 12),
        child: Text(text, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color)),
      );

  Widget divider() => Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Divider(thickness: 1, color: Colors.grey.shade300),
      );

  Widget saveButton(String label, VoidCallback onPressed, Color color) => SizedBox(
        width: double.infinity,
        child: ElevatedButton(
          onPressed: onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: color,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          child: Text(label, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white)),
        ),
      );

  Widget settingsCard(Color color, List<Widget> children) => Container(
        width: double.infinity,
        padding: const EdgeInsets.all(18),
        margin: const EdgeInsets.only(bottom: 20),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 6, offset: const Offset(0, 3)),
          ],
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: children),
      );

  Widget aboutCard(Color color, Color textColor, Color subTextColor) => Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 4, offset: const Offset(0, 2)),
          ],
        ),
        child: Column(
          children: [
            Text("AlertFi", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: textColor)),
            const SizedBox(height: 6),
            Text("Version 1.0.0", style: TextStyle(fontSize: 14, color: subTextColor)),
            Text("Developed by QUALI-5", style: TextStyle(fontSize: 14, color: subTextColor)),
            const SizedBox(height: 8),
            Divider(thickness: 1, color: Colors.grey[300]),
            const SizedBox(height: 8),
            Text("You can contact us through", style: TextStyle(fontSize: 14, color: textColor)),
            const SizedBox(height: 4),
            Text(
              "quali5@gmail.com",
              style: TextStyle(fontSize: 14, color: Colors.blue, fontWeight: FontWeight.w500),
            ),
          ],
        ),
      );
}
