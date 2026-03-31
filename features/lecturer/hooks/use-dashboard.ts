import { useQuery } from "@tanstack/react-query";
import { getClassDashboardApi } from "../api/dashboard-api"; // Import từ file API mới tách

export const useClassDashboard = (classId?: string) => {
  return useQuery({
    queryKey: ["class-dashboard", classId],
    queryFn: () => getClassDashboardApi(classId!),
    enabled: !!classId, // Chỉ gọi khi đã xác định được classId
    staleTime: 1000 * 60 * 5, // Tùy chọn: Cache lại 5 phút cho mượt, đỡ gọi BE liên tục
  });
};
