import 'package:flutter/material.dart';
import 'screens/welcome_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/home_screen.dart';
import 'screens/detector_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/history_screen.dart';

void main() {
  runApp(const AlertFiApp());
}

class AlertFiApp extends StatelessWidget {
  const AlertFiApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AlertFi',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.deepOrange,
        scaffoldBackgroundColor: Colors.white,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const WelcomeScreen(),
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
        '/home': (context) => const HomeScreen(),
        '/detector': (context) => const DetectorScreen(),
        '/settings': (context) =>  SettingsScreen(),
        '/history': (context) =>  HistoryScreen(),
      },
    );
  }
}
