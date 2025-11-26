import { Topic } from './types';

export const TOPICS: Topic[] = [
  // --- YEAR 1 (1ª MEDIA) ---
  { id: 't1_tobe', title: 'Verb To Be', category: 'grammar', level: 1, description: 'I am, You are, He is (Affirmative, Negative, Question).' },
  { id: 't1_articles', title: 'Articles (A/An/The)', category: 'grammar', level: 1, description: 'Definite and Indefinite articles.' },
  { id: 't1_plurals', title: 'Plural Nouns', category: 'grammar', level: 1, description: 'Regular (s/es) and Irregular (man/men).' },
  { id: 't1_havegot', title: 'Have Got', category: 'grammar', level: 1, description: 'Possession and physical description.' },
  { id: 't1_possessives', title: 'Possessive Adjectives & \'s', category: 'grammar', level: 1, description: 'My, Your... and Genitive Case (Tom\'s cat).' },
  { id: 't1_pres_simp', title: 'Present Simple', category: 'grammar', level: 1, description: 'Daily routines, habits, and 3rd person -S.' },
  { id: 't1_adverbs_freq', title: 'Adverbs of Frequency', category: 'grammar', level: 1, description: 'Always, Usually, Often, Never.' },
  { id: 't1_can', title: 'Can (Ability)', category: 'grammar', level: 1, description: 'Expressing ability and permission.' },
  { id: 't1_obj_pronouns', title: 'Object Pronouns', category: 'grammar', level: 1, description: 'Me, You, Him, Her, Us, Them.' },
  { id: 't1_imperative', title: 'Imperative', category: 'grammar', level: 1, description: 'Instructions and directions (Sit down, Don\'t go).' },

  // --- YEAR 2 (2ª MEDIA) ---
  { id: 't2_pres_cont', title: 'Present Continuous', category: 'grammar', level: 2, description: 'Actions happening right now vs. Simple.' },
  { id: 't2_count_uncount', title: 'Countable & Uncountable', category: 'grammar', level: 2, description: 'Some, Any, Much, Many, A lot of.' },
  { id: 't2_past_simp_reg', title: 'Past Simple (Regular)', category: 'grammar', level: 2, description: 'Events in the past using -ed ending.' },
  { id: 't2_past_simp_irreg', title: 'Past Simple (Irregular)', category: 'grammar', level: 2, description: 'Go -> Went, See -> Saw, Buy -> Bought.' },
  { id: 't2_comp_sup', title: 'Comparatives & Superlatives', category: 'grammar', level: 2, description: 'Bigger than, The most beautiful.' },
  { id: 't2_must_have_to', title: 'Must vs Have to', category: 'grammar', level: 2, description: 'Obligation and rules.' },
  { id: 't2_past_cont', title: 'Past Continuous', category: 'grammar', level: 2, description: 'I was watching TV when...' },
  { id: 't2_future_going', title: 'Future: Going to', category: 'grammar', level: 2, description: 'Intentions and predictions based on evidence.' },

  // --- YEAR 3 (3ª MEDIA) ---
  { id: 't3_pres_perf', title: 'Present Perfect', category: 'grammar', level: 3, description: 'Experiences, Just, Already, Yet.' },
  { id: 't3_for_since', title: 'For vs Since', category: 'grammar', level: 3, description: 'Duration vs Starting point.' },
  { id: 't3_pres_perf_vs_past', title: 'Pres. Perfect vs Past Simple', category: 'grammar', level: 3, description: 'When to use which?' },
  { id: 't3_future_will', title: 'Future: Will', category: 'grammar', level: 3, description: 'Promises, instant decisions, future facts.' },
  { id: 't3_zero_first_cond', title: 'Zero & First Conditional', category: 'grammar', level: 3, description: 'If it rains, I stay home. If I study, I will pass.' },
  { id: 't3_second_cond', title: 'Second Conditional', category: 'grammar', level: 3, description: 'Hypothetical: If I were rich, I would buy a boat.' },
  { id: 't3_passive', title: 'Passive Voice (Present/Past)', category: 'grammar', level: 3, description: 'The book was written by Shakespeare.' },
  { id: 't3_reported', title: 'Reported Speech (Basic)', category: 'grammar', level: 3, description: 'He said that he was happy.' },
  { id: 't3_relatives', title: 'Relative Clauses', category: 'grammar', level: 3, description: 'Who, Which, That, Where.' },
  { id: 't3_phrasal', title: 'Common Phrasal Verbs', category: 'vocabulary', level: 3, description: 'Get up, Look for, Turn on, Give up.' },
];

export const LEVEL_LABELS = {
  1: '1ª Media (Beginner)',
  2: '2ª Media (Intermediate)',
  3: '3ª Media (Advanced)'
};

export const RANK_THRESHOLDS = [
  { xp: 0, title: 'Novice Explorer', emoji: '🌱' },
  { xp: 500, title: 'Grammar Apprentice', emoji: '🛠️' },
  { xp: 1500, title: 'Vocabulary Voyager', emoji: '⛵' },
  { xp: 3000, title: 'Language Knight', emoji: '⚔️' },
  { xp: 5000, title: 'English Master', emoji: '👑' },
];