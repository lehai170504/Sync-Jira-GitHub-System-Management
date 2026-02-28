import { useQuery } from "@tanstack/react-query";
import { getMyProjectApi } from "../api/project-api";

export const useMyProject = () => {
  return useQuery({
    queryKey: ["my-project"],

    // BỌC HÀM LẠI VÀ THÊM FALLBACK (?? null) Ở ĐÂY 👇
    queryFn: async () => {
      const data = await getMyProjectApi();
      return data ?? null;
    },

    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
