/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Card, List, Typography, Row, Col, Divider, Collapse, Input, Button, message, Popconfirm } from "antd";
import { Fixture, Tournament } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "../api";
import { NUM_OF_CONSOLES } from "../constant";

const { Text } = Typography;
const { Panel } = Collapse;

const Fixtures = (props: { tournament?: Tournament }) => {
  const fixtures = props.tournament?.fixtures;

  const rounds = useMemo(() => {
    return [...new Set(fixtures?.map((fixture) => fixture.round))];
  }, [fixtures]);

  const activeRound = useMemo(() => {
    for (const round of rounds) {
      const currentRoundFixtures = fixtures?.filter((fixture) => fixture.round === round);
      const allFixturesHaveScores = currentRoundFixtures?.every(
        (fixture) => fixture.homeScore !== null && fixture.awayScore !== null
      );
      if (!allFixturesHaveScores) return round;
    }
    return null;
  }, [fixtures, rounds]);

  return (
    <Card bordered={false} style={{ backgroundColor: "#f9f9f9", margin: 0 }}>
      <Collapse size="small" defaultActiveKey={activeRound || 0}>
        {rounds?.map((round) => {
          const isActiveRound = round === activeRound;
          return (
            <Panel
              style={isActiveRound ? { backgroundColor: "azure", margin: 0, borderRadius: 2, color: "white" } : {}}
              header={`Round ${round}`}
              key={round}
            >
              <List
                grid={{ gutter: 8, column: NUM_OF_CONSOLES }}
                dataSource={smartShuffle(
                  fixtures?.filter((fixture) => fixture.round === round),
                  round,
                  props.tournament?.type === "Knockout"
                )}
                bordered
                size="small"
                renderItem={(fixture) => <FixtureRound fixture={fixture} isActiveRound={isActiveRound} />}
              />
            </Panel>
          );
        })}
      </Collapse>
    </Card>
  );
};

const FixtureRound = (props: { fixture: Fixture; isActiveRound: boolean }) => {
  const { home, homeScore, away, awayScore } = props.fixture;
  const [scores, setScores] = useState({
    homeScore: props.fixture.homeScore || 0,
    awayScore: props.fixture.awayScore || 0,
  });
  const queryClient = useQueryClient();
  const { mutate: saveFixtureScore } = useMutation({
    mutationFn: (scores: any) => apiPost(`/fixtures/${props.fixture.id}/scores`, scores),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`tournament`] });
      message.success("Scores Saved Successfully");
    },
  });

  useEffect(() => {
    setScores({
      homeScore: homeScore || 0,
      awayScore: awayScore || 0,
    });
  }, [homeScore, awayScore]);

  const isScored = homeScore !== null && Number(homeScore) >= 0 && awayScore !== null && Number(awayScore) >= 0;

  const handleSaveScore = () => {
    saveFixtureScore(scores);
  };

  return (
    <div key={props.fixture.id}>
      <Row justify="center" align="middle" style={{ padding: "2px 0" }}>
        <Col span={8} style={{ textAlign: "right" }}>
          <Text
            strong
            style={{
              fontSize: 12,
              color: isScored && homeScore! > awayScore! ? "blue" : homeScore! === awayScore! ? "#908d8e" : "unset",
            }}
          >
            {home?.name || "SYSTEM"}
          </Text>
        </Col>

        <Col span={8} style={{ textAlign: "center" }}>
          {isScored ? (
            <Text style={{ fontSize: 12, color: "#8c8c8c" }}>
              ({homeScore} - {awayScore})
            </Text>
          ) : (
            <Text style={{ fontSize: 12, color: "#8c8c8c" }}>vs</Text>
          )}
        </Col>

        <Col span={8} style={{ textAlign: "left" }}>
          <Text
            strong
            style={{
              fontSize: 12,
              color: isScored && awayScore! > homeScore! ? "blue" : awayScore! === homeScore! ? "#908d8e" : "unset",
            }}
          >
            {away?.name || "SYSTEM"}
          </Text>
        </Col>
      </Row>

      {!isScored && (
        <Row style={{ marginBottom: 5 }} gutter={0} justify="center">
          <Col span={6} style={{ textAlign: "right" }}>
            <Input
              placeholder="Home score"
              value={scores.homeScore}
              onChange={(e) =>
                setScores((scores) => ({
                  ...scores,
                  homeScore: Number(e.target.value),
                }))
              }
              style={{ width: "80%" }}
              type="number"
              min={0}
              size="small"
            />
          </Col>

          <Col span={6} style={{ textAlign: "left" }}>
            <Input
              placeholder="Away score"
              value={scores.awayScore}
              onChange={(e) =>
                setScores((scores) => ({
                  ...scores,
                  awayScore: Number(e.target.value),
                }))
              }
              style={{ width: "80%" }}
              type="number"
              min={0}
              size="small"
            />
          </Col>

          <Col span={6} style={{ textAlign: "left", marginLeft: -10 }}>
            <Popconfirm
              title={`Confirm to save score (${scores.homeScore} - ${scores.awayScore})`}
              onConfirm={handleSaveScore}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" type="primary">
                Save Score
              </Button>
            </Popconfirm>
          </Col>
        </Row>
      )}
      <Divider style={{ marginTop: 0, marginBottom: 0 }} />
    </div>
  );
};

function smartShuffle(arr: any[] | undefined, num: number, doSmartShuffle: boolean) {
  if (!doSmartShuffle) return arr;
  if (!arr?.length) return arr;
  const n = num % arr.length;
  return arr.slice(n).concat(arr.slice(0, n));
}

export default Fixtures;
