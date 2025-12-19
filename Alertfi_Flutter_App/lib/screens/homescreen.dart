import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import '../providers/theme_provider.dart';
import '../services/api_service.dart'; 

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  Map<String, dynamic>? detector;
  String systemStatus = 'Safe';
  String? detectorId;
  bool isLoading = false;
  Timer? _timer;

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        if (message.notification != null) {
          final notification = message.notification!;
          print(
              '📩 FCM message received: ${notification.title} - ${notification.body}');
          showDialog(
            context: context,
            builder: (_) => AlertDialog(
              title: Text(notification.title ?? 'Notification'),
              content: Text(notification.body ?? 'No message body'),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('OK'),
                ),
              ],
            ),
          );
        }
      });
    });

    _timer = Timer.periodic(const Duration(seconds: 3), (_) {
      if (detectorId != null) {
        fetchDetectorById(detectorId!);
      }
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args =
        ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
    detectorId = args?['detectorId']?.toString();

    if (detectorId != null) {
      fetchDetectorById(detectorId!);
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> fetchDetectorById(String id) async {
    final res = await ApiService.authorizedGet('/detectors/$id/data/');

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);

      final ppm = data['ppm'] ?? 0;
      final battery = data['battery'] ?? 0;
      final isOn = data['sensor_on'] ?? true;
      final temperature = data['temperature'] ?? 0;
      final humidity = data['humidity'] ?? 0; 

      setState(() {
        detector = {
          ...data,
          'ppm': ppm,
          'battery': battery,
          'sensor_on': isOn,
          'temperature': temperature,
          'humidity': humidity, 
        };

        if (ppm > 100) {
          systemStatus = 'Danger';
        } else if (ppm >= 70) {
          systemStatus = 'Warning';
        } else {
          systemStatus = 'Safe';
        }
      });
    } else {
      print('❌ Failed to fetch detector. Status: ${res.statusCode}');
    }
  }

  Future<void> toggleSensor() async {
    if (detectorId == null || detector == null) return;

    setState(() => isLoading = true);

    final res =
        await ApiService.authorizedPatch('/detectors/$detectorId/toggle/', {});

    if (res.statusCode == 200) {
      final updated = jsonDecode(res.body);
      setState(() {
        detector!['sensor_on'] = updated['sensor_on'];
      });
    } else {
      print('❌ Toggle failed. Status: ${res.statusCode}');
    }

    setState(() => isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Provider.of<ThemeProvider>(context).isDarkMode;
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    final statusColor = {
      'Safe': Colors.green,
      'Warning': Colors.amber,
      'Danger': Colors.red,
    };

    final statusBackground = {
      'Safe': [Colors.green.shade700, Colors.green.shade400],
      'Warning': [Colors.amber.shade700, Colors.amber.shade400],
      'Danger': [Colors.red.shade700, Colors.red.shade400],
    };

    final theme = {
      'bg': isDarkMode ? const Color(0xFF121214) : const Color(0xFFF5F7FA),
      'text': isDarkMode ? Colors.grey[200] : Colors.black,
      'subText': isDarkMode ? Colors.grey : Colors.grey[700],
      'card': isDarkMode ? const Color(0xFF1e1e22) : Colors.white,
      'switchActive': Colors.green,
      'switchInactive': Colors.grey[300],
      'batteryFill': Colors.green,
      'batteryEmpty': Colors.grey[300],
    };

    return Scaffold(
      backgroundColor: theme['bg'],
      appBar: AppBar(
        backgroundColor: const Color(0xFF8E1616),
        foregroundColor: Colors.white,
        title: const Text('Dashboard'),
        elevation: 4,
        actions: [
          IconButton(
            icon: Icon(isDarkMode ? Icons.dark_mode : Icons.light_mode),
            onPressed: () {
              Provider.of<ThemeProvider>(context, listen: false)
                  .toggleDarkMode();
            },
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => Navigator.pushNamed(context, '/settings'),
          ),
        ],
      ),
      body: detector == null
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () => fetchDetectorById(detectorId!),
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: EdgeInsets.symmetric(
                  horizontal: screenWidth * 0.06,
                  vertical: screenHeight * 0.04,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Text(
                      '${detector!['location']} Detector',
                      style: TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.bold,
                        color: theme['text'],
                      ),
                    ),
                    SizedBox(height: screenHeight * 0.02),

                    // --- SYSTEM STATUS ---
                    Container(
                      width: double.infinity,
                      padding: EdgeInsets.symmetric(
                        vertical: screenHeight * 0.04,
                        horizontal: screenWidth * 0.06,
                      ),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: statusBackground[systemStatus]!,
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: const [
                          BoxShadow(color: Colors.black26, blurRadius: 12)
                        ],
                      ),
                      child: Column(
                        children: [
                          const Text(
                            'SMOKE/GAS SENSOR',
                            style: TextStyle(
                              fontSize: 18,
                              letterSpacing: 1.2,
                              color: Colors.white70,
                            ),
                          ),
                          SizedBox(height: screenHeight * 0.02),
                          Container(
                            width: screenWidth * 0.5 > 300
                                ? 300
                                : screenWidth * 0.5,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              systemStatus,
                              style: TextStyle(
                                fontSize: 30,
                                fontWeight: FontWeight.bold,
                                color: statusColor[systemStatus],
                              ),
                            ),
                          ),
                          SizedBox(height: screenHeight * 0.02),
                          Text(
                            'PPM Level: ${detector!['ppm']}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 20,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),

                    //  TEMPERATURE + HUMIDITY SENSOR CARDS
                    SizedBox(height: screenHeight * 0.03),
                    Row(
                      children: [
                        //  TEMPERATURE CARD 
                        Expanded(
                          child: Container(
                            padding: EdgeInsets.all(screenWidth * 0.05),
                            decoration: BoxDecoration(
                              color: (detector!['temperature'] ?? 0) > 40
                                  ? Colors.red.shade400 // 🔴 Danger
                                  : Colors.blue.shade400, // 🔵 Normal
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: const [
                                BoxShadow(color: Colors.black12, blurRadius: 6),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                const Text(
                                  'TEMPERATURE',
                                  style: TextStyle(
                                    fontSize: 14,
                                    letterSpacing: 1.2,
                                    color: Colors.white70,
                                  ),
                                ),
                                SizedBox(height: screenHeight * 0.02),
                                const Icon(Icons.thermostat, size: 40, color: Colors.white),
                                SizedBox(height: screenHeight * 0.015),
                                Text(
                                  '${detector!['temperature'] ?? 0}°C',
                                  style: const TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.white,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),

                        SizedBox(width: screenWidth * 0.04), 

                        // HUMIDITY CARD 
                        Expanded(
                          child: Container(
                            padding: EdgeInsets.all(screenWidth * 0.05),
                            decoration: BoxDecoration(
                              color: (detector!['humidity'] ?? 0) > 70
                                  ? Colors.red.shade400 // 🔴 High humidity
                                  : Colors.teal.shade400, // 🟢 Normal
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: const [
                                BoxShadow(color: Colors.black12, blurRadius: 6),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                const Text(
                                  'HUMIDITY',
                                  style: TextStyle(
                                    fontSize: 14,
                                    letterSpacing: 1.2,
                                    color: Colors.white70,
                                  ),
                                ),
                                SizedBox(height: screenHeight * 0.02),
                                const Icon(Icons.water_drop, size: 40, color: Colors.white),
                                SizedBox(height: screenHeight * 0.015),
                                Text(
                                  '${detector!['humidity'] ?? 0}%',
                                  style: const TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.white,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),


                    // DEVICE STATUS HEADER
                    SizedBox(height: screenHeight * 0.04),
                    Row(
                      children: [
                        Expanded(
                          child: Divider(
                            color: Colors.grey.withOpacity(0.3),
                            thickness: 1,
                          ),
                        ),
                        const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 12),
                          child: Text(
                            'DEVICE STATUS',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1,
                              color: Colors.grey,
                            ),
                          ),
                        ),
                        Expanded(
                          child: Divider(
                            color: Colors.grey.withOpacity(0.3),
                            thickness: 1,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: screenHeight * 0.04),

                    // SENSOR + BATTERY
                    Row(
                      children: [
                        Expanded(
                          child: Container(
                            padding: EdgeInsets.all(screenWidth * 0.04),
                            decoration: BoxDecoration(
                              color: theme['card'],
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: const [
                                BoxShadow(color: Colors.black12, blurRadius: 6)
                              ],
                            ),
                            child: Column(
                              children: [
                                Text('Sensor',
                                    style: TextStyle(color: theme['text'])),
                                SizedBox(height: screenHeight * 0.02),
                                GestureDetector(
                                  onTap: isLoading ? null : toggleSensor,
                                  child: Container(
                                    width: 70,
                                    height: 36,
                                    decoration: BoxDecoration(
                                      color: (detector!['sensor_on'] ?? true)
                                          ? theme['switchActive']
                                          : theme['switchInactive'],
                                      borderRadius: BorderRadius.circular(30),
                                    ),
                                    alignment: (detector!['sensor_on'] ?? true)
                                        ? Alignment.centerRight
                                        : Alignment.centerLeft,
                                    padding: const EdgeInsets.all(4),
                                    child: Container(
                                      width: 28,
                                      height: 28,
                                      decoration: const BoxDecoration(
                                        color: Colors.white,
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                  ),
                                ),
                                SizedBox(height: screenHeight * 0.03),
                                Text(
                                  (detector!['sensor_on'] ?? true)
                                      ? '🟢 ON'
                                      : '🔴 OFF',
                                  style: TextStyle(color: theme['text']),
                                ),
                              ],
                            ),
                          ),
                        ),
                        SizedBox(width: screenWidth * 0.04),
                        Expanded(
                          child: Container(
                            padding: EdgeInsets.all(screenWidth * 0.04),
                            decoration: BoxDecoration(
                              color: theme['card'],
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: const [
                                BoxShadow(color: Colors.black12, blurRadius: 6)
                              ],
                            ),
                            child: Column(
                              children: [
                                Text('Battery',
                                    style: TextStyle(color: theme['text'])),
                                SizedBox(height: screenHeight * 0.015),
                                const Icon(Icons.battery_full,
                                    size: 36, color: Colors.green),
                                SizedBox(height: screenHeight * 0.012),
                                Text(
                                  'Health: ${detector!['battery']}%',
                                  style: TextStyle(
                                    color:
                                        (detector!['battery'] as int) > 40
                                            ? theme['batteryFill']
                                            : Colors.red,
                                  ),
                                ),
                                SizedBox(height: screenHeight * 0.012),
                                Container(
                                  height: 12,
                                  width: double.infinity,
                                  decoration: BoxDecoration(
                                    color: theme['batteryEmpty'],
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: FractionallySizedBox(
                                    alignment: Alignment.centerLeft,
                                    widthFactor:
                                        (detector!['battery'] as int) / 100,
                                    child: Container(
                                      decoration: BoxDecoration(
                                        color: (detector!['battery'] as int) >
                                                40
                                            ? theme['batteryFill']
                                            : Colors.red,
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),

                    // HISTORY BUTTON
                    SizedBox(height: screenHeight * 0.06),
                    Center(
                      child: ElevatedButton.icon(
                        onPressed: () {
                          if (detectorId != null) {
                            Navigator.pushNamed(
                              context,
                              '/history',
                              arguments: {'detectorId': detectorId},
                            );
                          }
                        },
                        icon: const Icon(Icons.history),
                        label: const Text(
                          'View Alert History',
                          style: TextStyle(
                              fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.deepOrange,
                          padding: EdgeInsets.symmetric(
                            vertical: screenHeight * 0.02,
                            horizontal: screenWidth * 0.05,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          foregroundColor: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
