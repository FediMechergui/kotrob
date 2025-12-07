// Arabic Root (Jidhr) Game Data
// This contains trilateral Arabic roots with their valid combinations

export interface RootData {
  letters: [string, string, string]; // Three Arabic letters
  validRoots: string[]; // Valid combinations that exist in Arabic
  meanings: Record<string, string>; // Meanings for each valid root
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameLevel {
  id: number;
  roots: RootData[];
  proverb: string; // Arabic proverb shown when level is completed
  proverbMeaning: string;
  requiredScore: number;
}

// Generate all 6 permutations of 3 letters
export function generatePermutations(letters: [string, string, string]): string[] {
  const [a, b, c] = letters;
  return [
    a + b + c, // ABC
    a + c + b, // ACB
    b + a + c, // BAC
    b + c + a, // BCA
    c + a + b, // CAB
    c + b + a, // CBA
  ];
}

// Sample Arabic roots data
// In a real app, this would come from an Arabic roots API
export const ARABIC_ROOTS: RootData[] = [
  // Level 1 - Easy roots
  {
    letters: ['ك', 'ت', 'ب'],
    validRoots: ['كتب'],
    meanings: {
      'كتب': 'الكتابة - Writing',
    },
    difficulty: 'easy',
  },
  {
    letters: ['ع', 'ل', 'م'],
    validRoots: ['علم'],
    meanings: {
      'علم': 'العلم والمعرفة - Knowledge',
    },
    difficulty: 'easy',
  },
  {
    letters: ['ق', 'ر', 'ء'],
    validRoots: ['قرء'],
    meanings: {
      'قرء': 'القراءة - Reading',
    },
    difficulty: 'easy',
  },
  {
    letters: ['س', 'م', 'ع'],
    validRoots: ['سمع'],
    meanings: {
      'سمع': 'السمع - Hearing',
    },
    difficulty: 'easy',
  },
  {
    letters: ['ن', 'ظ', 'ر'],
    validRoots: ['نظر'],
    meanings: {
      'نظر': 'النظر والرؤية - Looking',
    },
    difficulty: 'easy',
  },
  // Level 2 - Medium roots
  {
    letters: ['ف', 'ت', 'ح'],
    validRoots: ['فتح'],
    meanings: {
      'فتح': 'الفتح والانفتاح - Opening',
    },
    difficulty: 'medium',
  },
  {
    letters: ['خ', 'ر', 'ج'],
    validRoots: ['خرج'],
    meanings: {
      'خرج': 'الخروج - Going out',
    },
    difficulty: 'medium',
  },
  {
    letters: ['د', 'خ', 'ل'],
    validRoots: ['دخل'],
    meanings: {
      'دخل': 'الدخول - Entering',
    },
    difficulty: 'medium',
  },
  {
    letters: ['ج', 'م', 'ع'],
    validRoots: ['جمع'],
    meanings: {
      'جمع': 'الجمع والتجميع - Gathering',
    },
    difficulty: 'medium',
  },
  {
    letters: ['ف', 'ر', 'ق'],
    validRoots: ['فرق'],
    meanings: {
      'فرق': 'التفريق والفرق - Separation',
    },
    difficulty: 'medium',
  },
  // Level 3 - Harder roots with multiple valid forms
  {
    letters: ['ح', 'م', 'ل'],
    validRoots: ['حمل', 'لحم'],
    meanings: {
      'حمل': 'الحمل والحمولة - Carrying',
      'لحم': 'اللحم - Meat/Flesh',
    },
    difficulty: 'hard',
  },
  {
    letters: ['ب', 'ر', 'ك'],
    validRoots: ['برك', 'ركب'],
    meanings: {
      'برك': 'البركة والتبريك - Blessing',
      'ركب': 'الركوب - Riding',
    },
    difficulty: 'hard',
  },
  {
    letters: ['ص', 'ب', 'ر'],
    validRoots: ['صبر', 'برص'],
    meanings: {
      'صبر': 'الصبر - Patience',
      'برص': 'البرص (مرض) - Leprosy',
    },
    difficulty: 'hard',
  },
  {
    letters: ['ن', 'ص', 'ر'],
    validRoots: ['نصر'],
    meanings: {
      'نصر': 'النصر والانتصار - Victory',
    },
    difficulty: 'hard',
  },
  {
    letters: ['ش', 'ك', 'ر'],
    validRoots: ['شكر'],
    meanings: {
      'شكر': 'الشكر والامتنان - Gratitude',
    },
    difficulty: 'hard',
  },
  // Additional roots
  {
    letters: ['ع', 'م', 'ر'],
    validRoots: ['عمر'],
    meanings: {
      'عمر': 'العمر والعمارة - Life/Building',
    },
    difficulty: 'medium',
  },
  {
    letters: ['ز', 'ر', 'ع'],
    validRoots: ['زرع'],
    meanings: {
      'زرع': 'الزراعة - Planting',
    },
    difficulty: 'easy',
  },
  {
    letters: ['ص', 'ن', 'ع'],
    validRoots: ['صنع'],
    meanings: {
      'صنع': 'الصناعة - Making/Manufacturing',
    },
    difficulty: 'medium',
  },
  {
    letters: ['ح', 'ك', 'م'],
    validRoots: ['حكم'],
    meanings: {
      'حكم': 'الحكم والحكمة - Ruling/Wisdom',
    },
    difficulty: 'medium',
  },
  {
    letters: ['ق', 'ص', 'د'],
    validRoots: ['قصد'],
    meanings: {
      'قصد': 'القصد والمقصود - Intention',
    },
    difficulty: 'hard',
  },
];

// Arabic Proverbs for level completion
export const ARABIC_PROVERBS = [
  {
    text: 'العِلمُ في الصِّغَرِ كالنَّقشِ في الحَجَر',
    meaning: 'Learning in youth is like carving in stone',
  },
  {
    text: 'مَن جَدَّ وَجَد',
    meaning: 'Whoever strives shall find (success)',
  },
  {
    text: 'الصَّبرُ مِفتاحُ الفَرَج',
    meaning: 'Patience is the key to relief',
  },
  {
    text: 'خَيرُ الكَلامِ ما قَلَّ وَدَلّ',
    meaning: 'The best speech is that which is brief and meaningful',
  },
  {
    text: 'إذا هَبَّت رِياحُكَ فَاغتَنِمها',
    meaning: 'When your winds blow, seize the opportunity',
  },
  {
    text: 'العَقلُ زِينَة',
    meaning: 'The mind is an adornment',
  },
  {
    text: 'الكِتابُ خَيرُ جَليس',
    meaning: 'A book is the best companion',
  },
  {
    text: 'رُبَّ أَخٍ لَكَ لَم تَلِدهُ أُمُّك',
    meaning: 'Perhaps you have a brother whom your mother did not bear',
  },
  {
    text: 'اليَدُ الواحِدَةُ لا تُصَفِّق',
    meaning: 'One hand cannot clap (cooperation is needed)',
  },
  {
    text: 'أَدِّب ابنَكَ صَغيراً يَنفَعُكَ كَبيراً',
    meaning: 'Educate your son while young, he will benefit you when old',
  },
];

// Arabic grammar rules for hints
export const ARABIC_RULES = [
  {
    title: 'الجذر الثلاثي',
    text: 'الجذر الثلاثي هو أصل الكلمة في اللغة العربية، ومنه تُشتق الكلمات',
    meaning: 'The trilateral root is the origin of words in Arabic, from which words are derived',
  },
  {
    title: 'الميزان الصرفي',
    text: 'الميزان الصرفي هو فَعَلَ للأفعال الثلاثية',
    meaning: 'The morphological scale is fa-ʿa-la for trilateral verbs',
  },
  {
    title: 'الاشتقاق',
    text: 'الاشتقاق هو أخذ كلمة من كلمة أخرى',
    meaning: 'Derivation is taking one word from another',
  },
  {
    title: 'الأوزان',
    text: 'للأفعال والأسماء أوزان معينة في اللغة العربية',
    meaning: 'Verbs and nouns have specific patterns in Arabic',
  },
];

// Game Levels
export const GAME_LEVELS: GameLevel[] = [
  {
    id: 1,
    roots: ARABIC_ROOTS.filter(r => r.difficulty === 'easy').slice(0, 3),
    proverb: ARABIC_PROVERBS[0].text,
    proverbMeaning: ARABIC_PROVERBS[0].meaning,
    requiredScore: 100,
  },
  {
    id: 2,
    roots: ARABIC_ROOTS.filter(r => r.difficulty === 'easy').slice(2, 5),
    proverb: ARABIC_PROVERBS[1].text,
    proverbMeaning: ARABIC_PROVERBS[1].meaning,
    requiredScore: 150,
  },
  {
    id: 3,
    roots: ARABIC_ROOTS.filter(r => r.difficulty === 'medium').slice(0, 3),
    proverb: ARABIC_PROVERBS[2].text,
    proverbMeaning: ARABIC_PROVERBS[2].meaning,
    requiredScore: 200,
  },
  {
    id: 4,
    roots: ARABIC_ROOTS.filter(r => r.difficulty === 'medium').slice(2, 5),
    proverb: ARABIC_PROVERBS[3].text,
    proverbMeaning: ARABIC_PROVERBS[3].meaning,
    requiredScore: 250,
  },
  {
    id: 5,
    roots: ARABIC_ROOTS.filter(r => r.difficulty === 'hard').slice(0, 3),
    proverb: ARABIC_PROVERBS[4].text,
    proverbMeaning: ARABIC_PROVERBS[4].meaning,
    requiredScore: 350,
  },
  {
    id: 6,
    roots: ARABIC_ROOTS.filter(r => r.difficulty === 'hard').slice(2, 5),
    proverb: ARABIC_PROVERBS[5].text,
    proverbMeaning: ARABIC_PROVERBS[5].meaning,
    requiredScore: 400,
  },
  {
    id: 7,
    roots: [...ARABIC_ROOTS.filter(r => r.difficulty === 'easy').slice(0, 1),
            ...ARABIC_ROOTS.filter(r => r.difficulty === 'medium').slice(0, 1),
            ...ARABIC_ROOTS.filter(r => r.difficulty === 'hard').slice(0, 1)],
    proverb: ARABIC_PROVERBS[6].text,
    proverbMeaning: ARABIC_PROVERBS[6].meaning,
    requiredScore: 300,
  },
  {
    id: 8,
    roots: ARABIC_ROOTS.slice(15, 18),
    proverb: ARABIC_PROVERBS[7].text,
    proverbMeaning: ARABIC_PROVERBS[7].meaning,
    requiredScore: 350,
  },
  {
    id: 9,
    roots: ARABIC_ROOTS.slice(17, 20),
    proverb: ARABIC_PROVERBS[8].text,
    proverbMeaning: ARABIC_PROVERBS[8].meaning,
    requiredScore: 400,
  },
  {
    id: 10,
    roots: ARABIC_ROOTS.slice(0, 3),
    proverb: ARABIC_PROVERBS[9].text,
    proverbMeaning: ARABIC_PROVERBS[9].meaning,
    requiredScore: 500,
  },
];
