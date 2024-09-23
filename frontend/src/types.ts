export type Tournament = {
  id: number;
  name: string;
  type: TournamentType;
  numOfPlayers: number;
  fixtures?: Fixture[];
  standings?: Standing[];
};

export type Fixture = {
  id: number;
  round: number;
  homeId: number;
  awayId: number;
  homeScore?: number;
  awayScore?: number;
  home?: Player;
  away?: Player;
};

export type Player = {
  id: number;
  name: string;
};

export type TournamentType = "League" | "Knockout";

export type Standing = {
  key: number;
  rank: number;
  player: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  points: number;
  form: ("W" | "L" | "D")[];
};
