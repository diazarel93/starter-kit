import { requireAuth } from "@/lib/auth";
import { readFileSync } from "fs";
import { resolve } from "path";

function getCurrentWeekDay() {
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
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

export default async function FormationPage() {
  await requireAuth();

  const { week, day, dayOfYear } = getCurrentWeekDay();
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
        <h1 className="font-display text-3xl text-white">🎯 Formation Personnelle</h1>
        <p className="text-white/40 text-sm mt-1">Curriculum Kura, coaching bot Telegram, progression</p>
      </div>

      {/* Statut aujourd'hui */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white/3 border border-white/5 rounded-lg p-4">
          <p className="text-xs text-white/30 uppercase tracking-wide">Semaine</p>
          <p className="text-3xl font-bold text-white mt-1">{week}</p>
          <p className="text-xs text-white/30 mt-1">Jour {day}/7</p>
        </div>
        <div className="bg-white/3 border border-white/5 rounded-lg p-4">
          <p className="text-xs text-white/30 uppercase tracking-wide">Quiz 20h ce soir</p>
          <p className="text-lg font-bold text-white mt-1">
            {[1, 3, 5].includes(day) ? "🧬 Kura" : [2, 4].includes(day) ? "🧠 Tech" : "🔀 Les deux"}
          </p>
        </div>
        <div className="bg-white/3 border border-white/5 rounded-lg p-4">
          <p className="text-xs text-white/30 uppercase tracking-wide">Bot Telegram</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-sm text-white/70">Actif — 5 messages/jour</span>
          </div>
        </div>
      </div>

      {/* Leçon du jour */}
      {lesson && (
        <div className="bg-white/3 border border-[#4ECDC4]/20 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-[#4ECDC4]/20 text-[#4ECDC4] px-2 py-0.5 rounded uppercase tracking-wider">
              Leçon du jour
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">{lesson.titre}</h3>
          <p className="text-sm text-white/50 mt-1">{lesson.cours?.fr?.substring(0, 200)}...</p>
        </div>
      )}

      {/* Radar compétences */}
      <div className="bg-white/3 border border-white/5 rounded-lg p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Radar compétences</h3>
        <div className="space-y-3">
          {skills.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="text-sm text-white/50 w-32 flex-shrink-0">{s.name}</span>
              <div className="flex-1 bg-white/5 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${s.pct}%`, backgroundColor: s.color }}
                />
              </div>
              <span className="text-xs text-white/30 w-8 text-right">{s.pct}%</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-white/20 mt-3">Estimations initiales — se mettent à jour au fil des quiz</p>
      </div>

      {/* Crons actifs */}
      <div className="bg-white/3 border border-white/5 rounded-lg p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Messages Telegram programmés</h3>
        <div className="space-y-2">
          {[
            { time: "08h00", label: "Veille tech + leçon dev AI", active: true },
            { time: "10h00", label: "Vocab 3 mots (Dev AI + Kura + Anglais)", active: true },
            { time: "12h00", label: "Leçon Kura du jour", active: true },
            { time: "17h00", label: "Rappel quiz du soir", active: true },
            { time: "20h00", label: "Quiz automatique (Kura/Tech/Both)", active: true },
          ].map((cron) => (
            <div key={cron.time} className="flex items-center gap-3 text-sm">
              <span className="text-white/30 w-12">{cron.time}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${cron.active ? "bg-green-400" : "bg-white/20"}`} />
              <span className="text-white/60">{cron.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
