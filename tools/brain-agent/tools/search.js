/**
 * search.js — Veille web (WADA, tech stack, RegTech)
 * Utilise l'API DuckDuckGo Instant Answer (gratuite, sans clé)
 */

export async function webSearch({ query, maxResults = 3 }) {
  try {
    // DuckDuckGo Instant Answer API — gratuit, pas de clé requise
    const encoded = encodeURIComponent(query);
    const url = `https://api.duckduckgo.com/?q=${encoded}&format=json&no_html=1&skip_disambig=1`;

    const res = await fetch(url, {
      headers: { "User-Agent": "brain-agent/1.0 (romain@banlieuwood.com)" },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return { error: `HTTP ${res.status}` };
    const data = await res.json();

    const results = [];

    // Abstract (définition directe)
    if (data.AbstractText) {
      results.push({
        title: data.Heading ?? query,
        snippet: data.AbstractText.substring(0, 300),
        url: data.AbstractURL,
        source: data.AbstractSource,
      });
    }

    // Related topics
    for (const topic of (data.RelatedTopics ?? []).slice(0, maxResults - results.length)) {
      if (topic.Text) {
        results.push({
          title: topic.FirstURL?.split("/").pop()?.replace(/_/g, " ") ?? "—",
          snippet: topic.Text.substring(0, 200),
          url: topic.FirstURL,
        });
      }
    }

    if (results.length === 0) return { message: "Aucun résultat instant — requête trop spécifique", query };
    return { query, results };
  } catch (e) {
    return { error: e.message, query };
  }
}

export async function checkWadaUpdates() {
  // Vérifier si la liste WADA a été mise à jour récemment
  try {
    const res = await fetch("https://www.wada-ama.org/en/prohibited-list", {
      headers: { "User-Agent": "brain-agent/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return { error: `WADA site HTTP ${res.status}` };
    const html = await res.text();

    // Chercher la date de dernière mise à jour dans le HTML
    const dateMatch = html.match(/2026|2025/g);
    const mentionsCurrentYear = dateMatch?.includes("2026");

    return {
      accessible: true,
      currentYearMentioned: mentionsCurrentYear,
      message: mentionsCurrentYear
        ? "Site WADA accessible, liste 2026 présente"
        : "Site WADA accessible, vérifier si liste 2026 est active",
    };
  } catch (e) {
    return { error: `WADA inaccessible : ${e.message}` };
  }
}
