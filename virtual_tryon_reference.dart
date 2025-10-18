import 'dart:async';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:lottie/lottie.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:share_plus/share_plus.dart';
import 'package:http/http.dart' as http;
import 'package:image_gallery_saver/image_gallery_saver.dart';
import 'package:path_provider/path_provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'dart:ui' as ui;
import '../services/rating_service.dart';
import '../theme/fitcheck_theme.dart';
import 'dart:io';
import 'package:connectivity_plus/connectivity_plus.dart';
import '../widgets/privacy_card.dart';
import '../services/mixpanel_service.dart';

class Config {
  static const String FASHON_API_KEY = 'fa-XADkCq5X82DA-6kuLwPj777Gpq20KldxPeUn4';
  static const String FASHON_API_ENDPOINT = 'https://api.fashn.ai/v1';
  static const String SUPABASE_URL = 'https://tayfqvhlpoosyrvgmbmr.supabase.co/';
  static const String SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRheWZxdmhscG9vc3lydmdtYm1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNDAxNTQsImV4cCI6MjA0ODcxNjE1NH0.qJu0NUVv0aBT4yus0Yod4GdauidG-wRyJ-07YIZCsW0';
}

class TryOnLoadingDialog extends StatefulWidget {
  final String status;
  final String selectedMode;
  final VoidCallback? onCancel;

  const TryOnLoadingDialog({
    Key? key,
    required this.status,
    required this.selectedMode,
    this.onCancel,
  }) : super(key: key);

  @override
  _TryOnLoadingDialogState createState() => _TryOnLoadingDialogState();
}

