// Composant utilitaire pour les previews de direction artistique
// Usage : uniquement dans src/app/design-preview/
// Supprimer ce dossier apres validation de la direction choisie

type Score = {
  lisibilite: number; // /5
  brand: number; // /5
  effort: "S" | "M" | "L";
  modernite: number; // /5
  emotion: number; // /5
};

const EFFORT_LABEL = { S: "Rapide < 2h", M: "Moyen 2-8h", L: "Long > 8h" };
const EFFORT_COLOR = { S: "text-green-400", M: "text-yellow-400", L: "text-orange-400" };

function ScoreBar({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 w-4 rounded-full ${i < value ? "bg-white" : "bg-white/20"}`}
        />
      ))}
    </div>
  );
}

export function DirectionCard({
  name,
  concept,
  score,
  children,
}: {
  name: string;
  concept: string;
  score: Score;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      {/* Header direction */}
      <div className="border-b border-white/10 px-5 py-4">
        <p className="mb-1 text-xs tracking-widest text-white/40 uppercase">{name}</p>
        <p className="text-sm leading-snug text-white/80">{concept}</p>
      </div>

      {/* Preview composant */}
      <div className="flex-1 overflow-hidden p-4">{children}</div>

      {/* Scores */}
      <div className="space-y-2 border-t border-white/10 px-5 py-4">
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>Lisibilite</span>
          <ScoreBar value={score.lisibilite} />
        </div>
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>Coherence brand</span>
          <ScoreBar value={score.brand} />
        </div>
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>Modernite</span>
          <ScoreBar value={score.modernite} />
        </div>
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>Emotion cible</span>
          <ScoreBar value={score.emotion} />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/40">Effort</span>
          <span className={`font-medium ${EFFORT_COLOR[score.effort]}`}>
            {score.effort} — {EFFORT_LABEL[score.effort]}
          </span>
        </div>
      </div>
    </div>
  );
}
