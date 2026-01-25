import { useQuery } from "@tanstack/react-query";
import { getClassTeamsApi } from "../api/team-api";

export const useClassTeams = (classId: string | undefined) => {
  return useQuery({
    queryKey: ["class-teams", classId], // Cache theo classId
    queryFn: () => getClassTeamsApi(classId!),
    enabled: !!classId, // Chỉ chạy khi có classId
    staleTime: 1000 * 60 * 5, // Cache 5 phút để đỡ gọi lại nhiều lần
  });
};
