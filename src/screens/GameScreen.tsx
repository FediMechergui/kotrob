import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  LetterWheel,
  RootGrid,
  ClamAnimation,
  HintModal,
  ScoreBoard,
} from '../components';
import { COLORS, FONTS, SHADOWS, BORDER_RADIUS, SPACING } from '../constants/theme';
import {
  generateRoundData,
  RoundData,
  ARABIC_PROVERBS,
  Difficulty,
} from '../services/arabicApi';
import {
  saveHighScore,
  saveCompletedLevel,
  getHighScore,
} from '../utils/storage';

interface RootOption {
  root: string;
  isValid: boolean;
  isSelected: boolean;
  isRevealed: boolean;
}

// Difficulty settings
const DIFFICULTY_CONFIG = {
  easy: { 
    nameAr: 'سهل', 
    roundsPerLevel: 3, 
    basePoints: 10,
    hintCost: 5,
  },
  medium: { 
    nameAr: 'متوسط', 
    roundsPerLevel: 4, 
    basePoints: 15,
    hintCost: 10,
  },
  hard: { 
    nameAr: 'صعب', 
    roundsPerLevel: 5, 
    basePoints: 25,
    hintCost: 15,
  },
};

// Proverbs for each level completion
const LEVEL_PROVERBS = ARABIC_PROVERBS;

