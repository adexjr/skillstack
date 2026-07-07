export type QuestionType = "multiple_choice" | "code_output";

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  sort_order: number;
}

export interface Question {
  id: string;
  lesson_id: string;
  type: QuestionType;
  prompt: string;
  code_snippet: string | null;
  options: string[];
  correct_answer: string;
  explanation: string | null;
  sort_order: number;
}

export interface Profile {
  id: string;
  username: string;
  xp: number;
  streak: number;
  last_active: string | null;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  score: number;
  completed_at: string | null;
}

export type BadgeCriteriaType = "lessons_completed" | "streak" | "course_completed";

export interface Badge {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  criteria_type: BadgeCriteriaType;
  criteria_value: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  xp: number;
  streak: number;
}