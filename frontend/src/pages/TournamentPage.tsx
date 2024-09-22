import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Divider, Spin, Row, Col, Card, Statistic } from "antd";
import StandingPage from "./StandingPage";
import FixturesPage from "./FixturesPage";
import { useGetTournament } from "../hooks/tournaments";
import { Tournament } from "../types";
import { TournamentTypeDisplay } from "../components/TournamentTypeDisplay";

export const TournamentInfo = (props: { tournament: Tournament; isLoading: boolean }) => {
  const fixtureStatus = useMemo(() => {
    const fixtureStatus = {
      played: 0,
      toPlay: 0,
    };
    props.tournament.fixtures?.forEach((f) => {
      if (f.away && f.home) {
        if (f.awayScore === null || f.homeScore === null) fixtureStatus.toPlay += 1;
        else fixtureStatus.played += 1;
      }
    });
    return fixtureStatus;
  }, [props.tournament.fixtures]);
  return (
    <Spin spinning={props.isLoading}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>{props.tournament?.name}</h2>
          <TournamentTypeDisplay type={props.tournament?.type} />
        </div>
        <Row style={{ margin: 0 }} gutter={10}>
          <Col>
            <Card bordered={false}>
              <Statistic title="Results (games played)" value={fixtureStatus.played} valueStyle={{ color: "blue" }} />
            </Card>
          </Col>
          <Col>
            <Card bordered={false}>
              <Statistic
                title="Fixtures (games remaining)"
                value={fixtureStatus.toPlay}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
        </Row>
      </div>

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
