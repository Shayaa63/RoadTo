import type { Badge, Goal, PeppMeddelande, Step, Streak } from '../types';

// ---------- Hjälpfunktioner ----------

// Skapar ett unikt id (UUID) – fungerar även om crypto.randomUUID saknas
export function nyId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (tecken) => {
    const slump = Math.floor(Math.random() * 16);
    const varde = tecken === 'x' ? slump : (slump & 0x3) | 0x8;
    return varde.toString(16);
  });
}

function tvaSiffror(n: number): string {
  return String(n).padStart(2, '0');
}

// Datum som text (YYYY-MM-DD) i användarens lokala tid
export function datumSomText(datum: Date): string {
  return `${datum.getFullYear()}-${tvaSiffror(datum.getMonth() + 1)}-${tvaSiffror(datum.getDate())}`;
}

export function idag(): string {
  return datumSomText(new Date());
}

export function gardag(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return datumSomText(d);
}

function pluralDagar(n: number): string {
  return `${n} ${n === 1 ? 'dag' : 'dagar'}`;
}

// ---------- Framsteg ----------

// Procent klara steg. Mål utan steg ger 0 (aldrig NaN).
export function beraknaFramsteg(steg: Step[]): number {
  if (steg.length === 0) return 0;
  const klara = steg.filter((s) => s.completed).length;
  return Math.round((klara / steg.length) * 100);
}

// Ett mål räknas som klart när det har minst ett steg och alla är avbockade
export function arMalKlart(mal: Goal): boolean {
  return mal.steps.length > 0 && mal.steps.every((s) => s.completed);
}

export interface Statistik {
  totalaMal: number;
  avklaradeMal: number;
  totalaSteg: number;
  avklaradeSteg: number;
  totalProcent: number;
}

export function beraknaStatistik(goals: Goal[]): Statistik {
  const alleSteg = goals.flatMap((g) => g.steps);
  return {
    totalaMal: goals.length,
    avklaradeMal: goals.filter(arMalKlart).length,
    totalaSteg: alleSteg.length,
    avklaradeSteg: alleSteg.filter((s) => s.completed).length,
    totalProcent: beraknaFramsteg(alleSteg),
  };
}

// Antal steg som slutförts sedan måndag den här veckan
export function stegDennaVecka(goals: Goal[]): number {
  const nu = new Date();
  const veckodag = (nu.getDay() + 6) % 7; // måndag = 0
  const veckostart = new Date(nu.getFullYear(), nu.getMonth(), nu.getDate() - veckodag);

  return goals
    .flatMap((g) => g.steps)
    .filter((s) => s.completed && s.completed_at && new Date(s.completed_at) >= veckostart).length;
}

// ---------- Streak ----------

// Anropas när användaren bockar av ett steg
export function registreraAktivitet(streak: Streak): Streak {
  const dagensDatum = idag();
  if (streak.lastActiveDate === dagensDatum) return streak;

  const current = streak.lastActiveDate === gardag() ? streak.current + 1 : 1;
  return {
    current,
    longest: Math.max(streak.longest, current),
    lastActiveDate: dagensDatum,
  };
}

// Streaken som ska visas: bruten streak (äldre än igår) visas som 0
export function visadStreak(streak: Streak): number {
  if (streak.lastActiveDate === idag() || streak.lastActiveDate === gardag()) {
    return streak.current;
  }
  return 0;
}

// ---------- Badges ----------

export function beraknaBadges(goals: Goal[], streak: Streak): Badge[] {
  const stat = beraknaStatistik(goals);
  const bastaStreak = Math.max(streak.longest, visadStreak(streak));

  return [
    {
      id: 'forsta-steget',
      title: 'Första steget',
      description: 'Slutför ditt första delsteg.',
      icon: 'footprints',
      earned: stat.avklaradeSteg >= 1,
    },
    {
      id: 'tio-steg',
      title: 'På gång',
      description: 'Slutför 10 delsteg.',
      icon: 'zap',
      earned: stat.avklaradeSteg >= 10,
    },
    {
      id: 'tjugofem-steg',
      title: 'Rullar på',
      description: 'Slutför 25 delsteg.',
      icon: 'medal',
      earned: stat.avklaradeSteg >= 25,
    },
    {
      id: 'forsta-malet',
      title: 'Mål i hamn',
      description: 'Nå 100 % på ett mål.',
      icon: 'target',
      earned: stat.avklaradeMal >= 1,
    },
    {
      id: 'tre-mal',
      title: 'Måljägare',
      description: 'Slutför 3 mål.',
      icon: 'trophy',
      earned: stat.avklaradeMal >= 3,
    },
    {
      id: 'streak-3',
      title: 'Tre i rad',
      description: 'Håll en streak på 3 dagar.',
      icon: 'flame',
      earned: bastaStreak >= 3,
    },
    {
      id: 'streak-7',
      title: 'Veckostreak',
      description: 'Håll en streak på 7 dagar.',
      icon: 'flame',
      earned: bastaStreak >= 7,
    },
  ];
}

