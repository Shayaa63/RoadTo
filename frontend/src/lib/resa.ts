import type { Goal, PeppMeddelande } from '../types';
import { arMalKlart, beraknaStatistik } from './logik';

// "1 kontrollpunkt" / "3 kontrollpunkter"
export function kontrollpunkterText(n: number): string {
  return `${n} ${n === 1 ? 'kontrollpunkt' : 'kontrollpunkter'}`;
}

// Alla datum då en kontrollpunkt nåddes
function naddaDatum(goals: Goal[]): Date[] {
  return goals
    .flatMap((g) => g.steps)
    .filter((s) => s.completed && s.completed_at)
    .map((s) => new Date(s.completed_at as string))
    .filter((d) => !Number.isNaN(d.getTime()));
}

// Antal kontrollpunkter som nåtts under innevarande kalendermånad
export function kontrollpunkterDennaManad(goals: Goal[]): number {
  const nu = new Date();
  return naddaDatum(goals).filter(
    (d) => d.getFullYear() === nu.getFullYear() && d.getMonth() === nu.getMonth(),
  ).length;
}

const TVA_VECKOR_MS = 14 * 86_400_000;

// Lugn, intervallbaserad text för banderollen – inga streaks, inget tryck
export function valjResaMeddelande(goals: Goal[]): PeppMeddelande {
  const stat = beraknaStatistik(goals);

  if (goals.length === 0) {
    return { text: 'En tom sida väntar. Sätt ut din första destination.', ton: 'neutral' };
  }

  if (stat.totalaSteg === 0) {
    return { text: 'Rita ut vägen – lägg till din första kontrollpunkt.', ton: 'neutral' };
  }

  if (goals.every(arMalKlart)) {
    return { text: 'Alla dina destinationer är nådda. Vart bär det härnäst?', ton: 'framgang' };
  }

  const manad = kontrollpunkterDennaManad(goals);
  if (manad > 0) {
    return {
      text: `${kontrollpunkterText(manad)} ${manad === 1 ? 'nådd' : 'nådda'} den här månaden. Du är på väg.`,
      ton: 'framgang',
    };
  }

  const datum = naddaDatum(goals);
  if (datum.length > 0) {
    const tider = datum.map((d) => d.getTime());
    const senaste = Math.max(...tider);
    const tidigaste = new Date(Math.min(...tider));

    if (Date.now() - senaste > TVA_VECKOR_MS) {
      return {
        text: 'Det var ett tag sedan sist – det är helt okej. Nästa kontrollpunkt väntar när du är redo.',
        ton: 'paminnelse',
      };
    }

    const manadsnamn = tidigaste.toLocaleDateString('sv-SE', { month: 'long' });
    return { text: `Se hur långt du har färdats sedan ${manadsnamn}.`, ton: 'neutral' };
  }

  return { text: 'En lugn stig framåt. Nästa kontrollpunkt väntar när du är redo.', ton: 'neutral' };
}