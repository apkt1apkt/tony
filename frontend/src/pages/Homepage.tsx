import { Spin } from "antd";
import { TournamentInfo } from "./TournamentPage";
import { useGetTournament } from "../hooks/tournaments";

export default function Homepage() {
  const { data: tournament, isLoading } = useGetTournament(0);
  return (
    <Spin spinning={isLoading}>
      <TournamentInfo tournament={tournament} isLoading={false} />
    </Spin>
  );
}
