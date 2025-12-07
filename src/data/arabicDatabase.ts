// Comprehensive Arabic Roots Database with Real Valid Roots
// This is a curated database of real Arabic trilateral roots (جذور ثلاثية)

// All 28 Arabic letters for random generation
export const ARABIC_LETTERS = [
  'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش',
  'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
];

// Letters that work well as first letter (more common in roots)
export const STRONG_FIRST_LETTERS = [
  'ب', 'ت', 'ج', 'ح', 'خ', 'د', 'ر', 'س', 'ش', 'ص', 'ض', 'ط',
  'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و'
];

// Letters that work well as middle letter
export const STRONG_MIDDLE_LETTERS = [
  'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ر', 'ز', 'س', 'ش',
  'ص', 'ط', 'ع', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
];

// Comprehensive database of VALID Arabic trilateral roots
// Each root is a real Arabic root that exists in classical Arabic dictionaries
export const VALID_ARABIC_ROOTS: Record<string, {
  meaning: string;
  meaningEn: string;
  examples: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}> = {
  // ===== EASY ROOTS (Very common, well-known) =====
  'كتب': { meaning: 'الكتابة والتدوين', meaningEn: 'Writing', examples: ['كتاب', 'مكتبة', 'كاتب'], difficulty: 'easy' },
  'علم': { meaning: 'العلم والمعرفة', meaningEn: 'Knowledge', examples: ['عالم', 'معلم', 'تعليم'], difficulty: 'easy' },
  'قرء': { meaning: 'القراءة والتلاوة', meaningEn: 'Reading', examples: ['قارئ', 'قرآن', 'مقرأة'], difficulty: 'easy' },
  'سمع': { meaning: 'السمع والاستماع', meaningEn: 'Hearing', examples: ['سامع', 'مسموع', 'سماعة'], difficulty: 'easy' },
  'نظر': { meaning: 'النظر والرؤية', meaningEn: 'Looking', examples: ['ناظر', 'منظر', 'نظارة'], difficulty: 'easy' },
  'فتح': { meaning: 'الفتح والانفتاح', meaningEn: 'Opening', examples: ['فاتح', 'مفتاح', 'افتتاح'], difficulty: 'easy' },
  'خرج': { meaning: 'الخروج والإخراج', meaningEn: 'Going out', examples: ['خارج', 'مخرج', 'إخراج'], difficulty: 'easy' },
  'دخل': { meaning: 'الدخول والولوج', meaningEn: 'Entering', examples: ['داخل', 'مدخل', 'دخيل'], difficulty: 'easy' },
  'جلس': { meaning: 'الجلوس والقعود', meaningEn: 'Sitting', examples: ['جالس', 'مجلس', 'جلسة'], difficulty: 'easy' },
  'قول': { meaning: 'القول والكلام', meaningEn: 'Speaking', examples: ['قائل', 'مقولة', 'قول'], difficulty: 'easy' },
  'عمل': { meaning: 'العمل والفعل', meaningEn: 'Working', examples: ['عامل', 'معمل', 'عملية'], difficulty: 'easy' },
  'اكل': { meaning: 'الأكل والطعام', meaningEn: 'Eating', examples: ['آكل', 'مأكول', 'أكلة'], difficulty: 'easy' },
  'شرب': { meaning: 'الشرب والارتواء', meaningEn: 'Drinking', examples: ['شارب', 'مشروب', 'شراب'], difficulty: 'easy' },
  'نوم': { meaning: 'النوم والرقاد', meaningEn: 'Sleeping', examples: ['نائم', 'منام', 'نومة'], difficulty: 'easy' },
  'مشي': { meaning: 'المشي والسير', meaningEn: 'Walking', examples: ['ماشي', 'ممشى', 'مشية'], difficulty: 'easy' },
  'ركب': { meaning: 'الركوب والامتطاء', meaningEn: 'Riding', examples: ['راكب', 'مركب', 'ركوب'], difficulty: 'easy' },
  'ضرب': { meaning: 'الضرب والطرق', meaningEn: 'Hitting', examples: ['ضارب', 'مضروب', 'ضربة'], difficulty: 'easy' },
  'حمل': { meaning: 'الحمل والرفع', meaningEn: 'Carrying', examples: ['حامل', 'محمول', 'حمولة'], difficulty: 'easy' },
  'فهم': { meaning: 'الفهم والإدراك', meaningEn: 'Understanding', examples: ['فاهم', 'مفهوم', 'تفاهم'], difficulty: 'easy' },
  'حفظ': { meaning: 'الحفظ والصون', meaningEn: 'Memorizing', examples: ['حافظ', 'محفوظ', 'حفظ'], difficulty: 'easy' },
  
  // ===== MEDIUM ROOTS =====
  'جمع': { meaning: 'الجمع والتجميع', meaningEn: 'Gathering', examples: ['جامع', 'مجموع', 'جماعة'], difficulty: 'medium' },
  'فرق': { meaning: 'التفريق والفصل', meaningEn: 'Separating', examples: ['فارق', 'فرقة', 'تفريق'], difficulty: 'medium' },
  'صبر': { meaning: 'الصبر والتحمل', meaningEn: 'Patience', examples: ['صابر', 'صبور', 'مصابرة'], difficulty: 'medium' },
  'شكر': { meaning: 'الشكر والامتنان', meaningEn: 'Gratitude', examples: ['شاكر', 'شكور', 'مشكور'], difficulty: 'medium' },
  'نصر': { meaning: 'النصر والانتصار', meaningEn: 'Victory', examples: ['ناصر', 'منصور', 'انتصار'], difficulty: 'medium' },
  'حكم': { meaning: 'الحكم والحكمة', meaningEn: 'Ruling/Wisdom', examples: ['حاكم', 'محكمة', 'حكمة'], difficulty: 'medium' },
  'عمر': { meaning: 'العمر والعمارة', meaningEn: 'Life/Building', examples: ['عامر', 'معمار', 'عمارة'], difficulty: 'medium' },
  'زرع': { meaning: 'الزراعة والغرس', meaningEn: 'Planting', examples: ['زارع', 'مزرعة', 'زراعة'], difficulty: 'medium' },
  'صنع': { meaning: 'الصناعة والإنتاج', meaningEn: 'Making', examples: ['صانع', 'مصنع', 'صناعة'], difficulty: 'medium' },
  'قصد': { meaning: 'القصد والنية', meaningEn: 'Intention', examples: ['قاصد', 'مقصد', 'قصد'], difficulty: 'medium' },
  'وصل': { meaning: 'الوصول والاتصال', meaningEn: 'Arriving/Connecting', examples: ['واصل', 'موصل', 'اتصال'], difficulty: 'medium' },
  'فصل': { meaning: 'الفصل والتفريق', meaningEn: 'Separating', examples: ['فاصل', 'مفصل', 'فصيلة'], difficulty: 'medium' },
  'حسب': { meaning: 'الحساب والعد', meaningEn: 'Counting', examples: ['حاسب', 'محسوب', 'حساب'], difficulty: 'medium' },
  'طلب': { meaning: 'الطلب والسؤال', meaningEn: 'Requesting', examples: ['طالب', 'مطلوب', 'طلب'], difficulty: 'medium' },
  'رجع': { meaning: 'الرجوع والعودة', meaningEn: 'Returning', examples: ['راجع', 'مرجع', 'رجوع'], difficulty: 'medium' },
  'وقف': { meaning: 'الوقوف والتوقف', meaningEn: 'Standing/Stopping', examples: ['واقف', 'موقف', 'وقفة'], difficulty: 'medium' },
  'بدء': { meaning: 'البداية والابتداء', meaningEn: 'Beginning', examples: ['بادئ', 'مبدأ', 'بداية'], difficulty: 'medium' },
  'نهي': { meaning: 'النهاية والانتهاء', meaningEn: 'Ending', examples: ['ناهي', 'منتهى', 'نهاية'], difficulty: 'medium' },
  'سفر': { meaning: 'السفر والرحلة', meaningEn: 'Traveling', examples: ['مسافر', 'سفر', 'سفارة'], difficulty: 'medium' },
  'لعب': { meaning: 'اللعب واللهو', meaningEn: 'Playing', examples: ['لاعب', 'ملعب', 'لعبة'], difficulty: 'medium' },
  'درس': { meaning: 'الدراسة والتعلم', meaningEn: 'Studying', examples: ['دارس', 'مدرسة', 'درس'], difficulty: 'medium' },
  'بحث': { meaning: 'البحث والتفتيش', meaningEn: 'Searching', examples: ['باحث', 'مبحث', 'بحث'], difficulty: 'medium' },
  'حرك': { meaning: 'الحركة والتحرك', meaningEn: 'Moving', examples: ['متحرك', 'محرك', 'حركة'], difficulty: 'medium' },
  'سكن': { meaning: 'السكن والإقامة', meaningEn: 'Living/Dwelling', examples: ['ساكن', 'مسكن', 'سكينة'], difficulty: 'medium' },
  'لبس': { meaning: 'اللبس والارتداء', meaningEn: 'Wearing', examples: ['لابس', 'ملبس', 'لباس'], difficulty: 'medium' },
  'غسل': { meaning: 'الغسل والتنظيف', meaningEn: 'Washing', examples: ['غاسل', 'مغسلة', 'غسيل'], difficulty: 'medium' },
  
  // ===== HARD ROOTS =====
  'برك': { meaning: 'البركة والنماء', meaningEn: 'Blessing', examples: ['مبارك', 'بركة', 'تبريك'], difficulty: 'hard' },
  'لحم': { meaning: 'اللحم والالتحام', meaningEn: 'Flesh/Joining', examples: ['لحام', 'ملحمة', 'لحم'], difficulty: 'hard' },
  'برص': { meaning: 'البرص (مرض جلدي)', meaningEn: 'Leprosy', examples: ['أبرص', 'برص'], difficulty: 'hard' },
  'رحم': { meaning: 'الرحمة والعطف', meaningEn: 'Mercy', examples: ['راحم', 'رحيم', 'رحمة'], difficulty: 'hard' },
  'حرم': { meaning: 'التحريم والمنع', meaningEn: 'Forbidding', examples: ['محرم', 'حرام', 'حريم'], difficulty: 'hard' },
  'مرح': { meaning: 'المرح والفرح', meaningEn: 'Joy', examples: ['مرح', 'مراح'], difficulty: 'hard' },
  'فكر': { meaning: 'التفكير والتأمل', meaningEn: 'Thinking', examples: ['مفكر', 'فكرة', 'تفكير'], difficulty: 'hard' },
  'ذكر': { meaning: 'الذكر والتذكر', meaningEn: 'Remembering', examples: ['ذاكر', 'مذكرة', 'تذكير'], difficulty: 'hard' },
  'شعر': { meaning: 'الشعر والإحساس', meaningEn: 'Poetry/Feeling', examples: ['شاعر', 'مشاعر', 'شعور'], difficulty: 'hard' },
  'نثر': { meaning: 'النثر والتفريق', meaningEn: 'Prose/Scattering', examples: ['ناثر', 'منثور', 'نثر'], difficulty: 'hard' },
  'خلق': { meaning: 'الخلق والإبداع', meaningEn: 'Creating', examples: ['خالق', 'مخلوق', 'خلق'], difficulty: 'hard' },
  'رزق': { meaning: 'الرزق والعطاء', meaningEn: 'Provision', examples: ['رازق', 'مرزوق', 'رزق'], difficulty: 'hard' },
  'ملك': { meaning: 'الملك والسلطة', meaningEn: 'Ownership/King', examples: ['مالك', 'ملك', 'مملكة'], difficulty: 'hard' },
  'هلك': { meaning: 'الهلاك والدمار', meaningEn: 'Perishing', examples: ['هالك', 'مهلك', 'هلاك'], difficulty: 'hard' },
  'سلم': { meaning: 'السلام والأمان', meaningEn: 'Peace', examples: ['سالم', 'مسلم', 'سلام'], difficulty: 'hard' },
  'ظلم': { meaning: 'الظلم والجور', meaningEn: 'Injustice', examples: ['ظالم', 'مظلوم', 'ظلم'], difficulty: 'hard' },
  'عدل': { meaning: 'العدل والإنصاف', meaningEn: 'Justice', examples: ['عادل', 'معدل', 'عدالة'], difficulty: 'hard' },
  'حقق': { meaning: 'التحقيق والثبوت', meaningEn: 'Verifying', examples: ['محقق', 'حقيقة', 'تحقيق'], difficulty: 'hard' },
  'صدق': { meaning: 'الصدق والحق', meaningEn: 'Truth', examples: ['صادق', 'مصدق', 'صدق'], difficulty: 'hard' },
  'كذب': { meaning: 'الكذب والافتراء', meaningEn: 'Lying', examples: ['كاذب', 'مكذب', 'كذب'], difficulty: 'hard' },
  'وعد': { meaning: 'الوعد والعهد', meaningEn: 'Promising', examples: ['واعد', 'موعد', 'وعد'], difficulty: 'hard' },
  'نذر': { meaning: 'النذر والتحذير', meaningEn: 'Vowing/Warning', examples: ['ناذر', 'منذر', 'نذير'], difficulty: 'hard' },
  'غفر': { meaning: 'المغفرة والعفو', meaningEn: 'Forgiving', examples: ['غافر', 'مغفور', 'غفران'], difficulty: 'hard' },
  'ستر': { meaning: 'الستر والحجب', meaningEn: 'Covering', examples: ['ساتر', 'مستور', 'ستار'], difficulty: 'hard' },
  'كشف': { meaning: 'الكشف والإظهار', meaningEn: 'Revealing', examples: ['كاشف', 'مكشوف', 'كشف'], difficulty: 'hard' },
  'حجب': { meaning: 'الحجب والمنع', meaningEn: 'Veiling', examples: ['حاجب', 'محجوب', 'حجاب'], difficulty: 'hard' },
  'نور': { meaning: 'النور والإضاءة', meaningEn: 'Light', examples: ['منور', 'نور', 'إنارة'], difficulty: 'hard' },
  'ظهر': { meaning: 'الظهور والبروز', meaningEn: 'Appearing', examples: ['ظاهر', 'مظهر', 'ظهور'], difficulty: 'hard' },
  'بطن': { meaning: 'الباطن والخفاء', meaningEn: 'Hidden/Stomach', examples: ['باطن', 'بطن', 'بطين'], difficulty: 'hard' },
  'قلب': { meaning: 'القلب والتحويل', meaningEn: 'Heart/Flipping', examples: ['قالب', 'مقلوب', 'انقلاب'], difficulty: 'hard' },
  
  // Additional roots for variety
  'جهد': { meaning: 'الجهد والاجتهاد', meaningEn: 'Effort', examples: ['مجتهد', 'جهد', 'اجتهاد'], difficulty: 'medium' },
  'وجد': { meaning: 'الوجود والإيجاد', meaningEn: 'Finding/Existing', examples: ['واجد', 'موجود', 'وجود'], difficulty: 'medium' },
  'ولد': { meaning: 'الولادة والإنجاب', meaningEn: 'Birth', examples: ['والد', 'مولود', 'ولادة'], difficulty: 'easy' },
  'موت': { meaning: 'الموت والوفاة', meaningEn: 'Death', examples: ['ميت', 'موت', 'ممات'], difficulty: 'medium' },
  'حيا': { meaning: 'الحياة والعيش', meaningEn: 'Life', examples: ['حي', 'محيا', 'حياة'], difficulty: 'medium' },
  'صحح': { meaning: 'الصحة والسلامة', meaningEn: 'Health/Correcting', examples: ['صحيح', 'مصحح', 'تصحيح'], difficulty: 'hard' },
  'مرض': { meaning: 'المرض والسقم', meaningEn: 'Illness', examples: ['مريض', 'ممرض', 'مرض'], difficulty: 'medium' },
  'شفي': { meaning: 'الشفاء والعافية', meaningEn: 'Healing', examples: ['شافي', 'مشفى', 'شفاء'], difficulty: 'medium' },
  'طبب': { meaning: 'الطب والعلاج', meaningEn: 'Medicine', examples: ['طبيب', 'مطبب', 'طب'], difficulty: 'medium' },
  'بني': { meaning: 'البناء والتشييد', meaningEn: 'Building', examples: ['باني', 'مبنى', 'بناء'], difficulty: 'easy' },
  'هدم': { meaning: 'الهدم والتخريب', meaningEn: 'Demolishing', examples: ['هادم', 'مهدم', 'هدم'], difficulty: 'medium' },
  'عبد': { meaning: 'العبادة والخضوع', meaningEn: 'Worship', examples: ['عابد', 'معبد', 'عبادة'], difficulty: 'medium' },
  'سجد': { meaning: 'السجود والخشوع', meaningEn: 'Prostrating', examples: ['ساجد', 'مسجد', 'سجود'], difficulty: 'medium' },
  'صلح': { meaning: 'الصلاح والإصلاح', meaningEn: 'Righteousness', examples: ['صالح', 'مصلح', 'إصلاح'], difficulty: 'medium' },
  'فسد': { meaning: 'الفساد والإفساد', meaningEn: 'Corruption', examples: ['فاسد', 'مفسد', 'فساد'], difficulty: 'medium' },
};

