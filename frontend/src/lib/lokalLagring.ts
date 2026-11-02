import type { Goal, Streak, Theme } from '../types';

// Alla nycklar som används i localStorage samlade på ett ställe
const NYCKLAR = {
  mal: 'roadto:goals',
  streak: 'roadto:streak',
  badges: 'roadto:badges',
  seedat: 'roadto:seedat',
  tema: 'roadto:theme',
} as const;

function lasJson<T>(nyckel: string): T | null {
  try {
    const rå = localStorage.getItem(nyckel);
    return rå ? (JSON.parse(rå) as T) : null;
  } catch {
    return null;
  }
}

function sparaJson(nyckel: string, varde: unknown): void {
  try {
    localStorage.setItem(nyckel, JSON.stringify(varde));
  } catch {
    // localStorage kan vara blockerat (t.ex. privat läge) – då hoppar vi över sparandet
  }
}

// ---------- Mål ----------
export function lasLokalt(): Goal[] | null {
  const data = lasJson<Goal[]>(NYCKLAR.mal);
  return Array.isArray(data) ? data : null;
}

export function sparaLokalt(goals: Goal[]): void {
  sparaJson(NYCKLAR.mal, goals);
}

// ---------- Streak ----------
const STANDARD_STREAK: Streak = { current: 0, longest: 0, lastActiveDate: null };

export function lasStreak(): Streak {
  const data = lasJson<Streak>(NYCKLAR.streak);
  if (!data || typeof data.current !== 'number') return STANDARD_STREAK;
  return {
    current: data.current,
    longest: typeof data.longest === 'number' ? data.longest : data.current,
    lastActiveDate: typeof data.lastActiveDate === 'string' ? data.lastActiveDate : null,
  };
}

export function sparaStreak(streak: Streak): void {
  sparaJson(NYCKLAR.streak, streak);
}

// ---------- Upplåsta badges (id:n) ----------
export function lasUppnaddaBadges(): string[] {
  const data = lasJson<string[]>(NYCKLAR.badges);
  return Array.isArray(data) ? data : [];
}

export function sparaUppnaddaBadges(ids: string[]): void {
  sparaJson(NYCKLAR.badges, ids);
}

// ---------- Exempelmål (så att det inte återskapas efter radering) ----------
export function harSeedats(): boolean {
  return lasJson<boolean>(NYCKLAR.seedat) === true;
}

export function markeraSeedat(): void {
  sparaJson(NYCKLAR.seedat, true);
}

// ---------- Tema ----------
export function lasTema(): Theme | null {
  try {
    const tema = localStorage.getItem(NYCKLAR.tema);
    return tema === 'dark' || tema === 'light' ? tema : null;
  } catch {
    return null;
  }
}

export function sparaTema(tema: Theme): void {
  try {
    localStorage.setItem(NYCKLAR.tema, tema);
  } catch {
    // ignoreras
  }
}