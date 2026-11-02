import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import type { Goal, LagringStatus, Step, Streak } from './types';
import Header from './components/Header';
import MotivationBanner from './components/MotivationBanner';
import StatsOverview from './components/StatsOverview';
import GoalForm from './components/GoalForm';
import GoalCard from './components/GoalCard';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';
import { harSupabase, hamtaMal, synkaTillSupabase } from './lib/supabase';
import {
  harSeedats,
  lasStreak,
  lasUppnaddaBadges,
  markeraSeedat,
  sparaLokalt,
  sparaStreak,
  sparaUppnaddaBadges,
} from './lib/lokalLagring';
import { beraknaBadges, nyId, registreraAktivitet, skapaExempelMal } from './lib/logik';
import { kontrollpunkterDennaManad, valjResaMeddelande } from './lib/resa';

export default function App() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [laddad, setLaddad] = useState(false);
  const [lagring, setLagring] = useState<LagringStatus>('lokal');
  // Streaken räknas fortfarande internt (för milstolpar) men visas inte längre som tryck i UI:t
  const [streak, setStreak] = useState<Streak>(lasStreak);
  const [uppnadda, setUppnadda] = useState<string[]>(lasUppnaddaBadges);

  const [formVisas, setFormVisas] = useState(false);
  const [redigeraMal, setRedigeraMal] = useState<Goal | null>(null);
  const [malAttRadera, setMalAttRadera] = useState<Goal | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Synkar vi mot Supabase? (bara om hämtningen lyckades, så vi aldrig skriver över data av misstag)
  const synkAktiv = useRef(false);
  const forstaBadgeKorning = useRef(true);

  // ---------- Starta: hämta data (Supabase → localStorage) ----------
  useEffect(() => {
    let avbruten = false;

    async function starta() {
      const { goals: hamtade, kalla } = await hamtaMal();
      if (avbruten) return;

      let start = hamtade;
      if (start.length === 0 && !harSeedats()) {
        start = [skapaExempelMal()];
        markeraSeedat();
      }

      synkAktiv.current = kalla === 'supabase';
      setLagring(kalla === 'supabase' ? 'sparat' : harSupabase ? 'fel' : 'lokal');
      setGoals(start);
      setLaddad(true);
    }

    void starta();

    return () => {
      avbruten = true;
    };
  }, []);

  // ---------- Spara: alltid till localStorage, med fördröjning till Supabase ----------
  useEffect(() => {
    if (!laddad) return;

    sparaLokalt(goals);

    if (!synkAktiv.current) return;

    setLagring('synkar');
    const timer = window.setTimeout(async () => {
      const lyckades = await synkaTillSupabase(goals);
      setLagring(lyckades ? 'sparat' : 'fel');
    }, 600);

    return () => window.clearTimeout(timer);
  }, [goals, laddad]);

  useEffect(() => {
    sparaStreak(streak);
  }, [streak]);

  useEffect(() => {
    sparaUppnaddaBadges(uppnadda);
  }, [uppnadda]);

  // ---------- Milstolpar: lås upp och visa en lugn notis ----------
  const berakning = useMemo(() => beraknaBadges(goals, streak), [goals, streak]);

  useEffect(() => {
    if (!laddad) return;

    const nya = berakning.filter((b) => b.earned && !uppnadda.includes(b.id));
    const forstaGangen = forstaBadgeKorning.current;
    forstaBadgeKorning.current = false;

    if (nya.length === 0) return;

    setUppnadda((tidigare) => [...tidigare, ...nya.map((b) => b.id)]);

    // Ingen notis för milstolpar som redan var uppnådda när appen startade
    if (!forstaGangen) {
      setToast(`Ny milstolpe stämplad: ${nya[0].title}`);
    }
  }, [berakning, laddad, uppnadda]);

  // En milstolpe som någon gång varit stämplad förblir stämplad
  const badges = useMemo(
    () => berakning.map((b) => ({ ...b, earned: b.earned || uppnadda.includes(b.id) })),
    [berakning, uppnadda],
  );

  const peppMeddelande = useMemo(() => valjResaMeddelande(goals), [goals]);
  const manadensKontrollpunkter = useMemo(() => kontrollpunkterDennaManad(goals), [goals]);
  const stangToast = useCallback(() => setToast(null), []);

  // ---------- Destinationer (mål) ----------
  const oppnaNyttMal = () => {
    setRedigeraMal(null);
    setFormVisas(true);
  };

  const oppnaRedigeraMal = (mal: Goal) => {
    setRedigeraMal(mal);
    setFormVisas(true);
  };

  const stangForm = () => {
    setFormVisas(false);
    setRedigeraMal(null);
  };

  const sparaMal = (titel: string, beskrivning: string) => {
    if (redigeraMal) {
      const id = redigeraMal.id;
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, title: titel, description: beskrivning } : g)),
      );
    } else {
      const nyttMal: Goal = {
        id: nyId(),
        title: titel,
        description: beskrivning,
        created_at: new Date().toISOString(),
        steps: [],
      };
      setGoals((prev) => [nyttMal, ...prev]);
    }
    stangForm();
  };

  const raderaMal = () => {
    if (!malAttRadera) return;
    const id = malAttRadera.id;
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setMalAttRadera(null);
  };

  // ---------- Kontrollpunkter (steg) ----------
  const laggTillSteg = (malId: string, titel: string) => {
    const nyttSteg: Step = {
      id: nyId(),
      goal_id: malId,
      title: titel,
      completed: false,
      completed_at: null,
      created_at: new Date().toISOString(),
    };
    setGoals((prev) =>
      prev.map((g) => (g.id === malId ? { ...g, steps: [...g.steps, nyttSteg] } : g)),
    );
  };

  const redigeraSteg = (malId: string, stegId: string, titel: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === malId
          ? { ...g, steps: g.steps.map((s) => (s.id === stegId ? { ...s, title: titel } : s)) }
          : g,
      ),
    );
  };

  const raderaSteg = (malId: string, stegId: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === malId ? { ...g, steps: g.steps.filter((s) => s.id !== stegId) } : g,
      ),
    );
  };

  const vaxlaSteg = (malId: string, stegId: string) => {
    const mal = goals.find((g) => g.id === malId);
    const steg = mal?.steps.find((s) => s.id === stegId);
    if (!mal || !steg) return;

    const blirKlart = !steg.completed;
    const tidpunkt = new Date().toISOString();

    setGoals((prev) =>
      prev.map((g) =>
        g.id === malId
          ? {
              ...g,
              steps: g.steps.map((s) =>
                s.id === stegId
                  ? { ...s, completed: blirKlart, completed_at: blirKlart ? tidpunkt : null }
                  : s,
              ),
            }
          : g,
      ),
    );

    // Registrerar aktivitet för dagen (används bara av milstolpar tills vidare)
    if (blirKlart) {
      setStreak((tidigare) => registreraAktivitet(tidigare));
    }
  };

  return (
    <div className="min-h-screen">
      <Header manadensKontrollpunkter={manadensKontrollpunkter} lagring={lagring} />

      <main className="mx-auto max-w-5xl space-y-10 px-4 pb-16 sm:px-6">
        {!laddad ? (
          <p className="py-16 text-center font-serif text-base italic text-ink-soft">
            Öppnar journalen…
          </p>
        ) : (
          <>
            <MotivationBanner meddelande={peppMeddelande} />

            <StatsOverview goals={goals} badges={badges} />

            <section aria-label="Destinationer">
              <div className="mb-5 flex items-end justify-between gap-4 border-b border-ink/20 pb-3">
                <div>
                  <p className="meta">Journalens sidor</p>
                  <h2 className="mt-1 text-2xl font-semibold">Dina destinationer</h2>
                </div>
                <button type="button" className="knapp-primar" onClick={oppnaNyttMal}>
                  <Plus className="h-4 w-4" />
                  Ny destination
                </button>
              </div>

              {goals.length === 0 ? (
                <div className="flex flex-col items-center rounded-ark border border-dashed border-ink/30 px-6 py-14 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-ark border-2 border-ink text-ink">
                    <MapPin className="h-7 w-7" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-xl font-semibold">Ingen destination utstakad ännu</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
                    Varje resa börjar med en plats på kartan. Välj en destination, dela upp vägen i
                    kontrollpunkter och stämpla dig framåt.
                  </p>
                  <button type="button" className="knapp-primar mt-6" onClick={oppnaNyttMal}>
                    <Plus className="h-4 w-4" />
                    Sätt ut din första destination
                  </button>
                </div>
              ) : (
                <div className="grid items-start gap-5 lg:grid-cols-2">
                  {goals.map((mal, index) => (
                    <GoalCard
                      key={mal.id}
                      mal={mal}
                      // Äldsta destinationen får nummer 01
                      nummer={String(goals.length - index).padStart(2, '0')}
                      onRedigera={oppnaRedigeraMal}
                      onRadera={setMalAttRadera}
                      onLaggTillSteg={laggTillSteg}
                      onVaxlaSteg={vaxlaSteg}
                      onRedigeraSteg={redigeraSteg}
                      onRaderaSteg={raderaSteg}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="border-t border-ink/15 py-6 text-center">
        <p className="meta">RoadTo · React · TypeScript · Tailwind CSS · Supabase</p>
      </footer>

      {formVisas && <GoalForm mal={redigeraMal} onSpara={sparaMal} onAvbryt={stangForm} />}

      {malAttRadera && (
        <ConfirmModal
          titel="Radera destination?"
          text={`Vill du radera destinationen "${malAttRadera.title}" och dess ${malAttRadera.steps.length} kontrollpunkter? Det går inte att ångra.`}
          onAvbryt={() => setMalAttRadera(null)}
          onBekrafta={raderaMal}
        />
      )}

      <Toast meddelande={toast} onStang={stangToast} />
    </div>
  );
}