export const GameScreen: React.FC = () => {
  // Game state
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [level, setLevel] = useState(1);
  const [roundInLevel, setRoundInLevel] = useState(0);
  const [roundData, setRoundData] = useState<RoundData | null>(null);
  const [currentLetters, setCurrentLetters] = useState<[string, string, string]>(['ك', 'ت', 'ب']);
  const [selectedRoots, setSelectedRoots] = useState<Set<string>>(new Set());
  const [revealedRoots, setRevealedRoots] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // UI state
  const [showHintModal, setShowHintModal] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showDifficultySelect, setShowDifficultySelect] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Animation
  const fadeAnim = useState(new Animated.Value(0))[0];

  const difficultyConfig = DIFFICULTY_CONFIG[difficulty];
  const currentProverb = LEVEL_PROVERBS[(level - 1) % LEVEL_PROVERBS.length];

  // Generate hints from round data
  const generateHints = useCallback(() => {
    if (!roundData) return [];
    const hints: { title: string; text: string; meaning?: string }[] = [];
    
    // Add valid count hint
    hints.push({
      title: 'عدد الجذور',
      text: `عدد الجذور الصحيحة: ${roundData.validRoots.length}`,
    });
    
    // Add meaning hints for valid roots
    roundData.validRoots.forEach((root: string) => {
      if (roundData.meanings[root]) {
        hints.push({
          title: 'تلميح معنى',
          text: roundData.meanings[root],
          meaning: `هذا المعنى يشير إلى أحد الجذور الصحيحة`,
        });
      }
    });
    
    return hints;
  }, [roundData]);

  const hints = generateHints();

  // Load saved data
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedHighScore = await getHighScore();
      setHighScore(savedHighScore);
      setIsLoading(false);
      
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Error loading saved data:', error);
      setIsLoading(false);
    }
  };

  // Generate new round when starting or advancing
  const generateNewRound = useCallback(() => {
    const newRoundData = generateRoundData(difficulty);
    setRoundData(newRoundData);
    setCurrentLetters([...newRoundData.letters] as [string, string, string]);
    setSelectedRoots(new Set());
    setRevealedRoots(false);
    setHintsUsed(0);
  }, [difficulty]);

  // Start game with selected difficulty
  const handleStartGame = useCallback((selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setShowDifficultySelect(false);
    setLevel(1);
    setRoundInLevel(0);
    setScore(0);
    setStreak(0);
    
    // Generate first round with selected difficulty
    const newRoundData = generateRoundData(selectedDifficulty);
    setRoundData(newRoundData);
    setCurrentLetters([...newRoundData.letters] as [string, string, string]);
    setSelectedRoots(new Set());
    setRevealedRoots(false);
    setHintsUsed(0);
  }, []);

  // Handle letter rotation - generates completely NEW random letters
  const handleRotate = useCallback(async () => {
    if (isSpinning || revealedRoots) return;
    
    setIsSpinning(true);
    
    // Wait for spin animation (simulated delay)
    setTimeout(() => {
      // Generate completely new round with new letters
      const newRoundData = generateRoundData(difficulty);
      setRoundData(newRoundData);
      setCurrentLetters([...newRoundData.letters] as [string, string, string]);
      setSelectedRoots(new Set());
      setIsSpinning(false);
    }, 800);
  }, [difficulty, isSpinning, revealedRoots]);

  // Generate root options from current round
  const rootOptions: RootOption[] = roundData?.permutations.map(root => ({
    root,
    isValid: roundData.validRoots.includes(root),
    isSelected: selectedRoots.has(root),
    isRevealed: revealedRoots,
  })) || [];

  // Handle root selection
  const handleSelectRoot = useCallback((root: string) => {
    if (revealedRoots) return;
    
    setSelectedRoots(prev => {
      const newSet = new Set(prev);
      if (newSet.has(root)) {
        newSet.delete(root);
      } else {
        newSet.add(root);
      }
      return newSet;
    });
  }, [revealedRoots]);

  // Calculate score for current round
  const calculateRoundScore = useCallback(() => {
    if (!roundData) return { pointsEarned: 0, correct: 0, incorrect: 0, missed: 0, streakBonus: 0 };
    
    let correct = 0;
    let incorrect = 0;
    
    selectedRoots.forEach(root => {
      if (roundData.validRoots.includes(root)) {
        correct++;
      } else {
        incorrect++;
      }
    });
    
    const missed = roundData.validRoots.length - correct;
    const basePoints = difficultyConfig.basePoints;
    
    // Points calculation
    const correctPoints = correct * basePoints;
    const incorrectPenalty = incorrect * Math.floor(basePoints / 2);
    const missedPenalty = missed * Math.floor(basePoints / 4);
    const streakBonus = streak > 0 ? Math.floor(streak * basePoints * 0.1) : 0;
    
    const pointsEarned = Math.max(0, correctPoints - incorrectPenalty - missedPenalty + streakBonus);
    
    return { pointsEarned, correct, incorrect, missed, streakBonus };
  }, [roundData, selectedRoots, streak, difficultyConfig]);

  // Handle check answers
  const handleCheckAnswers = useCallback(() => {
    if (selectedRoots.size === 0) {
      Alert.alert('تنبيه', 'الرجاء اختيار جذر واحد على الأقل');
      return;
    }

    setRevealedRoots(true);
    
    const result = calculateRoundScore();
    const newScore = score + result.pointsEarned;
    
    setScore(newScore);
    
    // Update streak
    if (result.incorrect === 0 && result.missed === 0) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    // Update high score
    if (newScore > highScore) {
      setHighScore(newScore);
      saveHighScore(newScore);
    }
  }, [selectedRoots, calculateRoundScore, score, highScore]);

  // Handle next round
  const handleNextRound = useCallback(() => {
    const nextRoundInLevel = roundInLevel + 1;
    
    if (nextRoundInLevel >= difficultyConfig.roundsPerLevel) {
      // Level complete!
      setShowLevelComplete(true);
      saveCompletedLevel(level.toString());
    } else {
      // Next round in same level
      setRoundInLevel(nextRoundInLevel);
      generateNewRound();
    }
  }, [roundInLevel, difficultyConfig.roundsPerLevel, level, generateNewRound]);

  // Handle next level
  const handleNextLevel = useCallback(() => {
    setShowLevelComplete(false);
    
    // Increase difficulty every 3 levels
    const nextLevel = level + 1;
    let nextDifficulty = difficulty;
    
    if (nextLevel > 6 && difficulty === 'medium') {
      nextDifficulty = 'hard';
    } else if (nextLevel > 3 && difficulty === 'easy') {
      nextDifficulty = 'medium';
    }
    
    setLevel(nextLevel);
    setDifficulty(nextDifficulty);
    setRoundInLevel(0);
    
    // Generate new round with potentially new difficulty
    const newRoundData = generateRoundData(nextDifficulty);
    setRoundData(newRoundData);
    setCurrentLetters([...newRoundData.letters] as [string, string, string]);
    setSelectedRoots(new Set());
    setRevealedRoots(false);
    setHintsUsed(0);
  }, [level, difficulty]);

  // Handle hint use
  const handleUseHint = useCallback(() => {
    const hintCost = difficultyConfig.hintCost;
    if (hintsUsed < hints.length && score >= hintCost) {
      setHintsUsed(prev => prev + 1);
      setScore(prev => Math.max(0, prev - hintCost));
    }
  }, [hintsUsed, hints.length, score, difficultyConfig.hintCost]);

  // Reset game
  const handleResetGame = useCallback(() => {
    Alert.alert(
      'إعادة اللعب',
      'هل أنت متأكد من إعادة اللعب من البداية؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'نعم',
          onPress: () => {
            setShowDifficultySelect(true);
            setLevel(1);
            setRoundInLevel(0);
            setScore(0);
            setStreak(0);
            setHintsUsed(0);
            setSelectedRoots(new Set());
            setRevealedRoots(false);
            setShowLevelComplete(false);
          },
        },
      ]
    );
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  // Difficulty selection screen
  if (showDifficultySelect) {
    return (
      <LinearGradient
        colors={[COLORS.parchment, COLORS.parchmentDark, COLORS.parchment]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.parchment} />
          <Animated.View style={[styles.difficultyContainer, { opacity: fadeAnim }]}>
            <Text style={styles.difficultyTitle}>اختر مستوى الصعوبة</Text>
            <Text style={styles.difficultySubtitle}>كلما زادت الصعوبة، زادت النقاط</Text>
            
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[
                  styles.difficultyButton,
                  diff === 'easy' && styles.difficultyEasy,
                  diff === 'medium' && styles.difficultyMedium,
                  diff === 'hard' && styles.difficultyHard,
                ]}
                onPress={() => handleStartGame(diff)}
              >
                <Text style={styles.difficultyButtonText}>
                  {DIFFICULTY_CONFIG[diff].nameAr}
                </Text>
                <Text style={styles.difficultyDesc}>
                  {diff === 'easy' && 'حروف شائعة - مناسب للمبتدئين'}
                  {diff === 'medium' && 'تحدي متوسط - لعشاق اللغة'}
                  {diff === 'hard' && 'تحدي صعب - للخبراء فقط'}
                </Text>
                <Text style={styles.difficultyPoints}>
                  {DIFFICULTY_CONFIG[diff].basePoints} نقطة لكل جذر صحيح
                </Text>
              </TouchableOpacity>
            ))}
            
            <View style={styles.highScoreDisplay}>
              <Text style={styles.highScoreLabel}>أعلى نتيجة</Text>
              <Text style={styles.highScoreValue}>{highScore}</Text>
            </View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Level complete screen with clam animation
  if (showLevelComplete) {
    return (
      <LinearGradient
        colors={[COLORS.parchment, COLORS.parchmentDark, COLORS.parchment]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.parchment} />
          <ScrollView contentContainerStyle={styles.levelCompleteContainer}>
            <Text style={styles.levelCompleteTitle}>🎉 مبروك! 🎉</Text>
            <Text style={styles.levelCompleteSubtitle}>
              أكملت المستوى {level} ({difficultyConfig.nameAr})
            </Text>
            
            <ClamAnimation
              isOpen={true}
              proverb={currentProverb.text}
              proverbMeaning={currentProverb.meaning}
            />
            
            <View style={styles.levelScoreContainer}>
              <Text style={styles.levelScoreLabel}>مجموع النقاط</Text>
              <Text style={styles.levelScoreValue}>{score}</Text>
            </View>
            
            <TouchableOpacity style={styles.nextLevelButton} onPress={handleNextLevel}>
              <Text style={styles.nextLevelButtonText}>
                المستوى التالي ←
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Main game screen
  return (
    <LinearGradient
      colors={[COLORS.parchment, COLORS.parchmentLight, COLORS.parchment]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.parchment} />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.resetButton} onPress={handleResetGame}>
              <Text style={styles.resetButtonText}>⟳</Text>
            </TouchableOpacity>
            
            <View style={styles.titleContainer}>
              <Text style={styles.title}>لعبة الجذور</Text>
              <Text style={styles.difficultyBadge}>{difficultyConfig.nameAr}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.hintButton} 
              onPress={() => setShowHintModal(true)}
            >
              <Text style={styles.hintButtonText}>💡</Text>
            </TouchableOpacity>
          </View>

          {/* Progress */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              المستوى {level} - السؤال {roundInLevel + 1}/{difficultyConfig.roundsPerLevel}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((roundInLevel + 1) / difficultyConfig.roundsPerLevel) * 100}%` }
                ]} 
              />
            </View>
          </View>

          {/* Score Board */}
          <View style={styles.scoreBoardContainer}>
            <ScoreBoard
              score={score}
              level={level}
              streak={streak}
              highScore={highScore}
            />
          </View>

          {/* Letter Wheel with random rotation */}
          <View style={styles.wheelContainer}>
            <LetterWheel
              letters={currentLetters}
              onRotate={handleRotate}
              disabled={revealedRoots}
              isSpinning={isSpinning}
            />
          </View>

          {/* Root Grid */}
          <View style={styles.gridContainer}>
            <RootGrid
              options={rootOptions}
              onSelectRoot={handleSelectRoot}
              disabled={revealedRoots || isSpinning}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {!revealedRoots ? (
              <TouchableOpacity 
                style={[styles.checkButton, isSpinning && styles.buttonDisabled]} 
                onPress={handleCheckAnswers}
                disabled={isSpinning}
              >
                <Text style={styles.checkButtonText}>تحقق من الإجابات</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.nextButton} 
                onPress={handleNextRound}
              >
                <Text style={styles.nextButtonText}>
                  {roundInLevel < difficultyConfig.roundsPerLevel - 1 ? 'السؤال التالي' : 'إنهاء المستوى'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Meanings display after reveal */}
          {revealedRoots && roundData && (
            <View style={styles.meaningsContainer}>
              <Text style={styles.meaningsTitle}>معاني الجذور الصحيحة:</Text>
              {roundData.validRoots.map(root => (
                <View key={root} style={styles.meaningItem}>
                  <Text style={styles.meaningRoot}>{root}</Text>
                  <Text style={styles.meaningText}>
                    {roundData.meanings[root] || 'جذر صحيح'}
                  </Text>
                </View>
              ))}
              
              {/* Score breakdown */}
              <View style={styles.scoreBreakdown}>
                <Text style={styles.scoreBreakdownTitle}>تفاصيل النقاط:</Text>
                {(() => {
                  const result = calculateRoundScore();
                  return (
                    <>
                      <Text style={styles.scoreBreakdownItem}>
                        ✓ إجابات صحيحة: {result.correct}
                      </Text>
                      <Text style={styles.scoreBreakdownItem}>
                        ✗ إجابات خاطئة: {result.incorrect}
                      </Text>
                      <Text style={styles.scoreBreakdownItem}>
                        ○ جذور فائتة: {result.missed}
                      </Text>
                      <Text style={styles.scoreBreakdownTotal}>
                        المجموع: +{result.pointsEarned} نقطة
                      </Text>
                    </>
                  );
                })()}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Hint Modal */}
        <HintModal
          visible={showHintModal}
          hints={hints}
          hintsUsed={hintsUsed}
          maxHints={hints.length}
          onUseHint={handleUseHint}
          onClose={() => setShowHintModal(false)}
        />
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
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.parchment,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.inkBrown,
    ...FONTS.arabicText,
  },
  // Difficulty selection styles
  difficultyContainer: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
  },
  difficultyTitle: {
    fontSize: 32,
    color: COLORS.inkBrown,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    ...FONTS.arabicTitle,
  },
  difficultySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    ...FONTS.arabicText,
  },
  difficultyButton: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 2,
    ...SHADOWS.medium,
  },
  difficultyEasy: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  difficultyMedium: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF9800',
  },
  difficultyHard: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  difficultyButtonText: {
    fontSize: 24,
    color: COLORS.inkBrown,
    textAlign: 'center',
    ...FONTS.arabicTitle,
  },
  difficultyDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
    ...FONTS.arabicText,
  },
  difficultyPoints: {
    fontSize: 12,
    color: COLORS.inkGold,
    textAlign: 'center',
    marginTop: SPACING.xs,
    ...FONTS.arabicText,
  },
  highScoreDisplay: {
    marginTop: SPACING.xl,
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.parchmentLight,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.inkGold,
  },
  highScoreLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    ...FONTS.arabicText,
  },
  highScoreValue: {
    fontSize: 36,
    color: COLORS.inkGold,
    ...FONTS.arabicTitle,
  },
  // Main game styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  titleContainer: {
    alignItems: 'center',
  },
  resetButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.parchmentDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.inkGold,
  },
  resetButtonText: {
    fontSize: 24,
    color: COLORS.inkBrown,
  },
  title: {
    fontSize: 28,
    color: COLORS.inkBrown,
    ...FONTS.arabicTitle,
  },
  difficultyBadge: {
    fontSize: 12,
    color: COLORS.inkGold,
    backgroundColor: COLORS.parchmentDark,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: 2,
    overflow: 'hidden',
    ...FONTS.arabicText,
  },
  hintButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.inkGold,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  hintButtonText: {
    fontSize: 22,
  },
  progressContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    ...FONTS.arabicText,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.parchmentDark,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.inkGold,
    borderRadius: 4,
  },
  scoreBoardContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  wheelContainer: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  gridContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  actionButtons: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  checkButton: {
    backgroundColor: COLORS.inkGold,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  checkButtonText: {
    fontSize: 18,
    color: COLORS.parchment,
    ...FONTS.arabicTitle,
  },
  nextButton: {
    backgroundColor: COLORS.copperAccent,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  nextButtonText: {
    fontSize: 18,
    color: COLORS.parchment,
    ...FONTS.arabicTitle,
  },
  meaningsContainer: {
    margin: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.parchmentLight,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.inkGold,
  },
  meaningsTitle: {
    fontSize: 18,
    color: COLORS.inkBrown,
    marginBottom: SPACING.md,
    textAlign: 'center',
    ...FONTS.arabicTitle,
  },
  meaningItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.parchment,
    borderRadius: BORDER_RADIUS.md,
  },
  meaningRoot: {
    fontSize: 20,
    color: COLORS.inkGold,
    marginLeft: SPACING.md,
    width: 60,
    textAlign: 'center',
    ...FONTS.arabicLetter,
  },
  meaningText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'right',
    ...FONTS.arabicText,
  },
  scoreBreakdown: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.inkGold,
  },
  scoreBreakdownTitle: {
    fontSize: 16,
    color: COLORS.inkBrown,
    marginBottom: SPACING.sm,
    textAlign: 'center',
    ...FONTS.arabicText,
  },
  scoreBreakdownItem: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
    ...FONTS.arabicText,
  },
  scoreBreakdownTotal: {
    fontSize: 18,
    color: COLORS.inkGold,
    textAlign: 'center',
    marginTop: SPACING.sm,
    ...FONTS.arabicTitle,
  },
  // Level complete styles
  levelCompleteContainer: {
    flexGrow: 1,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelCompleteTitle: {
    fontSize: 36,
    color: COLORS.inkGold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    ...FONTS.arabicTitle,
  },
  levelCompleteSubtitle: {
    fontSize: 18,
    color: COLORS.inkBrown,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    ...FONTS.arabicText,
  },
  levelScoreContainer: {
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.parchmentLight,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.inkGold,
    marginVertical: SPACING.lg,
    minWidth: 200,
  },
  levelScoreLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    ...FONTS.arabicText,
  },
  levelScoreValue: {
    fontSize: 48,
    color: COLORS.inkGold,
    ...FONTS.arabicTitle,
  },
  nextLevelButton: {
    backgroundColor: COLORS.inkGold,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.lg,
    ...SHADOWS.large,
  },
  nextLevelButtonText: {
    fontSize: 20,
    color: COLORS.parchment,
    ...FONTS.arabicTitle,
  },
});
