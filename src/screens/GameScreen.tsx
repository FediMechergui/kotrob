import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  LetterWheel,
  RootGrid,
  ClamAnimation,
  HintModal,
  ScoreBoard,
  RootDefinitionModal,
} from "../components";
import {
  COLORS,
  FONTS,
  SHADOWS,
  BORDER_RADIUS,
  SPACING,
} from "../constants/theme";
import {
  generateRoundData,
  RoundData,
  ARABIC_PROVERBS,
  Difficulty,
} from "../services/arabicApi";
import { getRootInfo } from "../data/arabicDatabase";
import qutufData from "../../القطوف.json";
import ahsantJson from "../../أحسنت.json";
import winJson from "../../win.json";
import { getUnlockedCards, unlockCard } from "../utils/gameStorage";
import {
  saveRootsSession,
  getRootsSession,
  clearRootsSession,
  addToTotalScore,
  updateHighScore,
  updateTotalStreak,
  getGlobalScores,
  saveCompletedLevel,
  saveGameHistory,
} from "../services/database";
import { scaleFontSize, wp, hp } from "../utils/responsive";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Responsive sizing calculations
const isSmallDevice = SCREEN_WIDTH < 360;
const isMediumDevice = SCREEN_WIDTH >= 360 && SCREEN_WIDTH < 414;
const isShortDevice = SCREEN_HEIGHT < 700;

const getResponsiveSize = (base: number, small: number, medium: number) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return base;
};

interface RootOption {
  root: string;
  isValid: boolean;
  isSelected: boolean;
  isRevealed: boolean;
}

// Difficulty settings
const DIFFICULTY_CONFIG = {
  easy: {
    nameAr: "سهل",
    roundsPerLevel: 3,
    basePoints: 10,
    hintCost: 5,
  },
  medium: {
    nameAr: "متوسط",
    roundsPerLevel: 4,
    basePoints: 15,
    hintCost: 10,
  },
  hard: {
    nameAr: "صعب",
    roundsPerLevel: 5,
    basePoints: 25,
    hintCost: 15,
  },
};

// Proverbs for each level completion
const LEVEL_PROVERBS = ARABIC_PROVERBS;

