import 'package:flutter/material.dart';

class Detector {
  final String id;
  final String icon;
  String name;
  String location;

  Detector({
    required this.id,
    required this.icon,
    required this.name,
    required this.location,
  });
}

class DetectorScreen extends StatefulWidget {
  const DetectorScreen({super.key});

  @override
  State<DetectorScreen> createState() => _DetectorScreenState();
}

class _DetectorScreenState extends State<DetectorScreen> {
  List<Detector> detectors = [
    Detector(id: "1", icon: "🔥", location: "Detector LA", name: "Living Room"),
    Detector(id: "2", icon: "🔥", location: "Detector LB", name: "Living Room"),
    Detector(id: "3", icon: "🔥", location: "Detector KA", name: "Kitchen"),
    Detector(id: "4", icon: "🔥", location: "Detector BA", name: "Bed Room"),
  ];

  String? editingId;
  final nameController = TextEditingController();
  final locationController = TextEditingController();

  void startEditing(Detector detector) {
    setState(() {
      editingId = detector.id;
      nameController.text = detector.name;
      locationController.text = detector.location;
    });
  }

  void saveEditing() {
    final name = nameController.text.trim();
    final location = locationController.text.trim();

    if (name.isEmpty || location.isEmpty) {
      showDialog(
        context: context,
        builder: (_) => const AlertDialog(
          title: Text("Error"),
          content: Text("Name and location cannot be empty."),
        ),
      );
      return;
    }

    setState(() {
      detectors = detectors.map((d) {
        if (d.id == editingId) {
          return Detector(id: d.id, icon: d.icon, name: name, location: location);
        }
        return d;
      }).toList();
      editingId = null;
    });

    FocusManager.instance.primaryFocus?.unfocus();
    showDialog(
      context: context,
      builder: (_) => const AlertDialog(
        title: Text("Success"),
        content: Text("Detector info updated!"),
      ),
    );
  }

  void cancelEditing() {
    setState(() {
      editingId = null;
    });
    FocusManager.instance.primaryFocus?.unfocus();
  }

  void goToHomeScreen(String id) {
    Navigator.pushNamed(context, '/home', arguments: {'detectorId': id});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF8E1616),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              // Info Message
              Container(
                padding: const EdgeInsets.all(12),
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: const Color(0xFF4a1212),
                  border: Border.all(color: Color(0xFFb94545)),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: const [
                    Text("ℹ️", style: TextStyle(fontSize: 20, color: Colors.white)),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        "Tap on a card below to view the detector details",
                        style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ),

              if (detectors.isEmpty)
                const Text(
                  "No detectors found.",
                  style: TextStyle(color: Color(0xFF9ca3af), fontSize: 16),
                )
              else
                ...detectors.map((det) => buildCard(det)).toList(),
            ],
          ),
        ),
      ),
    );
  }

  Widget buildCard(Detector det) {
    final isEditing = editingId == det.id;

    return GestureDetector(
      onTap: () => goToHomeScreen(det.id),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: const [
            BoxShadow(
              color: Colors.black26,
              blurRadius: 8,
              offset: Offset(0, 6),
            ),
          ],
        ),
        child: Row(
          children: [
            // Icon
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: const Color(0xFF2563eb),
                shape: BoxShape.circle,
              ),
              alignment: Alignment.center,
              margin: const EdgeInsets.only(right: 12),
              child: Text(det.icon, style: const TextStyle(fontSize: 22, color: Colors.white)),
            ),

            // Text or input fields
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: isEditing
                    ? [
                        buildInput(nameController, fontSize: 18, bold: true),
                        const SizedBox(height: 6),
                        buildInput(locationController, fontSize: 14),
                      ]
                    : [
                        Text(
                          det.name,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF111827),
                          ),
                        ),
                        Text(
                          det.location,
                          style: const TextStyle(
                            fontSize: 14,
                            color: Color(0xFF6b7280),
                          ),
                        ),
                      ],
              ),
            ),

            // Buttons
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: isEditing
                  ? [
                      buildButton("Save", const Color(0xFF16a34a), saveEditing),
                      const SizedBox(height: 4),
                      buildButton("Cancel", const Color(0xFFdc2626), cancelEditing),
                    ]
                  : [
                      buildButton("Edit", const Color(0xFFFF5733), () => startEditing(det)),
                    ],
            )
          ],
        ),
      ),
    );
  }

  Widget buildInput(TextEditingController controller, {double fontSize = 16, bool bold = false}) {
    return TextField(
      controller: controller,
      style: TextStyle(
        fontSize: fontSize,
        fontWeight: bold ? FontWeight.bold : FontWeight.normal,
        color: bold ? const Color(0xFF111827) : const Color(0xFF6b7280),
      ),
      decoration: const InputDecoration(
        isDense: true,
        contentPadding: EdgeInsets.zero,
        border: UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.grey),
        ),
      ),
    );
  }

  Widget buildButton(String label, Color color, VoidCallback onTap) {
    return ElevatedButton(
      onPressed: onTap,
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
      ),
      child: Text(
        label,
        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 14),
      ),
    );
  }
}
