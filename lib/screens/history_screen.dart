import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:web_socket_channel/web_socket_channel.dart';
import 'dart:convert';

class HistoryScreen extends StatefulWidget {
  final String token;

  const HistoryScreen({Key? key, required this.token}) : super(key: key);

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  List<Map<String, dynamic>> alerts = [];
  late WebSocketChannel channel;

  @override
  void initState() {
    super.initState();
    fetchInitialAlerts();
    setupWebSocket();
  }

  void fetchInitialAlerts() async {
    final response = await http.get(
      Uri.parse('https://alertfi-web-7jgc.onrender.com/api/alerts/'),
      headers: {
        'Authorization': 'Bearer ${widget.token}',
      },
    );

    if (response.statusCode == 200) {
      final List data = jsonDecode(response.body);
      setState(() {
        alerts = data.cast<Map<String, dynamic>>();
      });
    } else {
      print('Failed to load alerts');
    }
  }

  void setupWebSocket() {
    channel = WebSocketChannel.connect(
      Uri.parse('wss://alertfi-web-7jgc.onrender.com/ws/sensor/?token=${widget.token}'),
    );

    channel.stream.listen((message) {
      final data = jsonDecode(message);

      if (data['alert_level'] != 'safe') {
        final newAlert = {
          'message': data['message'],
          'alert_level': data['alert_level'],
          'timestamp': DateTime.now().toIso8601String(),
        };

        setState(() {
          alerts.insert(0, newAlert);
        });
      }
    });
  }

  @override
  void dispose() {
    channel.sink.close();
    super.dispose();
  }

  String extractPPM(String? message) {
    final match = RegExp(r'PPM: (\d+)').firstMatch(message ?? '');
    return match != null ? match.group(1)! : 'N/A';
  }

  @override
  Widget build(BuildContext context) {
    final filteredAlerts = alerts.where((alert) =>
        alert['alert_level'] == 'warning' || alert['alert_level'] == 'danger');

    return Scaffold(
      appBar: AppBar(
        title: const Text('🔥 Alert History 🔥'),
        backgroundColor: Colors.redAccent,
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.white, Color(0xFFFF4C4C)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: filteredAlerts.isEmpty
            ? const Center(child: Text('No alerts found.'))
            : ListView.builder(
                itemCount: filteredAlerts.length,
                itemBuilder: (context, index) {
                  final alert = filteredAlerts.elementAt(index);
                  final color = alert['alert_level'] == 'danger'
                      ? Colors.red
                      : Colors.orange;
                  final ppm = extractPPM(alert['message']);

                  return Card(
                    margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: ListTile(
                      title: Text(
                        'Timestamp: ${DateTime.parse(alert['timestamp']).toLocal()}',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Status: ${alert['alert_level']}', style: TextStyle(color: color)),
                          Text('PPM: $ppm'),
                        ],
                      ),
                    ),
                  );
                },
              ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.pop(context);
        },
        label: const Text('Back to Home'),
        icon: const Icon(Icons.home),
        backgroundColor: Colors.green,
      ),
    );
  }
}
