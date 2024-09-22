import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../api";

export const useGetTournament = (tournamentId: number) => {
  return useQuery({
    queryKey: [`tournament`],
    queryFn: () => apiGet(`/tournaments/${tournamentId}`),
    refetchOnMount: true,
  });
};
