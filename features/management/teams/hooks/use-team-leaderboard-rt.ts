import { useQuery } from "@tanstack/react-query";

export type TeamLeaderboardRealtimeEntry = Record<string, unknown>;

export interface TeamLeaderboardRealtimePayload {
  teamId: string;
  leaderboard: TeamLeaderboardRealtimeEntry[];
}

/**
 * Cache-only hook: data được bơm từ Socket.IO event LEADERBOARD_UPDATED.
 * Không gọi API, chỉ subscribe để UI tự rerender khi query cache thay đổi.
 */
export const useTeamLeaderboardRealtime = (teamId: string | undefined) => {
  return useQuery<TeamLeaderboardRealtimePayload | null>({
    queryKey: ["team-leaderboard-rt", teamId],
    enabled: false,
    queryFn: async () => null,
    initialData: null,
  });
};

