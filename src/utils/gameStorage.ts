import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  // Player info
  PLAYER_NAME: '@kotrob_player_name',
  FIRST_LAUNCH: '@kotrob_first_launch',
  
  // Global scores
  TOTAL_SCORE: '@kotrob_total_score',
  TOTAL_STREAK: '@kotrob_total_streak',
  
  // Roots game state
  ROOTS_PROGRESS: '@kotrob_roots_progress',
  ROOTS_HIGH_SCORE: '@kotrob_roots_high_score',
  ROOTS_COMPLETED_LEVELS: '@kotrob_roots_completed_levels',
  
  // Qutrab game state
  QUTRAB_PROGRESS: '@kotrob_qutrab_progress',
  QUTRAB_HIGH_SCORE: '@kotrob_qutrab_high_score',
  
  // Video rewards
  UNLOCKED_VIDEOS: '@kotrob_unlocked_videos',
  WATCHED_VIDEOS: '@kotrob_watched_videos',
  
  // Settings
  SETTINGS: '@kotrob_settings',
};

// ============ PLAYER INFO ============

export interface PlayerInfo {
  name: string;
  firstLaunchDate: string;
  lastPlayDate: string;
}

export async function isFirstLaunch(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
    return value === null;
  } catch (error) {
    console.error('Error checking first launch:', error);
    return true;
  }
}

export async function setFirstLaunchComplete(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, new Date().toISOString());
  } catch (error) {
    console.error('Error setting first launch:', error);
  }
}

export async function savePlayerName(name: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PLAYER_NAME, name);
    await setFirstLaunchComplete();
  } catch (error) {
    console.error('Error saving player name:', error);
  }
}

export async function getPlayerName(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.PLAYER_NAME);
  } catch (error) {
    console.error('Error getting player name:', error);
    return null;
  }
}

// ============ GLOBAL SCORES ============

export interface GlobalScore {
  totalScore: number;
  totalStreak: number;
  rootsHighScore: number;
  qutrabHighScore: number;
}

export async function getGlobalScore(): Promise<GlobalScore> {
  try {
    const [totalScore, totalStreak, rootsHigh, qutrabHigh] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.TOTAL_SCORE),
      AsyncStorage.getItem(STORAGE_KEYS.TOTAL_STREAK),
      AsyncStorage.getItem(STORAGE_KEYS.ROOTS_HIGH_SCORE),
      AsyncStorage.getItem(STORAGE_KEYS.QUTRAB_HIGH_SCORE),
    ]);
    
    return {
      totalScore: totalScore ? parseInt(totalScore, 10) : 0,
      totalStreak: totalStreak ? parseInt(totalStreak, 10) : 0,
      rootsHighScore: rootsHigh ? parseInt(rootsHigh, 10) : 0,
      qutrabHighScore: qutrabHigh ? parseInt(qutrabHigh, 10) : 0,
    };
  } catch (error) {
    console.error('Error getting global score:', error);
    return { totalScore: 0, totalStreak: 0, rootsHighScore: 0, qutrabHighScore: 0 };
  }
}

export async function addToTotalScore(points: number): Promise<number> {
  try {
    const current = await AsyncStorage.getItem(STORAGE_KEYS.TOTAL_SCORE);
    const newTotal = (current ? parseInt(current, 10) : 0) + points;
    await AsyncStorage.setItem(STORAGE_KEYS.TOTAL_SCORE, newTotal.toString());
    return newTotal;
  } catch (error) {
    console.error('Error adding to total score:', error);
    return 0;
  }
}

export async function updateStreak(newStreak: number): Promise<void> {
  try {
    const current = await AsyncStorage.getItem(STORAGE_KEYS.TOTAL_STREAK);
    const currentStreak = current ? parseInt(current, 10) : 0;
    if (newStreak > currentStreak) {
      await AsyncStorage.setItem(STORAGE_KEYS.TOTAL_STREAK, newStreak.toString());
    }
  } catch (error) {
    console.error('Error updating streak:', error);
  }
}

