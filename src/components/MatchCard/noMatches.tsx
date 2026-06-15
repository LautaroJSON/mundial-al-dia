import { formatDate, formatTime, Match } from "../../libs/api";
import { translateTeam } from "../../libs/translations";

export const NoMatches = ({
  argentinaNextMatch,
}: {
  argentinaNextMatch: Match | null;
}) => (
  console.log("argentinaNextMatch", argentinaNextMatch),
  (
    <div class={"no-matches"}>
      <div class={"texto"}>No hay partidos en vivo en este momento.</div>
      {argentinaNextMatch && (
        <div class="next-argentina">
          🇦🇷 Próximo partido de La Seleccion: <br />
          <strong>
            <img
              class="team-crest"
              style={"margin-right: 8px"}
              src={argentinaNextMatch.homeTeam.crest}
              alt={argentinaNextMatch.homeTeam.shortName}
              width="36"
              height="36"
            />
            {translateTeam(argentinaNextMatch.homeTeam.name)} vs{" "}
            {translateTeam(argentinaNextMatch.awayTeam.name)}
            <img
              class="team-crest"
              style={"margin-left: 8px"}
              src={argentinaNextMatch.awayTeam.crest}
              alt={argentinaNextMatch.awayTeam.shortName}
              width="36"
              height="36"
            />
          </strong>
          el <strong>{formatDate(argentinaNextMatch.utcDate)}</strong> a las{" "}
          <strong>{formatTime(argentinaNextMatch.utcDate)}</strong>
        </div>
      )}
      <div>
        Puedes visitar las siguentes paginas para ver el resumen de los partidos
        y el itinerario:
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
  )
);
