import { readFileSync } from "fs";
import { resolve } from "path";

function getCurrentWeekDay() {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const week = Math.ceil(dayOfYear / 7);
  const day = now.getDay() === 0 ? 7 : now.getDay(); // 1=lundi, 7=dimanche
  return { week, day, dayOfYear };
}

function loadCurriculum(week: number, day: number) {
  try {
    const path = resolve(process.cwd(), `docs/curriculum/kura-semaine-0${week}.json`);
    const data = JSON.parse(readFileSync(path, "utf-8"));
    return data.jours?.[day - 1] ?? null;
  } catch {
    return null;
  }
}

export default async function FormationPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;

  const { week, day } = getCurrentWeekDay();
  const lesson = loadCurriculum(Math.min(week, 4), Math.min(day, 7));

  const skills = [
    { name: "Dev AI", pct: 25, color: "#4ECDC4" },
    { name: "Kura/Antidopage", pct: 10, color: "#8B5CF6" },
    { name: "Anglais pro", pct: 15, color: "#D4A843" },
    { name: "Founder CTO", pct: 20, color: "#FF6B35" },
    { name: "RegTech marché", pct: 5, color: "#10B981" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white">FORMATION PERSONNELLE</h1>
        <p className="mt-1 text-sm text-white/40">
          Curriculum Kura, coaching bot Telegram, progression
        </p>
      </div>

      {p && p !== "all" && (
        <p className="rounded border border-white/5 bg-white/3 px-3 py-2 text-xs text-white/20">
          Vue globale — cette section n&apos;est pas filtrée par projet
        </p>
      )}

      {/* Statut aujourd&apos;hui */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="rounded-lg border border-white/5 bg-white/3 p-4">
          <p className="text-xs tracking-widest text-white/30 uppercase">Semaine</p>
          <p className="mt-2 text-2xl font-bold text-white">{week}</p>
          <p className="mt-1 text-xs text-white/30">Jour {day}/7</p>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/3 p-4">
          <p className="text-xs tracking-widest text-white/30 uppercase">Quiz 20h ce soir</p>
          <p className="mt-2 text-lg font-bold text-white">
            {[1, 3, 5].includes(day) ? "Kura" : [2, 4].includes(day) ? "Tech" : "Les deux"}
          </p>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/3 p-4">
          <p className="text-xs tracking-widest text-white/30 uppercase">Bot Telegram</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            <span className="text-sm text-white/70">Actif — 5 messages/jour</span>
          </div>
        </div>
      </div>

      {/* Leçon du jour */}
      {lesson && (
        <div className="rounded-lg border border-[#4ECDC4]/20 bg-white/3 p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded bg-[#4ECDC4]/20 px-2 py-0.5 text-xs tracking-widest text-[#4ECDC4] uppercase">
              Leçon du jour
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">{lesson.titre}</h3>
          <p className="mt-1 text-sm text-white/50">{lesson.cours?.fr?.substring(0, 200)}...</p>
        </div>
      )}

      {/* Radar compétences */}
      <div className="rounded-lg border border-white/5 bg-white/3 p-4">
        <h3 className="mb-4 text-xs font-semibold tracking-widest text-white/40 uppercase">
          Radar compétences
        </h3>
        <div className="space-y-3">
          {skills.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="w-32 flex-shrink-0 text-sm text-white/50">{s.name}</span>
              <div className="h-2 flex-1 rounded-full bg-white/5">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${s.pct}%`, backgroundColor: s.color }}
                />
              </div>
              <span className="w-8 text-right text-xs text-white/30">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Crons actifs */}
      <div className="rounded-lg border border-white/5 bg-white/3 p-4">
        <h3 className="mb-3 text-xs font-semibold tracking-widest text-white/40 uppercase">
          Messages Telegram programmés
        </h3>
        <div className="space-y-2">
          {[
            { time: "08h00", label: "Veille tech + leçon dev AI", active: true },
            { time: "10h00", label: "Vocab 3 mots (Dev AI + Kura + Anglais)", active: true },
            { time: "12h00", label: "Leçon Kura du jour", active: true },
            { time: "17h00", label: "Rappel quiz du soir", active: true },
            { time: "20h00", label: "Quiz automatique (Kura/Tech/Both)", active: true },
          ].map((cron) => (
            <div key={cron.time} className="flex items-center gap-3 text-sm">
              <span className="w-12 text-white/30">{cron.time}</span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${cron.active ? "bg-green-400" : "bg-white/20"}`}
              />
              <span className="text-white/60">{cron.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
