import { useQuery } from "@tanstack/react-query";
import { getClassDetailsApi } from "../api/class-details-api";

export const useClassDetails = (classId: string | undefined | null) => {
  return useQuery({
    queryKey: ["class-details", classId], // Cache theo ID lớp
    queryFn: () => getClassDetailsApi(classId!),
    enabled: !!classId, // Chỉ gọi khi có classId
    staleTime: 1000 * 60 * 5, // Cache 5 phút
    retry: 1,
  });
};
