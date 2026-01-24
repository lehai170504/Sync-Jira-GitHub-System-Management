import { useQuery } from "@tanstack/react-query";
import { getMyClassesApi } from "../api/student-api";

export const useMyClasses = () => {
  return useQuery({
    queryKey: ["my-classes"],
    queryFn: getMyClassesApi,

    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
