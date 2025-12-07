import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SHADOWS, BORDER_RADIUS, SPACING } from '../constants/theme';
import { getHighScore, getCompletedLevels } from '../utils/storage';
import { GAME_LEVELS } from '../data/arabicRoots';

const { width, height } = Dimensions.get('window');

interface HomeScreenProps {
  onStartGame: () => void;
  onSelectLevel: (levelIndex: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onStartGame, 
  onSelectLevel 
}) => {
  const [highScore, setHighScore] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<string[]>([]);
  const [showLevelSelect, setShowLevelSelect] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const score = await getHighScore();
    const levels = await getCompletedLevels();
    setHighScore(score);
    setCompletedLevels(levels);
  };

  return (
    <LinearGradient
      colors={[COLORS.parchmentDark, COLORS.parchment, COLORS.parchmentDark]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.parchmentDark} />
        
        {/* Decorative Border */}
        <View style={styles.decorativeBorder}>
          <View style={styles.innerBorder}>
            
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

            {/* Game Description */}
            <View style={styles.descriptionSection}>
              <Text style={styles.description}>
                أدِر الحروف الثلاثة واكتشف الجذور الصحيحة من بين الستة احتمالات
              </Text>
            </View>

            {/* High Score Display */}
            {highScore > 0 && (
              <View style={styles.highScoreContainer}>
                <Text style={styles.highScoreLabel}>أعلى نقاط</Text>
                <Text style={styles.highScoreValue}>{highScore}</Text>
                <Text style={styles.completedText}>
                  {completedLevels.length} / {GAME_LEVELS.length} مستوى مكتمل
                </Text>
              </View>
            )}

            {/* Buttons */}
            <View style={styles.buttonSection}>
              <TouchableOpacity 
                style={styles.playButton} 
                onPress={onStartGame}
                activeOpacity={0.8}
              >
                <Text style={styles.playButtonText}>ابدأ اللعب</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.levelSelectButton} 
                onPress={() => setShowLevelSelect(!showLevelSelect)}
                activeOpacity={0.8}
              >
                <Text style={styles.levelSelectText}>
                  {showLevelSelect ? 'إخفاء المستويات' : 'اختر مستوى'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Level Selection */}
            {showLevelSelect && (
              <View style={styles.levelGrid}>
                {GAME_LEVELS.map((level, index) => {
                  const isCompleted = completedLevels.includes(level.id.toString());
                  const isLocked = index > 0 && !completedLevels.includes(GAME_LEVELS[index - 1].id.toString());
                  
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
                      <Text style={[
                        styles.levelNumber,
                        isCompleted && styles.levelNumberCompleted,
                        isLocked && styles.levelNumberLocked,
                      ]}>
                        {isLocked ? '🔒' : level.id}
                      </Text>
                      {isCompleted && <Text style={styles.checkMark}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Footer with Islamic Pattern hint */}
            <View style={styles.footer}>
              <View style={styles.footerPattern}>
                {[...Array(5)].map((_, i) => (
                  <View key={i} style={styles.patternDot} />
                ))}
              </View>
              <Text style={styles.footerText}>
                اكتشف جمال اللغة العربية
              </Text>
            </View>
          </View>
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleSection: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  titleDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
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
    transform: [{ rotate: '45deg' }],
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
    textAlign: 'center',
    lineHeight: 28,
    ...FONTS.arabicText,
  },
  highScoreContainer: {
    alignItems: 'center',
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
    width: '100%',
    gap: SPACING.md,
  },
  playButton: {
    backgroundColor: COLORS.turquoise,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  playButtonText: {
    fontSize: 24,
    color: COLORS.textLight,
    ...FONTS.arabicTitle,
  },
  levelSelectButton: {
    backgroundColor: COLORS.parchmentLight,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.inkBrown,
  },
  levelSelectText: {
    fontSize: 18,
    color: COLORS.inkBrown,
    ...FONTS.arabicText,
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  levelButton: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.parchmentLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.inkBrown,
    position: 'relative',
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
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.correct,
    color: COLORS.textLight,
    width: 18,
    height: 18,
    borderRadius: 9,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    overflow: 'hidden',
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  footerPattern: {
    flexDirection: 'row',
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
});
