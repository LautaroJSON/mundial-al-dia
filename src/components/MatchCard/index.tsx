import type { FC } from "hono/jsx";
import type { Match } from "../../libs/api";
import { formatTime, stageLabel } from "../../libs/api";

interface Props {
  match: Match;
}

const LIVE_STATUSES = new Set(["IN_PLAY", "PAUSED"]);

export const MatchCard: FC<Props> = ({ match }) => {
  console.log("match", match);
  if (match === undefined) {
    return (
      <div class={"no-matches"}>
        <div class={"texto"}>No hay partidos en vivo en este momento.</div>
        <div>
          Puedes visitar las siguentes paginas para ver el resumen de los
          partidos y el itinerario:
          <div class="sponsors">
            <a href="https://onefootball.com/es/inicio" target="_blank">
              <img
                src="https://filebucket.onefootball.com/2026/5/1777890758102-onefootball.png"
                alt="onefootball.com"
                width={150}
              />
            </a>
            <a href="https://www.tycsports.com/" target="_blank">
              <img
                src="https://statics-files.tycsports.com/frontend/tycsports/img/logos_2026/logo-azul.svg"
                alt=" tycsports.com"
              />
            </a>
          </div>
        </div>
      </div>
    );
  }
  const isLive = LIVE_STATUSES.has(match.status);
  const isFinished = match.status === "FINISHED";
  const score = match.score.fullTime;
  const htScore = match.score.halfTime;

  const hasScore =
    (isLive || isFinished) && score.home !== null && score.away !== null;

  const scoreDisplay = hasScore ? `${score.home} · ${score.away}` : "vs";

  const showHalfTime =
    isFinished &&
    htScore.home !== null &&
    htScore.away !== null &&
    !(htScore.home === score.home && htScore.away === score.away);

  return (
    <>
      <article class={`match-card${isLive ? " is-live" : ""}`}>
        {/* Meta row: stage + time */}
        <div class="match-meta">
          <span class="stage-pill">{stageLabel(match.stage, match.group)}</span>
          <span class={`match-time${isLive ? " live" : ""}`}>
            {isLive
              ? match.status === "PAUSED"
                ? "⏸ Medio tiempo"
                : "🔴 En juego"
              : isFinished
                ? "✓ Final"
                : `⏰ ${formatTime(match.utcDate)}`}
          </span>
        </div>

        {/* Teams + score */}
        <div class="match-body">
          <div class="team home">
            {match.homeTeam.crest && (
              <img
                class="team-crest"
                src={match.homeTeam.crest}
                alt={match.homeTeam.shortName}
                width="36"
                height="36"
              />
            )}
            <span class="team-name">{match.homeTeam.shortName}</span>
          </div>

          <div class="score-box">
            <span class={`score-main${isLive ? " live" : ""}`}>
              {scoreDisplay}
            </span>
            {showHalfTime && (
              <span class="score-ht">
                ET: {htScore.home}–{htScore.away}
              </span>
            )}
          </div>

          <div class="team away">
            {match.awayTeam.crest && (
              <img
                class="team-crest"
                src={match.awayTeam.crest}
                alt={match.awayTeam.shortName}
                width="36"
                height="36"
              />
            )}
            <span class="team-name">{match.awayTeam.shortName}</span>
          </div>
        </div>
      </article>
    </>
  );
};
