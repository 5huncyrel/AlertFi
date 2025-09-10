import 'package:flutter/material.dart';
import 'dart:math';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool darkMode = false;
  bool sensorOn = true;

  final detector = {
    'id': '1',
    'name': 'Living Room',
    'ppm': 150,
    'battery': 85,
  };

  String systemStatus = 'Safe';

  @override
  void initState() {
    super.initState();
    _updateSystemStatus();
  }

  void _updateSystemStatus() {
    final ppm = detector['ppm'] as int;
    if (ppm > 1000) {
      systemStatus = 'Danger';
    } else if (ppm >= 600) {
      systemStatus = 'Warning';
    } else {
      systemStatus = 'Safe';
    }
  }

  double getGaugeOffset(int ppm) {
    const radius = 80.0;
    double percentage = (ppm - 0) / (1500 - 0);
    percentage = percentage.clamp(0, 1);
    return pi * radius * (1 - percentage);
  }

  Color getStatusColor() {
    switch (systemStatus) {
      case 'Warning':
        return Colors.amber;
      case 'Danger':
        return Colors.red;
      default:
        return Colors.green;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = darkMode;
    final bgColor = isDark ? Colors.black : Colors.white;
    final textColor = isDark ? Colors.white : Colors.black;
    final subTextColor = isDark ? Colors.grey[400] : Colors.grey[800];
    final cardColor = isDark ? Colors.grey[900] : Colors.white;

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Dark Mode Toggle
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    icon: Text(isDark ? '🌙' : '🌞', style: const TextStyle(fontSize: 26)),
                    onPressed: () {
                      setState(() {
                        darkMode = !darkMode;
                      });
                    },
                  ),
                  IconButton(
                    icon: const Text('⚙️', style: TextStyle(fontSize: 26)),
                    onPressed: () {
                      Navigator.pushNamed(context, '/settings');
                    },
                  ),
                ],
              ),

              const SizedBox(height: 20),

              // System Status Gauge
              Card(
                color: cardColor,
                elevation: 6,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                child: Padding(
                  padding: const EdgeInsets.all(28),
                  child: Column(
                    children: [
                      Text('System Status',
                          style: TextStyle(
                              color: textColor, fontSize: 20, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 20),
                      SizedBox(
                        height: 110,
                        child: CustomPaint(
                          size: const Size(220, 110),
                          painter: GaugePainter(detector['ppm'] as int, systemStatus),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        systemStatus,
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: getStatusColor(),
                          shadows: [
                            Shadow(
                                color: getStatusColor().withOpacity(0.4),
                                blurRadius: 8,
                                offset: Offset(0, 0))
                          ],
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text('PPM: ${detector['ppm']}',
                          style: TextStyle(color: subTextColor, fontSize: 16)),
                    ],
                  ),
                ),
              ),

              // Sensor + Battery Row
              const SizedBox(height: 24),
              Row(
                children: [
                  // Sensor Switch
                  Expanded(
                    child: Card(
                      color: cardColor,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: [
                            Text('Sensor',
                                style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: textColor)),
                            const SizedBox(height: 12),
                            Switch(
                              value: sensorOn,
                              activeColor: Colors.green,
                              onChanged: (val) {
                                setState(() {
                                  sensorOn = val;
                                });
                              },
                            ),
                            Text(sensorOn ? '🟢 ON' : '🔴 OFF',
                                style: TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                    color: textColor)),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  // Battery
                  Expanded(
                    child: Card(
                      color: cardColor,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: [
                            Text('Battery',
                                style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: textColor)),
                            const SizedBox(height: 10),
                            const Text('🔋', style: TextStyle(fontSize: 36)),
                            const SizedBox(height: 10),
                            Text('Health: ${detector['battery']}%',
                                style: TextStyle(
                                    color: (detector['battery'] as int) > 40
                                        ? Colors.green
                                        : Colors.red,
                                    fontWeight: FontWeight.bold)),
                            const SizedBox(height: 10),
                            LinearProgressIndicator(
                              value: (detector['battery'] as int) / 100,
                              backgroundColor: Colors.grey[300],
                              color: (detector['battery'] as int) > 40
                                  ? Colors.green
                                  : Colors.red,
                              minHeight: 10,
                              borderRadius: BorderRadius.circular(8),
                            )
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 30),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.deepOrange,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                  padding: const EdgeInsets.symmetric(vertical: 18),
                  elevation: 6,
                ),
                onPressed: () {
                  Navigator.pushNamed(context, '/history');
                },
                icon: const Icon(Icons.receipt_long),
                label: const Text(
                  'View Alert History',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}

class GaugePainter extends CustomPainter {
  final int ppm;
  final String status;

  GaugePainter(this.ppm, this.status);

  @override
  void paint(Canvas canvas, Size size) {
    const radius = 80.0;
    final center = Offset(size.width / 2, size.height);
    final paintBackground = Paint()
      ..color = Colors.grey.shade300
      ..strokeWidth = 16
      ..style = PaintingStyle.stroke;

    final paintForeground = Paint()
      ..color = _statusColor()
      ..strokeWidth = 16
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final fullAngle = pi;
    final sweepAngle = fullAngle * (ppm.clamp(0, 1500) / 1500);

    canvas.drawArc(Rect.fromCircle(center: center, radius: radius), pi, fullAngle, false, paintBackground);
    canvas.drawArc(Rect.fromCircle(center: center, radius: radius), pi, sweepAngle, false, paintForeground);
  }

  Color _statusColor() {
    if (status == 'Danger') return Colors.red;
    if (status == 'Warning') return Colors.amber;
    return Colors.green;
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}
