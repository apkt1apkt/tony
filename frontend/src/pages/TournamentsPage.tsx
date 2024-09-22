/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Table, Button, Input, Form, message, Divider, Select } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "../api";
import { Link, Outlet } from "react-router-dom";
import { format } from "date-fns";
import { TournamentType } from "../types";
import { TournamentTypeDisplay } from "../components/TournamentTypeDisplay";

const queryKey = ["tournaments"];

const TournamentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentType, setTournamentType] = useState<TournamentType | "">("League");
  const [numOfLegs, setNumOfLegs] = useState(0);

  const { data: tournaments, isLoading } = useQuery({
    queryKey,
    queryFn: () => apiGet("/tournaments"),
    refetchOnMount: true,
  });

  const { mutate: createTournament } = useMutation({
    mutationFn: (data: any) => apiPost("/tournaments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setTournamentName("");
      setTournamentType("");
      setNumOfLegs(0);
      message.success("Tournament created successfully");
    },
  });

  const handleCreateTournament = () => {
    if (!tournamentName) return message.error("Tournament Name Is Required");
    if (!tournamentType) return message.error("Tournament Type Is Required");
    if (!numOfLegs) return message.error("Number Of Legs Is Required");
    createTournament({ name: tournamentName, type: tournamentType, numOfLegs });
  };

  const columns = [
    { title: "Tournament", dataIndex: "name", key: "name" },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      align: "center",
      width: 100,
      render: (type: any) => <TournamentTypeDisplay type={type} />,
    },
    { title: "Legs", dataIndex: "numOfLegs", key: "numOfLegs", align: "center", width: 50 },
    { title: "Status", dataIndex: "status", key: "status", align: "center", width: 100 },
    { title: "Winner", dataIndex: "winner", key: "winner", align: "center", width: 100 },
    { title: "Players", dataIndex: "numOfPlayers", key: "numOfPlayers", width: 50, align: "center" },
    {
      title: "Started At",
      dataIndex: "startedAt",
      key: "startedAt",
      width: 120,
      align: "center",
      render: (date: any) => (date ? format(date, "h:mm a") : ""),
    },
    {
      title: "Completed At",
      dataIndex: "completedAt",
      key: "CompletedAt",
      width: 130,
      align: "center",
      render: (date: any) => (date ? format(date, "h:mm a") : ""),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: { id: number }) => <Link to={`/tournaments/${record.id}`}>View</Link>,
    },
  ];

  return (
    <div>
      <h2>Tournaments</h2>

      <Divider />
      <Form layout="inline" style={{ marginBottom: "20px" }}>
        <Form.Item>
          <Input
            placeholder="Enter tournament name"
            value={tournamentName}
            onChange={(e) => setTournamentName(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Select style={{ minWidth: 120 }} value={tournamentType} onChange={(e) => setTournamentType(e)}>
            <Select.Option value=""> </Select.Option>
            <Select.Option value="League">League</Select.Option>
            <Select.Option value="Knockout">Knockout</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Input
            placeholder="Number Of Legs"
            type="number"
            max="2"
            min="1"
            value={numOfLegs}
            onChange={(e) => setNumOfLegs(Number(e.target.value))}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleCreateTournament}>
            Create New Tournament
          </Button>
        </Form.Item>
      </Form>
      <Divider />
      <Table
        dataSource={tournaments || []}
        columns={columns as any}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />
      <Outlet />
    </div>
  );
};

export default TournamentsPage;
