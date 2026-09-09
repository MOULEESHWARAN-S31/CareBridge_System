import 'package:flutter/material.dart';

enum ConsultationType {
  video,
  audio,
  chat,
}

extension ConsultationTypeExtension on ConsultationType {
  String get label {
    switch (this) {
      case ConsultationType.video:
        return 'Video Call';
      case ConsultationType.audio:
        return 'Audio Call';
      case ConsultationType.chat:
        return 'Chat';
    }
  }

  IconData get icon {
    switch (this) {
      case ConsultationType.video:
        return Icons.videocam_rounded;
      case ConsultationType.audio:
        return Icons.phone_in_talk_rounded;
      case ConsultationType.chat:
        return Icons.chat_bubble_outline_rounded;
    }
  }
}

enum ConsultationStatus {
  scheduled,
  waiting,
  connected,
  completed,
  cancelled,
}

class Teleconsultation {
  final String id;
  final String doctorId;
  final String doctorName;
  final String doctorSpecialization;
  final String doctorQualification;
  final String patientName;
  final String patientAbhaId;
  final String? patientAbhaNumber;
  final String? patientPhone;
  final ConsultationType type;
  final DateTime date;
  final String timeSlot;
  final ConsultationStatus status;
  final DateTime createdAt;
  final Duration? duration;
  final String? notes;

  const Teleconsultation({
    required this.id,
    required this.doctorId,
    required this.doctorName,
    required this.doctorSpecialization,
    required this.doctorQualification,
    required this.patientName,
    required this.patientAbhaId,
    this.patientAbhaNumber,
    this.patientPhone,
    required this.type,
    required this.date,
    required this.timeSlot,
    this.status = ConsultationStatus.scheduled,
    required this.createdAt,
    this.duration,
    this.notes,
  });

  Teleconsultation copyWith({
    String? id,
    String? doctorId,
    String? doctorName,
    String? doctorSpecialization,
    String? doctorQualification,
    String? patientName,
    String? patientAbhaId,
    String? patientAbhaNumber,
    String? patientPhone,
    ConsultationType? type,
    DateTime? date,
    String? timeSlot,
    ConsultationStatus? status,
    DateTime? createdAt,
    Duration? duration,
    String? notes,
  }) {
    return Teleconsultation(
      id: id ?? this.id,
      doctorId: doctorId ?? this.doctorId,
      doctorName: doctorName ?? this.doctorName,
      doctorSpecialization: doctorSpecialization ?? this.doctorSpecialization,
      doctorQualification: doctorQualification ?? this.doctorQualification,
      patientName: patientName ?? this.patientName,
      patientAbhaId: patientAbhaId ?? this.patientAbhaId,
      patientAbhaNumber: patientAbhaNumber ?? this.patientAbhaNumber,
      patientPhone: patientPhone ?? this.patientPhone,
      type: type ?? this.type,
      date: date ?? this.date,
      timeSlot: timeSlot ?? this.timeSlot,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      duration: duration ?? this.duration,
      notes: notes ?? this.notes,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Teleconsultation &&
          runtimeType == other.runtimeType &&
          id == other.id;

  @override
  int get hashCode => id.hashCode;
}
