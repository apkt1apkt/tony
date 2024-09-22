import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "antd/dist/reset.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/Homepage";
import PlayersPage from "./pages/PlayersPage";
import TournamentsPage from "./pages/TournamentsPage";
import TournamentPage from "./pages/TournamentPage";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/tournaments" element={<TournamentsPage />} />
            <Route path="/tournaments/:id/" element={<TournamentPage />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);