// ============ ROOTS GAME PROGRESS ============

export interface RootsGameProgress {
  currentLevel: number;
  currentRound: number;
  score: number;
  streak: number;
  completedLevels: string[];
  isPaused: boolean;
  lastPlayedDate: string;
}

const DEFAULT_ROOTS_PROGRESS: RootsGameProgress = {
  currentLevel: 0,
  currentRound: 0,
  score: 0,
  streak: 0,
  completedLevels: [],
  isPaused: false,
  lastPlayedDate: '',
};

export async function saveRootsProgress(progress: Partial<RootsGameProgress>): Promise<void> {
  try {
    const current = await getRootsProgress();
    const updated = { 
      ...current, 
      ...progress, 
      lastPlayedDate: new Date().toISOString() 
    };
    await AsyncStorage.setItem(STORAGE_KEYS.ROOTS_PROGRESS, JSON.stringify(updated));
    
    // Update high score if needed
    if (progress.score !== undefined) {
      const currentHigh = await AsyncStorage.getItem(STORAGE_KEYS.ROOTS_HIGH_SCORE);
      const highScore = currentHigh ? parseInt(currentHigh, 10) : 0;
      if (progress.score > highScore) {
        await AsyncStorage.setItem(STORAGE_KEYS.ROOTS_HIGH_SCORE, progress.score.toString());
      }
    }
    
    // Update completed levels
    if (progress.completedLevels) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.ROOTS_COMPLETED_LEVELS, 
        JSON.stringify(progress.completedLevels)
      );
    }
  } catch (error) {
    console.error('Error saving roots progress:', error);
  }
}

export async function getRootsProgress(): Promise<RootsGameProgress> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ROOTS_PROGRESS);
    if (value) {
      return { ...DEFAULT_ROOTS_PROGRESS, ...JSON.parse(value) };
    }
    return DEFAULT_ROOTS_PROGRESS;
  } catch (error) {
    console.error('Error getting roots progress:', error);
    return DEFAULT_ROOTS_PROGRESS;
  }
}

export async function clearRootsProgress(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ROOTS_PROGRESS, JSON.stringify(DEFAULT_ROOTS_PROGRESS));
  } catch (error) {
    console.error('Error clearing roots progress:', error);
  }
}

export async function getRootsCompletedLevels(): Promise<string[]> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ROOTS_COMPLETED_LEVELS);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Error getting completed levels:', error);
    return [];
  }
}

export async function getRootsHighScore(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ROOTS_HIGH_SCORE);
    return value ? parseInt(value, 10) : 0;
  } catch (error) {
    console.error('Error getting roots high score:', error);
    return 0;
  }
}

// ============ QUTRAB GAME PROGRESS ============

export interface QutrabGameProgress {
  difficulty: 'easy' | 'medium' | 'hard';
  currentLevel: number;
  roundInLevel: number;
  score: number;
  streak: number;
  isPaused: boolean;
  lastPlayedDate: string;
}

const DEFAULT_QUTRAB_PROGRESS: QutrabGameProgress = {
  difficulty: 'easy',
  currentLevel: 1,
  roundInLevel: 0,
  score: 0,
  streak: 0,
  isPaused: false,
  lastPlayedDate: '',
};

export async function saveQutrabProgress(progress: Partial<QutrabGameProgress>): Promise<void> {
  try {
    const current = await getQutrabProgress();
    const updated = { 
      ...current, 
      ...progress, 
      lastPlayedDate: new Date().toISOString() 
    };
    await AsyncStorage.setItem(STORAGE_KEYS.QUTRAB_PROGRESS, JSON.stringify(updated));
    
    // Update high score if needed
    if (progress.score !== undefined) {
      const currentHigh = await AsyncStorage.getItem(STORAGE_KEYS.QUTRAB_HIGH_SCORE);
      const highScore = currentHigh ? parseInt(currentHigh, 10) : 0;
      if (progress.score > highScore) {
        await AsyncStorage.setItem(STORAGE_KEYS.QUTRAB_HIGH_SCORE, progress.score.toString());
      }
    }
  } catch (error) {
    console.error('Error saving qutrab progress:', error);
  }
}

