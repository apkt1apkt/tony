import React from "react";
import { Layout, Menu } from "antd";
import { Link, Outlet } from "react-router-dom";

const { Header, Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#fff", padding: 0 }}>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">
            <Link to="/homepage">HomePage</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/players">Players</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/tournaments">Tournaments</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Content style={{ margin: "16px", padding: "20px", background: "#fff" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
