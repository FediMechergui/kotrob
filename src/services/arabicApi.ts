// Arabic Roots Validation API Service
// This service provides word validation using multiple approaches

import { 
  isValidRoot, 
  getRootInfo, 
  findValidRoots,
  getLettersWithValidRoots,
  getRandomLetters,
  VALID_ARABIC_ROOTS,
  generateAllPermutations,
} from '../data/arabicDatabase';

// Types
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface RootValidationResult {
  root: string;
  isValid: boolean;
  meaning?: string;
  meaningEn?: string;
  examples?: string[];
  difficulty?: Difficulty;
}

export interface LetterSetResult {
  letters: [string, string, string];
  validRoots: RootValidationResult[];
  totalPermutations: string[];
}

export interface RoundData {
  letters: [string, string, string];
  permutations: string[];
  validRoots: string[];
  meanings: { [key: string]: string };
}

// Arabic proverbs for level completion
export const ARABIC_PROVERBS = [
  { text: 'العلم نور والجهل ظلام', meaning: 'العلم يضيء طريق الإنسان بينما الجهل يحجب الرؤية' },
  { text: 'من جد وجد ومن زرع حصد', meaning: 'من يعمل بجد يحقق ما يريد' },
  { text: 'الصبر مفتاح الفرج', meaning: 'الصبر يؤدي إلى النجاح والراحة' },
  { text: 'القلم أقوى من السيف', meaning: 'الكلمة والعلم أقوى من القوة' },
  { text: 'خير الكلام ما قل ودل', meaning: 'أفضل الكلام المختصر المعبر' },
  { text: 'اطلبوا العلم ولو في الصين', meaning: 'اسعوا للعلم مهما كان بعيداً' },
  { text: 'العقل السليم في الجسم السليم', meaning: 'صحة الجسم تؤثر على صحة العقل' },
  { text: 'الحكمة ضالة المؤمن', meaning: 'المؤمن يبحث عن الحكمة أينما وجدها' },
  { text: 'رب كلمة قالت لصاحبها دعني', meaning: 'الكلمة لها تأثير كبير' },
  { text: 'اللغة العربية بحر لا ينضب', meaning: 'اللغة العربية غنية جداً بمفرداتها' },
];

// Generate round data for a specific difficulty
export function generateRoundData(difficulty: Difficulty): RoundData {
  // Get letters that have valid roots
  let letters = getLettersWithValidRoots(difficulty, 1, difficulty === 'hard' ? 4 : 3);
  
  // Fallback to random letters if needed
  if (!letters) {
    letters = getRandomLetters();
  }
  
  const permutations = generateAllPermutations(letters);
  const validRootsList = findValidRoots(letters);
  
  // Build meanings dictionary
  const meanings: { [key: string]: string } = {};
  validRootsList.forEach((root: string) => {
    const info = getRootInfo(root);
    if (info) {
      meanings[root] = info.meaning;
    }
  });
  
  return {
    letters,
    permutations,
    validRoots: validRootsList,
    meanings,
  };
}

// Validate a single root
export async function validateRoot(root: string): Promise<RootValidationResult> {
  // Check against our database
  const info = getRootInfo(root);
  
  if (info) {
    return {
      root,
      isValid: true,
      meaning: info.meaning,
      meaningEn: info.meaningEn,
      examples: info.examples,
      difficulty: info.difficulty,
    };
  }
  
  return {
    root,
    isValid: false,
  };
}

// Validate multiple roots
export async function validateRoots(roots: string[]): Promise<RootValidationResult[]> {
  return Promise.all(roots.map(root => validateRoot(root)));
}

// Get a letter set for a specific difficulty level
export async function getLetterSetForDifficulty(
  difficulty: 'easy' | 'medium' | 'hard'
): Promise<LetterSetResult> {
  // Define constraints based on difficulty
  const constraints = {
    easy: { minValidRoots: 1, maxValidRoots: 2 },
    medium: { minValidRoots: 1, maxValidRoots: 3 },
    hard: { minValidRoots: 1, maxValidRoots: 4 },
  };
  
  const { minValidRoots, maxValidRoots } = constraints[difficulty];
  
  // Get letters that have valid roots
  let letters = getLettersWithValidRoots(difficulty, minValidRoots, maxValidRoots);
  
  // If no good set found, get random letters
  if (!letters) {
    letters = getRandomLetters();
  }
  
  const totalPermutations = generateAllPermutations(letters);
  const validRootStrings = findValidRoots(letters);
  const validRoots = await validateRoots(validRootStrings);
  
  return {
    letters,
    validRoots,
    totalPermutations,
  };
}

// Get a completely new random letter set (for rotation)
export async function getNewRandomLetterSet(): Promise<LetterSetResult> {
  // Try to get letters with at least one valid root
  for (let attempt = 0; attempt < 50; attempt++) {
    const letters = getRandomLetters();
    const validRootStrings = findValidRoots(letters);
    
    if (validRootStrings.length > 0 && validRootStrings.length <= 4) {
      const validRoots = await validateRoots(validRootStrings);
      return {
        letters,
        validRoots,
        totalPermutations: generateAllPermutations(letters),
      };
    }
  }
  
  // Fallback: use easy difficulty
  return getLetterSetForDifficulty('easy');
}

// Get letter sets for a full level
export async function getLevelLetterSets(
  level: number,
  questionsPerLevel: number = 5
): Promise<LetterSetResult[]> {
  const letterSets: LetterSetResult[] = [];
  
  // Determine difficulty based on level
  let difficulty: 'easy' | 'medium' | 'hard';
  if (level <= 3) {
    difficulty = 'easy';
  } else if (level <= 6) {
    difficulty = 'medium';
  } else {
    difficulty = 'hard';
  }
  
  // Generate unique letter sets
  const usedLetterCombos = new Set<string>();
  
  for (let i = 0; i < questionsPerLevel; i++) {
    let letterSet: LetterSetResult;
    let attempts = 0;
    
    do {
      letterSet = await getLetterSetForDifficulty(difficulty);
      attempts++;
    } while (
      usedLetterCombos.has(letterSet.letters.join('')) && 
      attempts < 20
    );
    
    usedLetterCombos.add(letterSet.letters.join(''));
    letterSets.push(letterSet);
  }
  
  return letterSets;
}

// External API integration (for future use when a good API is available)
// This is a placeholder that can be connected to a real Arabic dictionary API
export async function validateRootExternal(root: string): Promise<RootValidationResult | null> {
  try {
    // Placeholder for external API
    // In the future, this could connect to:
    // - Arabic morphological analyzers
    // - Dictionary APIs
    // - NLP services
    
    // For now, fall back to local database
    return validateRoot(root);
  } catch (error) {
    console.error('External API error:', error);
    return null;
  }
}

// Get statistics about the database
export function getDatabaseStats() {
  const stats = {
    totalRoots: Object.keys(VALID_ARABIC_ROOTS).length,
    byDifficulty: {
      easy: 0,
      medium: 0,
      hard: 0,
    },
  };
  
  Object.values(VALID_ARABIC_ROOTS).forEach(info => {
    stats.byDifficulty[info.difficulty]++;
  });
  
  return stats;
}
