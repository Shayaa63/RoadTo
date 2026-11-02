// Ett delsteg som tillhör ett mål
export interface Step {
  id: string;
  goal_id: string;
  title: string;
  completed: boolean;
  completed_at: string | null; // ISO-datum när steget bockades av
  created_at: string;
}

// Ett mål med sina delsteg
export interface Goal {
  id: string;
  title: string;
  description: string;
  created_at: string;
  steps: Step[];
}

// Tema för dark/light mode
export type Theme = 'light' | 'dark';

// Dagar i rad
export interface Streak {
  current: number; // nuvarande streak
  longest: number; // längsta streak någonsin
  lastActiveDate: string | null; // YYYY-MM-DD (lokal tid) för senaste aktiva dag
}

// Vilka ikoner en badge kan ha (mappas till lucide-ikoner i UI:t)
export type BadgeIcon = 'footprints' | 'zap' | 'target' | 'trophy' | 'flame' | 'medal';

// En badge/milstolpe
export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: BadgeIcon;
  earned: boolean;
}

// Status för sparande, visas i headern
export type LagringStatus = 'lokal' | 'synkar' | 'sparat' | 'fel';

// Ton på peppbanderollen
export type PeppTon = 'neutral' | 'framgang' | 'paminnelse';

export interface PeppMeddelande {
  text: string;
  ton: PeppTon;
}