import { useQuery } from "@tanstack/react-query";
import { getLecturerProjectsApi } from "../api/project-api";
import { ProjectManagement } from "../types/types";

export const useLecturerProjects = (classId: string | undefined) => {
  return useQuery<ProjectManagement[]>({
    queryKey: ["lecturer-projects", classId],
    queryFn: () => getLecturerProjectsApi(classId!),
    enabled: !!classId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    placeholderData: [],
  });
};
