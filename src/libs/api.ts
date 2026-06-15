import { cached } from "./cache";

const BASE = "https://api.football-data.org/v4";

// En Workers las env vars no son globales.
// Todo lo que necesite TOKEN o COMPETITION lo recibe como parámetro.
export interface Env {
  API_TOKEN: string;
  COMPETITION_CODE?: string;
  CACHE: KVNamespace;
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  crest: string;
}

export interface Score {
  winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
  duration: "REGULAR" | "EXTRA_TIME" | "PENALTY_SHOOTOUT";
  fullTime: { home: number | null; away: number | null };
  halfTime: { home: number | null; away: number | null };
}

export type MatchStatus =
  | "SCHEDULED"
  | "TIMED"
  | "IN_PLAY"
  | "PAUSED"
  | "FINISHED"
  | "SUSPENDED"
  | "POSTPONED"
  | "CANCELLED"
  | "AWARDED";

export interface Match {
  id: number;
  utcDate: string;
  status: MatchStatus;
  matchday: number | null;
  stage: string;
  group: string | null;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
  competition: { name: string };
}

interface ApiResponse {
  matches: Match[];
}

// TTLs en segundos
const TTL = {
  live: 30, // 30s  — queremos ver goles rápido
  scheduled: 2 * 60, // 2min — los horarios no cambian seguido
  all: 5 * 60, // 5min — el itinerario es muy estable
};

async function fetchApi<T>(token: string, path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "X-Auth-Token": token },
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  console.log(res);
  return res.json() as Promise<T>;
}

export function getLiveMatches(env: Env): Promise<Match[]> {
  return cached("live-matches", TTL.live, () =>
    fetchApi<ApiResponse>(
      env.API_TOKEN,
      `/competitions/WC/matches?status=IN_PLAY,PAUSED`,
    ).then((d) => d.matches ?? []),
  );
}

export function getScheduledMatches(env: Env): Promise<Match[]> {
  return cached("scheduled-matches", TTL.scheduled, () =>
    fetchApi<ApiResponse>(
      env.API_TOKEN,
      `/competitions/WC/matches?status=SCHEDULED,TIMED`,
    ).then((d) => d.matches ?? []),
  );
}

export function getAllMatches(env: Env): Promise<Match[]> {
  return cached("all-matches", TTL.all, () =>
    fetchApi<ApiResponse>(env.API_TOKEN, `/competitions/WC/matches`).then(
      (d) => d.matches ?? [],
    ),
  );
}

// ─── Helpers de formato ───────────────────────

export function formatDate(utcDate: string): string {
  return new Date(utcDate).toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

export function formatTime(utcDate: string): string {
  return new Date(utcDate).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

export function stageLabel(stage: string, group: string | null): string {
  const labels: Record<string, string> = {
    GROUP_STAGE: group ? `Grupo ${group}` : "Fase de Grupos",
    LAST_16: "Octavos de Final",
    QUARTER_FINALS: "Cuartos de Final",
    SEMI_FINALS: "Semifinales",
    THIRD_PLACE: "Tercer Puesto",
    FINAL: "Final",
  };
  return labels[stage] ?? stage;
}

export function groupByDate(matches: Match[]): Map<string, Match[]> {
  const map = new Map<string, Match[]>();
  for (const m of matches) {
    const key = formatDate(m.utcDate);
    const arr = map.get(key) ?? [];
    arr.push(m);
    map.set(key, arr);
  }
  return map;
}