class _TryOnLoadingDialogState extends State<TryOnLoadingDialog>
    with TickerProviderStateMixin {
  late AnimationController _animationController;
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;
  
  final Map<String, int> estimatedTimes = {
    'quality': 20,
    'balanced': 14,
    'performance': 9,
  };

  final Map<String, String> modeNames = {
    'quality': 'Premium Quality',
    'balanced': 'Standard',
    'performance': 'Quick Preview',
  };

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: Duration(seconds: 2),
    )..repeat();
    
    _pulseController = AnimationController(
      duration: const Duration(seconds: 1),
      vsync: this,
    )..repeat(reverse: true);
    
    _pulseAnimation = Tween<double>(
      begin: 0.95,
      end: 1.05,
    ).animate(CurvedAnimation(
      parent: _pulseController,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _animationController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  Map<String, StatusInfo> get statusInfo => {
    'starting': StatusInfo(
      title: 'Initializing',
      message: 'Setting up the try-on process...',
      progress: 0.1,
      icon: Icons.rocket_launch,
    ),
    'in_queue': StatusInfo(
      title: 'In Queue',
      message: 'Your request is in line. We\'ll process it shortly...',
      progress: 0.3,  // Updated for better progression
      icon: Icons.queue,
    ),
    'processing': StatusInfo(
      title: 'Generating Your Look',
      message: 'Creating your custom visualization...',
      progress: 0.6,  // Updated for better progression
      icon: Icons.auto_awesome,
    ),
    'completed': StatusInfo(
      title: 'Ready!',
      message: 'Your try-on has been generated successfully!',
      progress: 1.0,
      icon: Icons.check_circle,
    ),
  };

  @override
  Widget build(BuildContext context) {
    final currentStatus = statusInfo[widget.status] ??
        StatusInfo(
          title: 'Processing',
          message: 'Please wait...',
          progress: 0.5,
          icon: Icons.hourglass_empty,
        );

    return Dialog(
      backgroundColor: Colors.transparent,
      elevation: 0,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 20,
              offset: Offset(0, 10),
            ),
          ],
        ),
        padding: EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Progress indicator with icon
            AnimatedBuilder(
              animation: _pulseAnimation,
              builder: (context, child) {
                return Transform.scale(
                  scale: _pulseAnimation.value,
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      Container(
                        width: 70,
                        height: 70,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: FitCheckTheme.primaryColor.withOpacity(0.1),
                        ),
                        child: CircularProgressIndicator(
                          value: currentStatus.progress,
                          strokeWidth: 4,
                          backgroundColor: FitCheckTheme.primaryColor.withOpacity(0.1),
                          valueColor: AlwaysStoppedAnimation<Color>(FitCheckTheme.primaryColor),
                        ),
                      ),
                      Container(
                        padding: EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: FitCheckTheme.primaryColor,
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: FitCheckTheme.primaryColor.withOpacity(0.3),
                              blurRadius: 12,
                              offset: Offset(0, 4),
                            ),
                          ],
                        ),
                        child: RotationTransition(
                          turns: _animationController,
                          child: Icon(
                            currentStatus.icon,
                            size: 24,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
            SizedBox(height: 20),

            // Status information
            Text(
              currentStatus.title,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: FitCheckTheme.textPrimary,
              ),
            ),
            SizedBox(height: 6),
            Text(
              currentStatus.message,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: FitCheckTheme.textSecondary,
                fontSize: 13,
              ),
            ),
            SizedBox(height: 16),

            // Quality Settings Info - Compact
            Container(
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: FitCheckTheme.primaryColor.withOpacity(0.05),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: FitCheckTheme.primaryColor.withOpacity(0.2),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.timer_outlined,
                    size: 14,
                    color: FitCheckTheme.primaryColor,
                  ),
                  SizedBox(width: 8),
                  Text(
                    '${modeNames[widget.selectedMode]} • ~${estimatedTimes[widget.selectedMode]}s',
                    style: TextStyle(
                      color: FitCheckTheme.textPrimary,
                      fontWeight: FontWeight.w600,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),

            // Cancel button if provided
            if (widget.onCancel != null) ...[
              SizedBox(height: 16),
              TextButton(
                onPressed: widget.onCancel,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.close, size: 16),
                    SizedBox(width: 4),
                    Text('Cancel', style: TextStyle(fontSize: 13)),
                  ],
                ),
                style: TextButton.styleFrom(
                  foregroundColor: FitCheckTheme.textSecondary,
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                    side: BorderSide(
                      color: Colors.grey.withOpacity(0.3),
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class StatusInfo {
  final String title;
  final String message;
  final double progress;
  final IconData icon;

  StatusInfo({
    required this.title,
    required this.message,
    required this.progress,
    required this.icon,
  });
}

class VirtualTryOn extends StatefulWidget {

  final String? userId;

  const VirtualTryOn({Key? key, this.userId}) : super(key: key);

  @override
  _VirtualTryOnState createState() => _VirtualTryOnState();
}

class _VirtualTryOnState extends State<VirtualTryOn> with SingleTickerProviderStateMixin {
  final supabase = Supabase.instance.client;
  RatingService? _ratingService;
  XFile? _modelImage;
  XFile? _garmentImage;
  String? _selectedCategory = 'tops';
  bool _isLoading = false;
  String? _generatedImageUrl;
  String? _errorMessage;
  bool _useCustomGarment = true;
  List<Map<String, dynamic>> _catalogueItems = [];
  bool _isLoadingCatalogue = false;
  String? _selectedCatalogueItem;
  String _selectedMode = 'quality';
  RealtimeChannel? _catalogueChannel;
  bool _isInitializing = false;
  // Add state for caching
  bool _isCacheLoaded = false;
  bool _showGarmentSection = false;
  bool _showCatalog = false;
  StreamSubscription<ConnectivityResult>? _connectivitySubscription;
  bool _isOnline = true;
  bool _showInstructionCard = false;
  Timer? _generationTimeout;
  late AnimationController _breathingController;
  bool _hasCheckedPreferences = false; // Add this flag
  String? _selectedGender;

  final List<Map<String, dynamic>> _categories = [
    {'value': 'tops', 'label': 'Top', 'icon': Icons.checkroom, 'apiValue': 'tops'},
    {'value': 'one-pieces', 'label': 'Full Body', 'icon': Icons.checkroom, 'apiValue': 'one-pieces'},
    {'value': 'bottoms', 'label': 'Bottoms', 'icon': Icons.layers, 'apiValue': 'bottoms'},
  ];

  @override
  void initState() {
    super.initState();
    _breathingController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    _initializeData();
    _connectivitySubscription = Connectivity()
        .onConnectivityChanged
        .listen(_updateConnectionStatus);
    _loadHowItWorksPreference();
    RatingService.getInstance().then((service) => _ratingService = service);
    MixpanelService.trackEvent(
        'Screen_View',
        properties: {
          'screen_name': 'virtual_tryon',
          'user_id': widget.userId ?? 'unknown'
        }
    );
  }

  @override
  void dispose() {
    _breathingController.dispose();
    _connectivitySubscription?.cancel();
    _generationTimeout?.cancel();
    super.dispose();
  }

  Future<void> _checkConnectivity() async {
    try {
      final result = await Connectivity().checkConnectivity();
      _updateConnectionStatus(result);
    } catch (e) {
      print('Failed to get connectivity status: $e');
    }
  }

  Future<void> _checkRating() async {
    if (_ratingService != null) {
      // Increment interaction count
      await _ratingService!.incrementInteractionCount();

      // Check if we should show rating dialog
      final shouldShow = await _ratingService!.shouldShowRating();
      if (shouldShow && mounted) {
        await _ratingService!.showCustomRatingDialog(context, widget.userId);
      }
    }
  }

  Future<String> _handleFashnError(dynamic error) async {
    print('[TryOn] Handling error: $error'); // For debugging

    if (error is Map) {
      final errorName = error['name'];
      final errorMessage = error['message'];

      // Log the error for debugging
      print('[TryOn] Error name: $errorName, message: $errorMessage');

      switch (errorName) {
        case 'ContentModerationError':
          return 'The uploaded content could not be processed. Please ensure your photos follow our guidelines.';
        case 'PhotoTypeError':
          return 'Unable to determine garment type or photo style. Please provide a clearer photo or manually select the garment category.';
        case 'PoseError':
          return 'Please provide a clear, full-body photo in a neutral pose, facing the camera.';
        case 'ImageLoadError':
          return 'We couldn\'t process the uploaded images. Please ensure the images are publicly accessible and in a supported format.';
        case 'PipelineError':
          return 'An unexpected error occurred. Please try again. If the issue persists, contact support.';
        case 'RateLimitExceeded':
          return 'The service is experiencing high demand. Please try again in a few moments.';
        case 'OutOfCredits':
          return 'This service is temporarily unavailable. Please try again later.';
        default:
        // Log unknown errors for monitoring
          print('[TryOn] Unknown error type: $errorName');
          return errorMessage ?? 'We encountered an issue while generating your try-on. Please try again.';
      }
    }

    // For general errors that don't follow the expected format
    print('[TryOn] Generic error: $error');
    return 'Unable to complete the try-on. Please try again later.';
  }


  void _showQualityModeSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) => Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 20,
              offset: Offset(0, -10),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle bar
            Container(
              margin: EdgeInsets.only(top: 12),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.withOpacity(0.3),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: FitCheckTheme.primaryColor,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(
                          Icons.tune_rounded,
                          color: Colors.white,
                          size: 20,
                        ),
                      ),
                      SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Generation Settings',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: FitCheckTheme.textPrimary,
                            ),
                          ),
                          Text(
                            'Choose your quality mode',
                            style: TextStyle(
                              fontSize: 12,
                              color: FitCheckTheme.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () => Navigator.pop(context),
                      borderRadius: BorderRadius.circular(50),
                      child: Container(
                        padding: EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.grey.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          Icons.close_rounded,
                          color: FitCheckTheme.textSecondary,
                          size: 20,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: QualityModeSelector(
                selectedMode: _selectedMode,
                onModeChange: (String mode) async {
                  setState(() => _selectedMode = mode);
                  // Quality mode change is immediate, so rating check timing is less critical
                  await _checkRating();
                  MixpanelService.trackEvent(
                      'Try_On_Mode_Changed',
                      properties: {
                        'mode': mode,
                        'user_id': widget.userId ?? 'unknown'
                      }
                  );
                  Navigator.pop(context);
                },
              ),
            ),
            SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  void _updateConnectionStatus(ConnectivityResult result) {
    final bool wasOffline = !_isOnline;
    final bool isNowOnline = result != ConnectivityResult.none;

    setState(() {
      _isOnline = isNowOnline;
    });

    if (mounted) {
      if (!isNowOnline) {
        // Show no internet snackbar only when going offline
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                Icon(Icons.signal_wifi_off, color: Colors.white),
                SizedBox(width: 8),
                Text('No internet connection available'),
              ],
            ),
            backgroundColor: FitCheckTheme.errorColor,
            duration: Duration(seconds: 5),
            behavior: SnackBarBehavior.floating,
            action: SnackBarAction(
              label: 'Retry',
              onPressed: () => _checkConnectivity(),
              textColor: Colors.white,
            ),
          ),
        );
      } else if (wasOffline) {
        // Hide snackbar and show success message when back online
        ScaffoldMessenger.of(context)
          ..hideCurrentSnackBar()
          ..showSnackBar(
            SnackBar(
              content: Row(
                children: [
                  Icon(Icons.wifi, color: Colors.white),
                  SizedBox(width: 8),
                  Text('Back online'),
                ],
              ),
              backgroundColor: FitCheckTheme.successColor,
              duration: Duration(seconds: 3),
              behavior: SnackBarBehavior.floating,
            ),
          );
      }
    }
  }

  void _showNoInternetSnackBar() {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(Icons.signal_wifi_off, color: Colors.white),
            SizedBox(width: 8),
            Text('No internet connection available'),
          ],
        ),
        backgroundColor: FitCheckTheme.errorColor,
        duration: Duration(seconds: 5),
        behavior: SnackBarBehavior.floating,
        action: SnackBarAction(
          label: 'Retry',
          onPressed: () => _checkConnectivity(),
          textColor: Colors.white,
        ),
      ),
    );
  }

  void _showGenerationDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) => TryOnLoadingDialog(
        status: 'starting',
        selectedMode: _selectedMode,
        onCancel: () {
          _generationTimeout?.cancel();
          Navigator.of(context).pop();
          setState(() => _isLoading = false);
        },
      ),
    );

    // Set timeout for generation process
    _generationTimeout = Timer(Duration(minutes: 2), () {
      if (mounted) {
        Navigator.of(context).pop();
        _showError(
            'Taking longer than expected',
            'The generation process is taking too long. Please try again.'
        );
      }
    });
  }

  Widget _buildGeneratedImageDialog(String imageUrl) {
    return Dialog(
      backgroundColor: Colors.transparent,
      elevation: 0,
      child: Container(
        constraints: BoxConstraints(
          maxHeight: MediaQuery.of(context).size.height * 0.75,
          maxWidth: MediaQuery.of(context).size.width * 0.95,
        ),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(32),
          boxShadow: [
            BoxShadow(
              color: FitCheckTheme.primaryColor.withOpacity(0.1),
              blurRadius: 40,
              offset: Offset(0, 20),
              spreadRadius: 5,
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header with gradient accent
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    FitCheckTheme.primaryColor.withOpacity(0.1),
                    FitCheckTheme.primaryColor.withOpacity(0.05),
                  ],
                ),
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(32),
                  topRight: Radius.circular(32),
                ),
              ),
              child: Row(
                children: [
                  Container(
                    padding: EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: FitCheckTheme.primaryColor,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Icon(
                      Icons.auto_awesome,
                      color: Colors.white,
                      size: 24,
                    ),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Looking amazing! 🔥',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w800,
                            color: FitCheckTheme.textPrimary,
                            letterSpacing: -0.5,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'Your virtual try-on is ready',
                          style: TextStyle(
                            fontSize: 13,
                            color: FitCheckTheme.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.close_rounded),
                    onPressed: () => Navigator.of(context).pop(),
                    style: IconButton.styleFrom(
                      backgroundColor: Colors.grey[100],
                      foregroundColor: FitCheckTheme.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            // AI Generated badge outside image
            Container(
              margin: EdgeInsets.only(bottom: 8),
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                decoration: BoxDecoration(
                  color: FitCheckTheme.primaryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(100),
                  border: Border.all(
                    color: FitCheckTheme.primaryColor.withOpacity(0.2),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: FitCheckTheme.successColor,
                        shape: BoxShape.circle,
                      ),
                    ),
                    SizedBox(width: 8),
                    Text(
                      'AI Generated',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: FitCheckTheme.primaryColor,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Image without overlay
            Flexible(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(20),
                    child: AspectRatio(
                      aspectRatio: 2/3,
                      child: CachedNetworkImage(
                                imageUrl: imageUrl,
                                fit: BoxFit.cover,
                                placeholder: (context, url) => Container(
                                  color: Colors.grey[100],
                                  child: Center(
                                    child: CircularProgressIndicator(
                                      valueColor: AlwaysStoppedAnimation<Color>(
                                        FitCheckTheme.primaryColor,
                                      ),
                                    ),
                                  ),
                                ),
                                errorWidget: (context, url, error) => Container(
                                  color: Colors.grey[100],
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        Icons.error_outline,
                                        size: 48,
                                        color: FitCheckTheme.errorColor,
                                      ),
                                      SizedBox(height: 16),
                                      Text(
                                        'Failed to load image',
                                        style: TextStyle(
                                          color: FitCheckTheme.textSecondary,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
            // Action buttons with better styling
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(32),
                  bottomRight: Radius.circular(32),
                ),
              ),
              child: Column(
                children: [
                  // Primary actions
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          height: 44,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                FitCheckTheme.primaryColor,
                                FitCheckTheme.primaryColor.withOpacity(0.8),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: [
                              BoxShadow(
                                color: FitCheckTheme.primaryColor.withOpacity(0.3),
                                blurRadius: 12,
                                offset: Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Material(
                            color: Colors.transparent,
                            child: InkWell(
                              onTap: () {
                                Navigator.of(context).pop();
                                Future.delayed(const Duration(milliseconds: 100), _shareImage);
                              },
                              borderRadius: BorderRadius.circular(16),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.share_rounded,
                                    color: Colors.white,
                                    size: 20,
                                  ),
                                  SizedBox(width: 8),
                                  Text(
                                    'Share',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 14,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                      SizedBox(width: 12),
                      Expanded(
                        child: Container(
                          height: 44,
                          child: OutlinedButton.icon(
                            onPressed: () {
                              Navigator.of(context).pop();
                              Future.delayed(const Duration(milliseconds: 100), _saveImage);
                            },
                            icon: Icon(Icons.download_rounded, size: 18),
                            label: Text(
                              'Save',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: FitCheckTheme.textPrimary,
                              side: BorderSide(
                                color: Colors.grey[300]!,
                                width: 1.5,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              padding: EdgeInsets.symmetric(vertical: 8),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 8),
                  // Secondary action
                  TextButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                      // Could trigger another try-on
                    },
                    child: Text(
                      'Try another outfit',
                      style: TextStyle(
                        color: FitCheckTheme.primaryColor,
                        fontWeight: FontWeight.w600,
                        fontSize: 13,
                      ),
                    ),
                    style: TextButton.styleFrom(
                      padding: EdgeInsets.symmetric(vertical: 8),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showError(String title, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(message),
            SizedBox(height: 16),
            PrivacyCard(isCompact: true),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }

  Future<void> _initializeData() async {
    setState(() {
      _isInitializing = true;
    });

    try {
      await Future.wait([
        _loadHowItWorksPreference(),
        _loadCachedCatalogue(),
        _checkConnectivity(),
      ]);

      _setupRealtimeSubscription();
      await _loadCatalogueItems();
    } finally {
      if (mounted) {
        setState(() {
          _isInitializing = false;
        });
      }
    }
  }

  Future<void> _loadCachedCatalogue() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String? cachedData = prefs.getString('catalogue_cache_${_selectedCategory}');

      if (cachedData != null) {
        final List<dynamic> cached = json.decode(cachedData);
        if (mounted) {
          setState(() {
            _catalogueItems = List<Map<String, dynamic>>.from(cached);
            _isCacheLoaded = true;
            _isLoadingCatalogue = false;
          });
        }
      }
    } catch (e) {
      print('Error loading cached catalogue: $e');
    }
  }

  Future<void> _updateCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String cachedData = json.encode(_catalogueItems);
      await prefs.setString('catalogue_cache_${_selectedCategory}', cachedData);
    } catch (e) {
      print('Error updating cache: $e');
    }
  }


  void _showGenerationLoadingDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return Dialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          child: Container(
            padding: EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: FitCheckTheme.primaryColor.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(FitCheckTheme.primaryColor),
                  ),
                ),
                SizedBox(height: 24),
                Text(
                  'Generating Your Look',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: FitCheckTheme.textPrimary,
                  ),
                ),
                SizedBox(height: 16),
                Text(
                  'We\'re creating a custom visualization of you wearing the selected outfit. This may take a minute...',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: FitCheckTheme.textSecondary,
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showGeneratedImageDialog(BuildContext context, String imageUrl) {
    final screenSize = MediaQuery.of(context).size;
    final maxHeight = screenSize.height * 0.85;
    final maxWidth = screenSize.width * 0.95;

    // Use showDialog instead of Navigator.push
    showDialog(
      context: context,
      barrierDismissible: true,
      barrierColor: Colors.black87, // Semi-transparent barrier
      builder: (dialogContext) => _buildGeneratedImageDialog(imageUrl),
    );
  }

  void _handleGenerationComplete(List<String> imageUrls) {
    _generationTimeout?.cancel();
    if (mounted && imageUrls.isNotEmpty) {  // Changed from _generatedImageUrl to imageUrls
      WidgetsBinding.instance.addPostFrameCallback((_) async {
        Navigator.of(context).popUntil((route) => route.isFirst);

        if (imageUrls.length > 1) {
          _showMultipleResultsDialog(context, imageUrls);
        } else {
          setState(() => _generatedImageUrl = imageUrls[0]);  // Set the first image as current
          _showGeneratedImageDialog(context, imageUrls[0]);
        }

        await _checkRating();
      });
    }
  }

  void _showMultipleResultsDialog(BuildContext context, List<String> imageUrls) {
    final PageController pageController = PageController();
    String currentImageUrl = imageUrls[0]; // Track current image URL
    int currentIndex = 0;

    showDialog(
      context: context,
      barrierDismissible: true,
      barrierColor: Colors.black87,
      builder: (dialogContext) {
        // Get screen dimensions for responsive design
        final screenSize = MediaQuery.of(context).size;
        final isSmallScreen = screenSize.width < 375;
        final isMediumScreen = screenSize.width >= 375 && screenSize.width < 414;
        final isTablet = screenSize.width > 600;
        
        // Responsive sizing
        final dialogWidth = isTablet ? 500.0 : screenSize.width * 0.92;
        final dialogHeight = screenSize.height * (isSmallScreen ? 0.7 : 0.65);
        final headerFontSize = isSmallScreen ? 16.0 : 18.0;
        final buttonFontSize = isSmallScreen ? 12.0 : 14.0;
        final iconSize = isSmallScreen ? 16.0 : 18.0;
        final padding = isSmallScreen ? 8.0 : 12.0;
        
        return Dialog(
          backgroundColor: Colors.transparent,
          elevation: 0,
          child: Container(
            constraints: BoxConstraints(
              maxHeight: dialogHeight,
              maxWidth: dialogWidth,
              minHeight: 400,  // Minimum height to prevent squishing
            ),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.white,
                  Colors.white.withOpacity(0.95),
                ],
              ),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                width: 1,
                color: FitCheckTheme.primaryColor.withOpacity(0.1),
              ),
              boxShadow: [
                BoxShadow(
                  color: FitCheckTheme.primaryColor.withOpacity(0.15),
                  blurRadius: 30,
                  offset: Offset(0, 15),
                  spreadRadius: 5,
                ),
              ],
            ),
            child: StatefulBuilder(
              builder: (context, setDialogState) => Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Modern header with animation
                  Container(
                    padding: EdgeInsets.all(padding),
                    child: Row(
                      children: [
                        // Animated icon
                        TweenAnimationBuilder<double>(
                          tween: Tween(begin: 0.0, end: 1.0),
                          duration: Duration(milliseconds: 600),
                          curve: Curves.elasticOut,
                          builder: (context, value, child) {
                            return Transform.scale(
                              scale: value,
                              child: Container(
                                padding: EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      FitCheckTheme.primaryColor,
                                      FitCheckTheme.primaryColor.withOpacity(0.7),
                                    ],
                                  ),
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(
                                  Icons.auto_awesome,
                                  color: Colors.white,
                                  size: isSmallScreen ? 14 : 16,
                                ),
                              ),
                            );
                          },
                        ),
                        SizedBox(width: 8),
                        
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Flexible(
                                    child: Text(
                                      imageUrls.length > 1 ? 'Looks ready! 🔥' : 'Looking fire! 🔥',
                                      style: TextStyle(
                                        fontSize: headerFontSize,
                                        fontWeight: FontWeight.w800,
                                        color: FitCheckTheme.textPrimary,
                                        letterSpacing: -0.5,
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  SizedBox(width: 6),
                                  // Animated AI badge
                                  AnimatedContainer(
                                    duration: Duration(milliseconds: 300),
                                    padding: EdgeInsets.symmetric(
                                      horizontal: isSmallScreen ? 6 : 8, 
                                      vertical: 2
                                    ),
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [
                                          Color(0xFF00F5FF),
                                          Color(0xFF00D4FF),
                                        ],
                                      ),
                                      borderRadius: BorderRadius.circular(100),
                                    ),
                                    child: Text(
                                      'AI',
                                      style: TextStyle(
                                        fontSize: isSmallScreen ? 9 : 10,
                                        fontWeight: FontWeight.w700,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              if (imageUrls.length > 1 && !isSmallScreen)
                                Text(
                                  'Swipe for more options',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: FitCheckTheme.textSecondary.withOpacity(0.7),
                                  ),
                                ),
                            ],
                          ),
                        ),
                        
                        // Close button
                        GestureDetector(
                          onTap: () => Navigator.of(context).pop(),
                          child: Container(
                            padding: EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: Colors.black.withOpacity(0.05),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              Icons.close,
                              size: isSmallScreen ? 18 : 20,
                              color: Colors.black54,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Image carousel with responsive sizing
                  Flexible(
                    child: Stack(
                      children: [
                        PageView.builder(
                          controller: pageController,
                          itemCount: imageUrls.length,
                          onPageChanged: (index) {
                            setDialogState(() {
                              currentIndex = index;
                              currentImageUrl = imageUrls[index];
                            });
                          },
                          itemBuilder: (context, index) {
                            return Padding(
                              padding: EdgeInsets.symmetric(
                                horizontal: isSmallScreen ? 8 : 12,
                                vertical: 4,
                              ),
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(20),
                                child: Container(
                                  decoration: BoxDecoration(
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.1),
                                        blurRadius: 20,
                                        offset: Offset(0, 10),
                                      ),
                                    ],
                                  ),
                                  child: AspectRatio(
                                    aspectRatio: 2/3,
                                    child: CachedNetworkImage(
                                      imageUrl: imageUrls[index],
                                      fit: BoxFit.cover,
                                      placeholder: (context, url) => Container(
                                        decoration: BoxDecoration(
                                          gradient: LinearGradient(
                                            begin: Alignment.topLeft,
                                            end: Alignment.bottomRight,
                                            colors: [
                                              Colors.grey[100]!,
                                              Colors.grey[200]!,
                                            ],
                                          ),
                                        ),
                                        child: Center(
                                          child: CircularProgressIndicator(
                                            strokeWidth: 2,
                                            valueColor: AlwaysStoppedAnimation<Color>(
                                              FitCheckTheme.primaryColor,
                                            ),
                                          ),
                                        ),
                                      ),
                                      errorWidget: (context, url, error) => Container(
                                        color: Colors.grey[100],
                                        child: Center(
                                          child: Icon(
                                            Icons.broken_image_outlined,
                                            size: 32,
                                            color: Colors.grey[400],
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                        
                        // Modern page indicators
                        if (imageUrls.length > 1)
                          Positioned(
                            bottom: 16,
                            left: 0,
                            right: 0,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: List.generate(
                                imageUrls.length,
                                (index) => AnimatedContainer(
                                  duration: Duration(milliseconds: 300),
                                  width: currentIndex == index 
                                    ? (isSmallScreen ? 16 : 20) 
                                    : (isSmallScreen ? 4 : 6),
                                  height: isSmallScreen ? 4 : 6,
                                  margin: EdgeInsets.symmetric(horizontal: 3),
                                  decoration: BoxDecoration(
                                    gradient: currentIndex == index
                                      ? LinearGradient(
                                          colors: [
                                            FitCheckTheme.primaryColor,
                                            FitCheckTheme.primaryColor.withOpacity(0.7),
                                          ],
                                        )
                                      : null,
                                    color: currentIndex == index
                                      ? null
                                      : Colors.white.withOpacity(0.5),
                                    borderRadius: BorderRadius.circular(3),
                                    boxShadow: currentIndex == index
                                      ? [
                                          BoxShadow(
                                            color: FitCheckTheme.primaryColor.withOpacity(0.5),
                                            blurRadius: 4,
                                            offset: Offset(0, 2),
                                          ),
                                        ]
                                      : null,
                                  ),
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                  
                  // Responsive action bar
                  Container(
                    padding: EdgeInsets.all(padding),
                    decoration: BoxDecoration(
                      color: Colors.grey[50],
                      borderRadius: BorderRadius.only(
                        bottomLeft: Radius.circular(24),
                        bottomRight: Radius.circular(24),
                      ),
                    ),
                    child: Row(
                      children: [
                        // Save button - responsive
                        AnimatedContainer(
                          duration: Duration(milliseconds: 200),
                          child: IconButton(
                            onPressed: () async {
                              await _saveImage(currentImageUrl);
                            },
                            icon: Icon(
                              Icons.download_rounded,
                              size: iconSize,
                            ),
                            style: IconButton.styleFrom(
                              backgroundColor: Colors.white,
                              foregroundColor: FitCheckTheme.primaryColor,
                              padding: EdgeInsets.all(isSmallScreen ? 8 : 10),
                              minimumSize: Size(isSmallScreen ? 36 : 44, isSmallScreen ? 36 : 44),
                              side: BorderSide(
                                color: FitCheckTheme.primaryColor.withOpacity(0.2),
                              ),
                            ),
                            tooltip: 'Save',
                          ),
                        ),
                        SizedBox(width: isSmallScreen ? 6 : 8),
                        
                        // Share button - primary, responsive
                        Expanded(
                          child: Container(
                            height: isSmallScreen ? 40 : 44,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  FitCheckTheme.primaryColor,
                                  FitCheckTheme.primaryColor.withOpacity(0.8),
                                ],
                              ),
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [
                                BoxShadow(
                                  color: FitCheckTheme.primaryColor.withOpacity(0.3),
                                  blurRadius: 8,
                                  offset: Offset(0, 4),
                                ),
                              ],
                            ),
                            child: ElevatedButton.icon(
                              onPressed: () async {
                                await _shareImage(currentImageUrl);
                              },
                              icon: Icon(Icons.share_rounded, size: iconSize),
                              label: FittedBox(
                                fit: BoxFit.scaleDown,
                                child: Text(
                                  'Share',
                                  style: TextStyle(
                                    fontSize: buttonFontSize,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.transparent,
                                foregroundColor: Colors.white,
                                elevation: 0,
                                shadowColor: Colors.transparent,
                                padding: EdgeInsets.symmetric(
                                  horizontal: isSmallScreen ? 12 : 16,
                                  vertical: 0,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                            ),
                          ),
                        ),
                        SizedBox(width: isSmallScreen ? 6 : 8),
                        
                        // New style button - responsive
                        AnimatedContainer(
                          duration: Duration(milliseconds: 200),
                          height: isSmallScreen ? 40 : 44,
                          child: OutlinedButton(
                            onPressed: () {
                              Navigator.of(context).pop();
                            },
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.refresh_rounded,
                                  size: iconSize,
                                ),
                                if (!isSmallScreen) ...[
                                  SizedBox(width: 4),
                                  Text(
                                    'New',
                                    style: TextStyle(
                                      fontSize: buttonFontSize,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ],
                            ),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: FitCheckTheme.primaryColor,
                              padding: EdgeInsets.symmetric(
                                horizontal: isSmallScreen ? 12 : 16,
                              ),
                              side: BorderSide(
                                color: FitCheckTheme.primaryColor.withOpacity(0.3),
                                width: 1.5,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                          ),
                        ),
                        
                        // Image counter - responsive, hide on very small screens
                        if (imageUrls.length > 1 && screenSize.width > 320)
                          AnimatedContainer(
                            duration: Duration(milliseconds: 200),
                            margin: EdgeInsets.only(left: isSmallScreen ? 6 : 8),
                            padding: EdgeInsets.symmetric(
                              horizontal: isSmallScreen ? 8 : 10,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: FitCheckTheme.primaryColor.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(100),
                            ),
                            child: Text(
                              '${currentIndex + 1}/${imageUrls.length}',
                              style: TextStyle(
                                fontSize: isSmallScreen ? 10 : 12,
                                fontWeight: FontWeight.w700,
                                color: FitCheckTheme.primaryColor,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildDialogActionButton({
    required IconData icon,
    required String label,
    required VoidCallback onPressed,
    bool isPrimary = false,
  }) {
    return isPrimary
        ? ElevatedButton.icon(
            onPressed: onPressed,
            icon: Icon(icon),
            label: Text(label),
            style: ElevatedButton.styleFrom(
              backgroundColor: FitCheckTheme.primaryColor,
              foregroundColor: Colors.white,
              padding: EdgeInsets.symmetric(vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          )
        : OutlinedButton.icon(
            onPressed: onPressed,
            icon: Icon(icon),
            label: Text(label),
            style: OutlinedButton.styleFrom(
              foregroundColor: FitCheckTheme.primaryColor,
              padding: EdgeInsets.symmetric(vertical: 12),
              side: BorderSide(
                color: FitCheckTheme.primaryColor.withOpacity(0.3),
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          );
  }

  void _handleRealtimeUpdate(Map<String, dynamic> payload) {
    final eventType = payload['eventType'];
    final newRecord = payload['new'];
    final oldRecord = payload['old'];

    setState(() {
      switch (eventType) {
        case 'INSERT':
          _catalogueItems.insert(0, newRecord);
          break;
        case 'DELETE':
          _catalogueItems.removeWhere((item) => item['id'] == oldRecord['id']);
          break;
        case 'UPDATE':
          final index = _catalogueItems.indexWhere((item) => item['id'] == newRecord['id']);
          if (index != -1) {
            _catalogueItems[index] = newRecord;
          }
          break;
      }
    });

    _updateCache();
  }

  Future<void> _loadHowItWorksPreference() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final bool? savedPreference = prefs.getBool('showHowItWorksTryOn');

      if (mounted) {
        setState(() {
          _showInstructionCard = savedPreference ?? false; // Show for first time users
          _hasCheckedPreferences = true;
        });
      }
    } catch (e) {
      print('Error loading preferences: $e');
      if (mounted) {
        setState(() {
          _showInstructionCard = true;
          _hasCheckedPreferences = true;
        });
      }
    }
  }

  Future<void> _setHowItWorksPreference(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('showHowItWorksTryOn', value);
    setState(() {
      _showInstructionCard = value;
    });
  }

  void _setupRealtimeSubscription() {
    _catalogueChannel?.unsubscribe();

    _catalogueChannel = supabase.channel('catalogue_changes')
      ..on(
        RealtimeListenTypes.postgresChanges,
        ChannelFilter(
          event: '*',
          schema: 'public',
          table: 'catalogue_items',
          filter: 'category=eq.${_selectedCategory}',
        ),
            (payload, [ref]) {
          _handleRealtimeUpdate(payload);
        },
      ).subscribe();
  }

  Future<void> _loadCatalogueItems() async {
    int retryCount = 0;
    const maxRetries = 3;
    const retryDelay = Duration(seconds: 2);

    // Only show loading if we don't have any items
    final bool shouldShowLoading = _catalogueItems.isEmpty;

    while (retryCount < maxRetries) {
      try {
        // Only set loading state if we should show loading
        if (shouldShowLoading) {
          setState(() {
            _isLoadingCatalogue = true;
            _errorMessage = null;
          });
        }

        print('Loading catalogue items for category: $_selectedCategory (Attempt ${retryCount + 1})');

        final response = await supabase
            .from('catalogue_items')
            .select()
            .eq('is_active', true)
            .eq('category', _selectedCategory)
            .order('created_at')
            .timeout(Duration(seconds: 10));

        if (response == null) {
          throw Exception('No response from server');
        }

        print('Raw response: $response');

        if (response is List) {
          setState(() {
            _catalogueItems = List<Map<String, dynamic>>.from(response);
            _isLoadingCatalogue = false;
            _errorMessage = null;
          });
          print('Successfully loaded ${_catalogueItems.length} items');
          return;
        } else {
          throw Exception('Invalid response format');
        }
      } catch (e) {
        print('Error loading catalogue (Attempt ${retryCount + 1}): $e');
        retryCount++;

        if (retryCount < maxRetries) {
          print('Retrying in ${retryDelay.inSeconds} seconds...');
          await Future.delayed(retryDelay);
        } else {
          print('Max retries reached, giving up');
          setState(() {
            _catalogueItems = [];
            _isLoadingCatalogue = false;
            _errorMessage = 'Failed to load catalogue items. Please try again later.';
          });
        }
      }
    }
  }

  void _showUploadGarmentSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      isScrollControlled: true,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => _UploadGarmentSheet(
        onCategorySelected: (category) async {
          setState(() => _selectedCategory = category);
          Navigator.pop(context);  // Close bottom sheet first
          await Future.delayed(Duration(milliseconds: 100));  // Short delay
          await _pickImage(false);  // Then show image picker
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: FitCheckTheme.backgroundColor,
      body: !_hasCheckedPreferences
          ? Center(child: CircularProgressIndicator())
          : CustomScrollView(
        slivers: [
          // App Bar
          SliverAppBar(
            expandedHeight: 80,
            pinned: true,
            backgroundColor: Colors.transparent,
            elevation: 0,
            actions: [
              if (!_showInstructionCard)
                IconButton(
                  icon: Icon(
                    Icons.help_outline,
                    color: Colors.white,
                  ),
                  onPressed: () => setState(() => _showInstructionCard = true),
                ),
              const SizedBox(width: 8),
            ],
            flexibleSpace: Stack(
              fit: StackFit.expand,
              children: [
                // Background image that stays visible when collapsed
                Positioned.fill(
                  child: Image.asset(
                    'assets/images/c_v.png',
                    fit: BoxFit.cover,
                  ),
                ),
                // Black overlay with transparency
                Positioned.fill(
                  child: Container(
                    color: Colors.black.withOpacity(0.4),
                  ),
                ),
                // Title
                FlexibleSpaceBar(
                  titlePadding: const EdgeInsets.only(left: 24, bottom: 16),
                  title: Text(
                    'Virtual Try-On',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 24,
                    ),
                  ),
                ),
              ],
            ),
          ),

          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (_showInstructionCard)
                  Container(
                    padding: EdgeInsets.only(top: 16),
                    child: _buildInstructionsCard(),
                  ),

                // Required Photo Upload Section
                Padding(
                  padding: EdgeInsets.all(16),
                  child: Column(
                    children: [
                      _buildPhotoUploadCard(),
                      if (_modelImage == null)
                        Padding(
                          padding: EdgeInsets.only(top: 24),
                          child: Lottie.asset(
                            'assets/lottie/clickpic.json',
                            height: 200,
                            fit: BoxFit.contain,
                          ),
                        ),
                    ],
                  ),
                ),

                // Garment Section
                if (_showGarmentSection && _modelImage != null)
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          margin: EdgeInsets.only(bottom: 16),
                          child: Text(
                            'What would you like to try on?',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                              height: 1.2,
                            ),
                          ),
                        ),

                        Column(
                          children: [
                            // Choice Toggle
                            Container(
                              padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.05),
                                    blurRadius: 10,
                                    offset: Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: _buildChoiceButton(
                                      title: 'Upload custom',
                                      icon: Icons.upload_file,
                                      isSelected: !_showCatalog,
                                      onTap: () {
                                        setState(() => _showCatalog = false);
                                        MixpanelService.trackEvent(
                                            'View_Mode_Changed',
                                            properties: {
                                              'mode': false ? 'catalog' : 'upload',
                                              'user_id': widget.userId ?? 'unknown'
                                            }
                                        );
                                      },
                                    ),
                                  ),
                                  Expanded(
                                    child: _buildChoiceButton(
                                      title: 'Browse Catalog',
                                      icon: Icons.shopping_bag,
                                      isSelected: _showCatalog,
                                      onTap: () {
                                        setState(() => _showCatalog = true);
                                        MixpanelService.trackEvent(
                                            'View_Mode_Changed',
                                            properties: {
                                              'mode': true ? 'catalog' : 'upload',
                                              'user_id': widget.userId ?? 'unknown'
                                            }
                                        );
                                      },
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            SizedBox(height: 14),

                            // Content based on selection
                            if (!_showCatalog && _garmentImage != null)
                              _buildGarmentPreview()
                            else if (!_showCatalog)
                              _buildUploadButton()
                            else
                              Stack(
                                children: [
                                  _buildCatalogGrid(),
                                  Positioned(
                                    top: 0,
                                    right: 8,
                                    child: Container(
                                      decoration: BoxDecoration(
                                        color: _selectedGender != null || _selectedCategory != 'tops'
                                            ? const Color(0xFF2196F3)
                                            : Colors.white,
                                        borderRadius: BorderRadius.circular(8),
                                        boxShadow: [BoxShadow(
                                          color: Colors.black.withOpacity(0.1),
                                          blurRadius: 4,
                                          offset: Offset(0, 2),
                                        )],
                                      ),
                                      child: IconButton(
                                        icon: Icon(Icons.filter_list),
                                        onPressed: _showFilterSheet,
                                        color: _selectedGender != null || _selectedCategory != 'tops'
                                            ? Colors.white
                                            : Colors.grey[600],
                                        iconSize: 18,
                                        padding: EdgeInsets.all(4),
                                        constraints: BoxConstraints(minWidth: 32, minHeight: 32),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomBar(context),
    );
  }



  void _showFilterSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 20,
              offset: Offset(0, -10),
            ),
          ],
        ),
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header with close button
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: FitCheckTheme.primaryColor,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Icon(
                          Icons.filter_list_rounded,
                          color: Colors.white,
                          size: 20,
                        ),
                      ),
                      SizedBox(width: 12),
                      Text(
                        'Filters',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w800,
                          color: FitCheckTheme.textPrimary,
                          letterSpacing: -0.5,
                        ),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: Icon(Icons.close_rounded, color: FitCheckTheme.textSecondary),
                    onPressed: () => Navigator.pop(context),
                    style: IconButton.styleFrom(
                      backgroundColor: Colors.grey.withOpacity(0.1),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 24),
              
              // Gender Section
              Container(
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: FitCheckTheme.primaryColor.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: FitCheckTheme.primaryColor.withOpacity(0.2),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.person_outline_rounded,
                          color: FitCheckTheme.textSecondary,
                          size: 18,
                        ),
                        SizedBox(width: 8),
                        Text(
                          'Gender',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: FitCheckTheme.textPrimary,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 12),
                    Row(
                      children: [
                        _buildGenderFilter('All', null),
                        SizedBox(width: 8),
                        _buildGenderFilter('Men', 'men'),
                        SizedBox(width: 8),
                        _buildGenderFilter('Women', 'women'),
                      ],
                    ),
                  ],
                ),
              ),
              SizedBox(height: 16),
              
              // Clothing Type Section
              Container(
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: FitCheckTheme.primaryColor.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: FitCheckTheme.primaryColor.withOpacity(0.2),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.checkroom_rounded,
                          color: FitCheckTheme.textSecondary,
                          size: 18,
                        ),
                        SizedBox(width: 8),
                        Text(
                          'Clothing Type',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: FitCheckTheme.textPrimary,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 12),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _categories.map((category) {
                        final isSelected = category['value'] == _selectedCategory;
                        return GestureDetector(
                          onTap: () {
                            setState(() {
                              _selectedCategory = category['value'];
                              _selectedCatalogueItem = null;
                            });
                            MixpanelService.trackEvent(
                                'Filter_Changed',
                                properties: {
                                  'type': 'category',
                                  'value': category['value'],
                                  'user_id': widget.userId ?? 'unknown'
                                }
                            );
                            _loadCatalogueItems();
                            Navigator.pop(context);
                          },
                          child: Container(
                            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                            decoration: BoxDecoration(
                              color: isSelected 
                                  ? FitCheckTheme.primaryColor 
                                  : FitCheckTheme.primaryColor.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: isSelected
                                    ? Colors.transparent
                                    : Colors.white.withOpacity(0.2),
                              ),
                              boxShadow: isSelected
                                  ? [
                                      BoxShadow(
                                        color: FitCheckTheme.primaryColor.withOpacity(0.3),
                                        blurRadius: 8,
                                        offset: Offset(0, 2),
                                      ),
                                    ]
                                  : null,
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  category['icon'],
                                  color: isSelected ? Colors.white : FitCheckTheme.textPrimary,
                                  size: 18,
                                ),
                                SizedBox(width: 8),
                                Text(
                                  category['label'],
                                  style: TextStyle(
                                    color: isSelected ? Colors.white : FitCheckTheme.textPrimary,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGenderFilter(String label, String? gender) {
    final isSelected = _selectedGender == gender;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() => _selectedGender = gender);
          MixpanelService.trackEvent(
              'Gender_Filter_Changed',
              properties: {
                'gender': gender ?? 'all',
                'user_id': widget.userId ?? 'unknown',
              }
          );
          Navigator.pop(context);
        },
        child: Container(
          padding: EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected 
                ? FitCheckTheme.primaryColor 
                : FitCheckTheme.primaryColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected
                  ? Colors.transparent
                  : FitCheckTheme.primaryColor.withOpacity(0.3),
            ),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: FitCheckTheme.primaryColor.withOpacity(0.3),
                      blurRadius: 8,
                      offset: Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                color: isSelected ? Colors.white : FitCheckTheme.textPrimary,
                fontWeight: FontWeight.w600,
                fontSize: 14,
              ),
            ),
          ),
        ),
      ),
    );
  }


  Widget _buildCategoryPill({
    required Map<String, dynamic> category,
    required bool isSelected,
  }) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedCategory = category['value'];
          _selectedCatalogueItem = null;
        });
        _loadCatalogueItems();
      },
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF2196F3) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? const Color(0xFF2196F3) : Colors.grey[300]!,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              category['icon'],
              color: isSelected ? Colors.white : Colors.grey[600],
              size: 18,
            ),
            SizedBox(width: 8),
            Text(
              category['label'],
              style: TextStyle(
                color: isSelected ? Colors.white : Colors.grey[600],
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChoiceButton({
    required String title,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        decoration: BoxDecoration(
          color: isSelected ? FitCheckTheme.primaryColor : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 20,
              color: isSelected ? Colors.white : Colors.grey[600],
            ),
            SizedBox(width: 8),
            Text(
              title,
              style: TextStyle(
                color: isSelected ? Colors.white : Colors.grey[600],
                fontWeight: FontWeight.w600,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }


  Widget _buildGarmentPreview() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          height: 200,
          width: double.infinity,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.grey[200]!),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Stack(
              fit: StackFit.expand,
              children: [
                Image.file(
                  File(_garmentImage!.path),
                  fit: BoxFit.cover,
                ),
                Positioned(
                  top: 8,
                  right: 8,
                  child: Material(
                    color: Colors.transparent,
                    child: IconButton(
                      icon: Icon(Icons.close, color: Colors.white),
                      onPressed: () {
                        setState(() {
                          _garmentImage = null;
                        });
                      },
                      style: IconButton.styleFrom(
                        backgroundColor: Colors.black54,
                        padding: EdgeInsets.all(8),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        SizedBox(height: 16),
        ElevatedButton.icon(
          onPressed: () => _showUploadGarmentSheet(),
          icon: Icon(Icons.refresh),
          label: Text('Choose Different Garment'),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.white,
            foregroundColor: FitCheckTheme.primaryColor,
            elevation: 0,
            side: BorderSide(
              color: FitCheckTheme.primaryColor.withOpacity(0.5),
              width: 1.5,
            ),
            padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildUploadButton() {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: FitCheckTheme.primaryColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: FitCheckTheme.primaryColor.withOpacity(0.3),
            blurRadius: 12,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => _showUploadGarmentSheet(),
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.cloud_upload_rounded,
                  color: Colors.white,
                  size: 24,
                ),
                SizedBox(width: 12),
                Text(
                  'Upload Your Own Garment',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBottomBar(BuildContext context) {
    return Container(
      height: 90,  // Fixed height
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 20,
            offset: Offset(0, -10),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: EdgeInsets.fromLTRB(16, 16, 16, 16),
          child: Row(
            children: [
              // Settings button with animated gradient
              Container(
                decoration: BoxDecoration(
                  color: FitCheckTheme.primaryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: FitCheckTheme.primaryColor.withOpacity(0.3),
                    width: 1,
                  ),
                ),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: _showQualityModeSheet,
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: EdgeInsets.all(12),
                      child: Icon(
                        Icons.tune_rounded,
                        size: 20,
                        color: FitCheckTheme.primaryColor,
                      ),
                    ),
                  ),
                ),
              ),
              SizedBox(width: 12),
              // Generate button with gradient
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: (_modelImage != null &&
                        (_selectedCatalogueItem != null || _garmentImage != null)) &&
                        !_isLoading
                        ? FitCheckTheme.primaryColor
                        : Colors.grey[300],
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: (_modelImage != null &&
                        (_selectedCatalogueItem != null || _garmentImage != null)) &&
                        !_isLoading
                        ? [
                            BoxShadow(
                              color: FitCheckTheme.primaryColor.withOpacity(0.3),
                              blurRadius: 12,
                              offset: Offset(0, 4),
                            ),
                          ]
                        : [],
                  ),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: (_modelImage != null &&
                          (_selectedCatalogueItem != null || _garmentImage != null)) &&
                          !_isLoading
                          ? _generateTryOn
                          : null,
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        padding: EdgeInsets.symmetric(vertical: 16),
                        child: Center(
                          child: _isLoading
                              ? Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    SizedBox(
                                      width: 20,
                                      height: 20,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        valueColor: AlwaysStoppedAnimation<Color>(
                                          Colors.white,
                                        ),
                                      ),
                                    ),
                                    SizedBox(width: 12),
                                    Text(
                                      'Generating Magic...',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                                  ],
                                )
                              : Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.auto_awesome,
                                      color: (_modelImage != null &&
                                          (_selectedCatalogueItem != null || _garmentImage != null)) &&
                                          !_isLoading
                                          ? Colors.white
                                          : FitCheckTheme.textSecondary,
                                      size: 20,
                                    ),
                                    SizedBox(width: 8),
                                    Text(
                                      'Generate Try-On',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: (_modelImage != null &&
                                            (_selectedCatalogueItem != null || _garmentImage != null)) &&
                                            !_isLoading
                                            ? Colors.white
                                            : FitCheckTheme.textSecondary,
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                                  ],
                                ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPhotoUploadCard() {
    return AnimatedBuilder(
      animation: _breathingController,
      builder: (context, child) {
        final glowValue = _breathingController.value;

        return GestureDetector(
          onTap: () => _pickImage(true),
          child: Container(
            height: 280,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                  spreadRadius: 0,
                ),
              ],
            ),
            child: _modelImage == null
                ? Stack(
              children: [
                // Dashed border container
                Positioned.fill(
                  child: Container(
                    margin: EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: Colors.transparent,
                      ),
                    ),
                    child: CustomPaint(
                      painter: DashedBorderPainter(
                        color: const Color(0xFF2196F3).withOpacity(0.5),
                        strokeWidth: 2,
                        gap: 5,
                      ),
                      child: Container(),
                    ),
                  ),
                ),

                // Required badge
                Positioned(
                  top: 24,
                  right: 24,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFF4CAF50).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(30),
                      border: Border.all(
                        color: const Color(0xFF4CAF50).withOpacity(0.2),
                        width: 1,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        Icon(
                          Icons.check_circle,
                          size: 14,
                          color: Color(0xFF4CAF50),
                        ),
                        SizedBox(width: 4),
                        Text(
                          'Required',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF4CAF50),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Main content
                Positioned.fill(
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: FitCheckTheme.primaryColor.withOpacity(0.1),
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: FitCheckTheme.primaryColor.withOpacity(0.2),
                              width: 1,
                            ),
                          ),
                          child: Icon(
                            Icons.add_a_photo_rounded,
                            size: 32,
                            color: FitCheckTheme.primaryColor,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'Click to Upload Your Photo',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.black87,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Full-body photo for best results',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 14,
                            color: FitCheckTheme.textSecondary,
                          ),
                        ),
                        const SizedBox(height: 20),
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            color: FitCheckTheme.primaryColor.withOpacity(0.05),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: FitCheckTheme.primaryColor.withOpacity(0.2),
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.info_outline_rounded,
                                size: 14,
                                color: FitCheckTheme.textSecondary,
                              ),
                              SizedBox(width: 6),
                              Text(
                                'AI-powered virtual fitting',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: FitCheckTheme.textSecondary,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            )
                : Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: FitCheckTheme.primaryColor.withOpacity(0.3),
                    blurRadius: 20,
                    offset: Offset(0, 10),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    Image.file(
                      File(_modelImage!.path),
                      fit: BoxFit.cover,
                    ),
                    // Gradient overlay
                    Positioned.fill(
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.transparent,
                              Colors.black.withOpacity(0.3),
                            ],
                            stops: [0.7, 1.0],
                          ),
                        ),
                      ),
                    ),
                    // Success badge
                    Positioned(
                      bottom: 16,
                      left: 16,
                      child: Container(
                        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: FitCheckTheme.successColor,
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: FitCheckTheme.successColor.withOpacity(0.3),
                              blurRadius: 8,
                              offset: Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.check_circle,
                              size: 14,
                              color: Colors.white,
                            ),
                            SizedBox(width: 4),
                            Text(
                              'Photo uploaded',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    // Delete button
                    Positioned(
                      top: 16,
                      right: 16,
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          onTap: () {
                            setState(() {
                              _modelImage = null;
                              _showGarmentSection = false;
                            });
                          },
                          borderRadius: BorderRadius.circular(50),
                          child: Container(
                            padding: EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: Colors.black.withOpacity(0.7),
                              shape: BoxShape.circle,
                              // Blur effect already visible through opacity
                            ),
                            child: Icon(
                              Icons.delete_rounded,
                              color: Colors.white,
                              size: 20,
                            ),
                          ),
                        ),
                      ),
                    ),
                    // Retake option (replacing old indicator)
                    Positioned(
                      bottom: 16,
                      right: 16,
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          onTap: () => _pickImage(true),
                          borderRadius: BorderRadius.circular(20),
                          child: Container(
                            padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.9),
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.1),
                                  blurRadius: 8,
                                  offset: Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.refresh_rounded,
                                  size: 16,
                                  color: FitCheckTheme.textPrimary,
                                ),
                                SizedBox(width: 6),
                                Text(
                                  'Retake',
                                  style: TextStyle(
                                    color: FitCheckTheme.textPrimary,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
  Widget _buildUploadOwnButton() {
    return OutlinedButton.icon(
      onPressed: () => _showUploadGarmentSheet(),
      icon: Icon(Icons.upload),
      label: Text('Upload Your Own Garment'),
      style: OutlinedButton.styleFrom(
        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }

  Widget _buildCatalogGrid() {
    if (_isLoadingCatalogue) {
      // Loading UI remains same
      return GridView.builder(
        shrinkWrap: true,
        physics: NeverScrollableScrollPhysics(),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          childAspectRatio: 0.75,
        ),
        itemCount: 4,
        itemBuilder: (context, index) => _buildLoadingCard(),
      );
    }

    // Add filtering logic here
    final filteredItems = _selectedGender != null
        ? _catalogueItems.where((item) =>
    item['gender'] == _selectedGender ||
        item['gender'] == null).toList()
        : _catalogueItems;

    return GridView.builder(
      shrinkWrap: true,
      physics: NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 0.75,
      ),
      itemCount: filteredItems.length,  // Use filteredItems instead
      itemBuilder: (context, index) => _buildCatalogItem(filteredItems[index]),  // Use filteredItems
    );
  }

  Widget _buildLoadingCard() {
    return Container(
      height: 240, // Fixed height
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(  // Make the image container take remaining space
            flex: 3,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
              ),
            ),
          ),
          Expanded(
            flex: 1,
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: const [
                  ShimmerLoading(height: 10, width: 120),
                  SizedBox(height: 8),
                  ShimmerLoading(height: 10, width: 80),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCatalogItem(Map<String, dynamic> item) {
    final isSelected = _selectedCatalogueItem == item['id'];

    return GestureDetector(
      onTap: () async {
        setState(() => _selectedCatalogueItem = item['id']);
        await _checkRating();
      },
      child: AnimatedContainer(
        duration: Duration(milliseconds: 200),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: isSelected
                  ? FitCheckTheme.primaryColor.withOpacity(0.3)
                  : Colors.black.withOpacity(0.08),
              blurRadius: isSelected ? 16 : 8,
              offset: Offset(0, isSelected ? 8 : 4),
              spreadRadius: isSelected ? 2 : 0,
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Stack(
            children: [
              // Image
              Positioned.fill(
                child: CachedNetworkImage(
                  imageUrl: item['image_url'],
                  fit: BoxFit.cover,
                  placeholder: (context, url) => Container(
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                    ),
                    child: Center(
                      child: CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation<Color>(FitCheckTheme.primaryColor),
                        strokeWidth: 2,
                      ),
                    ),
                  ),
                  errorWidget: (context, url, error) => Container(
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                    ),
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.image_not_supported_rounded,
                            color: FitCheckTheme.textSecondary,
                            size: 32,
                          ),
                          SizedBox(height: 8),
                          Text(
                            'Image unavailable',
                            style: TextStyle(
                              color: FitCheckTheme.textSecondary,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
              
              // Gradient overlay
              Positioned.fill(
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.transparent,
                        Colors.transparent,
                        Colors.black.withOpacity(0.6),
                      ],
                      stops: [0.0, 0.6, 1.0],
                    ),
                  ),
                ),
              ),
              
              // Title and info
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: Container(
                  padding: EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item['title'],
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w700,
                          fontSize: 15,
                          letterSpacing: -0.3,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      if (item['collection'] != null) ...[                        
                        SizedBox(height: 4),
                        Text(
                          item['collection'],
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.8),
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ],
                  ),
                ),
              ),
              
              // Selected indicator
              if (isSelected)
                Positioned.fill(
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: FitCheckTheme.primaryColor,
                        width: 3,
                      ),
                    ),
                  ),
                ),
              
              if (isSelected)
                Positioned(
                  top: 12,
                  right: 12,
                  child: Container(
                    padding: EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: FitCheckTheme.primaryColor,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: FitCheckTheme.primaryColor.withOpacity(0.4),
                          blurRadius: 8,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Icon(
                      Icons.check_rounded,
                      color: Colors.white,
                      size: 16,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInstructionsCard() {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Card(
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Stack(
          children: [
            Container(
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: FitCheckTheme.primaryColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(
                          Icons.tips_and_updates,
                          color: FitCheckTheme.primaryColor,
                          size: 16,
                        ),
                      ),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'How It Works',
                          style: TextStyle(
                            color: FitCheckTheme.textPrimary,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 16),
                  ..._buildSteps(),
                  SizedBox(height: 12),
                  PrivacyCard(isCompact: true),
                ],
              ),
            ),
            Positioned(
              top: 8,
              right: 8,
              child: IconButton(
                padding: EdgeInsets.zero,
                constraints: BoxConstraints(),
                icon: Icon(Icons.close, color: FitCheckTheme.textSecondary, size: 20),
                onPressed: () => _setHowItWorksPreference(false),
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildSteps() {
    final steps = [
      {
        'icon': Icons.add_a_photo,
        'title': 'Upload Your Photo',
        'description': 'Take a full-body photo of yourself in a neutral pose',
        'color': FitCheckTheme.primaryColor,
      },
      {
        'icon': Icons.checkroom,
        'title': 'Choose Your Garment',
        'description': 'Select from our catalogue or upload your own clothing item',
        'color': FitCheckTheme.primaryColor.withOpacity(0.8),
      },
      {
        'icon': Icons.auto_awesome,
        'title': 'Generate Try-On',
        'description': 'See yourself wearing the selected garment using AI',
        'color': FitCheckTheme.primaryColor.withOpacity(0.6),
      },
    ];

    return steps.map((step) => Padding(
      padding: EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: step['color'] as Color,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              step['icon'] as IconData,
              color: Colors.white,
              size: 16,
            ),
          ),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  step['title'] as String,
                  style: TextStyle(
                    color: FitCheckTheme.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  step['description'] as String,
                  style: TextStyle(
                    color: FitCheckTheme.textSecondary,
                    fontSize: 12,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    )).toList();
  }


  Widget _buildInstructionStep(String number, String text) {
    return Padding(
      padding: EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
              child: Text(
                number,
                style: TextStyle(
                  color: Theme.of(context).colorScheme.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                color: Theme.of(context).colorScheme.onSurface.withOpacity(0.8),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildModelPhotoSection() {
    return _buildUploadSection(
      isModel: true,
      image: _modelImage,
      onTap: () => _pickImage(true),
      title: 'Your Photo',
      subtitle: 'Take a full-body photo in neutral pose',
      icon: Icons.person,
    );
  }

  Widget _buildCustomGarmentSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildUploadSection(
          isModel: false,
          image: _garmentImage,
          onTap: () => _pickImage(false),
          title: 'Upload Garment',
          subtitle: 'Choose a clear photo of the garment',
          icon: Icons.checkroom,
        ),
        SizedBox(height: 24),
        _buildCategorySelector(),
      ],
    );
  }

  Widget _buildUploadSection({
    required bool isModel,
    required XFile? image,
    required VoidCallback onTap,
    required String title,
    required String subtitle,
    required IconData icon,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 12),
        _buildUploadArea(
          isModel: isModel,
          image: image,
          onTap: onTap,
          icon: icon,
          mainText: title,
          description: subtitle,
        ),
      ],
    );
  }

  Widget _buildUploadArea({
    required bool isModel,
    required XFile? image,
    required VoidCallback onTap,
    required IconData icon,
    required String mainText,
    required String description,
  }) {
    return InkWell(
      onTap: onTap,
      child: Container(
        height: 200,
        width: double.infinity,
        decoration: BoxDecoration(
          color: FitCheckTheme.surfaceColor,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: image == null
            ? Stack(
          children: [
            // Custom dashed border using CustomPaint
            CustomPaint(
              painter: DottedBorderPainter(
                color: FitCheckTheme.primaryColor.withOpacity(0.3),
                strokeWidth: 2,
                gap: 5,
              ),
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
            ),
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: FitCheckTheme.primaryColor.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.add_photo_alternate,
                      size: 32,
                      color: FitCheckTheme.primaryColor,
                    ),
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Upload $mainText',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: FitCheckTheme.primaryColor,
                    ),
                  ),
                  SizedBox(height: 12),
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: FitCheckTheme.primaryColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.touch_app,
                          size: 16,
                          color: FitCheckTheme.primaryColor,
                        ),
                        SizedBox(width: 8),
                        Text(
                          'Tap to choose photo',
                          style: TextStyle(
                            color: FitCheckTheme.primaryColor,
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                  SizedBox(height: 8),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 32),
                    child: Text(
                      description,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        color: FitCheckTheme.textSecondary,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        )
            : ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Stack(
            fit: StackFit.expand,
            children: [
              Image.file(
                File(image.path),
                fit: BoxFit.cover,
              ),
              Positioned(
                top: 8,
                right: 8,
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.5),
                    shape: BoxShape.circle,
                  ),
                  child: IconButton(
                    icon: Icon(Icons.close, color: Colors.white),
                    onPressed: () => setState(() {
                      if (isModel) {
                        _modelImage = null;
                        _showGarmentSection = false;
                      } else {
                        _garmentImage = null;
                      }
                    }),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGarmentSourceToggle() {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Choose Your Garment',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildSourceOption(
                  title: 'Upload Your Own',
                  icon: Icons.upload_file,
                  isSelected: _useCustomGarment,
                  onTap: () => setState(() => _useCustomGarment = true),
                  gradient: LinearGradient(
                    colors: [
                      Theme.of(context).colorScheme.primary,
                      Theme.of(context).colorScheme.secondary,
                    ],
                  ),
                ),
              ),
              SizedBox(width: 16),
              Expanded(
                child: _buildSourceOption(
                  title: 'Browse Catalogue',
                  icon: Icons.shopping_bag,
                  isSelected: !_useCustomGarment,
                  onTap: () {
                    setState(() {
                      _useCustomGarment = false;
                      _garmentImage = null;
                    });
                    _loadCatalogueItems();
                  },
                  gradient: LinearGradient(
                    colors: [
                      Theme.of(context).colorScheme.tertiary,
                      Theme.of(context).colorScheme.secondary,
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSourceOption({
    required String title,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
    required Gradient gradient,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: Duration(milliseconds: 200),
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: isSelected ? gradient : null,
          color: isSelected ? null : Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: isSelected
                  ? Theme.of(context).colorScheme.primary.withOpacity(0.3)
                  : Colors.black.withOpacity(0.05),
              blurRadius: isSelected ? 12 : 4,
              offset: Offset(0, 4),
            ),
          ],
          border: Border.all(
            color: isSelected
                ? Colors.transparent
                : Theme.of(context).colorScheme.outline.withOpacity(0.2),
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 32,
              color: isSelected ? Colors.white : Theme.of(context).colorScheme.primary,
            ),
            SizedBox(height: 12),
            Text(
              title,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: isSelected ? Colors.white : Theme.of(context).colorScheme.onSurface,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCatalogueSection() {
    return Container(
      height: 300,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Select from Catalogue',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 16),
          Expanded(
            child: _isLoadingCatalogue
                ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 16),
                  Text(
                    'Loading catalogue...',
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                    ),
                  ),
                ],
              ),
            )
                : _catalogueItems.isEmpty
                ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.category_outlined,
                    size: 48,
                    color: Theme.of(context).colorScheme.primary.withOpacity(0.5),
                  ),
                  SizedBox(height: 16),
                  Text(
                    'No items available in this category',
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                    ),
                  ),
                ],
              ),
            )
                : ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _catalogueItems.length,
              itemBuilder: (context, index) {
                final item = _catalogueItems[index];
                final isSelected = _selectedCatalogueItem == item['id'];

                print('Loading catalogue item: ${item['title']}'); // Debug print

                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _selectedCatalogueItem = item['id'];
                    });
                  },
                  child: Container(
                    width: 200,
                    margin: EdgeInsets.only(right: 16),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isSelected
                            ? Theme.of(context).colorScheme.primary
                            : Theme.of(context).colorScheme.outline.withOpacity(0.2),
                        width: isSelected ? 2 : 1,
                      ),
                    ),
                    clipBehavior: Clip.antiAlias,
                    child: Stack(
                      children: [
                        Positioned.fill(
                          child: CachedNetworkImage(
                            imageUrl: item['image_url'],
                            fit: BoxFit.cover,
                            maxHeightDiskCache: 1000,
                            memCacheHeight: 800,
                            fadeInDuration: Duration(milliseconds: 300),
                            fadeOutDuration: Duration(milliseconds: 300),
                            placeholder: (context, url) => Container(
                              color: Theme.of(context).colorScheme.surfaceVariant,
                              child: Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    CircularProgressIndicator(
                                      strokeWidth: 2,
                                    ),
                                    SizedBox(height: 8),
                                    Text(
                                      'Loading image...',
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            errorWidget: (context, url, error) {
                              print('Error loading image for ${item['title']}: $error');
                              return Container(
                                color: Theme.of(context).colorScheme.errorContainer.withOpacity(0.1),
                                child: Center(
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        Icons.error_outline,
                                        color: Theme.of(context).colorScheme.error,
                                        size: 32,
                                      ),
                                      SizedBox(height: 8),
                                      Padding(
                                        padding: EdgeInsets.all(8),
                                        child: Text(
                                          'Image unavailable',
                                          textAlign: TextAlign.center,
                                          style: TextStyle(
                                            color: Theme.of(context).colorScheme.error,
                                            fontSize: 12,
                                          ),
                                        ),
                                      ),
                                      TextButton(
                                        onPressed: () {
                                          CachedNetworkImage.evictFromCache(item['image_url']);
                                          setState(() {});
                                        },
                                        child: Text('Retry'),
                                        style: TextButton.styleFrom(
                                          padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                        Positioned(
                          bottom: 0,
                          left: 0,
                          right: 0,
                          child: Container(
                            padding: EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [
                                  Colors.transparent,
                                  Colors.black.withOpacity(0.7),
                                ],
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item['title'],
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                if (item['collection'] != null)
                                  Text(
                                    item['collection'],
                                    style: TextStyle(
                                      color: Colors.white.withOpacity(0.8),
                                      fontSize: 12,
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        ),
                        if (isSelected)
                          Positioned(
                            top: 8,
                            right: 8,
                            child: Container(
                              padding: EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: Theme.of(context).colorScheme.primary,
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                Icons.check,
                                color: Colors.white,
                                size: 16,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorSection() {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.error.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Theme.of(context).colorScheme.error.withOpacity(0.2),
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.error.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              Icons.error_outline,
              color: Theme.of(context).colorScheme.error,
              size: 24,
            ),
          ),
          SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Error',
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.error,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  _errorMessage!,
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.error.withOpacity(0.8),
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () {
              setState(() {
                _errorMessage = null;
              });
            },
            icon: Icon(
              Icons.close,
              color: Theme.of(context).colorScheme.error,
              size: 20,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategorySelector() {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            'Or select from our catalog',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          SizedBox(height: 12),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: _categories.map((category) {
                final isSelected = category['value'] == _selectedCategory;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedCategory = category['value'];
                        _selectedCatalogueItem = null;
                      });
                      _loadCatalogueItems();
                    },
                    child: Container(
                      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: isSelected ? FitCheckTheme.primaryColor : Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected ? FitCheckTheme.primaryColor : Colors.grey[300]!,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            category['icon'],
                            color: isSelected ? Colors.white : Colors.grey[600],
                            size: 18,
                          ),
                          SizedBox(width: 8),
                          Text(
                            category['label'],
                            style: TextStyle(
                              color: isSelected ? Colors.white : Colors.grey[600],
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGenerateButton() {
    final bool canGenerate = _modelImage != null &&
        (_useCustomGarment ? _garmentImage != null : _selectedCatalogueItem != null);

    return ElevatedButton(
      onPressed: canGenerate && !_isLoading ? _generateTryOn : null,
      style: ElevatedButton.styleFrom(
        padding: EdgeInsets.symmetric(vertical: 16),
        backgroundColor: Theme.of(context).colorScheme.primary,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      child: _isLoading
          ? Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            ),
          ),
          SizedBox(width: 12),
          Text(
            'Generating...',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ],
      )
          : Text(
        'Generate Try-On',
        style: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
    );
  }
  Widget _buildGeneratedImage() {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: EdgeInsets.all(16),
            child: Text(
              'Generated Result',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: CachedNetworkImage(
              imageUrl: _generatedImageUrl!,
              fit: BoxFit.cover,
              placeholder: (context, url) => Container(
                height: 400,
                width: double.infinity,
                child: Center(child: CircularProgressIndicator()),
              ),
              errorWidget: (context, url, error) => Container(
                height: 400,
                width: double.infinity,
                color: Theme.of(context).colorScheme.error.withOpacity(0.1),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.error_outline,
                      color: Theme.of(context).colorScheme.error,
                      size: 48,
                    ),
                    SizedBox(height: 16),
                    Text(
                      'Failed to load generated image',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.error,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          Padding(
            padding: EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _saveImage,
                    icon: Icon(Icons.save_alt),
                    label: Text('Save Image'),
                    style: OutlinedButton.styleFrom(
                      padding: EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _shareImage,
                    icon: Icon(Icons.share),
                    label: Text('Share'),
                    style: ElevatedButton.styleFrom(
                      padding: EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Future<Map<String, dynamic>> _buildRequestBody(String modelImageUrl, String garmentImageUrl, String apiCategory) async {
    // Adjust parameters based on selected mode
    Map<String, dynamic> modeSpecificParams;
    switch (_selectedMode) {
      case 'quality':
        modeSpecificParams = {
          'num_samples': 2,                    // Generate 2 options for user
          'mode': 'quality',
          'output_format': 'png',              // Highest quality
          'segmentation_free': true,           // Better garment fitting
        };
        break;

      case 'balanced':
        modeSpecificParams = {
          'num_samples': 1,
          'mode': 'balanced',
          'output_format': 'png',              // Good quality
          'segmentation_free': true,
        };
        break;

      case 'performance':
        modeSpecificParams = {
          'num_samples': 1,
          'mode': 'performance',
          'output_format': 'jpeg',             // Faster response
          'segmentation_free': true,
        };
        break;

      default:
        modeSpecificParams = {
          'num_samples': 1,
          'mode': 'balanced',
          'output_format': 'png',
          'segmentation_free': true,
        };
    }

    // Build the request with new API structure
    return {
      'model_name': 'tryon-v1.6',  // Use latest model version
      'inputs': {
        'model_image': modelImageUrl,
        'garment_image': garmentImageUrl,
        'category': apiCategory,
        'moderation_level': 'permissive',     // Replaced nsfw_filter
        'garment_photo_type': 'auto',
        ...modeSpecificParams,  // Apply mode-specific parameters
      }
    };
  }

  Future<void> _pickImage(bool isModel) async {
    if (!mounted) return;

    try {
      // Close the bottom sheet first if it's open
      if (!isModel && Navigator.canPop(context)) {
        Navigator.pop(context);
        // Add a small delay before showing picker
        await Future.delayed(Duration(milliseconds: 100));
      }

      final ImagePicker picker = ImagePicker();
      final XFile? image = await picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );

      if (image != null && mounted) {

        MixpanelService.trackEvent(
            'Image_Selected',
            properties: {
              'type': isModel ? 'model_photo' : 'garment_photo',
              'source': 'gallery',
              'user_id': widget.userId ?? 'unknown'
            }
        );

        setState(() {
          if (isModel) {
            _modelImage = image;
            _showGarmentSection = true;
          } else {
            _garmentImage = image;
            _selectedCatalogueItem = null;
          }
          _errorMessage = null;
        });
        await _checkRating();
      }
    } catch (e) {
      print('Error picking image: $e');
      MixpanelService.trackEvent(
          'Image_Selection_Error',
          properties: {
            'error': e.toString(),
            'type': isModel ? 'model_photo' : 'garment_photo',
            'user_id': widget.userId ?? 'unknown'
          }
      );
      if (mounted) {
        setState(() {
          _errorMessage = 'Failed to pick image: ${e.toString()}';
        });
      }
    }
  }

  Future<void> _generateTryOn() async {
    final startTime = DateTime.now();

    if (!_isOnline) {
      _showNoInternetSnackBar();
      return;
    }

    // Track start of try-on attempt
    await MixpanelService.trackEvent(
      'Virtual_TryOn_Started',
      properties: {
        'mode': _selectedMode,
        'category': _selectedCategory ?? 'unknown',
        'using_custom_garment': (_garmentImage != null).toString(),
        'using_catalogue_item': (_selectedCatalogueItem != null).toString(),
        'selected_gender': _selectedGender ?? 'all',
        'view_mode': _showCatalog ? 'catalog' : 'upload',
        'user_id': widget.userId ?? 'unknown',
      },
    );

    bool hasModelImage = _modelImage != null;
    bool hasSelectedGarment = _selectedCatalogueItem != null;
    bool hasUploadedGarment = _garmentImage != null;

    // Validation with analytics
    if (!hasModelImage) {
      await MixpanelService.trackEvent(
        'Virtual_TryOn_Error',
        properties: {
          'error_type': 'missing_model_image',
          'user_id': widget.userId ?? 'unknown',
        },
      );
      _showError(
        'Photo Required',
        'Please add a full-body photo of yourself to continue.',
      );
      return;
    }

    if (!hasSelectedGarment && !hasUploadedGarment) {
      await MixpanelService.trackEvent(
        'Virtual_TryOn_Error',
        properties: {
          'error_type': 'missing_garment',
          'user_id': widget.userId ?? 'unknown',
        },
      );
      _showError(
        'Garment Required',
        'Please either select a garment from our catalogue or upload your own.',
      );
      return;
    }

    print('[TryOn] Starting generation with mode: $_selectedMode');
    _showGenerationDialog();

    try {
      // Upload model image
      print('[TryOn] Uploading model image...');
      final modelImageUrl = await _uploadImageToSupabase(_modelImage!);
      print('[TryOn] Model image uploaded: $modelImageUrl');

      // Get garment image URL
      String garmentImageUrl;
      if (hasUploadedGarment && _garmentImage != null) {
        print('[TryOn] Uploading custom garment...');
        garmentImageUrl = await _uploadImageToSupabase(_garmentImage!);
        print('[TryOn] Custom garment uploaded: $garmentImageUrl');
      } else {
        final selectedItem = _catalogueItems.firstWhere(
              (item) => item['id'] == _selectedCatalogueItem,
        );
        garmentImageUrl = selectedItem['image_url'];
        print('[TryOn] Using catalogue garment: $garmentImageUrl');
      }

      // Get API category
      final selectedCategory = _categories.firstWhere(
            (cat) => cat['value'] == _selectedCategory,
      );
      final apiCategory = selectedCategory['apiValue'];
      print('[TryOn] Using API category: $apiCategory');

      // Prepare API request with optimized parameters
      final Map<String, dynamic> requestBody = await _buildRequestBody(
          modelImageUrl,
          garmentImageUrl,
          apiCategory
      );

      print('[TryOn] Sending API request with parameters: ${json.encode(requestBody)}');

      final response = await http.post(
        Uri.parse('${Config.FASHON_API_ENDPOINT}/run'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${Config.FASHON_API_KEY}',
        },
        body: json.encode(requestBody),
      );

      final data = json.decode(response.body);
      print('[TryOn] Received API response: ${json.encode(data)}');

      if (response.statusCode == 200 && data['error'] == null) {
        final String predictionId = data['id'];
        print('[TryOn] Prediction started with ID: $predictionId');

        await MixpanelService.trackEvent(
          'Virtual_TryOn_Prediction_Started',
          properties: {
            'prediction_id': predictionId,
            'mode': _selectedMode,
            'category': apiCategory,
            'user_id': widget.userId ?? 'unknown',
          },
        );

        // Poll for status updates
        await _pollPredictionStatus(predictionId, (String newStatus) async {
          print('[TryOn] Status update for $predictionId: $newStatus');

          await MixpanelService.trackEvent(
            'Virtual_TryOn_Status_Update',
            properties: {
              'prediction_id': predictionId,
              'status': newStatus,
              'mode': _selectedMode,
              'user_id': widget.userId ?? 'unknown',
            },
          );

          if (mounted) {
            Navigator.of(context).pop();
            showDialog(
              context: context,
              barrierDismissible: false,
              builder: (BuildContext context) => TryOnLoadingDialog(
                status: newStatus,
                selectedMode: _selectedMode,
                onCancel: () async {
                  print('[TryOn] User cancelled prediction: $predictionId');

                  await MixpanelService.trackEvent(
                    'Virtual_TryOn_Cancelled',
                    properties: {
                      'prediction_id': predictionId,
                      'status': newStatus,
                      'mode': _selectedMode,
                      'user_id': widget.userId ?? 'unknown',
                    },
                  );

                  // Cancel the prediction
                  try {
                    final cancelResponse = await http.get(
                      Uri.parse('${Config.FASHON_API_ENDPOINT}/cancel/$predictionId'),
                      headers: {
                        'Authorization': 'Bearer ${Config.FASHON_API_KEY}',
                      },
                    );
                    print('[TryOn] Cancellation response: ${cancelResponse.statusCode}');
                  } catch (e) {
                    print('[TryOn] Error cancelling prediction: $e');
                  }

                  Navigator.of(context).pop();
                  setState(() => _isLoading = false);
                },
              ),
            );
          }
        });

        _generationTimeout?.cancel();
        if (mounted) {
          final duration = DateTime.now().difference(startTime);
          await MixpanelService.trackEvent(
            'Virtual_TryOn_Completed',
            properties: {
              'prediction_id': predictionId,
              'mode': _selectedMode,
              'category': apiCategory,
              'duration_seconds': duration.inSeconds.toString(),
              'user_id': widget.userId ?? 'unknown',
              'success': 'true',
            },
          );
        }
      } else {
        throw Exception(data['error']?['message'] ?? 'Failed to generate try-on');
      }
    } catch (e, stackTrace) {
      print('[TryOn] Error during generation: $e');
      print('[TryOn] Stack trace: $stackTrace');

      await MixpanelService.trackEvent(
        'Virtual_TryOn_Error',
        properties: {
          'error_message': e.toString(),
          'mode': _selectedMode,
          'category': _selectedCategory ?? 'unknown',
          'user_id': widget.userId ?? 'unknown',
        },
      );

      _generationTimeout?.cancel();
      if (mounted) {
        Navigator.of(context).pop();
        _showError(
          'Generation Failed',
          'We couldn\'t create your virtual try-on. Please try again.',
        );
      }
    }
  }


  Future<void> _pollPredictionStatus(String predictionId, Function(String) onStatusUpdate) async {
    String currentStatus = 'starting';
    int retryCount = 0;
    const maxRetries = 3;
    const maxDuration = Duration(minutes: 2);
    final stopwatch = Stopwatch()..start();

    while (stopwatch.elapsed < maxDuration) {
      try {
        final response = await http.get(
          Uri.parse('${Config.FASHON_API_ENDPOINT}/status/$predictionId'),
          headers: {
            'Authorization': 'Bearer ${Config.FASHON_API_KEY}',
          },
        );

        if (response.statusCode != 200) {
          throw Exception('Status check failed with code: ${response.statusCode}');
        }

        final data = json.decode(response.body);

        // Update status if changed
        if (data['status'] != null && data['status'] != currentStatus) {
          currentStatus = data['status'];
          onStatusUpdate(currentStatus);
        }

        switch (data['status']) {
          case 'starting':
          case 'in_queue':
            await Future.delayed(Duration(seconds: 3));
            break;
          case 'processing':
            await Future.delayed(Duration(seconds: 1));
            break;
          case 'completed':
            if (mounted) {
              // Handle potential multiple outputs
              final outputs = List<String>.from(data['output']);
              _handleGenerationComplete(outputs);  // Call the handler here
              setState(() => _isLoading = false);
            }
            return;
          case 'failed':
            final errorMessage = await _handleFashnError(data['error']);
            throw Exception(errorMessage);
        }
      } catch (e) {
        retryCount++;
        if (retryCount >= maxRetries) {
          throw Exception('Generation failed after multiple attempts');
        }
        await Future.delayed(Duration(seconds: 2));
      }
    }
  }

  Future<String> _uploadImageToSupabase(XFile image) async {
    int retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        final bytes = await image.readAsBytes();
        final fileExt = image.path.split('.').last;
        final fileName = '${DateTime.now().toIso8601String()}.$fileExt';
        final filePath = fileName;

        print('Uploading image: $fileName (Attempt ${retryCount + 1})');

        await supabase.storage.from('tryon-images').uploadBinary(
          filePath,
          bytes,
          fileOptions: FileOptions(
            contentType: 'image/$fileExt',
            upsert: true,
          ),
        );

        final url = supabase.storage.from('tryon-images').getPublicUrl(filePath);
        print('Upload successful. URL: $url');
        return url;
      } catch (e) {
        print('Upload error (Attempt ${retryCount + 1}): $e');
        retryCount++;

        if (retryCount == maxRetries) {
          throw Exception('Failed to upload image after $maxRetries attempts. Please try again.');
        }

        // Wait before retrying
        await Future.delayed(Duration(seconds: 2));
      }
    }

    throw Exception('Failed to upload image');
  }


  Future<void> _saveImage([String? specificUrl]) async {
    final imageUrl = specificUrl ?? _generatedImageUrl;
    if (imageUrl == null) {
      print('No image URL available to save');
      return;
    }
    if (!mounted) return;

    try {
      // Show loading indicator
      if (mounted) {
        ScaffoldMessenger.of(context).hideCurrentSnackBar(); // Hide any existing snackbar
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)),
                SizedBox(width: 12),
                Text('Saving image...'),
              ],
            ),
            duration: Duration(seconds: 1),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }

      // Download image - Use the passed URL here
      final response = await http.get(Uri.parse(imageUrl));

      // Save to gallery
      final result = await ImageGallerySaver.saveImage(
        response.bodyBytes,
        quality: 100,
        name: 'fitcheck_${DateTime.now().millisecondsSinceEpoch}.jpg',
      );

      // Show success/error message
      if (mounted) {
        ScaffoldMessenger.of(context).hideCurrentSnackBar();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                Icon(result['isSuccess'] ? Icons.check_circle : Icons.error, color: Colors.white),
                SizedBox(width: 12),
                Text(result['isSuccess'] ? 'Image saved to gallery' : 'Failed to save image'),
              ],
            ),
            behavior: SnackBarBehavior.floating,
            backgroundColor: result['isSuccess'] ? FitCheckTheme.successColor : FitCheckTheme.errorColor,
            action: result['isSuccess'] ? null : SnackBarAction(
              label: 'Retry',
              textColor: Colors.white,
              onPressed: () => _saveImage(imageUrl),  // Pass the URL when retrying too
            ),
          ),
        );

        // Check rating AFTER successful save
        if (result['isSuccess']) {
          await _checkRating();
        }
      }
    } catch (e) {
      print('Error saving image: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).hideCurrentSnackBar();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to save image'),
            backgroundColor: FitCheckTheme.errorColor,
            behavior: SnackBarBehavior.floating,
            action: SnackBarAction(
              label: 'Retry',
              textColor: Colors.white,
              onPressed: () => _saveImage(imageUrl),  // Pass the URL when retrying too
            ),
          ),
        );
      }
    }
  }

  Future<void> _shareImage([String? specificUrl]) async {
    final imageUrl = specificUrl ?? _generatedImageUrl;
    if (imageUrl == null) {
      print('No image URL available to share');
      return;
    }

    try {
      final response = await http.get(Uri.parse(imageUrl));
      final tempDir = await getTemporaryDirectory();
      final tempPath = '${tempDir.path}/virtual_tryon_${DateTime.now().millisecondsSinceEpoch}.jpg';
      await File(tempPath).writeAsBytes(response.bodyBytes);
      await Share.shareXFiles(
        [XFile(tempPath)],
        text: 'Check out my virtual try-on from FitCheck!',
      );

      if (mounted) {
        await _checkRating();
      }

    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to share image: ${e.toString()}'),
          behavior: SnackBarBehavior.floating,
          backgroundColor: Theme.of(context).colorScheme.error,
        ),
      );
    }
  }
}

class DottedBorderPainter extends CustomPainter {
  final Color color;
  final double strokeWidth;
  final double gap;

  DottedBorderPainter({
    required this.color,
    this.strokeWidth = 2,
    this.gap = 5,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke;

    const radius = 16.0;
    final Path path = Path()
      ..addRRect(RRect.fromRectAndRadius(
        Rect.fromLTWH(0, 0, size.width, size.height),
        Radius.circular(radius),
      ));

    final Path dashPath = Path();
    double distance = 0;
    bool shouldDraw = true;

    for (ui.PathMetric metric in path.computeMetrics()) {
      while (distance < metric.length) {
        if (shouldDraw) {
          dashPath.addPath(
            metric.extractPath(distance, distance + gap),
            Offset.zero,
          );
        }
        shouldDraw = !shouldDraw;
        distance += gap;
      }
    }

    canvas.drawPath(dashPath, paint);
  }

  @override
  bool shouldRepaint(DottedBorderPainter oldDelegate) =>
      oldDelegate.color != color ||
          oldDelegate.strokeWidth != strokeWidth ||
          oldDelegate.gap != gap;
}


class GridPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..strokeWidth = 0.5;

    const spacing = 20.0;
    for (double i = 0; i < size.width + size.height; i += spacing) {
      canvas.drawLine(
        Offset(-size.height + i, size.height),
        Offset(i, 0),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}

class _UploadGarmentSheet extends StatelessWidget {
  final Function(String) onCategorySelected;

  const _UploadGarmentSheet({
    Key? key,
    required this.onCategorySelected,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.7,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Select Garment Type',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: Icon(Icons.close),
                  padding: EdgeInsets.zero,
                  constraints: BoxConstraints(),
                ),
              ],
            ),
          ),
          Flexible(
            child: ListView(
              shrinkWrap: true,
              children: [
                _buildCategoryTile(
                  context,
                  'tops',
                  'Top',
                  'Shirts, T-shirts, Blouses',
                  Icons.checkroom,
                ),
                _buildCategoryTile(
                  context,
                  'one-pieces',
                  'Full Body',
                  'Dresses, Jumpsuits',
                  Icons.checkroom,
                ),
                _buildCategoryTile(
                  context,
                  'bottoms',
                  'Bottoms',
                  'Pants, Skirts, Shorts',
                  Icons.layers,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryTile(BuildContext context, String value, String title, String subtitle, IconData icon) {
    return InkWell(
      onTap: () {
        onCategorySelected(value);
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          children: [
            Container(
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: FitCheckTheme.primaryColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: FitCheckTheme.primaryColor),
            ),
            SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
            Icon(Icons.chevron_right, color: Colors.grey[400]),
          ],
        ),
      ),
    );
  }
}

class ShimmerLoading extends StatelessWidget {
  final double height;
  final double width;

  const ShimmerLoading({
    Key? key,
    required this.height,
    required this.width,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      width: width,
      decoration: BoxDecoration(
        color: Colors.grey[300],
        borderRadius: BorderRadius.circular(4),
      ),
    );
  }
}

class ShimmerPainter extends CustomPainter {
  final Color color;
  final double progress;

  ShimmerPainter({
    required this.color,
    required this.progress,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..shader = LinearGradient(
        colors: [
          color.withOpacity(0),
          color.withOpacity(0.1 * progress),
          color.withOpacity(0),
        ],
        stops: const [0.0, 0.5, 1.0],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

    canvas.drawRect(
      Rect.fromLTWH(0, 0, size.width, size.height),
      paint,
    );
  }

  @override
  bool shouldRepaint(ShimmerPainter oldDelegate) => progress != oldDelegate.progress;
}

class DashedBorderPainter extends CustomPainter {
  final Color color;
  final double strokeWidth;
  final double gap;

  DashedBorderPainter({
    required this.color,
    this.strokeWidth = 2,
    this.gap = 5,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke;

    final Path path = Path()
      ..addRRect(RRect.fromRectAndRadius(
        Rect.fromLTWH(0, 0, size.width, size.height),
        Radius.circular(12),
      ));

    final Path dashPath = Path();
    final double dashWidth = 8;
    double distance = 0;
    bool drawDash = true;

    for (ui.PathMetric metric in path.computeMetrics()) {
      while (distance < metric.length) {
        if (drawDash) {
          dashPath.addPath(
            metric.extractPath(distance, distance + dashWidth),
            Offset.zero,
          );
        }
        distance += dashWidth + gap;
        drawDash = !drawDash;
      }
    }

    canvas.drawPath(dashPath, paint);
  }

  @override
  bool shouldRepaint(DashedBorderPainter oldDelegate) =>
      oldDelegate.color != color ||
          oldDelegate.strokeWidth != strokeWidth ||
          oldDelegate.gap != gap;
}

// Add this to your virtual_tryon.dart file
class QualityModeSelector extends StatelessWidget {
  final String selectedMode;
  final Function(String) onModeChange;

  const QualityModeSelector({
    Key? key,
    required this.selectedMode,
    required this.onModeChange,
  }) : super(key: key);

  static final List<Map<String, dynamic>> modes = [
    {
      'id': 'quality',
      'title': 'Premium Quality',
      'description': 'Best quality results (~20s)',
      'icon': Icons.auto_awesome,
      'color': FitCheckTheme.primaryColor,  // Primary
    },
    {
      'id': 'balanced',
      'title': 'Standard',
      'description': 'Balanced speed & quality (~14s)',
      'icon': Icons.tune,
      'color': FitCheckTheme.primaryColor.withOpacity(0.8),  // Primary variation
    },
    {
      'id': 'performance',
      'title': 'Quick Preview',
      'description': 'Fastest results (~9s)',
      'icon': Icons.bolt,
      'color': FitCheckTheme.accentColor,  // Accent
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Text(
            'Select Quality Mode',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: FitCheckTheme.textPrimary,
            ),
          ),
        ),
        ListView.builder(
          shrinkWrap: true,
          physics: NeverScrollableScrollPhysics(),
          itemCount: modes.length,
          itemBuilder: (context, index) {
            final mode = modes[index];
            final isSelected = selectedMode == mode['id'];

            return Padding(
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: InkWell(
                onTap: () => onModeChange(mode['id']),
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isSelected ? mode['color'] : Colors.grey[300]!,
                      width: isSelected ? 2 : 1,
                    ),
                    color: isSelected ? mode['color'].withOpacity(0.05) : Colors.white,
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: mode['color'].withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(
                          mode['icon'],
                          color: mode['color'],
                          size: 24,
                        ),
                      ),
                      SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              mode['title'],
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: FitCheckTheme.textPrimary,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              mode['description'],
                              style: TextStyle(
                                fontSize: 14,
                                color: FitCheckTheme.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (isSelected)
                        Container(
                          padding: EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: mode['color'],
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.check,
                            color: Colors.white,
                            size: 16,
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}