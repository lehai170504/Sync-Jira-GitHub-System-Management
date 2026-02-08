// features/management/lecturers/hooks/use-lecturer-classes.ts

import { useQuery } from "@tanstack/react-query";
import { getLecturerClassesApi } from "../api/lecturer-classes-api";

export const useLecturerClasses = (lecturerId: string | undefined) => {
  return useQuery({
    queryKey: ["lecturer-classes", lecturerId],

    queryFn: async () => {
      if (!lecturerId) throw new Error("Lecturer ID is missing");
      return getLecturerClassesApi(lecturerId);
    },

    enabled: !!lecturerId,
    staleTime: 1000 * 60 * 5,
    retry: 1,

    placeholderData: (previousData) => previousData,
  });
};
