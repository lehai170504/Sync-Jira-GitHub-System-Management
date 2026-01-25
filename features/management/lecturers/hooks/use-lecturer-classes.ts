// features/management/lecturers/hooks/use-lecturer-classes.ts

import { useQuery } from "@tanstack/react-query";
import { getLecturerClassesApi } from "../api/lecturer-classes-api";

export const useLecturerClasses = (lecturerId: string | undefined) => {
  return useQuery({
    queryKey: ["lecturer-classes", lecturerId], // Cache key theo ID giảng viên
    queryFn: () => getLecturerClassesApi(lecturerId!),
    enabled: !!lecturerId, // Chỉ gọi API khi đã có ID (từ useProfile)
    staleTime: 1000 * 60 * 5, // Cache dữ liệu trong 5 phút
    retry: 1,
  });
};
