import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  HIGH_SCORE: '@jidhr_game_high_score',
  COMPLETED_LEVELS: '@jidhr_game_completed_levels',
  TOTAL_SCORE: '@jidhr_game_total_score',
  SETTINGS: '@jidhr_game_settings',
};

export interface GameProgress {
  highScore: number;
  completedLevels: string[];
  totalScore: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

const DEFAULT_PROGRESS: GameProgress = {
  highScore: 0,
  completedLevels: [],
  totalScore: 0,
};

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
};

// Save high score
export async function saveHighScore(score: number): Promise<void> {
  try {
    const currentHigh = await getHighScore();
    if (score > currentHigh) {
      await AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
    }
  } catch (error) {
    console.error('Error saving high score:', error);
  }
}

// Get high score
export async function getHighScore(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
    return value ? parseInt(value, 10) : 0;
  } catch (error) {
    console.error('Error getting high score:', error);
    return 0;
  }
}

// Save completed level
export async function saveCompletedLevel(levelId: string | number): Promise<void> {
  try {
    const completedLevels = await getCompletedLevels();
    const levelIdStr = levelId.toString();
    if (!completedLevels.includes(levelIdStr)) {
      completedLevels.push(levelIdStr);
      await AsyncStorage.setItem(
        STORAGE_KEYS.COMPLETED_LEVELS,
        JSON.stringify(completedLevels)
      );
    }
  } catch (error) {
    console.error('Error saving completed level:', error);
  }
}

// Get completed levels
export async function getCompletedLevels(): Promise<string[]> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_LEVELS);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Error getting completed levels:', error);
    return [];
  }
}

// Save game progress
export async function saveGameProgress(progress: Partial<GameProgress>): Promise<void> {
  try {
    const current = await getGameProgress();
    const updated = { ...current, ...progress };
    
    if (progress.highScore !== undefined) {
      await saveHighScore(progress.highScore);
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.TOTAL_SCORE, updated.totalScore.toString());
  } catch (error) {
    console.error('Error saving game progress:', error);
  }
}

// Get game progress
export async function getGameProgress(): Promise<GameProgress> {
  try {
    const [highScore, completedLevels, totalScore] = await Promise.all([
      getHighScore(),
      getCompletedLevels(),
      AsyncStorage.getItem(STORAGE_KEYS.TOTAL_SCORE),
    ]);
    
    return {
      highScore,
      completedLevels,
      totalScore: totalScore ? parseInt(totalScore, 10) : 0,
    };
  } catch (error) {
    console.error('Error getting game progress:', error);
    return DEFAULT_PROGRESS;
  }
}

// Save settings
export async function saveSettings(settings: Partial<GameSettings>): Promise<void> {
  try {
    const current = await getSettings();
    const updated = { ...current, ...settings };
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

// Get settings
export async function getSettings(): Promise<GameSettings> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return value ? JSON.parse(value) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting settings:', error);
    return DEFAULT_SETTINGS;
  }
}

// Reset all data
export async function resetAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error resetting data:', error);
  }
}
