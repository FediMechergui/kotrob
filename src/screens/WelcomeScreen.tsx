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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, FONTS, SHADOWS, BORDER_RADIUS, SPACING } from "../constants/theme";
import { savePlayerName } from "../utils/gameStorage";
import { scaleFontSize, wp, hp } from "../utils/responsive";

interface WelcomeScreenProps {
  onComplete: (name: string) => void;
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
      await savePlayerName(trimmedName);
      onComplete(trimmedName);
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
                اكتشف جمال اللغة العربية من خلال ألعاب ممتعة تختبر معرفتك بالجذور
                والتشكيل
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
    padding: SPACING.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  decorativeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  decorLine: {
    width: wp(15),
    height: 2,
    backgroundColor: COLORS.inkGold,
  },
  decorDiamond: {
    width: 12,
    height: 12,
    backgroundColor: COLORS.inkGold,
    transform: [{ rotate: "45deg" }],
    marginHorizontal: SPACING.sm,
  },
  welcomeTitle: {
    fontSize: scaleFontSize(42),
    color: COLORS.inkBrown,
    marginBottom: SPACING.xs,
    ...FONTS.arabicTitle,
  },
  welcomeSubtitle: {
    fontSize: scaleFontSize(18),
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    ...FONTS.arabicText,
  },
  descriptionBox: {
    backgroundColor: COLORS.parchmentLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.copperAccent,
    width: "100%",
  },
  description: {
    fontSize: scaleFontSize(14),
    color: COLORS.inkBrown,
    textAlign: "center",
    lineHeight: 24,
    ...FONTS.arabicText,
  },
  inputSection: {
    width: "100%",
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontSize: scaleFontSize(18),
    color: COLORS.inkBrown,
    marginBottom: SPACING.sm,
    textAlign: "right",
    ...FONTS.arabicTitle,
  },
  nameInput: {
    backgroundColor: COLORS.parchmentLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    fontSize: scaleFontSize(18),
    color: COLORS.inkBrown,
    borderWidth: 2,
    borderColor: COLORS.inkGold,
    ...FONTS.arabicText,
    ...SHADOWS.small,
  },
  errorText: {
    color: COLORS.incorrect,
    fontSize: scaleFontSize(12),
    marginTop: SPACING.sm,
    textAlign: "right",
    ...FONTS.arabicText,
  },
  submitButton: {
    backgroundColor: COLORS.turquoise,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.lg,
    width: "100%",
    alignItems: "center",
    ...SHADOWS.medium,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: scaleFontSize(20),
    color: COLORS.textLight,
    ...FONTS.arabicTitle,
  },
  footerDecoration: {
    marginTop: SPACING.xxl,
  },
  footerPattern: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  patternDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.inkGold,
  },
});

export default WelcomeScreen;
