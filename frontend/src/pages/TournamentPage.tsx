import React from "react";
import { useParams } from "react-router-dom";
import { Divider, Spin, Row, Col } from "antd";
import StandingPage from "./StandingPage";
import FixturesPage from "./FixturesPage";
import { useGetTournament } from "../hooks/tournaments";
import { Tournament } from "../types";
import { TournamentTypeDisplay } from "../components/TournamentTypeDisplay";

export const TournamentInfo = (props: { tournament: Tournament; isLoading: boolean }) => {
  return (
    <Spin spinning={props.isLoading}>
      <h2>{props.tournament?.name}</h2>
      <TournamentTypeDisplay type={props.tournament?.type} />
      <Divider />
      <Row gutter={[12, 12]}>
        <Col xs={24} md={12}>
          <StandingPage tournament={props.tournament} />
        </Col>
        <Col xs={24} md={12}>
          <FixturesPage tournament={props.tournament} />
        </Col>
      </Row>
    </Spin>
  );
};

const TournamentPage: React.FC = () => {
  const { id } = useParams();
  const { data: tournament, isLoading } = useGetTournament(Number(id));
  return <TournamentInfo tournament={tournament} isLoading={isLoading} />;
};

export default TournamentPage;
