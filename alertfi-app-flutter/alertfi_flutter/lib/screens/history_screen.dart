import 'package:flutter/material.dart';

class HistoryScreen extends StatelessWidget {
  final List<Map<String, String>> mockAlerts = [
    {"id": "1", "status": "Gas Detected", "date": "2025-02-10", "time": "10:35", "reading": "PPM: 1500"},
    {"id": "2", "status": "Safe", "date": "2025-05-10", "time": "8:10", "reading": "PPM: 190"},
    {"id": "3", "status": "Warning", "date": "2025-08-09", "time": "11:22", "reading": "PPM: 800"},
    {"id": "4", "status": "Smoke Detected", "date": "2025-10-09", "time": "12:22", "reading": "PPM: 1500"},
    {"id": "5", "status": "Safe", "date": "2025-15-10", "time": "13:10", "reading": "PPM: 150"},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF8E1616),
      appBar: AppBar(
        backgroundColor: Color(0xFF8E1616),
        title: Text('Alert History', style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
        centerTitle: true,
        elevation: 0,
      ),
      body: ListView.builder(
        padding: EdgeInsets.all(20),
        itemCount: mockAlerts.length,
        itemBuilder: (context, index) {
          final item = mockAlerts[index];
          return Container(
            margin: EdgeInsets.only(bottom: 15),
            padding: EdgeInsets.all(15),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
              boxShadow: [
                BoxShadow(
                  color: Colors.black12,
                  offset: Offset(0, 2),
                  blurRadius: 4,
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item['status']!, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                SizedBox(height: 5),
                Text('Date: ${item['date']}'),
                Text('Time: ${item['time']}'),
                Text('Reading: ${item['reading']}'),
              ],
            ),
          );
        },
      ),
    );
  }
}
