import type { Context } from "hono";
import { getLiveMatches, getNextMatchForTeam } from "../libs/api";
import { Layout } from "../layout";
import { MatchCard } from "../components/MatchCard";
import { NoMatches } from "../components/MatchCard/noMatches";

async function homePage(c: Context) {
  const matches = await getLiveMatches(c.env);
  const nextArgentina = await getNextMatchForTeam(c.env, 762);
  return c.html(
    <Layout>
      {matches[0] === undefined ? (
        <NoMatches argentinaNextMatch={nextArgentina} />
      ) : (
        <MatchCard match={matches[0]} />
      )}
    </Layout>,
  );
}

export default homePage;
