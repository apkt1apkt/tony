/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bracket, IRenderSeedProps, Seed, SeedItem, SeedTeam } from "react-brackets";
import { Spin, Typography } from "antd";
import { Fixture, Tournament } from "../types";
import { useMemo } from "react";

const { Text } = Typography;

type Team = {
  name?: string;
  scores?: number[];
};

type Seed = {
  teams: Team[];
};

type SeedTeamProps = {
  team: Team;
  isWinner: boolean;
};

const DrawPage = (props: { tournament?: Tournament }) => {
  const rounds = useMemo(
    () => mapTournamentToKnockout(props.tournament?.numOfPlayers || 0, props.tournament?.fixtures),
    [props.tournament?.numOfPlayers, props.tournament?.fixtures]
  );
  if (!rounds) return <Spin spinning></Spin>;
  return (
    <div style={{ overflow: "auto" }}>
      <Bracket rounds={rounds} renderSeedComponent={CustomSeed} />
    </div>
  );
};

const groupFixturesByRounds = (fixtures?: Fixture[]) => {
  const groups: Record<number, Fixture[]> = {};
  fixtures?.forEach((f) => {
    if (!groups[f.round]) groups[f.round] = [];
    groups[f.round].push(f);
  });
  return groups;
};

const groupFixturesByTeams = (fixtures?: Fixture[]) => {
  const result: Record<
    string,
    {
      id: string;
      playerA: { name?: string; scores?: (number | null)[] };
      playerB: { name?: string; scores?: (number | null)[] };
    }
  > = {};
  fixtures?.forEach((f) => {
    const homeId = f.homeId || 0;
    const awayId = f.awayId || 0;
    const id = homeId > awayId ? `${awayId}-${homeId}` : `${homeId}-${awayId}`;
    if (!result[id]) {
      result[id] = {
        id,
        playerA: {
          name: homeId > awayId ? f.away?.name : f.home?.name,
          scores: [],
        },
        playerB: {
          name: awayId > homeId ? f.away?.name : f.home?.name,
          scores: [],
        },
      };
    }
    result[id].playerA.scores?.push(homeId > awayId ? f.awayScore! : f.homeScore!);
    result[id].playerB.scores?.push(awayId > homeId ? f.awayScore! : f.homeScore!);
  });
  return Object.values(result);
};

const mapTournamentToKnockout = (numOfPlayers: number, fixtures?: Fixture[]) => {
  if (!fixtures?.length) return;
  const roundFixtures = groupFixturesByRounds(fixtures);
  return Object.keys(roundFixtures).map((round) => {
    const fixtures = groupFixturesByTeams(roundFixtures[round as any]);
    return {
      title: getTournamentRoundLabel(numOfPlayers, Number(round)),
      seeds: fixtures.map((f) => ({
        id: f.id,
        teams: [f.playerA, f.playerB],
      })),
    };
  });
};

const CustomSeedTeam = (props: SeedTeamProps) => {
  const { isWinner, team } = props;
  return (
    <SeedTeam>
      <Text strong={isWinner} style={{ fontSize: 12, color: isWinner ? "blue" : "black" }}>
        {team.name}
        {isWinner ? " *" : ""}
      </Text>
      {team.scores?.length && (
        <div>
          {team.scores?.map((v, i) => (
            <Text strong style={{ fontSize: 12, marginLeft: i === 0 ? 0 : 5, color: "#6e7275" }}>
              {v}
            </Text>
          ))}
        </div>
      )}
    </SeedTeam>
  );
};

const CustomSeed = (props: IRenderSeedProps) => {
  const [homeTeam, awayTeam] = props.seed.teams;
  const totalHomeScores = homeTeam?.scores?.reduce((a: any, c: any) => +c + +a);
  const totalAwayScores = awayTeam?.scores?.reduce((a: any, c: any) => +c + +a);
  return (
    <Seed mobileBreakpoint={props.breakpoint} style={{ fontSize: 12 }}>
      <SeedItem style={{ backgroundColor: "unset", borderRadius: 8 }}>
        <div style={{ margin: 2 }}>
          {homeTeam?.name && <CustomSeedTeam team={homeTeam} isWinner={totalHomeScores > totalAwayScores} />}
          {awayTeam?.name && <CustomSeedTeam team={awayTeam} isWinner={totalAwayScores > totalHomeScores} />}
        </div>
      </SeedItem>
    </Seed>
  );
};

const getTournamentRoundLabel = (numberOfPlayers: number, round: number) => {
  const nextPowerOf2 = (n: number) => Math.pow(2, Math.ceil(Math.log2(n)));
  const nextPower = nextPowerOf2(numberOfPlayers);
  while (numberOfPlayers < nextPower) numberOfPlayers += 1;
  const rounds = [
    "Winner",
    "Final",
    "Semi-final",
    "Quarter-finals",
    "Round of 16",
    "Round of 32",
    "Round of 64",
    "Round of 128",
  ];
  const totalRounds = Math.log2(numberOfPlayers);
  const roundIndex = totalRounds - round + 1;
  if (roundIndex >= 0 && roundIndex < rounds.length) {
    return rounds[roundIndex];
  }
  return `Round of ${Math.pow(2, totalRounds - round + 1)}`;
};

export default DrawPage;
