import { useQuery } from "@tanstack/react-query";
import { getProfileApi } from "../api/profile-api";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfileApi,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