interface GameScreenProps {
  onBack?: () => void;
  onOpenVideoReward?: () => void;
  resumeGame?: boolean;
  playerId: number;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  onBack,
  onOpenVideoReward,
  resumeGame = false,
  playerId,
}) => {
  // Game state
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [level, setLevel] = useState(1);
  const [roundInLevel, setRoundInLevel] = useState(0);
  const [roundData, setRoundData] = useState<RoundData | null>(null);
  const [currentLetters, setCurrentLetters] = useState<
    [string, string, string]
  >(["ك", "ت", "ب"]);
  const [selectedRoots, setSelectedRoots] = useState<Set<string>>(new Set());
  const [revealedRoots, setRevealedRoots] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // UI state
  const [showHintModal, setShowHintModal] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  // difficulty selection removed — start game immediately
  const [showDifficultySelect, setShowDifficultySelect] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Popups and unlocks
  const [ahsant, setAhsant] = useState<any[]>([]);
  const [wins, setWins] = useState<any[]>([]);
  const [showClamPopup, setShowClamPopup] = useState(false);
  const [popupItem, setPopupItem] = useState<any | null>(null);
  const [unlockedCardsState, setUnlockedCardsState] = useState<any[]>([]);
  const [showUnlockedModal, setShowUnlockedModal] = useState(false);

  // Definition modal state (click to show)
  const [showDefinitionModal, setShowDefinitionModal] = useState(false);
  const [definitionRoot, setDefinitionRoot] = useState("");
  const [definitionMeaning, setDefinitionMeaning] = useState("");
  const [definitionPoetry, setDefinitionPoetry] = useState<string | undefined>(
    undefined
  );
  const [definitionDifficulty, setDefinitionDifficulty] = useState<
    "easy" | "medium" | "hard" | undefined
  >(undefined);

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
      title: "عدد الجذور",
      text: `عدد الجذور الصحيحة: ${roundData.validRoots.length}`,
    });

    // Add meaning hints for valid roots
    roundData.validRoots.forEach((root: string) => {
      if (roundData.meanings[root]) {
        hints.push({
          title: "تلميح معنى",
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
      if (playerId) {
        const globalScores = await getGlobalScores(playerId);
        setHighScore(globalScores.roots_high_score);

        // Check if we should resume a game
        if (resumeGame) {
          const savedSession = await getRootsSession(playerId);
          if (savedSession && savedSession.is_paused) {
            // Restore game state
            setDifficulty(savedSession.difficulty as Difficulty);
            setLevel(savedSession.current_level);
            setRoundInLevel(savedSession.current_round);
            setScore(savedSession.score);
            setStreak(savedSession.streak);
            setShowDifficultySelect(false);

            // Generate a new round (can't save exact round state)
            const newRoundData = generateRoundData(
              savedSession.difficulty as Difficulty
            );
            setRoundData(newRoundData);
            setCurrentLetters([...newRoundData.letters] as [
              string,
              string,
              string
            ]);
          }
        }
      }

      setIsLoading(false);

      // Load popup and win data (from project root JSON files)
      try {
        setAhsant(Array.isArray(ahsantJson as any) ? (ahsantJson as any) : []);
      } catch (e) {
        setAhsant([]);
      }

      try {
        setWins(Array.isArray(winJson as any) ? (winJson as any) : []);
      } catch (e) {
        setWins([]);
      }

      // Load unlocked cards from storage
      try {
        const unlocked = await getUnlockedCards();
        setUnlockedCardsState(unlocked);
      } catch (e) {
        setUnlockedCardsState([]);
      }

      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Error loading saved data:", error);
      setIsLoading(false);
    }
  };

  // Generate new round when starting or advancing
  const generateNewRound = useCallback(() => {
    const newRoundData = generateRoundData(difficulty);
    setRoundData(newRoundData);
    if ((newRoundData as any).difficulty) {
      setDifficulty((newRoundData as any).difficulty as Difficulty);
    }
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
    if ((newRoundData as any).difficulty) {
      setDifficulty((newRoundData as any).difficulty as Difficulty);
    }
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
  const rootOptions: RootOption[] =
    roundData?.permutations.map((root) => ({
      root,
      isValid: roundData.validRoots.includes(root),
      isSelected: selectedRoots.has(root),
      isRevealed: revealedRoots,
    })) || [];

  // Handle root selection
  const handleSelectRoot = useCallback(
    (root: string) => {
      if (revealedRoots) return;

      setSelectedRoots((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(root)) {
          newSet.delete(root);
        } else {
          newSet.add(root);
        }
        return newSet;
      });
    },
    [revealedRoots]
  );

  // Calculate score for current round
  const calculateRoundScore = useCallback(() => {
    if (!roundData)
      return {
        pointsEarned: 0,
        correct: 0,
        incorrect: 0,
        missed: 0,
        streakBonus: 0,
      };

    let correct = 0;
    let incorrect = 0;

    selectedRoots.forEach((root) => {
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

    const pointsEarned = Math.max(
      0,
      correctPoints - incorrectPenalty - missedPenalty + streakBonus
    );

    return { pointsEarned, correct, incorrect, missed, streakBonus };
  }, [roundData, selectedRoots, streak, difficultyConfig]);

  // Handle showing definition modal when clicking on valid root after reveal
  const handleRootPress = useCallback(
    (root: string) => {
      if (roundData && roundData.validRoots.includes(root)) {
        setDefinitionRoot(root);
        setDefinitionMeaning(roundData.meanings[root] || "جذر صحيح");
        setDefinitionPoetry(roundData.poetryExamples[root]);
        setDefinitionDifficulty((roundData as any).difficulty || difficulty);
        setShowDefinitionModal(true);
      }
    },
    [roundData]
  );

  // Handle check answers
  const handleCheckAnswers = useCallback(async () => {
    if (selectedRoots.size === 0) {
      Alert.alert("تنبيه", "الرجاء اختيار جذر واحد على الأقل");
      return;
    }

    setRevealedRoots(true);

    const result = calculateRoundScore();
    const newScore = score + result.pointsEarned;

    setScore(newScore);

    // Update streak
    let newStreak = streak;
    if (result.incorrect === 0 && result.missed === 0) {
      newStreak = streak + 1;
      setStreak(newStreak);
    } else {
      newStreak = 0;
      setStreak(0);
    }

    // Update high score in database
    if (playerId && newScore > highScore) {
      setHighScore(newScore);
      await updateHighScore(playerId, "roots", newScore);
    }

    // Update total streak in database
    if (playerId) {
      await updateTotalStreak(playerId, newStreak);
    }
  }, [selectedRoots, calculateRoundScore, score, highScore, streak, playerId]);

  // Handle next round
  const handleNextRound = useCallback(async () => {
    const nextRoundInLevel = roundInLevel + 1;

    if (nextRoundInLevel >= difficultyConfig.roundsPerLevel) {
      // Level complete! Save to database
      if (playerId) {
        await saveCompletedLevel(playerId, "roots", level.toString());
        await addToTotalScore(playerId, score);
        await saveGameHistory(playerId, "roots", score, streak, level);
      }
      setShowLevelComplete(true);
      // Show a random popup from أحسنت.json when the clam appears
      if (ahsant && ahsant.length > 0) {
        const item = ahsant[Math.floor(Math.random() * ahsant.length)];
        setPopupItem(item);
        setShowClamPopup(true);
      }
    } else {
      // Next round in same level
      setRoundInLevel(nextRoundInLevel);
      generateNewRound();
    }
  }, [
    roundInLevel,
    difficultyConfig.roundsPerLevel,
    level,
    generateNewRound,
    playerId,
    score,
    streak,
    ahsant,
  ]);

  // Handle next level
  const handleNextLevel = useCallback(async () => {
    setShowLevelComplete(false);

    // Increase difficulty every 3 levels
    const nextLevel = level + 1;
    let nextDifficulty = difficulty;

    if (nextLevel > 6 && difficulty === "medium") {
      nextDifficulty = "hard";
    } else if (nextLevel > 3 && difficulty === "easy") {
      nextDifficulty = "medium";
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
      setHintsUsed((prev) => prev + 1);
      setScore((prev) => Math.max(0, prev - hintCost));
    }
  }, [hintsUsed, hints.length, score, difficultyConfig.hintCost]);

  // Reset game
  const handleResetGame = useCallback(() => {
    setShowPauseModal(false);
    Alert.alert("إعادة اللعب", "هل أنت متأكد من إعادة اللعب من البداية؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "نعم",
        onPress: async () => {
          if (playerId) {
            await clearRootsSession(playerId);
          }
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
    ]);
  }, [playerId]);

  // Pause game - save progress and show pause modal
  const handlePauseGame = useCallback(async () => {
    // Auto-save progress when pausing
    if (playerId) {
      await saveRootsSession(playerId, {
        difficulty,
        currentLevel: level,
        currentRound: roundInLevel,
        score,
        streak,
        isPaused: true,
      });
    }
    setShowPauseModal(true);
  }, [playerId, difficulty, level, roundInLevel, score, streak]);

  // Ensure progress is saved if component unmounts or user navigates away
  useEffect(() => {
    return () => {
      (async () => {
        try {
          if (playerId) {
            await saveRootsSession(playerId, {
              difficulty,
              currentLevel: level,
              currentRound: roundInLevel,
              score,
              streak,
              isPaused: true,
            });
            await addToTotalScore(playerId, score);
            await updateTotalStreak(playerId, streak);
          }
        } catch (e) {
          // ignore
        }
      })();
    };
  }, [playerId, difficulty, level, roundInLevel, score, streak]);

  // Resume game from pause
  const handleResumePause = useCallback(() => {
    setShowPauseModal(false);
  }, []);

  // Quit game with confirmation
  const handleQuitGame = useCallback(() => {
    setShowPauseModal(false);
    setShowExitConfirm(true);
  }, []);

  // Confirm exit - save and go back
  const handleConfirmExit = useCallback(async () => {
    // Always save current progress to SQLite before exiting
    if (playerId) {
      await saveRootsSession(playerId, {
        difficulty,
        currentLevel: level,
        currentRound: roundInLevel,
        score,
        streak,
        isPaused: true,
      });
      await addToTotalScore(playerId, score);
      await updateTotalStreak(playerId, streak);
    }
    setShowExitConfirm(false);
    if (onBack) onBack();
  }, [playerId, difficulty, level, roundInLevel, score, streak, onBack]);

  // Cancel exit
  const handleCancelExit = useCallback(() => {
    setShowExitConfirm(false);
  }, []);

  // Handle video reward - save progress before opening video
  const handleVideoReward = useCallback(async () => {
    // Save progress before watching video
    if (playerId) {
      await saveRootsSession(playerId, {
        difficulty,
        currentLevel: level,
        currentRound: roundInLevel,
        score,
        streak,
        isPaused: true,
      });
    }
    setShowPauseModal(false);
    if (onOpenVideoReward) {
      onOpenVideoReward();
    }
  }, [
    playerId,
    difficulty,
    level,
    roundInLevel,
    score,
    streak,
    onOpenVideoReward,
  ]);

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
          <StatusBar
            barStyle="dark-content"
            backgroundColor={COLORS.parchment}
          />
          <Animated.View
            style={[styles.difficultyContainer, { opacity: fadeAnim }]}
          >
            <Text style={styles.difficultyTitle}>اختر مستوى الصعوبة</Text>
            <Text style={styles.difficultySubtitle}>
              كلما زادت الصعوبة، زادت النقاط
            </Text>

            {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[
                  styles.difficultyButton,
                  diff === "easy" && styles.difficultyEasy,
                  diff === "medium" && styles.difficultyMedium,
                  diff === "hard" && styles.difficultyHard,
                ]}
                onPress={() => handleStartGame(diff)}
              >
                <Text style={styles.difficultyButtonText}>
                  {DIFFICULTY_CONFIG[diff].nameAr}
                </Text>
                <Text style={styles.difficultyDesc}>
                  {diff === "easy" && "حروف شائعة - مناسب للمبتدئين"}
                  {diff === "medium" && "تحدي متوسط - لعشاق اللغة"}
                  {diff === "hard" && "تحدي صعب - للخبراء فقط"}
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
          <StatusBar
            barStyle="dark-content"
            backgroundColor={COLORS.parchment}
          />
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

            {/* Clam popup from أحسنت.json */}
            <Modal visible={showClamPopup} transparent animationType="fade">
              <View style={styles.clamPopupOverlay}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.clamPopupCard}
                  onPress={async () => {
                    // Unlock a random card from win.json when popup pressed
                    try {
                      setShowClamPopup(false);
                      if (wins && wins.length > 0) {
                        const card =
                          wins[Math.floor(Math.random() * wins.length)];
                        await unlockCard({
                          id: card.id,
                          title: card.title,
                          description: card.description,
                          data: card,
                        });
                        const updated = await getUnlockedCards();
                        setUnlockedCardsState(updated);
                        // Open unlocked cards modal so user can immediately access the new card
                        setShowUnlockedModal(true);
                      } else {
                        Alert.alert("ملاحظة", "لا توجد بطاقات متاحة حالياً");
                      }
                    } catch (e) {
                      console.error("Error unlocking card from popup", e);
                    }
                  }}
                >
                  <Text style={styles.clamPopupEmoji}>🤿</Text>
                  <Text style={styles.clamPopupTitle}>
                    {popupItem?.title || "أحسنت!"}
                  </Text>
                  {popupItem?.content && Array.isArray(popupItem.content) && (
                    <Text style={styles.clamPopupText}>
                      {popupItem.content[0]}
                    </Text>
                  )}
                  <Text style={styles.clamPopupHint}>اضغط لفتح بطاقة</Text>
                </TouchableOpacity>
              </View>
            </Modal>

            <View style={styles.levelScoreContainer}>
              <Text style={styles.levelScoreLabel}>مجموع النقاط</Text>
              <Text style={styles.levelScoreValue}>{score}</Text>
            </View>

            <TouchableOpacity
              style={styles.nextLevelButton}
              onPress={handleNextLevel}
            >
              <Text style={styles.nextLevelButtonText}>المستوى التالي ←</Text>
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

        <View style={styles.gameContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.pauseButton}
              onPress={handlePauseGame}
            >
              <Text style={styles.pauseButtonText}>⏸️</Text>
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>لعبة الجذور</Text>
              <Text style={styles.difficultyBadge}>
                {difficultyConfig.nameAr}
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={[styles.hintButton, { marginRight: 8 }]}
                onPress={() => setShowHintModal(true)}
              >
                <Text style={styles.hintButtonText}>💡</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.hintButton}
                onPress={() => setShowUnlockedModal(true)}
              >
                <Text style={styles.hintButtonText}>📚</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              المستوى {level} - السؤال {roundInLevel + 1}/
              {difficultyConfig.roundsPerLevel}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      ((roundInLevel + 1) / difficultyConfig.roundsPerLevel) *
                      100
                    }%`,
                  },
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
              onRootPress={handleRootPress}
              disabled={revealedRoots || isSpinning}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {!revealedRoots ? (
              <TouchableOpacity
                style={[
                  styles.checkButton,
                  isSpinning && styles.buttonDisabled,
                ]}
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
                  {roundInLevel < difficultyConfig.roundsPerLevel - 1
                    ? "السؤال التالي"
                    : "إنهاء المستوى"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Score breakdown after reveal */}
          {revealedRoots && (
            <View style={styles.scoreBreakdownCompact}>
              {(() => {
                const result = calculateRoundScore();
                return (
                  <Text style={styles.scoreBreakdownText}>
                    ✓ {result.correct} | ✗ {result.incorrect} | ○{" "}
                    {result.missed} | +{result.pointsEarned}
                  </Text>
                );
              })()}
              <Text style={styles.tapHintText}>
                اضغط على الجذر لمعرفة معناه
              </Text>
            </View>
          )}
        </View>

        {/* Hint Modal */}
        <HintModal
          visible={showHintModal}
          hints={hints}
          hintsUsed={hintsUsed}
          maxHints={hints.length}
          onUseHint={handleUseHint}
          onClose={() => setShowHintModal(false)}
        />

        {/* Pause Modal */}
        <Modal
          visible={showPauseModal}
          transparent
          animationType="fade"
          onRequestClose={handleResumePause}
        >
          <View style={styles.pauseModalOverlay}>
            <View style={styles.pauseModalContent}>
              <Text style={styles.pauseModalTitle}>⏸️ اللعبة متوقفة</Text>

              <View style={styles.pauseModalStats}>
                <Text style={styles.pauseModalStat}>المستوى: {level}</Text>
                <Text style={styles.pauseModalStat}>النقاط: {score}</Text>
                <Text style={styles.pauseModalStat}>السلسلة: {streak} 🔥</Text>
              </View>

              <TouchableOpacity
                style={styles.pauseModalButton}
                onPress={handleResumePause}
              >
                <Text style={styles.pauseModalButtonText}>▶️ استمرار</Text>
              </TouchableOpacity>

              {onOpenVideoReward && (
                <TouchableOpacity
                  style={[
                    styles.pauseModalButton,
                    styles.pauseModalButtonVideo,
                  ]}
                  onPress={handleVideoReward}
                >
                  <Text style={styles.pauseModalButtonText}>
                    🎬 مكافأة فيديو (+100 نقطة)
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.pauseModalButton, styles.pauseModalButtonReset]}
                onPress={handleResetGame}
              >
                <Text style={styles.pauseModalButtonText}>⟳ إعادة اللعب</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.pauseModalButton, styles.pauseModalButtonQuit]}
                onPress={handleQuitGame}
              >
                <Text style={styles.pauseModalButtonText}>🚪 خروج</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Exit Confirmation Modal */}
        <Modal
          visible={showExitConfirm}
          transparent
          animationType="fade"
          onRequestClose={handleCancelExit}
        >
          <View style={styles.pauseModalOverlay}>
            <View style={styles.pauseModalContent}>
              <Text style={styles.pauseModalTitle}>🚪 الخروج من اللعبة</Text>
              <Text style={styles.exitConfirmText}>
                سيتم حفظ تقدمك تلقائياً. هل تريد الخروج؟
              </Text>

              <View style={styles.exitConfirmButtons}>
                <TouchableOpacity
                  style={[styles.pauseModalButton, styles.exitConfirmButton]}
                  onPress={handleCancelExit}
                >
                  <Text style={styles.pauseModalButtonText}>إلغاء</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.pauseModalButton,
                    styles.pauseModalButtonQuit,
                    styles.exitConfirmButton,
                  ]}
                  onPress={handleConfirmExit}
                >
                  <Text style={styles.pauseModalButtonText}>خروج</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Root Definition Modal */}
        <RootDefinitionModal
          visible={showDefinitionModal}
          root={definitionRoot}
          meaning={definitionMeaning}
          poetryExample={definitionPoetry}
          difficulty={definitionDifficulty}
          onClose={() => setShowDefinitionModal(false)}
        />

        {/* Unlocked Cards Modal */}
        <Modal visible={showUnlockedModal} transparent animationType="slide">
          <View style={styles.unlockedOverlay}>
            <View style={styles.unlockedContainer}>
              <Text style={styles.unlockedTitle}>البطاقات المفتوحة</Text>
              <ScrollView style={{ flex: 1, width: "100%" }}>
                {unlockedCardsState.length === 0 ? (
                  <Text style={styles.unlockedEmpty}>لم تفتح أي بطاقة بعد</Text>
                ) : (
                  unlockedCardsState.map((card) => (
                    <View key={card.id} style={styles.unlockedCard}>
                      <Text style={styles.unlockedCardTitle}>
                        {card.title || `بطاقة ${card.id}`}
                      </Text>
                      {card.description && (
                        <Text style={styles.unlockedCardDesc}>
                          {card.description}
                        </Text>
                      )}
                      {card.data && card.data["التحليل النهائي"] && (
                        <Text style={styles.unlockedCardAnalysis}>
                          {card.data["التحليل النهائي"]}
                        </Text>
                      )}
                    </View>
                  ))
                )}
              </ScrollView>

              <TouchableOpacity
                style={styles.pauseModalButton}
                onPress={() => setShowUnlockedModal(false)}
              >
                <Text style={styles.pauseModalButtonText}>إغلاق</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: scaleFontSize(18),
    color: COLORS.inkBrown,
    ...FONTS.arabicText,
  },
  // Difficulty selection styles
  difficultyContainer: {
    flex: 1,
    padding: getResponsiveSize(SPACING.xl, SPACING.md, SPACING.lg),
    justifyContent: "center",
  },
  difficultyTitle: {
    fontSize: scaleFontSize(isSmallDevice ? 26 : 32),
    color: COLORS.inkBrown,
    textAlign: "center",
    marginBottom: getResponsiveSize(SPACING.sm, SPACING.xs, SPACING.xs),
    ...FONTS.arabicTitle,
  },
  difficultySubtitle: {
    fontSize: scaleFontSize(isSmallDevice ? 14 : 16),
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: getResponsiveSize(SPACING.xl, SPACING.lg, SPACING.lg),
    ...FONTS.arabicText,
  },
  difficultyButton: {
    padding: getResponsiveSize(SPACING.lg, SPACING.md, SPACING.md),
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: getResponsiveSize(SPACING.md, SPACING.sm, SPACING.sm),
    borderWidth: 2,
    ...SHADOWS.medium,
  },
  difficultyEasy: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
  },
  difficultyMedium: {
    backgroundColor: "#FFF3E0",
    borderColor: "#FF9800",
  },
  difficultyHard: {
    backgroundColor: "#FFEBEE",
    borderColor: "#F44336",
  },
  difficultyButtonText: {
    fontSize: scaleFontSize(isSmallDevice ? 20 : 24),
    color: COLORS.inkBrown,
    textAlign: "center",
    ...FONTS.arabicTitle,
  },
  difficultyDesc: {
    fontSize: scaleFontSize(isSmallDevice ? 12 : 14),
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.xs,
    ...FONTS.arabicText,
  },
  difficultyPoints: {
    fontSize: scaleFontSize(isSmallDevice ? 10 : 12),
    color: COLORS.inkGold,
    textAlign: "center",
    marginTop: SPACING.xs,
    ...FONTS.arabicText,
  },
  highScoreDisplay: {
    marginTop: getResponsiveSize(SPACING.xl, SPACING.lg, SPACING.lg),
    alignItems: "center",
    padding: getResponsiveSize(SPACING.lg, SPACING.md, SPACING.md),
    backgroundColor: COLORS.parchmentLight,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.inkGold,
  },
  highScoreLabel: {
    fontSize: scaleFontSize(isSmallDevice ? 14 : 16),
    color: COLORS.textSecondary,
    ...FONTS.arabicText,
  },
  highScoreValue: {
    fontSize: scaleFontSize(isSmallDevice ? 28 : 36),
    color: COLORS.inkGold,
    ...FONTS.arabicTitle,
  },
  // Main game styles
  gameContent: {
    flex: 1,
    paddingBottom: getResponsiveSize(SPACING.md, SPACING.sm, SPACING.sm),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: getResponsiveSize(SPACING.lg, SPACING.md, SPACING.md),
    paddingVertical: getResponsiveSize(SPACING.md, SPACING.sm, SPACING.sm),
  },
  titleContainer: {
    alignItems: "center",
  },
  resetButton: {
    width: getResponsiveSize(44, 36, 40),
    height: getResponsiveSize(44, 36, 40),
    borderRadius: getResponsiveSize(22, 18, 20),
    backgroundColor: COLORS.parchmentDark,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.inkGold,
  },
  resetButtonText: {
    fontSize: scaleFontSize(isSmallDevice ? 20 : 24),
    color: COLORS.inkBrown,
  },
  title: {
    fontSize: scaleFontSize(isSmallDevice ? 22 : 28),
    color: COLORS.inkBrown,
    ...FONTS.arabicTitle,
  },
  difficultyBadge: {
    fontSize: scaleFontSize(isSmallDevice ? 10 : 12),
    color: COLORS.inkGold,
    backgroundColor: COLORS.parchmentDark,
    paddingHorizontal: getResponsiveSize(SPACING.sm, SPACING.xs, SPACING.xs),
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: 2,
    overflow: "hidden",
    ...FONTS.arabicText,
  },
  hintButton: {
    width: getResponsiveSize(44, 36, 40),
    height: getResponsiveSize(44, 36, 40),
    borderRadius: getResponsiveSize(22, 18, 20),
    backgroundColor: COLORS.inkGold,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.small,
  },
  hintButtonText: {
    fontSize: scaleFontSize(isSmallDevice ? 18 : 22),
  },
  progressContainer: {
    paddingHorizontal: getResponsiveSize(SPACING.lg, SPACING.md, SPACING.md),
    marginBottom: getResponsiveSize(SPACING.md, SPACING.sm, SPACING.sm),
  },
  progressText: {
    fontSize: scaleFontSize(isSmallDevice ? 12 : 14),
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.xs,
    ...FONTS.arabicText,
  },
  progressBar: {
    height: isSmallDevice ? 6 : 8,
    backgroundColor: COLORS.parchmentDark,
    borderRadius: isSmallDevice ? 3 : 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.inkGold,
    borderRadius: isSmallDevice ? 3 : 4,
  },
  scoreBoardContainer: {
    paddingHorizontal: getResponsiveSize(SPACING.lg, SPACING.md, SPACING.md),
    marginBottom: getResponsiveSize(SPACING.md, SPACING.sm, SPACING.sm),
  },
  wheelContainer: {
    alignItems: "center",
    marginVertical: getResponsiveSize(SPACING.lg, SPACING.md, SPACING.md),
  },
  gridContainer: {
    paddingHorizontal: getResponsiveSize(SPACING.lg, SPACING.md, SPACING.md),
    marginBottom: getResponsiveSize(SPACING.lg, SPACING.md, SPACING.md),
  },
  actionButtons: {
    paddingHorizontal: getResponsiveSize(SPACING.lg, SPACING.md, SPACING.md),
    marginBottom: getResponsiveSize(SPACING.lg, SPACING.md, SPACING.md),
  },
  checkButton: {
    backgroundColor: COLORS.inkGold,
    padding: getResponsiveSize(SPACING.md, SPACING.sm, SPACING.sm),
    borderRadius: BORDER_RADIUS.lg,
    alignItems: "center",
    ...SHADOWS.medium,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  checkButtonText: {
    fontSize: scaleFontSize(isSmallDevice ? 16 : 18),
    color: COLORS.parchment,
    ...FONTS.arabicTitle,
  },
  nextButton: {
    backgroundColor: COLORS.copperAccent,
    padding: getResponsiveSize(SPACING.md, SPACING.sm, SPACING.sm),
    borderRadius: BORDER_RADIUS.lg,
    alignItems: "center",
    ...SHADOWS.medium,
  },
  nextButtonText: {
    fontSize: scaleFontSize(isSmallDevice ? 16 : 18),
    color: COLORS.parchment,
    ...FONTS.arabicTitle,
  },
  scoreBreakdownCompact: {
    paddingHorizontal: getResponsiveSize(SPACING.lg, SPACING.md, SPACING.md),
    alignItems: "center",
  },
  scoreBreakdownText: {
    fontSize: scaleFontSize(isSmallDevice ? 12 : 14),
    color: COLORS.inkBrown,
    ...FONTS.arabicText,
  },
  tapHintText: {
    fontSize: scaleFontSize(isSmallDevice ? 10 : 12),
    color: COLORS.inkGold,
    marginTop: SPACING.xs,
    ...FONTS.arabicText,
  },
  meaningsContainer: {
    margin: getResponsiveSize(SPACING.lg, SPACING.md, SPACING.md),
    padding: getResponsiveSize(SPACING.lg, SPACING.md, SPACING.md),
    backgroundColor: COLORS.parchmentLight,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.inkGold,
  },
  meaningsTitle: {
    fontSize: scaleFontSize(isSmallDevice ? 16 : 18),
    color: COLORS.inkBrown,
    marginBottom: getResponsiveSize(SPACING.md, SPACING.sm, SPACING.sm),
    textAlign: "center",
    ...FONTS.arabicTitle,
  },
  meaningItem: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    marginBottom: SPACING.sm,
    padding: getResponsiveSize(SPACING.sm, SPACING.xs, SPACING.xs),
    backgroundColor: COLORS.parchment,
    borderRadius: BORDER_RADIUS.md,
  },
  meaningRoot: {
    fontSize: scaleFontSize(isSmallDevice ? 18 : 20),
    color: COLORS.inkGold,
    marginLeft: getResponsiveSize(SPACING.md, SPACING.sm, SPACING.sm),
    width: isSmallDevice ? 50 : 60,
    textAlign: "center",
    ...FONTS.arabicLetter,
  },
  meaningContent: {
    flex: 1,
  },
  meaningText: {
    fontSize: scaleFontSize(isSmallDevice ? 12 : 14),
    color: COLORS.textSecondary,
    textAlign: "right",
    ...FONTS.arabicText,
  },
  poetryContainer: {
    marginTop: SPACING.sm,
    padding: getResponsiveSize(SPACING.sm, SPACING.xs, SPACING.xs),
    backgroundColor: COLORS.parchmentDark,
    borderRadius: BORDER_RADIUS.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.inkGold,
  },
  poetryLabel: {
    fontSize: scaleFontSize(isSmallDevice ? 10 : 12),
    color: COLORS.inkGold,
    textAlign: "right",
    marginBottom: SPACING.xs,
    ...FONTS.arabicTitle,
  },
  poetryText: {
    fontSize: scaleFontSize(isSmallDevice ? 11 : 13),
    color: COLORS.inkBrown,
    textAlign: "right",
    lineHeight: isSmallDevice ? 18 : 22,
    fontStyle: "italic",
    ...FONTS.arabicText,
  },
  scoreBreakdown: {
    marginTop: getResponsiveSize(SPACING.md, SPACING.sm, SPACING.sm),
    paddingTop: getResponsiveSize(SPACING.md, SPACING.sm, SPACING.sm),
    borderTopWidth: 1,
    borderTopColor: COLORS.inkGold,
  },
  scoreBreakdownTitle: {
    fontSize: scaleFontSize(isSmallDevice ? 14 : 16),
    color: COLORS.inkBrown,
    marginBottom: SPACING.sm,
    textAlign: "center",
    ...FONTS.arabicText,
  },
  scoreBreakdownItem: {
    fontSize: scaleFontSize(isSmallDevice ? 12 : 14),
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 4,
    ...FONTS.arabicText,
  },
  scoreBreakdownTotal: {
    fontSize: scaleFontSize(isSmallDevice ? 16 : 18),
    color: COLORS.inkGold,
    textAlign: "center",
    marginTop: SPACING.sm,
    ...FONTS.arabicTitle,
  },
  // Level complete styles
  levelCompleteContainer: {
    flexGrow: 1,
    padding: getResponsiveSize(SPACING.xl, SPACING.md, SPACING.lg),
    alignItems: "center",
    justifyContent: "center",
  },
  levelCompleteTitle: {
    fontSize: scaleFontSize(isSmallDevice ? 28 : 36),
    color: COLORS.inkGold,
    textAlign: "center",
    marginBottom: SPACING.sm,
    ...FONTS.arabicTitle,
  },
  levelCompleteSubtitle: {
    fontSize: scaleFontSize(isSmallDevice ? 16 : 18),
    color: COLORS.inkBrown,
    textAlign: "center",
    marginBottom: getResponsiveSize(SPACING.xl, SPACING.lg, SPACING.lg),
    ...FONTS.arabicText,
  },
  levelScoreContainer: {
    alignItems: "center",
    padding: getResponsiveSize(SPACING.lg, SPACING.md, SPACING.md),
    backgroundColor: COLORS.parchmentLight,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.inkGold,
    marginVertical: getResponsiveSize(SPACING.lg, SPACING.md, SPACING.md),
    minWidth: isSmallDevice ? 160 : 200,
  },
  levelScoreLabel: {
    fontSize: scaleFontSize(isSmallDevice ? 14 : 16),
    color: COLORS.textSecondary,
    ...FONTS.arabicText,
  },
  levelScoreValue: {
    fontSize: scaleFontSize(isSmallDevice ? 36 : 48),
    color: COLORS.inkGold,
    ...FONTS.arabicTitle,
  },
  nextLevelButton: {
    backgroundColor: COLORS.inkGold,
    paddingHorizontal: getResponsiveSize(SPACING.xl, SPACING.lg, SPACING.lg),
    paddingVertical: getResponsiveSize(SPACING.md, SPACING.sm, SPACING.sm),
    borderRadius: BORDER_RADIUS.lg,
    marginTop: getResponsiveSize(SPACING.lg, SPACING.md, SPACING.md),
    ...SHADOWS.large,
  },
  nextLevelButtonText: {
    fontSize: scaleFontSize(isSmallDevice ? 18 : 20),
    color: COLORS.parchment,
    ...FONTS.arabicTitle,
  },
  // Pause Modal Styles
  pauseButton: {
    padding: getResponsiveSize(SPACING.sm, SPACING.xs, SPACING.xs),
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.parchmentLight,
    borderWidth: 1,
    borderColor: COLORS.ornamentBorder,
  },
  pauseButtonText: {
    fontSize: scaleFontSize(isSmallDevice ? 18 : 22),
  },
  pauseModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  pauseModalContent: {
    backgroundColor: COLORS.parchment,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: "100%",
    maxWidth: 350,
    borderWidth: 3,
    borderColor: COLORS.inkGold,
    ...SHADOWS.large,
  },
  pauseModalTitle: {
    fontSize: scaleFontSize(26),
    color: COLORS.inkBrown,
    textAlign: "center",
    marginBottom: SPACING.lg,
    ...FONTS.arabicTitle,
  },
  pauseModalStats: {
    backgroundColor: COLORS.parchmentLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.ornamentBorder,
  },
  pauseModalStat: {
    fontSize: scaleFontSize(16),
    color: COLORS.inkBrown,
    textAlign: "center",
    marginVertical: 4,
    ...FONTS.arabicText,
  },
  pauseModalButton: {
    backgroundColor: COLORS.turquoise,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
    ...SHADOWS.medium,
  },
  pauseModalButtonText: {
    fontSize: scaleFontSize(16),
    color: COLORS.textLight,
    textAlign: "center",
    ...FONTS.arabicTitle,
  },
  pauseModalButtonVideo: {
    backgroundColor: COLORS.inkGold,
  },
  pauseModalButtonReset: {
    backgroundColor: COLORS.copperAccent,
  },
  pauseModalButtonQuit: {
    backgroundColor: COLORS.burgundy,
  },
  // Clam popup styles
  clamPopupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  clamPopupCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: COLORS.parchmentLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.inkGold,
  },
  clamPopupEmoji: {
    fontSize: scaleFontSize(36),
    marginBottom: SPACING.sm,
  },
  clamPopupTitle: {
    fontSize: scaleFontSize(18),
    color: COLORS.inkBrown,
    marginBottom: SPACING.xs,
    ...FONTS.arabicTitle,
  },
  clamPopupText: {
    fontSize: scaleFontSize(14),
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.sm,
    ...FONTS.arabicText,
  },
  clamPopupHint: {
    fontSize: scaleFontSize(12),
    color: COLORS.inkGold,
    marginTop: SPACING.xs,
    ...FONTS.arabicText,
  },
  unlockedOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  unlockedContainer: {
    width: "100%",
    maxWidth: 700,
    maxHeight: "80%",
    backgroundColor: COLORS.parchmentLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.inkGold,
  },
  unlockedTitle: {
    fontSize: scaleFontSize(18),
    color: COLORS.inkBrown,
    marginBottom: SPACING.sm,
    textAlign: "center",
    ...FONTS.arabicTitle,
  },
  unlockedEmpty: {
    fontSize: scaleFontSize(14),
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.md,
    ...FONTS.arabicText,
  },
  unlockedCard: {
    backgroundColor: COLORS.parchment,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.ornamentBorder,
  },
  unlockedCardTitle: {
    fontSize: scaleFontSize(16),
    color: COLORS.inkGold,
    marginBottom: SPACING.xs,
    ...FONTS.arabicTitle,
  },
  unlockedCardDesc: {
    fontSize: scaleFontSize(13),
    color: COLORS.inkBrown,
    marginBottom: SPACING.xs,
    ...FONTS.arabicText,
  },
  unlockedCardAnalysis: {
    fontSize: scaleFontSize(12),
    color: COLORS.textSecondary,
    ...FONTS.arabicText,
  },
  exitConfirmText: {
    fontSize: scaleFontSize(16),
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.lg,
    ...FONTS.arabicText,
  },
  exitConfirmButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  exitConfirmButton: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
});
