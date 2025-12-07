import { RootData, generatePermutations } from '../data/arabicRoots';

export interface GameState {
  currentRootIndex: number;
  currentLetters: [string, string, string];
  selectedRoots: Set<string>;
  revealedRoots: boolean;
  score: number;
  streak: number;
  hintsUsed: number;
  roundScore: number;
}

export interface RoundResult {
  correctSelected: number;
  incorrectSelected: number;
  missed: number;
  pointsEarned: number;
  streakBonus: number;
}

// Points configuration
const POINTS = {
  CORRECT_ROOT: 50,
  INCORRECT_ROOT: -25,
  MISSED_ROOT: -10,
  STREAK_BONUS: 10,
  HINT_COST: 10,
  PERFECT_ROUND_BONUS: 100,
};

// Rotate letters (shift left)
export function rotateLetters(letters: [string, string, string]): [string, string, string] {
  return [letters[1], letters[2], letters[0]];
}

// Calculate round score
export function calculateRoundScore(
  rootData: RootData,
  selectedRoots: Set<string>,
  currentStreak: number
): RoundResult {
  const allPermutations = generatePermutations(rootData.letters);
  const validRoots = new Set(rootData.validRoots);
  
  let correctSelected = 0;
  let incorrectSelected = 0;
  let missed = 0;
  
  // Check selected roots
  selectedRoots.forEach(root => {
    if (validRoots.has(root)) {
      correctSelected++;
    } else {
      incorrectSelected++;
    }
  });
  
  // Check missed valid roots
  validRoots.forEach(root => {
    if (!selectedRoots.has(root)) {
      missed++;
    }
  });
  
  // Calculate points
  let pointsEarned = 0;
  pointsEarned += correctSelected * POINTS.CORRECT_ROOT;
  pointsEarned += incorrectSelected * POINTS.INCORRECT_ROOT;
  pointsEarned += missed * POINTS.MISSED_ROOT;
  
  // Streak bonus
  let streakBonus = 0;
  if (correctSelected > 0 && incorrectSelected === 0 && missed === 0) {
    // Perfect round
    streakBonus = (currentStreak + 1) * POINTS.STREAK_BONUS;
    pointsEarned += POINTS.PERFECT_ROUND_BONUS;
  }
  
  return {
    correctSelected,
    incorrectSelected,
    missed,
    pointsEarned: Math.max(pointsEarned, 0), // Don't go negative
    streakBonus,
  };
}

// Check if level is complete
export function isLevelComplete(
  totalScore: number,
  requiredScore: number,
  currentRootIndex: number,
  totalRoots: number
): boolean {
  return currentRootIndex >= totalRoots - 1 || totalScore >= requiredScore;
}

// Generate hints for current root
export function generateHints(rootData: RootData): { title: string; text: string; meaning?: string }[] {
  const hints: { title: string; text: string; meaning?: string }[] = [];
  
  // Hint 1: Number of valid roots
  hints.push({
    title: 'عدد الجذور الصحيحة',
    text: `يوجد ${rootData.validRoots.length} جذر/جذور صحيحة من بين الستة`,
  });
  
  // Hint 2: Difficulty level
  const difficultyArabic = {
    easy: 'سهل',
    medium: 'متوسط',
    hard: 'صعب',
  };
  hints.push({
    title: 'مستوى الصعوبة',
    text: `هذا السؤال من المستوى ${difficultyArabic[rootData.difficulty]}`,
  });
  
  // Hint 3: First letter of a valid root
  if (rootData.validRoots.length > 0) {
    const firstRoot = rootData.validRoots[0];
    hints.push({
      title: 'الحرف الأول',
      text: `أحد الجذور الصحيحة يبدأ بحرف "${firstRoot[0]}"`,
    });
  }
  
  // Hint 4: Meaning hint
  if (rootData.validRoots.length > 0) {
    const firstRoot = rootData.validRoots[0];
    const meaning = rootData.meanings[firstRoot];
    if (meaning) {
      hints.push({
        title: 'معنى الجذر',
        text: meaning,
      });
    }
  }
  
  return hints;
}

// Initialize game state for a root
export function initializeRound(rootData: RootData): Partial<GameState> {
  return {
    currentLetters: [...rootData.letters] as [string, string, string],
    selectedRoots: new Set(),
    revealedRoots: false,
    roundScore: 0,
  };
}
