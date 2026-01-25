import { useQuery } from "@tanstack/react-query";
import { getSemesterDetailsApi } from "../api/semester-api";

export const useSemesterDetails = (semesterId: string | undefined) => {
  return useQuery({
    queryKey: ["semester-details", semesterId], // Unique key
    queryFn: () => getSemesterDetailsApi(semesterId!),
    enabled: !!semesterId, // Only fetch if ID exists
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
