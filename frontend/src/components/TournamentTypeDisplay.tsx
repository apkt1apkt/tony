import { RadarChartOutlined, ScissorOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import { TournamentType } from "../types";

export const TournamentTypeDisplay = (props: { type: TournamentType }) => {
  if (props.type === "League")
    return (
      <Tag icon={<RadarChartOutlined />} color="blue">
        League
      </Tag>
    );
  if (props.type === "Knockout")
    return (
      <Tag icon={<ScissorOutlined />} color="success">
        Knockout
      </Tag>
    );
};
