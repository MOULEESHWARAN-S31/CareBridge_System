/// Represents an individual medicine parsed from a prescription for ordering.
class PrescriptionMedicine {
  final String name;
  final String dosage;
  final String frequency;
  final String duration;
  bool isSelected;

  PrescriptionMedicine({
    required this.name,
    this.dosage = '',
    this.frequency = '',
    this.duration = '',
    this.isSelected = true,
  });

  /// Factory parser for extracting medicine components from a record detail field.
  factory PrescriptionMedicine.fromDetail(String label, String value) {
    // Example: label: 'Paracetamol 500mg', value: '1 tablet twice daily after meals (3 days)'
    String name = label.trim();
    String dosage = '';
    String frequency = '';
    String duration = '';

    final parts = value.split('(');
    if (parts.length > 1) {
      duration = parts[1].replaceAll(')', '').trim();
    }

    final mainPart = parts[0].trim();
    final words = mainPart.split(' ');
    if (words.isNotEmpty) {
      dosage = words.take(2).join(' ');
      frequency = words.skip(2).join(' ');
    } else {
      frequency = mainPart;
    }

    return PrescriptionMedicine(
      name: name,
      dosage: dosage.isNotEmpty ? dosage : 'Standard dosage',
      frequency: frequency.isNotEmpty ? frequency : mainPart,
      duration: duration.isNotEmpty ? duration : 'As prescribed',
      isSelected: true,
    );
  }
}

/// Represents a placed mock medicine order.
class MedicineOrder {
  final String orderId;
  final String prescriptionId;
  final String prescriptionTitle;
  final String facility;
  final List<PrescriptionMedicine> items;
  final DateTime orderDate;
  final String status;

  const MedicineOrder({
    required this.orderId,
    required this.prescriptionId,
    required this.prescriptionTitle,
    required this.facility,
    required this.items,
    required this.orderDate,
    this.status = 'Confirmed',
  });

  static int _orderCounter = 1;

  static String generateOrderId() {
    final numStr = _orderCounter.toString().padLeft(4, '0');
    _orderCounter++;
    return 'CB-MED-$numStr';
  }
}
