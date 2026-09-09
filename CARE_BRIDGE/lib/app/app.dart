import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import '../core/constants/app_constants.dart';
import '../core/localization/app_localizations.dart';
import '../core/localization/supported_locales.dart';
import '../core/services/session_service.dart';
import '../features/authentication/data/mock_auth_repository.dart';
import '../features/authentication/domain/auth_repository.dart';
import '../features/authentication/presentation/authentication_controller.dart';
import 'routes/app_routes.dart';
import 'theme/app_theme.dart';

/// CareBridge Root Application Widget
class CareBridgeApp extends StatefulWidget {
  final SessionService? sessionService;
  final AuthRepository? authRepository;
  final AuthenticationController? authController;
  final String? initialRoute;
  final Locale? initialLocale;

  const CareBridgeApp({
    super.key,
    this.sessionService,
    this.authRepository,
    this.authController,
    this.initialRoute,
    this.initialLocale,
  });

  @override
  State<CareBridgeApp> createState() => _CareBridgeAppState();
}

class _CareBridgeAppState extends State<CareBridgeApp> {
  late final SessionService _sessionService;
  late final AuthRepository _authRepository;
  late final AuthenticationController _authController;
  late final bool _ownsController;
  late Locale _currentLocale;

  @override
  void initState() {
    super.initState();
    _sessionService = widget.sessionService ?? SessionService();
    final savedLang = _sessionService.getPreferredLanguage();
    _currentLocale = widget.initialLocale ??
        (savedLang != null ? Locale(savedLang) : SupportedLocales.english);
    AppRoutes.configure(_sessionService);

    _authRepository = widget.authRepository ?? MockAuthRepository(sessionService: _sessionService);

    if (widget.authController != null) {
      _authController = widget.authController!;
      _ownsController = false;
    } else {
      _authController = AuthenticationController(
        repository: _authRepository,
        sessionService: _sessionService,
        onLocaleChanged: _updateLocale,
      );
      _ownsController = true;
    }

    // Attempt restoring authenticated session on boot
    _authController.restoreSession();
  }

  @override
  void didUpdateWidget(CareBridgeApp oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.initialLocale != null && widget.initialLocale != oldWidget.initialLocale) {
      _currentLocale = widget.initialLocale!;
    }
  }

  void _updateLocale(Locale newLocale) {
    if (_currentLocale != newLocale) {
      setState(() {
        _currentLocale = newLocale;
      });
    }
  }

  @override
  void dispose() {
    if (_ownsController) {
      _authController.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return CareBridgeAuthScope(
      controller: _authController,
      child: MaterialApp(
        title: AppConstants.appName,
        debugShowCheckedModeBanner: false,

        // Centralized Theme System
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.light,

        // Live Dynamic Locale
        locale: _currentLocale,

        // Centralized Routing System
        initialRoute: widget.initialRoute ?? AppRoutes.splash,
        onGenerateInitialRoutes: (initialRoute) => [
          AppRoutes.onGenerateRoute(RouteSettings(name: initialRoute)),
        ],
        onGenerateRoute: AppRoutes.onGenerateRoute,

        // Localization Architecture
        supportedLocales: SupportedLocales.all,
        localizationsDelegates: const [
          AppLocalizations.delegate,
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],

        // Accessibility Text Scale Clamping (Supports up to 1.6x magnification safely)
        builder: (context, child) {
          final mediaQueryData = MediaQuery.of(context);
          final clampedScale = mediaQueryData.textScaler.clamp(
            minScaleFactor: 1.0,
            maxScaleFactor: 1.6,
          );
          return MediaQuery(
            data: mediaQueryData.copyWith(
              textScaler: clampedScale,
            ),
            child: child ?? const SizedBox.shrink(),
          );
        },
      ),
    );
  }
}
