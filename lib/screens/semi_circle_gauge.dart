import 'package:flutter/material.dart';
import 'dart:math';

class SemiCircleGauge extends StatelessWidget {
  final int ppm;

  const SemiCircleGauge({Key? key, required this.ppm}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    double percent = (ppm / 1000).clamp(0.0, 1.0);
    double angle = percent * pi; // Half circle = pi radians

    Color color = Colors.green;
    if (ppm >= 600 && ppm <= 1000) {
      color = Colors.orange;
    } else if (ppm > 1000) {
      color = Colors.red;
    }

    return SizedBox(
      width: 200,
      height: 100,
      child: CustomPaint(
        painter: _SemiCirclePainter(angle: angle, color: color),
        child: Center(
          child: Text(
            '$ppm PPM',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
        ),
      ),
    );
  }
}

class _SemiCirclePainter extends CustomPainter {
  final double angle;
  final Color color;

  _SemiCirclePainter({required this.angle, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final strokeWidth = 20.0;
    final center = Offset(size.width / 2, size.height);
    final radius = (size.width / 2) - strokeWidth / 2;

    final backgroundPaint = Paint()
      ..color = Colors.grey.shade300
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;

    final foregroundPaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeWidth = strokeWidth;

    // Draw background semicircle
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      pi, // start at 180 degrees (left)
      pi, // sweep 180 degrees
      false,
      backgroundPaint,
    );

    // Draw foreground arc based on ppm
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      pi, // start at 180 degrees (left)
      angle, // sweep angle based on ppm
      false,
      foregroundPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _SemiCirclePainter oldDelegate) {
    return oldDelegate.angle != angle || oldDelegate.color != color;
  }
}
