import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SHADOWS, BORDER_RADIUS, SPACING } from '../constants/theme';
import {
  scaleFontSize,
  wp,
  hp,
  SCREEN,
  moderateScale,
} from '../utils/responsive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive sizing calculations
const isSmallDevice = SCREEN_WIDTH < 360;
const isMediumDevice = SCREEN_WIDTH >= 360 && SCREEN_WIDTH < 414;

const getResponsiveSize = (base: number, small: number, medium: number) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return base;
};

interface SuccessMessageModalProps {
  visible: boolean;
  onClose: () => void;
  root: string;
  successMessage: string;
  meaning?: string;
}

export const SuccessMessageModal: React.FC<SuccessMessageModalProps> = ({
  visible,
  onClose,
  root,
  successMessage,
  meaning,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible, scaleAnim, fadeAnim]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={styles.overlayTouch} 
          activeOpacity={1}
          onPress={onClose}
        >
          <Animated.View 
            style={[
              styles.modalContent,
              { transform: [{ scale: scaleAnim }] }
            ]}
          >
            <TouchableOpacity activeOpacity={1}>
              <LinearGradient
                colors={[COLORS.inkGoldLight, COLORS.inkGold, COLORS.goldBorder]}
                style={styles.gradient}
              >
                {/* Decorative Header */}
                <View style={styles.header}>
                  <Text style={styles.celebrationEmoji}>🎊</Text>
                  <Text style={styles.rootText}>{root}</Text>
                  <Text style={styles.celebrationEmoji}>🎊</Text>
                </View>

                {/* Main Title */}
                <Text style={styles.ahsantTitle}>أحسنت!</Text>
                
                {/* Success Message */}
                <ScrollView 
                  style={styles.messageContainer}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.successMessage}>{successMessage}</Text>
                  
                  {meaning && (
                    <View style={styles.meaningContainer}>
                      <Text style={styles.meaningLabel}>المعنى:</Text>
                      <Text style={styles.meaningText}>{meaning}</Text>
                    </View>
                  )}
                </ScrollView>

                {/* Decorative Border */}
                <View style={styles.decorativeBorder} />

                {/* Continue Button */}
                <TouchableOpacity style={styles.continueButton} onPress={onClose}>
                  <Text style={styles.continueButtonText}>متابعة ←</Text>
                </TouchableOpacity>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouch: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: wp(90),
    maxWidth: Math.min(wp(90), 400),
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  gradient: {
    padding: getResponsiveSize(SPACING.xl, SPACING.md, SPACING.lg),
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getResponsiveSize(SPACING.md, SPACING.sm, SPACING.sm),
  },
  celebrationEmoji: {
    fontSize: scaleFontSize(32),
    marginHorizontal: getResponsiveSize(SPACING.sm, SPACING.xs, SPACING.xs),
  },
  rootText: {
    fontSize: scaleFontSize(isSmallDevice ? 36 : 48),
    ...FONTS.arabicTitle,
    color: COLORS.inkBrown,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ahsantTitle: {
    fontSize: scaleFontSize(isSmallDevice ? 28 : 36),
    ...FONTS.arabicTitle,
    color: COLORS.inkBrown,
    marginBottom: getResponsiveSize(SPACING.lg, SPACING.md, SPACING.md),
    textAlign: 'center',
  },
  messageContainer: {
    maxHeight: hp(isSmallDevice ? 18 : 25),
    width: '100%',
  },
  successMessage: {
    fontSize: scaleFontSize(isSmallDevice ? 15 : 18),
    ...FONTS.arabicText,
    color: COLORS.inkBrown,
    textAlign: 'center',
    lineHeight: moderateScale(isSmallDevice ? 24 : 28),
    paddingHorizontal: getResponsiveSize(SPACING.sm, SPACING.xs, SPACING.xs),
  },
  meaningContainer: {
    marginTop: getResponsiveSize(SPACING.md, SPACING.sm, SPACING.sm),
    padding: getResponsiveSize(SPACING.md, SPACING.sm, SPACING.sm),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: BORDER_RADIUS.md,
  },
  meaningLabel: {
    fontSize: scaleFontSize(isSmallDevice ? 12 : 14),
    ...FONTS.arabicTitle,
    color: COLORS.inkBrown,
    marginBottom: SPACING.xs,
    textAlign: 'right',
  },
  meaningText: {
    fontSize: scaleFontSize(isSmallDevice ? 14 : 16),
    ...FONTS.arabicText,
    color: COLORS.inkBrown,
    textAlign: 'right',
    lineHeight: moderateScale(isSmallDevice ? 20 : 24),
  },
  decorativeBorder: {
    height: 2,
    width: '80%',
    backgroundColor: COLORS.inkBrown,
    opacity: 0.3,
    marginVertical: getResponsiveSize(SPACING.lg, SPACING.md, SPACING.md),
    borderRadius: 1,
  },
  continueButton: {
    backgroundColor: COLORS.inkBrown,
    paddingVertical: getResponsiveSize(SPACING.md, SPACING.sm, SPACING.sm),
    paddingHorizontal: getResponsiveSize(SPACING.xl, SPACING.lg, SPACING.lg),
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.medium,
  },
  continueButtonText: {
    fontSize: scaleFontSize(isSmallDevice ? 16 : 18),
    ...FONTS.arabicTitle,
    color: COLORS.inkGold,
    textAlign: 'center',
  },
});

export default SuccessMessageModal;
