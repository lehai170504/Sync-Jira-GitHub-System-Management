import { useQuery } from "@tanstack/react-query";
import { getSubjectDetailApi } from "../api/subject-api";

export const useSubjectDetail = (subjectId: string | undefined) => {
  return useQuery({
    queryKey: ["subject-detail", subjectId],
    queryFn: () => getSubjectDetailApi(subjectId!),
    enabled: !!subjectId, // Chỉ fetch khi có ID
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });
};
