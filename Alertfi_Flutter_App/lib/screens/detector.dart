import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/services.dart';
import '../services/api_service.dart';

class DetectorScreen extends StatefulWidget {
  const DetectorScreen({super.key});

  @override
  State<DetectorScreen> createState() => _DetectorScreenState();
}

class _DetectorScreenState extends State<DetectorScreen> {
  List<Map<String, dynamic>> detectors = [];
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _locationController = TextEditingController();

  @override
  void initState() {
    super.initState();
    fetchDetectors();
  }

  Future<void> fetchDetectors() async {
    try {
      final res = await ApiService.authorizedGet('/detectors/');
      if (res.statusCode == 200) {
        final data = json.decode(res.body);
        setState(() {
          detectors = List<Map<String, dynamic>>.from(data);
        });
      } else {
        _showAlert('Error', 'Failed to fetch detectors. (${res.statusCode})');
      }
    } catch (e) {
      _showAlert('Error', 'Something went wrong: $e');
    }
  }

  Future<void> addDetector(String name, String location) async {
    final body = {'name': name, 'location': location};
    final res = await ApiService.authorizedPost('/detectors/', body);

    if (res.statusCode == 201) {
      Navigator.pop(context);
      fetchDetectors();
      _showAlert('Success', 'Detector Added Successfully!');
    } else {
      _showAlert('Error', 'Failed to add detector. (${res.statusCode})');
    }
  }

  Future<void> updateDetector(int id, String name, String location) async {
    final body = {'name': name, 'location': location};
    final res = await ApiService.authorizedPatch('/detectors/$id/', body);

    if (res.statusCode == 200) {
      Navigator.pop(context);
      fetchDetectors();
    } else {
      _showAlert('Error', 'Failed to update detector. (${res.statusCode})');
    }
  }

  Future<void> deleteDetector(int id) async {
    final res = await ApiService.authorizedDelete('/detectors/$id/');
    if (res.statusCode == 204) {
      fetchDetectors();
    } else {
      _showAlert('Error', 'Failed to delete detector. (${res.statusCode})');
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access');
    await prefs.remove('refresh');
    if (!mounted) return;
    Navigator.pushReplacementNamed(context, '/login');
  }

  void _showAddDetectorDialog() {
    _nameController.clear();
    _locationController.clear();
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Add Detector'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(hintText: 'Detector Name'),
            ),
            TextField(
              controller: _locationController,
              decoration: const InputDecoration(hintText: 'Location'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () async {
              final name = _nameController.text.trim();
              final location = _locationController.text.trim();
              if (name.isNotEmpty && location.isNotEmpty) {
                await addDetector(name, location);
              } else {
                _showAlert('Error', 'Please fill all fields.');
              }
            },
            child: const Text('Add'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
        ],
      ),
    );
  }

  void _showEditDetectorDialog(Map<String, dynamic> detector) {
    _nameController.text = detector['name'] ?? '';
    _locationController.text = detector['location'] ?? '';

    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Edit Detector'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(hintText: 'Detector Name'),
            ),
            TextField(
              controller: _locationController,
              decoration: const InputDecoration(hintText: 'Location'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () async {
              final name = _nameController.text.trim();
              final location = _locationController.text.trim();

              if (name.isNotEmpty && location.isNotEmpty) {
                await updateDetector(detector['id'], name, location);
              } else {
                _showAlert('Error', 'Please fill all fields.');
              }
            },
            child: const Text('Save'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
        ],
      ),
    );
  }

  void _showDeleteConfirmDialog(Map<String, dynamic> detector) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Remove Detector'),
        content: Text(
          'Are you sure you want to remove "${detector['name']}"?',
        ),
        actions: [
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              await deleteDetector(detector['id']);
            },
            child: const Text('Delete', style: TextStyle(color: Colors.red)),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
        ],
      ),
    );
  }

  void _showAlert(String title, String message) {
    if (!mounted) return;
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        SystemNavigator.pop();
        return false;
      },
      child: Scaffold(
        backgroundColor: const Color(0xFF8E1616),
        appBar: AppBar(
          backgroundColor: const Color(0xFFF1F1F1),
          foregroundColor: Colors.black87,
          elevation: 0,
          automaticallyImplyLeading: false,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.black87),
            onPressed: () {
              SystemNavigator.pop();
            },
          ),
          title: const Text('Detectors'),
          actions: [
            IconButton(
              icon: const Icon(Icons.add_circle_outline, color: Colors.black87),
              onPressed: _showAddDetectorDialog,
            ),
          ],
        ),
        body: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Center(   // <<< FIXED ALIGNMENT
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: detectors.isEmpty
                        ? [
                            const Padding(
                              padding: EdgeInsets.only(top: 40),
                              child: Text(
                                'No detectors found.',
                                style: TextStyle(color: Colors.white70),
                              ),
                            ),
                          ]
                        : detectors
                            .map((det) => _buildDetectorCard(det))
                            .toList(),
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: ElevatedButton.icon(
                onPressed: logout,
                icon: const Icon(Icons.logout),
                label: const Text('Logout'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: Colors.black87,
                  padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Detector card UI

  Widget _buildDetectorCard(Map<String, dynamic> det) {
    final detectorCode = det['detector_code'] ?? '';

    return GestureDetector(
      onTap: () => Navigator.pushNamed(
        context,
        '/home',
        arguments: {'detectorId': det['id']},
      ),
      child: Container(
        margin: const EdgeInsets.only(bottom: 18),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: const [
            BoxShadow(color: Colors.black26, blurRadius: 8, offset: Offset(0, 5)),
          ],
        ),
        child: Row(
          children: [
            const CircleAvatar(
              backgroundColor: Color(0xFF2563EB),
              radius: 28,
              child: Text('🔥', style: TextStyle(fontSize: 22)),
            ),
            const SizedBox(width: 16),

            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    det['name'] ?? '',
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                  Text(
                    det['location'] ?? '',
                    style: const TextStyle(
                      fontSize: 14,
                      color: Colors.black54,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "Code: $detectorCode",
                    style: const TextStyle(
                      fontSize: 12,
                      color: Colors.black45,
                    ),
                  ),
                ],
              ),
            ),

            IconButton(
              icon: const Icon(Icons.edit, color: Colors.black54),
              onPressed: () => _showEditDetectorDialog(det),
            ),
            IconButton(
              icon: const Icon(Icons.delete, color: Colors.red),
              onPressed: () => _showDeleteConfirmDialog(det),
            ),
          ],
        ),
      ),
    );
  }
}
