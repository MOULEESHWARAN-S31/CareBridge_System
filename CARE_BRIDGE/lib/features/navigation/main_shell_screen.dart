import 'package:flutter/material.dart';
import '../../shared/widgets/care_bridge_bottom_navigation.dart';
import '../appointments/appointments_screen.dart';
import '../healthcare/care_screen.dart';
import '../health_records/records_screen.dart';
import '../home/home_screen.dart';
import '../profile/profile_screen.dart';

/// MainShellScreen
/// Central owner of the 5-tab navigation state for CareBridge:
/// [0] Home
/// [1] Appointments
/// [2] Care
/// [3] Records
/// [4] Profile
class MainShellScreen extends StatefulWidget {
  final int initialTabIndex;

  const MainShellScreen({
    super.key,
    this.initialTabIndex = 0,
  });

  @override
  State<MainShellScreen> createState() => _MainShellScreenState();
}

class _MainShellScreenState extends State<MainShellScreen> {
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialTabIndex.clamp(0, 4);
  }

  void _onTabSelected(int index) {
    if (_currentIndex != index) {
      setState(() {
        _currentIndex = index;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // 5 Primary Navigation Screens
    final List<Widget> screens = [
      HomeScreen(onNavigateTab: _onTabSelected),
      const AppointmentsScreen(),
      const CareScreen(),
      const RecordsScreen(),
      const ProfileScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: CareBridgeBottomNavigation(
        currentIndex: _currentIndex,
        onTabSelected: _onTabSelected,
      ),
    );
  }
}
