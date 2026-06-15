import type { FC } from "hono/jsx";
import type { Match } from "../../libs/api";
import { formatTime, getMatchMinute, stageLabel } from "../../libs/api";
import { translateTeam } from "../../libs/translations";
import { NoMatches } from "./noMatches";

interface Props {
  match: Match;
}

const LIVE_STATUSES = new Set(["IN_PLAY", "PAUSED"]);

export const MatchCard: FC<Props> = ({ match }) => {
  console.log("match", match);

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
      <article
        class={`match-card${isLive ? " is-live" : ""}`}
        data-home={match.homeTeam.name}
        data-away={match.awayTeam.name}
        data-stage={match.stage}
      >
        {/* Meta row: stage + time */}
        <div class="match-meta">
          <span class="stage-pill">{stageLabel(match.stage, match.group)}</span>
          {isLive && (
            <span
              class={`match-minute${match.status === "PAUSED" ? " is-paused" : ""}`}
            >
              {match.status === "PAUSED"
                ? "ET"
                : getMatchMinute(match.utcDate, match.lastUpdated)}
            </span>
          )}
          <span class={`match-time${isLive ? " live" : ""}`}>
            {isLive
              ? match.status === "PAUSED"
                ? "⏸ Medio tiempo"
                : "🔴 En juego"
              : isFinished
                ? "✓ Finalizado"
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
            <span class="team-name">{translateTeam(match.homeTeam.name)}</span>
            <span class="team-name-original">{match.homeTeam.name}</span>
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
            <span class="team-name">{translateTeam(match.awayTeam.name)}</span>
            <span class="team-name-original">{match.awayTeam.name}</span>
          </div>
        </div>
      </article>
    </>
  );
};
