import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/theme_provider.dart';
import '../services/api_service.dart';

class HistoryScreen extends StatefulWidget {
  @override
  _HistoryScreenState createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  String detectorId = '';
  List<Map<String, dynamic>> history = [];

  final Map<String, List<Color>> statusColors = {
    'WARNING': [Colors.amber, Colors.orangeAccent],
    'DANGER': [Colors.red, Colors.redAccent],
    'SMOKE DETECTED': [Colors.red, Colors.redAccent],
    'GAS DETECTED': [Colors.red, Colors.deepOrange],
  };

  IconData getIcon(String status) {
    switch (status) {
      case 'WARNING':
        return Icons.warning_amber_rounded;
      case 'DANGER':
        return Icons.whatshot;
      case 'SMOKE DETECTED':
        return Icons.smoke_free;
      case 'GAS DETECTED':
        return Icons.local_gas_station;
      default:
        return Icons.error_outline;
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
    if (args != null && args.containsKey('detectorId')) {
      detectorId = args['detectorId'].toString();
      fetchHistory();
    }
  }

  Future<void> fetchHistory() async {
    final res = await ApiService.authorizedGet('/detectors/$detectorId/readings/');

    if (res.statusCode == 200) {
      final List<dynamic> data = jsonDecode(res.body);
      setState(() {
        history = data
            .map<Map<String, dynamic>>((item) => item as Map<String, dynamic>)
            .where((item) =>
                item['status'] == 'WARNING' ||
                item['status'] == 'DANGER' ||
                item['status'] == 'SMOKE DETECTED' ||
                item['status'] == 'GAS DETECTED')
            .toList()
            .reversed
            .toList();
      });
    } else {
      setState(() {
        history = [];
      });
    }
  }

  Future<void> deleteReading(String id) async {
    final res = await ApiService.authorizedDelete('/readings/$id/');

    if (res.statusCode == 204 || res.statusCode == 200) {
      setState(() {
        history.removeWhere((item) => item['id'].toString() == id);
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Failed to delete. Please try again.")),
      );
    }
  }

  void confirmDelete(String id) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Delete Record"),
        content: const Text("Are you sure you want to delete this alert record?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text("Cancel"),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () {
              Navigator.of(context).pop();
              deleteReading(id);
            },
            child: const Text("Delete"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Provider.of<ThemeProvider>(context).isDarkMode;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF121214) : Colors.grey[100],
      appBar: AppBar(
        title: const Text("Alert History"),
        backgroundColor: const Color(0xFF8E1616),
        foregroundColor: Colors.white,
        elevation: 4,
      ),
      body: history.isEmpty
          ? const Center(
              child: Text(
                "No alerts to show.",
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: history.length,
              itemBuilder: (context, index) {
                final item = history[index];
                final id = item['id'].toString();
                final status = item['status'] ?? '';
                final ppm = item['ppm']?.toString() ?? '';
                final timestamp = item['timestamp'] ?? '';

                final dateTime = DateTime.tryParse(timestamp)?.toLocal();
                final date = dateTime != null
                    ? "${dateTime.year}-${dateTime.month.toString().padLeft(2, '0')}-${dateTime.day.toString().padLeft(2, '0')}"
                    : '';
                final time = dateTime != null
                    ? DateFormat('h:mm a').format(dateTime)
                    : '';

                final colors = statusColors[status] ?? [Colors.grey, Colors.grey];

                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: colors,
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: colors[0].withOpacity(0.3),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    leading: Icon(getIcon(status), color: Colors.white, size: 28),
                    title: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          status,
                          style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                        const SizedBox(height: 4),
                        Text("PPM: $ppm", style: const TextStyle(color: Colors.white70)),
                      ],
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 4),
                        Text("Date: $date", style: const TextStyle(color: Colors.white70)),
                        Text("Time: $time", style: const TextStyle(color: Colors.white70)),
                      ],
                    ),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete, color: Colors.white),
                      onPressed: () => confirmDelete(id),
                    ),
                  ),
                );
              },
            ),
    );
  }
}
