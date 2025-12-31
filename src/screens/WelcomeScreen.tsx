import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  COLORS,
  FONTS,
  SHADOWS,
  BORDER_RADIUS,
  SPACING,
} from "../constants/theme";
import { createPlayer } from "../services/database";
import {
  scaleFontSize,
  wp,
  hp,
  isShortScreen,
  isMediumHeight,
} from "../utils/responsive";

const { height } = Dimensions.get("window");

// Compact spacing for short screens
const COMPACT_SPACING = {
  xs: isShortScreen ? 2 : 4,
  sm: isShortScreen ? 4 : 8,
  md: isShortScreen ? 8 : 12,
  lg: isShortScreen ? 12 : 16,
  xl: isShortScreen ? 16 : 24,
  xxl: isShortScreen ? 24 : 32,
};

interface WelcomeScreenProps {
  onComplete: (name: string, playerId: number) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSubmit = async () => {
    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError("الرجاء إدخال اسم صالح (حرفان على الأقل)");
      return;
    }

    if (trimmedName.length > 20) {
      setError("الاسم طويل جداً (20 حرف كحد أقصى)");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const playerId = await createPlayer(trimmedName);
      onComplete(trimmedName, playerId);
    } catch (err) {
      setError("حدث خطأ. حاول مرة أخرى.");
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.parchment, COLORS.parchmentDark, COLORS.parchment]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.parchment} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            {/* Decorative Header */}
            <View style={styles.decorativeHeader}>
              <View style={styles.decorLine} />
              <View style={styles.decorDiamond} />
              <View style={styles.decorLine} />
            </View>

            {/* Welcome Text */}
            <Text style={styles.welcomeTitle}>أهلاً وسهلاً</Text>
            <Text style={styles.welcomeSubtitle}>مرحباً بك في لعبة الجذور</Text>

            {/* App Description */}
            <View style={styles.descriptionBox}>
              <Text style={styles.description}>
                اكتشف جمال اللغة العربية من خلال ألعاب ممتعة تختبر معرفتك
                بالجذور والتشكيل
              </Text>
            </View>

            {/* Name Input Section */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>ما اسمك؟</Text>
              <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError("");
                }}
                placeholder="أدخل اسمك هنا"
                placeholderTextColor={COLORS.textSecondary}
                textAlign="right"
                maxLength={20}
                autoFocus
                editable={!isSubmitting}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!name.trim() || isSubmitting) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!name.trim() || isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? "جاري الحفظ..." : "ابدأ المغامرة"}
              </Text>
            </TouchableOpacity>

            {/* Footer Decoration */}
            <View style={styles.footerDecoration}>
              <View style={styles.footerPattern}>
                {[...Array(5)].map((_, i) => (
                  <View key={i} style={styles.patternDot} />
                ))}
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: COMPACT_SPACING.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  decorativeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: COMPACT_SPACING.lg,
  },
  decorLine: {
    width: wp(12),
    height: 2,
    backgroundColor: COLORS.inkGold,
  },
  decorDiamond: {
    width: isShortScreen ? 8 : 10,
    height: isShortScreen ? 8 : 10,
    backgroundColor: COLORS.inkGold,
    transform: [{ rotate: "45deg" }],
    marginHorizontal: COMPACT_SPACING.sm,
  },
  welcomeTitle: {
    fontSize: scaleFontSize(isShortScreen ? 32 : 38),
    color: COLORS.inkBrown,
    marginBottom: COMPACT_SPACING.xs,
    ...FONTS.arabicTitle,
  },
  welcomeSubtitle: {
    fontSize: scaleFontSize(isShortScreen ? 14 : 16),
    color: COLORS.textSecondary,
    marginBottom: COMPACT_SPACING.md,
    ...FONTS.arabicText,
  },
  descriptionBox: {
    backgroundColor: COLORS.parchmentLight,
    borderRadius: BORDER_RADIUS.md,
    padding: COMPACT_SPACING.md,
    marginBottom: COMPACT_SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.copperAccent,
    width: "100%",
  },
  description: {
    fontSize: scaleFontSize(isShortScreen ? 12 : 14),
    color: COLORS.inkBrown,
    textAlign: "center",
    lineHeight: isShortScreen ? 18 : 22,
    ...FONTS.arabicText,
  },
  inputSection: {
    width: "100%",
    marginBottom: COMPACT_SPACING.lg,
  },
  inputLabel: {
    fontSize: scaleFontSize(isShortScreen ? 14 : 16),
    color: COLORS.inkBrown,
    marginBottom: COMPACT_SPACING.sm,
    textAlign: "right",
    ...FONTS.arabicTitle,
  },
  nameInput: {
    backgroundColor: COLORS.parchmentLight,
    borderRadius: BORDER_RADIUS.md,
    padding: COMPACT_SPACING.md,
    fontSize: scaleFontSize(isShortScreen ? 14 : 16),
    color: COLORS.inkBrown,
    borderWidth: 1,
    borderColor: COLORS.inkGold,
    ...FONTS.arabicText,
    ...SHADOWS.small,
  },
  errorText: {
    color: COLORS.incorrect,
    fontSize: scaleFontSize(11),
    marginTop: COMPACT_SPACING.xs,
    textAlign: "right",
    ...FONTS.arabicText,
  },
  submitButton: {
    backgroundColor: COLORS.turquoise,
    paddingVertical: COMPACT_SPACING.md,
    paddingHorizontal: COMPACT_SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    width: "100%",
    alignItems: "center",
    ...SHADOWS.small,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: scaleFontSize(isShortScreen ? 16 : 18),
    color: COLORS.textLight,
    ...FONTS.arabicTitle,
  },
  footerDecoration: {
    marginTop: COMPACT_SPACING.xl,
  },
  footerPattern: {
    flexDirection: "row",
    gap: COMPACT_SPACING.xs,
  },
  patternDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.inkGold,
  },
});

export default WelcomeScreen;
