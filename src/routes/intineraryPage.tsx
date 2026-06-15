import type { Context } from "hono";
import { Layout } from "../layout";
import { MatchCard } from "../components/MatchCard";
import { getAllMatches, groupByDate, type Match, type Env } from "../libs/api";
import { translateTeam } from "../libs/translations";

// Extrae todos los países únicos de los matches, ordenados alfabéticamente en español
function getTeams(matches: Match[]): { name: string; translated: string }[] {
  const seen = new Set<string>();
  const teams: { name: string; translated: string }[] = [];

  for (const m of matches) {
    for (const team of [m.homeTeam, m.awayTeam]) {
      if (!seen.has(team.name)) {
        seen.add(team.name);
        teams.push({ name: team.name, translated: translateTeam(team.name) });
      }
    }
  }
  console.log("teams", teams);
  return teams.sort((a, b) => {
    if (a.name !== null && b.name !== null)
      return a.translated.localeCompare(b.translated, "es");
    return 0;
  });
}

export async function itineraryPage(c: Context<{ Bindings: Env }>) {
  const all = await getAllMatches(c.env);

  // Query params
  const teamFilter = c.req.query("pais") ?? "all";
  const stageFilter = c.req.query("stage") ?? "all";

  // Filtrar matches según los params
  const filtered = all.filter((m) => {
    const matchesTeam =
      teamFilter === "all" ||
      m.homeTeam.name === teamFilter ||
      m.awayTeam.name === teamFilter;

    const matchesStage = stageFilter === "all" || m.stage === stageFilter;

    return matchesTeam && matchesStage;
  });

  const byDate = groupByDate(filtered);
  const teams = getTeams(all); // siempre todos los países para el select

  const stages = [
    { value: "all", label: "Todas las fases" },
    { value: "GROUP_STAGE", label: "Fase de Grupos" },
    { value: "LAST_16", label: "Octavos" },
    { value: "QUARTER_FINALS", label: "Cuartos" },
    { value: "SEMI_FINALS", label: "Semifinales" },
    { value: "FINAL", label: "Final" },
  ];

  return c.html(
    <Layout title="Mundial 2026 — Itinerario">
      <h2 class="section-label">🗓 Itinerario</h2>

      {/* ── Filtros ── */}
      <div class="filters-wrapper">
        {/* Select de países — htmx hace GET /itinerario?pais=X al cambiar */}
        <div class="filter-group">
          <label class="filter-label" for="pais-select">
            País
          </label>
          <select id="pais-select" class="filter-select">
            <option value="all">Todos los países</option>
            {teams.map((t) => (
              <option value={t.name}>{t.translated}</option>
            ))}
          </select>
        </div>

        {/* Select de fase */}
        <div class="filter-group">
          <label class="filter-label" for="stage-select">
            Fase
          </label>
          <select id="stage-select" class="filter-select">
            {stages.map((s) => (
              <option value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Lista de partidos — htmx reemplaza este div ── */}
      <div id="schedule">
        <ScheduleList byDate={byDate} filtered={filtered} />
      </div>
    </Layout>,
  );
}

// ── Componente compartido entre la página completa y el partial ──
function ScheduleList({
  byDate,
  filtered,
}: {
  byDate: Map<string, Match[]>;
  filtered: Match[];
}) {
  if (filtered.length === 0) {
    return (
      <div class="empty-state">
        <div class="icon">🔍</div>
        <p>No hay partidos que coincidan con los filtros.</p>
      </div>
    );
  }

  return (
    <>
      {Array.from(byDate.entries()).map(([date, matches]) => (
        <div class="day-group">
          <div class="day-header">{date}</div>
          {matches.map((m) => (
            <MatchCard match={m} />
          ))}
        </div>
      ))}
    </>
  );
}
