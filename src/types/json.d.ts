// Type declarations for JSON imports
declare module '*.json' {
  const value: unknown;
  export default value;
}

// Specific type for ابدذر.json
declare module '../../ابدذر.json' {
  interface ArabicRoot {
    'الجذر': string;
    'الشرح المختصر': string;
    'التلميح'?: string;
    'الأمثلة الشعرية'?: string;
    'المستوى': string;
    'أمثلة توضيحية'?: string;
    'أحسنت! '?: string;
  }
  
  interface RootsData {
    Feuil1: ArabicRoot[];
    Feuil2: unknown[];
    Feuil3: unknown[];
  }
  
  const value: RootsData;
  export default value;
}
