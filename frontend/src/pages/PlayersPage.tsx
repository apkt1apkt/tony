/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Table, Button, Input, Form, Popconfirm, message, Card, Statistic, Row, Col, Divider } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "../api";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import ButtonGroup from "antd/es/button/button-group";

const queryKey = ["players"];

const PlayersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [newPlayerName, setNewPlayerName] = useState("");

  const { data: players, isLoading } = useQuery<{ name: string; isActive: boolean }[]>({
    queryKey,
    queryFn: () => apiGet("/players"),
    refetchOnMount: true,
  });

  const { mutate: addPlayer } = useMutation({
    mutationFn: (name: string) => apiPost("/players", { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setNewPlayerName("");
      message.success("Player added successfully");
    },
  });

  const { mutate: activatePlayer } = useMutation({
    mutationFn: ({ playerId, asActive }: { playerId: number; asActive: boolean }) =>
      apiPost(`/players/${playerId}/activate`, { asActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const onAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName);
    } else {
      message.warning("Please enter a player name");
    }
  };

  const markAsActive = (playerId: number, asActive: boolean) => () => {
    activatePlayer({ playerId, asActive });
  };

  const columns = [
    { title: "Player Name", dataIndex: "name", key: "name" },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      width: 5,
      align: "center",
      render: (isActive: boolean) =>
        isActive ? <CheckOutlined style={{ color: "blue" }} /> : <CloseOutlined style={{ color: "red" }} />,
    },
    {
      title: "Date Added",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      align: "center",
      render: (date: any) => (date ? format(date, "h:mm a") : ""),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_: any, player: any) => (
        <ButtonGroup>
          {!!player.isActive && (
            <Popconfirm
              title="Are you sure you want to mark player as inactive?"
              onConfirm={markAsActive(player.id, false)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger>
                Mark As Inactive
              </Button>
            </Popconfirm>
          )}
          {!player.isActive && (
            <Popconfirm
              title="Are you sure you want to mark player as active?"
              onConfirm={markAsActive(player.id, true)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary">Mark As Active</Button>
            </Popconfirm>
          )}
        </ButtonGroup>
      ),
    },
  ];

  const activePlayers = players?.filter((v) => v.isActive);

  return (
    <div>
      <h2>Players</h2>

      <Divider />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Form layout="inline" style={{ marginBottom: "20px" }}>
          <Form.Item>
            <Input
              placeholder="Enter player name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={onAddPlayer}>
              Add Player
            </Button>
          </Form.Item>
        </Form>

        <Row gutter={10}>
          <Col>
            <Card bordered={false}>
              <Statistic title="Total Players" value={players?.length} valueStyle={{ color: "#3f8600" }} />
            </Card>
          </Col>{" "}
          <Col>
            <Card bordered={false}>
              <Statistic title="Active Players" value={activePlayers?.length} valueStyle={{ color: "#3f8600" }} />
            </Card>
          </Col>
        </Row>
      </div>

      <Divider />

      <Table dataSource={players} columns={columns as any} rowKey="id" loading={isLoading} pagination={false} />
    </div>
  );
};

export default PlayersPage;
