import type { Context } from "hono";
import { getLiveMatches } from "../libs/api";
import { Layout } from "../layout";
import { MatchCard } from "../components/MatchCard";

async function homePage(c: Context) {
  const matches = await getLiveMatches(c.env);
  return c.html(
    <Layout>
      <MatchCard match={matches[0]} />
    </Layout>,
  );
}

export default homePage;
