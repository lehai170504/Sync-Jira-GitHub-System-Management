import { useQuery } from "@tanstack/react-query";
import { getMyProjectApi } from "../api/project-api";

export const useMyProject = () => {
  return useQuery({
    // Sử dụng Query Key riêng biệt cho Project
    queryKey: ["my-project"],

    // Gọi hàm API đã tách ở trên
    queryFn: getMyProjectApi,

    // Cấu hình cache: Dữ liệu dự án ít thay đổi nên giữ cache lâu (10 phút)
    staleTime: 10 * 60 * 1000,

    // Tùy chọn: Không tự động gọi lại khi focus cửa sổ nếu bạn muốn tối ưu hiệu năng
    refetchOnWindowFocus: false,
  });
};