export async function getQutrabProgress(): Promise<QutrabGameProgress> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.QUTRAB_PROGRESS);
    if (value) {
      return { ...DEFAULT_QUTRAB_PROGRESS, ...JSON.parse(value) };
    }
    return DEFAULT_QUTRAB_PROGRESS;
  } catch (error) {
    console.error('Error getting qutrab progress:', error);
    return DEFAULT_QUTRAB_PROGRESS;
  }
}

export async function clearQutrabProgress(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.QUTRAB_PROGRESS, JSON.stringify(DEFAULT_QUTRAB_PROGRESS));
  } catch (error) {
    console.error('Error clearing qutrab progress:', error);
  }
}

export async function getQutrabHighScore(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.QUTRAB_HIGH_SCORE);
    return value ? parseInt(value, 10) : 0;
  } catch (error) {
    console.error('Error getting qutrab high score:', error);
    return 0;
  }
}

// ============ VIDEO REWARDS ============

export interface VideoInfo {
  id: string;
  filename: string;
  unlockedDate: string;
  watchCount: number;
}

export async function getUnlockedVideos(): Promise<VideoInfo[]> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.UNLOCKED_VIDEOS);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Error getting unlocked videos:', error);
    return [];
  }
}

export async function unlockVideo(filename: string): Promise<void> {
  try {
    const unlocked = await getUnlockedVideos();
    const exists = unlocked.find(v => v.filename === filename);
    
    if (!exists) {
      const newVideo: VideoInfo = {
        id: Date.now().toString(),
        filename,
        unlockedDate: new Date().toISOString(),
        watchCount: 1,
      };
      unlocked.push(newVideo);
      await AsyncStorage.setItem(STORAGE_KEYS.UNLOCKED_VIDEOS, JSON.stringify(unlocked));
    }
  } catch (error) {
    console.error('Error unlocking video:', error);
  }
}

export async function isVideoUnlocked(filename: string): Promise<boolean> {
  try {
    const unlocked = await getUnlockedVideos();
    return unlocked.some(v => v.filename === filename);
  } catch (error) {
    console.error('Error checking video unlock:', error);
    return false;
  }
}

export async function incrementVideoWatchCount(filename: string): Promise<void> {
  try {
    const unlocked = await getUnlockedVideos();
    const video = unlocked.find(v => v.filename === filename);
    if (video) {
      video.watchCount += 1;
      await AsyncStorage.setItem(STORAGE_KEYS.UNLOCKED_VIDEOS, JSON.stringify(unlocked));
    }
  } catch (error) {
    console.error('Error incrementing watch count:', error);
  }
}

// ============ SETTINGS ============

export interface GameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  language: 'ar' | 'en';
}

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
  language: 'ar',
};

export async function saveSettings(settings: Partial<GameSettings>): Promise<void> {
  try {
    const current = await getSettings();
    const updated = { ...current, ...settings };
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

export async function getSettings(): Promise<GameSettings> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return value ? { ...DEFAULT_SETTINGS, ...JSON.parse(value) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting settings:', error);
    return DEFAULT_SETTINGS;
  }
}

// ============ UTILITY ============

export async function resetAllGameData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error resetting all data:', error);
  }
}

export async function hasActiveGame(gameType: 'roots' | 'qutrab'): Promise<boolean> {
  try {
    if (gameType === 'roots') {
      const progress = await getRootsProgress();
      return progress.isPaused && progress.score > 0;
    } else {
      const progress = await getQutrabProgress();
      return progress.isPaused && progress.score > 0;
    }
  } catch (error) {
    return false;
  }
}
