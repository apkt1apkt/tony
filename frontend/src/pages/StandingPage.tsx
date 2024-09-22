/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Tag } from "antd";
import { Tournament } from "../types";

const columns = [
  {
    title: "#",
    dataIndex: "rank",
    key: "rank",
    align: "center",
    width: 30,
    render: (rank: any) => <Tag color={rank <= 3 ? "gold" : "silver"}>{rank}</Tag>,
  },
  {
    title: "Player",
    dataIndex: "player",
    key: "player",
    align: "left",
    width: 150,
  },
  {
    title: "MP",
    dataIndex: "matchesPlayed",
    key: "matchesPlayed",
    align: "center",
    width: 15,
    render: (mp: any) => <Tag color="blue">{mp}</Tag>,
  },
  {
    title: "WDL",
    key: "wdl",
    align: "center",
    width: 50,
    render: (record: any) => (
      <Tag color="green">
        {record.wins}-{record.draws}-{record.losses}
      </Tag>
    ), // Green tag for wins-draws-losses format
  },
  {
    title: "G",
    key: "goals",
    align: "center",
    width: 30,
    render: (record: any) => (
      <Tag color="purple">
        {record.goalsScored}:{record.goalsConceded}
      </Tag>
    ), // Purple for goals scored and conceded
  },
  {
    title: "Pts",
    dataIndex: "points",
    key: "points",
    align: "center",
    width: 30,
    render: (points: any) => <Tag color="cyan">{points}</Tag>, // Cyan for points
  },
  {
    title: "Form",
    key: "form",
    align: "center",
    render: (record: any) => (
      <div style={{ fontSize: 12 }}>
        {record.form.map((result: any, index: number) => (
          <Tag
            color={result === "W" ? "green" : result === "L" ? "red" : "geekblue"}
            key={index}
            style={{ marginRight: 4 }}
          >
            {result}
          </Tag>
        ))}
      </div>
    ),
  },
];

const StandingsTable = (props: { tournament?: Tournament }) => {
  const standings = props.tournament?.standings;
  return (
    <Table
      size="small"
      dataSource={standings}
      columns={columns as any}
      pagination={false}
      bordered
      rowClassName="standings-row"
      style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", padding: "16px" }}
    />
  );
};

export default StandingsTable;
