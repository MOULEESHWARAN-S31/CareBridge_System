import 'dart:async';
import 'package:flutter/material.dart';
import '../../../app/routes/app_routes.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/localization/app_localizations.dart';
import '../data/mock_teleconsultation_repository.dart';
import '../domain/teleconsultation.dart';
import '../domain/teleconsultation_repository.dart';

class TeleconsultationCallScreen extends StatefulWidget {
  final Teleconsultation consultation;
  final TeleconsultationRepository? repository;
  final bool autoConnect;

  const TeleconsultationCallScreen({
    super.key,
    required this.consultation,
    this.repository,
    this.autoConnect = true,
  });

  @override
  State<TeleconsultationCallScreen> createState() =>
      _TeleconsultationCallScreenState();
}

class _TeleconsultationCallScreenState
    extends State<TeleconsultationCallScreen> {
  late final TeleconsultationRepository _repository;
  bool _isConnected = false;
  bool _isEnded = false;
  bool _isMuted = false;
  bool _isCameraOff = false;
  bool _isFrontCamera = true;

  Timer? _connectTimer;
  Timer? _callTimer;
  int _secondsElapsed = 0;

  final TextEditingController _chatController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<Map<String, dynamic>> _chatMessages = [];

  @override
  void initState() {
    super.initState();
    _repository = widget.repository ?? MockTeleconsultationRepository();

    if (widget.consultation.type == ConsultationType.chat) {
      _chatMessages.add({
        'sender': 'doctor',
        'text':
            'Hello ${widget.consultation.patientName}, I am ${widget.consultation.doctorName}. How can I assist you today?',
        'time': 'Just now',
      });
    }

    if (widget.autoConnect) {
      _connectTimer = Timer(const Duration(milliseconds: 1200), () {
        if (mounted) {
          _startCall();
        }
      });
    } else {
      _startCall();
    }
  }

  void _startCall() {
    setState(() {
      _isConnected = true;
    });
    _callTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted && !_isEnded) {
        setState(() {
          _secondsElapsed++;
        });
      }
    });
  }

  void _endCall() {
    _connectTimer?.cancel();
    _callTimer?.cancel();
    final duration = Duration(seconds: _secondsElapsed);

    setState(() {
      _isEnded = true;
    });

    _repository.updateConsultationStatus(
      widget.consultation.id,
      ConsultationStatus.completed,
      duration: duration,
    );
  }

  @override
  void dispose() {
    _connectTimer?.cancel();
    _callTimer?.cancel();
    _chatController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  String _formatDuration(int totalSeconds) {
    final minutes = (totalSeconds ~/ 60).toString().padLeft(2, '0');
    final seconds = (totalSeconds % 60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: widget.consultation.type == ConsultationType.video
          ? Colors.black87
          : AppColors.background,
      appBar: AppBar(
        backgroundColor: widget.consultation.type == ConsultationType.video
            ? Colors.black
            : AppColors.surface,
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_rounded,
            color: widget.consultation.type == ConsultationType.video
                ? Colors.white
                : AppColors.textPrimary,
          ),
          onPressed: () {
            if (!_isEnded) {
              _endCall();
            } else {
              Navigator.of(context).pop();
            }
          },
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.consultation.doctorName,
              style: TextStyle(
                color: widget.consultation.type == ConsultationType.video
                    ? Colors.white
                    : AppColors.textPrimary,
                fontSize: 16,
                fontWeight: FontWeight.w700,
              ),
            ),
            Text(
              widget.consultation.doctorSpecialization,
              style: TextStyle(
                color: widget.consultation.type == ConsultationType.video
                    ? Colors.white70
                    : AppColors.textMuted,
                fontSize: 12,
              ),
            ),
          ],
        ),
        actions: [
          Container(
            alignment: Alignment.center,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: _isConnected
                    ? AppColors.success.withValues(alpha: 0.15)
                    : AppColors.warning.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CircleAvatar(
                    radius: 3,
                    backgroundColor:
                        _isConnected ? AppColors.success : AppColors.warning,
                  ),
                  const SizedBox(width: 5),
                  Text(
                    _isConnected ? _formatDuration(_secondsElapsed) : '...',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color:
                          _isConnected ? AppColors.success : AppColors.warning,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      body: _isEnded
          ? _buildCallEndedView(loc)
          : !_isConnected
              ? _buildConnectingView(loc)
              : _buildActiveCallView(loc),
    );
  }

  // CONNECTING STATE
  Widget _buildConnectingView(AppLocalizations loc) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _buildPrototypeNoticeBanner(loc),
          const Spacer(),
          CircleAvatar(
            radius: 46,
            backgroundColor: AppColors.primaryLight,
            child: const Icon(Icons.person_rounded,
                size: 52, color: AppColors.primary),
          ),
          const SizedBox(height: 20),
          Text(
            widget.consultation.doctorName,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            widget.consultation.doctorSpecialization,
            style: const TextStyle(
              fontSize: 14,
              color: AppColors.textMuted,
            ),
          ),
          const SizedBox(height: 24),
          const SizedBox(
            width: 24,
            height: 24,
            child: CircularProgressIndicator(strokeWidth: 2.5),
          ),
          const SizedBox(height: 12),
          Text(
            loc.connectingToDoctor,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppColors.textSecondary,
            ),
          ),
          const Spacer(),
          Padding(
            padding: const EdgeInsets.only(bottom: 32),
            child: FloatingActionButton(
              onPressed: () => Navigator.of(context).pop(),
              backgroundColor: AppColors.critical,
              child: const Icon(Icons.call_end_rounded, color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  // ACTIVE CALL STATE (Video, Audio, or Chat)
  Widget _buildActiveCallView(AppLocalizations loc) {
    switch (widget.consultation.type) {
      case ConsultationType.video:
        return _buildVideoCallView(loc);
      case ConsultationType.audio:
        return _buildAudioCallView(loc);
      case ConsultationType.chat:
        return _buildChatCallView(loc);
    }
  }

  // Video Layout
  Widget _buildVideoCallView(AppLocalizations loc) {
    return Stack(
      children: [
        // Simulated Doctor Video View
        Positioned.fill(
          child: Container(
            color: const Color(0xFF1E293B),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CircleAvatar(
                  radius: 56,
                  backgroundColor: AppColors.primary.withValues(alpha: 0.3),
                  child: const Icon(Icons.person_rounded,
                      size: 64, color: Colors.white70),
                ),
                const SizedBox(height: 16),
                Text(
                  widget.consultation.doctorName,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  widget.consultation.doctorSpecialization,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Colors.white70,
                  ),
                ),
              ],
            ),
          ),
        ),
        // Patient Mini Video Preview
        Positioned(
          top: 16,
          right: 16,
          child: Container(
            width: 100,
            height: 140,
            decoration: BoxDecoration(
              color: _isCameraOff ? Colors.black : const Color(0xFF334155),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white24, width: 1.5),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.4),
                  blurRadius: 8,
                ),
              ],
            ),
            child: _isCameraOff
                ? const Center(
                    child: Icon(Icons.videocam_off_rounded,
                        color: Colors.white54, size: 28),
                  )
                : Stack(
                    children: [
                      Center(
                        child: Icon(
                          Icons.person,
                          color: Colors.white.withValues(alpha: 0.4),
                          size: 40,
                        ),
                      ),
                      Positioned(
                        bottom: 6,
                        left: 6,
                        child: Text(
                          widget.consultation.patientName,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
          ),
        ),
        // Top Prototype Notice
        Positioned(
          top: 8,
          left: 16,
          right: 124,
          child: _buildPrototypeNoticeBanner(loc),
        ),
        // Bottom Controls
        Positioned(
          left: 0,
          right: 0,
          bottom: 24,
          child: _buildVideoControls(loc),
        ),
      ],
    );
  }

  Widget _buildVideoControls(AppLocalizations loc) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        IconButton(
          onPressed: () {
            setState(() {
              _isMuted = !_isMuted;
            });
          },
          iconSize: 28,
          style: IconButton.styleFrom(
            backgroundColor: _isMuted ? Colors.white : Colors.white24,
            foregroundColor: _isMuted ? Colors.black : Colors.white,
            padding: const EdgeInsets.all(14),
          ),
          icon: Icon(_isMuted ? Icons.mic_off_rounded : Icons.mic_rounded),
        ),
        IconButton(
          onPressed: () {
            setState(() {
              _isCameraOff = !_isCameraOff;
            });
          },
          iconSize: 28,
          style: IconButton.styleFrom(
            backgroundColor: _isCameraOff ? Colors.white : Colors.white24,
            foregroundColor: _isCameraOff ? Colors.black : Colors.white,
            padding: const EdgeInsets.all(14),
          ),
          icon: Icon(
              _isCameraOff ? Icons.videocam_off_rounded : Icons.videocam_rounded),
        ),
        IconButton(
          onPressed: () {
            setState(() {
              _isFrontCamera = !_isFrontCamera;
            });
          },
          iconSize: 28,
          style: IconButton.styleFrom(
            backgroundColor: Colors.white24,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.all(14),
          ),
          icon: const Icon(Icons.flip_camera_ios_rounded),
        ),
        IconButton(
          onPressed: _endCall,
          iconSize: 28,
          style: IconButton.styleFrom(
            backgroundColor: AppColors.critical,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.all(14),
          ),
          icon: const Icon(Icons.call_end_rounded),
        ),
      ],
    );
  }

  // Audio Layout
  Widget _buildAudioCallView(AppLocalizations loc) {
    return Column(
      children: [
        _buildPrototypeNoticeBanner(loc),
        const Spacer(),
        CircleAvatar(
          radius: 60,
          backgroundColor: AppColors.primaryLight,
          child: const Icon(Icons.person_rounded,
              size: 68, color: AppColors.primary),
        ),
        const SizedBox(height: 20),
        Text(
          widget.consultation.doctorName,
          style: const TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w800,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          widget.consultation.doctorSpecialization,
          style: const TextStyle(
            fontSize: 15,
            color: AppColors.textMuted,
          ),
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: AppColors.successLight,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            '${loc.consultationConnected} • ${_formatDuration(_secondsElapsed)}',
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: AppColors.success,
            ),
          ),
        ),
        const Spacer(),
        Container(
          padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 32),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              IconButton(
                onPressed: () {
                  setState(() {
                    _isMuted = !_isMuted;
                  });
                },
                iconSize: 28,
                style: IconButton.styleFrom(
                  backgroundColor:
                      _isMuted ? AppColors.textPrimary : AppColors.surfaceVariant,
                  foregroundColor:
                      _isMuted ? Colors.white : AppColors.textPrimary,
                  padding: const EdgeInsets.all(16),
                ),
                icon: Icon(
                    _isMuted ? Icons.mic_off_rounded : Icons.mic_rounded),
              ),
              FloatingActionButton(
                onPressed: _endCall,
                backgroundColor: AppColors.critical,
                elevation: 2,
                child: const Icon(Icons.call_end_rounded, color: Colors.white),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // Chat Layout
  Widget _buildChatCallView(AppLocalizations loc) {
    return Column(
      children: [
        _buildPrototypeNoticeBanner(loc),
        Expanded(
          child: ListView.builder(
            controller: _scrollController,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            itemCount: _chatMessages.length,
            itemBuilder: (context, index) {
              final msg = _chatMessages[index];
              final isDoctor = msg['sender'] == 'doctor';

              return Align(
                alignment:
                    isDoctor ? Alignment.centerLeft : Alignment.centerRight,
                child: Container(
                  margin: const EdgeInsets.symmetric(vertical: 4),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  constraints: BoxConstraints(
                    maxWidth: MediaQuery.of(context).size.width * 0.75,
                  ),
                  decoration: BoxDecoration(
                    color: isDoctor ? AppColors.surface : AppColors.primary,
                    borderRadius: BorderRadius.circular(16),
                    border: isDoctor
                        ? Border.all(color: AppColors.borderLight)
                        : null,
                  ),
                  child: Column(
                    crossAxisAlignment: isDoctor
                        ? CrossAxisAlignment.start
                        : CrossAxisAlignment.end,
                    children: [
                      Text(
                        msg['text'] as String,
                        style: TextStyle(
                          fontSize: 14,
                          color: isDoctor ? AppColors.textPrimary : Colors.white,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        msg['time'] as String,
                        style: TextStyle(
                          fontSize: 10,
                          color:
                              isDoctor ? AppColors.textMuted : Colors.white70,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: const BoxDecoration(
            color: AppColors.surface,
            border: Border(top: BorderSide(color: AppColors.borderLight)),
          ),
          child: SafeArea(
            top: false,
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _chatController,
                    decoration: InputDecoration(
                      hintText: loc.chatInputHint,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: const BorderSide(color: AppColors.borderLight),
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 10),
                    ),
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  onPressed: _sendMessage,
                  icon: const Icon(Icons.send_rounded, color: AppColors.primary),
                ),
                IconButton(
                  onPressed: _endCall,
                  icon: const Icon(Icons.close_rounded, color: AppColors.critical),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  void _sendMessage() {
    final text = _chatController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _chatMessages.add({
        'sender': 'patient',
        'text': text,
        'time': 'Just now',
      });
      _chatController.clear();
    });

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 200),
          curve: Curves.easeOut,
        );
      }
    });

    // Simulated doctor reply after 1.5s
    Timer(const Duration(milliseconds: 1500), () {
      if (mounted && !_isEnded) {
        setState(() {
          _chatMessages.add({
            'sender': 'doctor',
            'text':
                'Understood. I have recorded your symptoms and updated your clinical notes in your digital OPD summary.',
            'time': 'Just now',
          });
        });
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (_scrollController.hasClients) {
            _scrollController.animateTo(
              _scrollController.position.maxScrollExtent,
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeOut,
            );
          }
        });
      }
    });
  }

  Widget _buildPrototypeNoticeBanner(AppLocalizations loc) {
    return Container(
      margin: const EdgeInsets.all(12),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.warningLight,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.warning.withValues(alpha: 0.4)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.info_outline_rounded,
              size: 16, color: AppColors.warning),
          const SizedBox(width: 8),
          Flexible(
            child: Text(
              loc.prototypeConsultationNotice,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: Color(0xFF92400E),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // CALL ENDED VIEW
  Widget _buildCallEndedView(AppLocalizations loc) {
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(18),
              decoration: const BoxDecoration(
                color: AppColors.surfaceVariant,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.call_end_rounded,
                color: AppColors.critical,
                size: 48,
              ),
            ),
            const SizedBox(height: 18),
            Text(
              loc.consultationEndedTitle,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w800,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              '${loc.callDurationLabel}: ${_formatDuration(_secondsElapsed)}',
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderLight),
              ),
              child: Column(
                children: [
                  _buildSummaryRow(
                    label: loc.consultationIdLabel,
                    value: widget.consultation.id,
                  ),
                  const SizedBox(height: 10),
                  _buildSummaryRow(
                    label: loc.quickActionBookDoctor,
                    value: widget.consultation.doctorName,
                  ),
                  const SizedBox(height: 10),
                  _buildSummaryRow(
                    label: loc.filterSpecialization,
                    value: widget.consultation.doctorSpecialization,
                  ),
                  const SizedBox(height: 10),
                  _buildSummaryRow(
                    label: loc.consultationTypeTitle,
                    value: widget.consultation.type.label,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.of(context).pushReplacementNamed(
                    AppRoutes.appointments,
                  );
                },
                icon: const Icon(Icons.calendar_today_rounded, size: 18),
                label: Text(
                  loc.addToAppointmentsBtn,
                  style:
                      const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 0,
                ),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: OutlinedButton(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.textPrimary,
                  side: const BorderSide(color: AppColors.border),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: Text(
                  loc.returnToHomeBtn,
                  style:
                      const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow({required String label, required String value}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 13, color: AppColors.textMuted),
        ),
        Flexible(
          child: Text(
            value,
            textAlign: TextAlign.end,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
        ),
      ],
    );
  }
}
