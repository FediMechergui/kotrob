import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  COLORS,
  FONTS,
  SHADOWS,
  BORDER_RADIUS,
  SPACING,
} from "../constants/theme";
import { getHighScore, getCompletedLevels } from "../utils/storage";
import { getGlobalScore, getTotalScore } from "../utils/gameStorage";
import { GAME_LEVELS } from "../data/arabicRoots";
import { scaleFontSize, moderateScale } from "../utils/responsive";

const { width, height } = Dimensions.get("window");

interface HomeScreenProps {
  onStartGame: (resume?: boolean) => void;
  onSelectLevel: (levelIndex: number) => void;
  onStartQutrab: (resume?: boolean) => void;
  onOpenVideoArchive?: () => void;
  playerName?: string | null;
  hasActiveRootsGame?: boolean;
  hasActiveQutrabGame?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartGame,
  onSelectLevel,
  onStartQutrab,
  onOpenVideoArchive,
  playerName,
  hasActiveRootsGame = false,
  hasActiveQutrabGame = false,
}) => {
  const [highScore, setHighScore] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<string[]>([]);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [totalStreak, setTotalStreak] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const score = await getHighScore();
    const levels = await getCompletedLevels();
    const globalScore = await getGlobalScore();
    const total = await getTotalScore();

    setHighScore(score);
    setCompletedLevels(levels);
    setTotalScore(total);
    setTotalStreak(globalScore.totalStreak);
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "صباح الخير";
    if (hour >= 12 && hour < 17) return "مساء الخير";
    if (hour >= 17 && hour < 21) return "مساء النور";
    return "ليلة سعيدة";
  };

  return (
    <LinearGradient
      colors={[COLORS.parchmentDark, COLORS.parchment, COLORS.parchmentDark]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.parchmentDark}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Decorative Border */}
          <View style={styles.decorativeBorder}>
            <View style={styles.innerBorder}>
              {/* Player Greeting */}
              {playerName && (
                <View style={styles.greetingSection}>
                  <Text style={styles.greetingText}>
                    {getGreeting()}، {playerName}! 👋
                  </Text>
                </View>
              )}

              {/* Title Section */}
              <View style={styles.titleSection}>
                <View style={styles.titleDecoration}>
                  <View style={styles.decorLine} />
                  <View style={styles.decorDiamond} />
                  <View style={styles.decorLine} />
                </View>

                <Text style={styles.arabicTitle}>لُعبَة الجُذُور</Text>
                <Text style={styles.subtitle}>أصول الكلمات العربية</Text>

                <View style={styles.titleDecoration}>
                  <View style={styles.decorLine} />
                  <View style={styles.decorDiamond} />
                  <View style={styles.decorLine} />
                </View>
              </View>

              {/* Total Score Display */}
              <View style={styles.totalScoreContainer}>
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreBoxLabel}>إجمالي النقاط</Text>
                  <Text style={styles.scoreBoxValue}>{totalScore}</Text>
                </View>
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreBoxLabel}>أعلى سلسلة</Text>
                  <Text style={styles.scoreBoxValue}>{totalStreak} 🔥</Text>
                </View>
              </View>

              {/* Resume Section - Show if there are active games */}
              {(hasActiveRootsGame || hasActiveQutrabGame) && (
                <View style={styles.resumeSection}>
                  <Text style={styles.resumeTitle}>🎮 متابعة اللعب</Text>

                  {hasActiveRootsGame && (
                    <TouchableOpacity
                      style={styles.resumeButton}
                      onPress={() => onStartGame(true)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.resumeButtonText}>
                        استكمال لعبة الجذور
                      </Text>
                      <Text style={styles.resumeButtonHint}>
                        لديك لعبة متوقفة مؤقتاً
                      </Text>
                    </TouchableOpacity>
                  )}

                  {hasActiveQutrabGame && (
                    <TouchableOpacity
                      style={[styles.resumeButton, styles.resumeButtonQutrab]}
                      onPress={() => onStartQutrab(true)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.resumeButtonText}>
                        استكمال مثلث قطرب
                      </Text>
                      <Text style={styles.resumeButtonHint}>
                        لديك لعبة متوقفة مؤقتاً
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Buttons */}
              <View style={styles.buttonSection}>
                <Text style={styles.gameModeTitle}>اختر اللعبة</Text>

                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => onStartGame(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.playButtonText}>🌱 لُعبَة الجُذُور</Text>
                  <Text style={styles.gameDescription}>
                    اكتشف الجذور الصحيحة من الحروف
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.qutrabButton}
                  onPress={() => onStartQutrab(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.qutrabButtonText}>△ مُثَلَّث قُطرُب</Text>
                  <Text style={styles.gameDescription}>
                    طابق الكلمات بمعانيها حسب التشكيل
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.levelSelectButton}
                  onPress={() => setShowLevelSelect(!showLevelSelect)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.levelSelectText}>
                    {showLevelSelect
                      ? "إخفاء المستويات"
                      : "اختر مستوى (الجذور)"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Level Selection */}
              {showLevelSelect && (
                <View style={styles.levelGrid}>
                  {GAME_LEVELS.map((level, index) => {
                    const isCompleted = completedLevels.includes(
                      level.id.toString()
                    );
                    const isLocked =
                      index > 0 &&
                      !completedLevels.includes(
                        GAME_LEVELS[index - 1].id.toString()
                      );

                    return (
                      <TouchableOpacity
                        key={level.id}
                        style={[
                          styles.levelButton,
                          isCompleted && styles.levelCompleted,
                          isLocked && styles.levelLocked,
                        ]}
                        onPress={() => !isLocked && onSelectLevel(index)}
                        disabled={isLocked}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.levelNumber,
                            isCompleted && styles.levelNumberCompleted,
                            isLocked && styles.levelNumberLocked,
                          ]}
                        >
                          {isLocked ? "🔒" : level.id}
                        </Text>
                        {isCompleted && <Text style={styles.checkMark}>✓</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {/* Video Archive Button */}
              {onOpenVideoArchive && (
                <TouchableOpacity
                  style={styles.archiveButton}
                  onPress={onOpenVideoArchive}
                  activeOpacity={0.8}
                >
                  <Text style={styles.archiveButtonText}>
                    📼 أرشيف الفيديوهات
                  </Text>
                </TouchableOpacity>
              )}

              {/* Footer with Islamic Pattern hint */}
              <View style={styles.footer}>
                <View style={styles.footerPattern}>
                  {[...Array(5)].map((_, i) => (
                    <View key={i} style={styles.patternDot} />
                  ))}
                </View>
                <Text style={styles.footerText}>اكتشف جمال اللغة العربية</Text>
                <Text style={styles.completedText}>
                  {completedLevels.length} / {GAME_LEVELS.length} مستوى مكتمل
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.md,
  },
  decorativeBorder: {
    flex: 1,
    borderWidth: 3,
    borderColor: COLORS.inkGold,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.sm,
    backgroundColor: COLORS.parchment,
    ...SHADOWS.large,
  },
  innerBorder: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.copperAccent,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: "center",
  },
  greetingSection: {
    marginBottom: SPACING.md,
  },
  greetingText: {
    fontSize: scaleFontSize(18),
    color: COLORS.turquoise,
    textAlign: "center",
    ...FONTS.arabicText,
  },
  titleSection: {
    alignItems: "center",
    marginTop: SPACING.sm,
  },
  titleDecoration: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.sm,
  },
  decorLine: {
    width: 50,
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
  arabicTitle: {
    fontSize: 48,
    color: COLORS.inkBrown,
    marginBottom: SPACING.xs,
    ...FONTS.arabicTitle,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    ...FONTS.arabicText,
  },
  descriptionSection: {
    paddingHorizontal: SPACING.lg,
    marginVertical: SPACING.lg,
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 28,
    ...FONTS.arabicText,
  },
  highScoreContainer: {
    alignItems: "center",
    backgroundColor: COLORS.parchmentDark,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.inkGold,
    marginBottom: SPACING.lg,
  },
  highScoreLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    ...FONTS.arabicText,
  },
  highScoreValue: {
    fontSize: 36,
    color: COLORS.inkGold,
    ...FONTS.arabicTitle,
  },
  completedText: {
    fontSize: 12,
    color: COLORS.turquoise,
    marginTop: SPACING.xs,
    ...FONTS.arabicText,
  },
  buttonSection: {
    width: "100%",
    gap: SPACING.md,
  },
  gameModeTitle: {
    fontSize: 20,
    color: COLORS.inkBrown,
    textAlign: "center",
    marginBottom: SPACING.sm,
    ...FONTS.arabicTitle,
  },
  gameDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    opacity: 0.9,
    ...FONTS.arabicText,
  },
  playButton: {
    backgroundColor: COLORS.turquoise,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: "center",
    ...SHADOWS.medium,
  },
  playButtonText: {
    fontSize: 22,
    color: COLORS.textLight,
    ...FONTS.arabicTitle,
  },
  qutrabButton: {
    backgroundColor: COLORS.copperAccent,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: "center",
    ...SHADOWS.medium,
  },
  qutrabButtonText: {
    fontSize: 22,
    color: COLORS.textLight,
    ...FONTS.arabicTitle,
  },
  levelSelectButton: {
    backgroundColor: COLORS.parchmentLight,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.inkBrown,
  },
  levelSelectText: {
    fontSize: 18,
    color: COLORS.inkBrown,
    ...FONTS.arabicText,
  },
  levelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: SPACING.sm,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  levelButton: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.parchmentLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.inkBrown,
    position: "relative",
  },
  levelCompleted: {
    backgroundColor: COLORS.correctLight,
    borderColor: COLORS.correct,
  },
  levelLocked: {
    backgroundColor: COLORS.parchmentDark,
    borderColor: COLORS.textSecondary,
    opacity: 0.6,
  },
  levelNumber: {
    fontSize: 20,
    color: COLORS.inkBrown,
    ...FONTS.arabicTitle,
  },
  levelNumberCompleted: {
    color: COLORS.textLight,
  },
  levelNumberLocked: {
    fontSize: 16,
  },
  checkMark: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: COLORS.correct,
    color: COLORS.textLight,
    width: 18,
    height: 18,
    borderRadius: 9,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    overflow: "hidden",
  },
  footer: {
    alignItems: "center",
    marginTop: SPACING.lg,
  },
  footerPattern: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  patternDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.inkGold,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.copperAccent,
    ...FONTS.arabicText,
  },
  // New styles for enhanced features
  totalScoreContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: SPACING.md,
    gap: SPACING.md,
  },
  scoreBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.parchmentDark,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.ornamentBorder,
  },
  scoreBoxLabel: {
    fontSize: scaleFontSize(11),
    color: COLORS.textSecondary,
    ...FONTS.arabicText,
  },
  scoreBoxValue: {
    fontSize: scaleFontSize(22),
    color: COLORS.inkGold,
    marginTop: 2,
    ...FONTS.arabicTitle,
  },
  resumeSection: {
    width: "100%",
    backgroundColor: COLORS.parchmentLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.inkGold,
    borderStyle: "dashed",
  },
  resumeTitle: {
    fontSize: scaleFontSize(16),
    color: COLORS.inkBrown,
    textAlign: "center",
    marginBottom: SPACING.sm,
    ...FONTS.arabicTitle,
  },
  resumeButton: {
    backgroundColor: COLORS.turquoise,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  resumeButtonQutrab: {
    backgroundColor: COLORS.copperAccent,
  },
  resumeButtonText: {
    fontSize: scaleFontSize(14),
    color: COLORS.textLight,
    ...FONTS.arabicTitle,
  },
  resumeButtonHint: {
    fontSize: scaleFontSize(10),
    color: COLORS.textLight,
    opacity: 0.8,
    marginTop: 2,
    ...FONTS.arabicText,
  },
  archiveButton: {
    width: "100%",
    backgroundColor: COLORS.parchmentLight,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.ornamentBorder,
  },
  archiveButtonText: {
    fontSize: scaleFontSize(14),
    color: COLORS.inkBrown,
    ...FONTS.arabicText,
  },
});
