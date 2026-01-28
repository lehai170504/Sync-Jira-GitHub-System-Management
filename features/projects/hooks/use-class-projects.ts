import { useQuery } from "@tanstack/react-query";
import { getClassProjectsApi } from "../api/project-api";

export const useClassProjects = (classId: string | undefined) => {
  return useQuery({
    queryKey: ["class-projects", classId],
    queryFn: () => getClassProjectsApi(classId!),
    enabled: !!classId, // Chỉ gọi API khi có classId
    staleTime: 1000 * 60 * 5, // Dữ liệu được coi là mới trong 5 phút
  });
};
