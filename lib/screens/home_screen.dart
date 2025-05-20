import 'package:flutter/material.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'dart:convert';

class HomeScreen extends StatefulWidget {
  final String token;

  const HomeScreen({Key? key, required this.token}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late WebSocketChannel _channel;
  bool darkMode = false;
  bool sensorOn = true;
  int ppm = 0;
  String systemStatus = 'Safe';

  @override
  void initState() {
    super.initState();
    _initWebSocket();
  }

  void _initWebSocket() {
    if (widget.token.isEmpty || !sensorOn) return;

    _channel = WebSocketChannel.connect(
      Uri.parse('wss://alertfi-web-7jgc.onrender.com/ws/sensor/?token=${widget.token}'),
    );

    _channel.stream.listen((event) {
      try {
        final data = jsonDecode(event);
        final newPpm = data['ppm'];
        final newStatus = newPpm > 400
            ? 'Danger'
            : newPpm >= 300
                ? 'Warning'
                : 'Safe';

        setState(() {
          ppm = newPpm;
          systemStatus = newStatus;
        });

        if (newStatus != 'Safe') {
          _sendAlert(newPpm, newStatus);
        }
      } catch (e) {
        print('WebSocket message parse error: $e');
      }
    }, onError: (error) {
      print('WebSocket error: $error');
    }, onDone: () {
      print('WebSocket closed');
    });
  }

  void _sendAlert(int ppm, String status) {
    // Send API request if needed using http package
    // Not implemented here to avoid overloading
  }

  @override
  void dispose() {
    _channel.sink.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDanger = systemStatus == 'Danger';
    final isWarning = systemStatus == 'Warning';

    return Scaffold(
      backgroundColor: darkMode ? const Color(0xFF4A0000) : Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.redAccent,
        title: const Text("Welcome to AlertFi"),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              Navigator.pop(context);
            },
          ),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: darkMode
                ? [Color(0xFF4A0000), Color(0xFF8B0000)]
                : [Colors.white, Color(0xFF8B0000)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Theme Toggle
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Switch(
                  value: darkMode,
                  onChanged: (val) {
                    setState(() => darkMode = val);
                  },
                  activeColor: Colors.green,
                  inactiveThumbColor: Colors.redAccent,
                ),
                Text(darkMode ? "Dark Mode" : "Light Mode"),
              ],
            ),

            const SizedBox(height: 30),

            // Gauge Placeholder
            Container(
              height: 200,
              width: double.infinity,
              decoration: BoxDecoration(
                color: darkMode ? Colors.black54 : Colors.red[50],
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.red.withOpacity(0.3),
                    blurRadius: 12,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Center(
                child: Text(
                  'PPM: $ppm',
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                ),
              ),
            ),

            const SizedBox(height: 20),

            Text(
              'Status: $systemStatus',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: isDanger
                    ? Colors.red
                    : isWarning
                        ? Colors.orange
                        : Colors.green,
              ),
            ),

            const SizedBox(height: 20),

            // Sensor Toggle
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Switch(
                  value: sensorOn,
                  onChanged: (val) {
                    setState(() {
                      sensorOn = val;
                      _channel.sink.close();
                      _initWebSocket();
                    });
                  },
                  activeColor: Colors.green,
                  inactiveThumbColor: Colors.redAccent,
                ),
                Text(sensorOn ? "Sensor is ON" : "Sensor is OFF"),
              ],
            ),

            const Spacer(),

            // Navigate Button
            ElevatedButton.icon(
              onPressed: () {
                Navigator.pushNamed(context, '/history', arguments: widget.token);
              },
              icon: const Icon(Icons.history),
              label: const Text('View History'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
            ),

          ],
        ),
      ),
    );
  }
}
