export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  explanation: string;
}

export interface VocabularyItem {
  word: string;
  translation: string;
  context: string; // A short usage sentence
}

export interface LessonContent {
  title: string;
  theory: string; // Markdown/HTML supported text explanation
  vocabulary: VocabularyItem[];
  examples: string[];
  quiz: QuizQuestion[];
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  LESSON = 'LESSON',
  CHAT = 'CHAT',
  PROFILE = 'PROFILE'
}

export interface Topic {
  id: string;
  title: string;
  category: 'grammar' | 'vocabulary' | 'culture';
  level: 1 | 2 | 3; // Corresponds to middle school years
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}