// ---------- Pepp-banderoll ----------

const CITAT: string[] = [
  'Små steg varje dag leder långt.',
  'Framsteg slår perfektion – ta nästa steg.',
  'Det viktigaste är att börja. Resten följer.',
  'Konsekvens är viktigare än intensitet.',
  'En liten insats idag gör stor skillnad om ett år.',
  'Du behöver inte se hela vägen – bara nästa steg.',
  'Varje avbockat steg är ett bevis på att du kommer framåt.',
  'Ta det i din egen takt, men fortsätt röra dig framåt.',
];

function dagensCitat(): string {
  const nu = new Date();
  const arsStart = new Date(nu.getFullYear(), 0, 0);
  const dagNummer = Math.floor((nu.getTime() - arsStart.getTime()) / 86_400_000);
  return CITAT[dagNummer % CITAT.length];
}

// Väljer meddelande utifrån användarens framsteg och streak
export function valjPeppMeddelande(goals: Goal[], streak: Streak): PeppMeddelande {
  const stat = beraknaStatistik(goals);
  const aktivStreak = visadStreak(streak);
  const veckoSteg = stegDennaVecka(goals);

  if (goals.length === 0) {
    return { text: 'Redo att börja? Skapa ditt första mål och ta första steget.', ton: 'neutral' };
  }

  if (stat.totalaSteg === 0) {
    return { text: 'Lägg till några delsteg i ditt mål så är du igång.', ton: 'neutral' };
  }

  if (stat.avklaradeMal === stat.totalaMal) {
    return {
      text: 'Fantastiskt! Alla dina mål är i hamn. Dags att sätta ett nytt?',
      ton: 'framgang',
    };
  }

  if (streak.current > 0 && streak.lastActiveDate === gardag()) {
    return {
      text: `Du har ${pluralDagar(aktivStreak)} i rad – bocka av ett steg idag för att behålla din streak!`,
      ton: 'paminnelse',
    };
  }

  if (aktivStreak >= 7) {
    return {
      text: `Imponerande! ${pluralDagar(aktivStreak)} i rad. Du bygger en riktig vana.`,
      ton: 'framgang',
    };
  }

  if (aktivStreak >= 3) {
    return { text: `${pluralDagar(aktivStreak)} i rad – håll i gången!`, ton: 'framgang' };
  }

  if (veckoSteg > 0) {
    return {
      text: `Bra jobbat! Du har slutfört ${veckoSteg} ${veckoSteg === 1 ? 'steg' : 'steg'} denna vecka!`,
      ton: 'framgang',
    };
  }

  return { text: dagensCitat(), ton: 'neutral' };
}

// ---------- Exempelmål ----------

export function skapaExempelMal(): Goal {
  const malId = nyId();
  const start = Date.now();
  const titlar = [
    'Utforska appen',
    'Bocka av det här steget',
    'Lägg till ett eget delsteg',
    'Skapa ditt första riktiga mål',
  ];

  return {
    id: malId,
    title: 'Mitt första mål',
    description:
      'Det här är ett exempelmål. Bocka av stegen, lägg till egna eller radera målet när du är redo.',
    created_at: new Date(start).toISOString(),
    steps: titlar.map((titel, index) => ({
      id: nyId(),
      goal_id: malId,
      title: titel,
      completed: false,
      completed_at: null,
      // Olika tidsstämplar så att ordningen bevaras vid hämtning från databasen
      created_at: new Date(start + index).toISOString(),
    })),
  };
}