// Get all valid roots as a Set for quick lookup
export const VALID_ROOTS_SET = new Set(Object.keys(VALID_ARABIC_ROOTS));

// Function to check if a root is valid
export function isValidRoot(root: string): boolean {
  return VALID_ROOTS_SET.has(root);
}

// Function to get root info
export function getRootInfo(root: string) {
  return VALID_ARABIC_ROOTS[root] || null;
}

// Generate all 6 permutations of 3 letters
export function generateAllPermutations(letters: [string, string, string]): string[] {
  const [a, b, c] = letters;
  return [
    a + b + c,
    a + c + b,
    b + a + c,
    b + c + a,
    c + a + b,
    c + b + a,
  ];
}

// Find valid roots from permutations
export function findValidRoots(letters: [string, string, string]): string[] {
  const permutations = generateAllPermutations(letters);
  return permutations.filter(p => isValidRoot(p));
}

// Get a letter set that has at least one valid root
export function getLettersWithValidRoots(difficulty: 'easy' | 'medium' | 'hard', minValidRoots: number = 1, maxValidRoots: number = 3): [string, string, string] | null {
  // Get roots of the specified difficulty
  const rootsOfDifficulty = Object.entries(VALID_ARABIC_ROOTS)
    .filter(([_, info]) => info.difficulty === difficulty)
    .map(([root]) => root);
  
  if (rootsOfDifficulty.length === 0) return null;
  
  // Try to find a good letter combination
  for (let attempt = 0; attempt < 100; attempt++) {
    const randomRoot = rootsOfDifficulty[Math.floor(Math.random() * rootsOfDifficulty.length)];
    const letters: [string, string, string] = [randomRoot[0], randomRoot[1], randomRoot[2]];
    
    // Shuffle the letters
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    
    const validRoots = findValidRoots(letters);
    if (validRoots.length >= minValidRoots && validRoots.length <= maxValidRoots) {
      return letters;
    }
  }
  
  // Fallback: just return letters from a random root
  const randomRoot = rootsOfDifficulty[Math.floor(Math.random() * rootsOfDifficulty.length)];
  return [randomRoot[0], randomRoot[1], randomRoot[2]];
}

// Get completely random letters (may or may not have valid roots)
export function getRandomLetters(): [string, string, string] {
  const shuffled = [...ARABIC_LETTERS].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1], shuffled[2]];
}
