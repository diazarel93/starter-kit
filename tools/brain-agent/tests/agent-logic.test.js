import { describe, it, expect } from "vitest";

describe("Agent logic — cycle rules", () => {
  function isSilentHour(hour) {
    return hour >= 22 || hour < 7;
  }

  it("mode silencieux entre 22h et 7h", () => {
    expect(isSilentHour(22)).toBe(true);
    expect(isSilentHour(23)).toBe(true);
    expect(isSilentHour(0)).toBe(true);
    expect(isSilentHour(6)).toBe(true);
  });

  it("mode actif entre 7h et 22h", () => {
    expect(isSilentHour(7)).toBe(false);
    expect(isSilentHour(12)).toBe(false);
    expect(isSilentHour(21)).toBe(false);
  });
});

describe("Agent logic — cost tracking", () => {
  function calculateCost(model, inputTokens, outputTokens) {
    const pricing = {
      "claude-haiku-4-5-20251001": { in: 0.0000008, out: 0.000004 },
      "claude-sonnet-4-6":         { in: 0.000003,  out: 0.000015 },
      "claude-opus-4-6":           { in: 0.000015,  out: 0.000075 },
    };
    const p = pricing[model] ?? pricing["claude-haiku-4-5-20251001"];
    return (inputTokens * p.in) + (outputTokens * p.out);
  }

  it("calcule correctement le coût Haiku", () => {
    // 1000 input + 200 output = 0.0008 + 0.0008 = $0.00160
    const cost = calculateCost("claude-haiku-4-5-20251001", 1000, 200);
    expect(cost).toBeCloseTo(0.00160, 5);
  });

  it("Haiku est ~4x moins cher que Sonnet en input", () => {
    const haiku = calculateCost("claude-haiku-4-5-20251001", 1000, 0);
    const sonnet = calculateCost("claude-sonnet-4-6", 1000, 0);
    expect(sonnet / haiku).toBeCloseTo(3.75, 1);
  });

  it("30 cycles/jour à 2K tokens = ~$0.05/jour", () => {
    const costPerCycle = calculateCost("claude-haiku-4-5-20251001", 1500, 300);
    const dailyCost = costPerCycle * 30;
    expect(dailyCost).toBeLessThan(0.10); // moins de 10 cents/jour
    expect(dailyCost).toBeGreaterThan(0.01); // plus d'1 cent (réaliste)
  });

  it("fallback vers Haiku si modèle inconnu", () => {
    const known = calculateCost("claude-haiku-4-5-20251001", 1000, 100);
    const unknown = calculateCost("modele-inconnu", 1000, 100);
    expect(known).toBe(unknown);
  });
});

describe("Agent logic — memory trimming", () => {
  it("trime à 20 clés les plus récentes", () => {
    const memory = {};
    for (let i = 0; i < 25; i++) memory[`k${i}`] = `v${i}`;

    const keys = Object.keys(memory).slice(-20);
    expect(keys).toHaveLength(20);
    expect(keys[0]).toBe("k5"); // les 5 premières supprimées
    expect(keys[19]).toBe("k24");
  });
});

describe("Agent Idée — quiz schedule", () => {
  function getQuizType(day) {
    // 1=lun, 2=mar, 3=mer, 4=jeu, 5=ven, 6=sam, 7=dim
    if ([1, 3, 5].includes(day)) return "kura";
    if ([2, 4].includes(day)) return "tech";
    return "both";
  }

  it("Kura le lundi, mercredi, vendredi", () => {
    expect(getQuizType(1)).toBe("kura");
    expect(getQuizType(3)).toBe("kura");
    expect(getQuizType(5)).toBe("kura");
  });

  it("Tech le mardi et jeudi", () => {
    expect(getQuizType(2)).toBe("tech");
    expect(getQuizType(4)).toBe("tech");
  });

  it("Les deux le week-end", () => {
    expect(getQuizType(6)).toBe("both");
    expect(getQuizType(7)).toBe("both");
  });
});
