import { createClient } from '@supabase/supabase-js';
import type { Goal, Step } from '../types';
import { lasLokalt } from './lokalLagring';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const nyckel = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Är Supabase konfigurerat? Annars kör appen enbart mot localStorage.
export const harSupabase = Boolean(url && nyckel);

export const supabase = harSupabase ? createClient(url as string, nyckel as string) : null;

export interface HamtaResultat {
  goals: Goal[];
  kalla: 'supabase' | 'lokal';
}

// Hämtar alla mål med steg. Faller tillbaka på localStorage om Supabase saknas eller felar.
export async function hamtaMal(): Promise<HamtaResultat> {
  if (supabase) {
    try {
      const [malSvar, stegSvar] = await Promise.all([
        supabase.from('goals').select('*').order('created_at', { ascending: false }),
        supabase.from('steps').select('*').order('created_at', { ascending: true }),
      ]);

      if (malSvar.error) throw malSvar.error;
      if (stegSvar.error) throw stegSvar.error;

      const alleSteg = (stegSvar.data ?? []) as Step[];
      const goals: Goal[] = ((malSvar.data ?? []) as Omit<Goal, 'steps'>[]).map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description ?? '',
        created_at: m.created_at,
        steps: alleSteg.filter((s) => s.goal_id === m.id),
      }));

      return { goals, kalla: 'supabase' };
    } catch (fel) {
      console.warn('Kunde inte hämta från Supabase, använder localStorage istället.', fel);
    }
  }

  return { goals: lasLokalt() ?? [], kalla: 'lokal' };
}

// Raderar rader i en tabell som inte längre finns i appens state
async function raderaSaknade(tabell: 'goals' | 'steps', behall: string[]): Promise<void> {
  if (!supabase) return;

  const fraga = supabase.from(tabell).delete();
  const { error } =
    behall.length > 0
      ? await fraga.not('id', 'in', `(${behall.join(',')})`)
      : await fraga.neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) throw error;
}

// Synkar hela appens state till Supabase (enkelt och robust för en portfolio-app).
// Returnerar true om allt gick bra.
export async function synkaTillSupabase(goals: Goal[]): Promise<boolean> {
  if (!supabase) return false;

  try {
    const malRader = goals.map((g) => ({
      id: g.id,
      title: g.title,
      description: g.description,
      created_at: g.created_at,
    }));
    const stegRader = goals.flatMap((g) => g.steps);

    // 1. Ta bort det som raderats i appen (steg först, sedan mål)
    await raderaSaknade('steps', stegRader.map((s) => s.id));
    await raderaSaknade('goals', malRader.map((m) => m.id));

    // 2. Skapa/uppdatera mål och därefter steg (steg refererar till mål)
    if (malRader.length > 0) {
      const { error } = await supabase.from('goals').upsert(malRader);
      if (error) throw error;
    }
    if (stegRader.length > 0) {
      const { error } = await supabase.from('steps').upsert(stegRader);
      if (error) throw error;
    }

    return true;
  } catch (fel) {
    console.warn('Synkning till Supabase misslyckades.', fel);
    return false;
  }
}