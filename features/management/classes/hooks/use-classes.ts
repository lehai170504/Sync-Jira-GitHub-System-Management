import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getClassesApi,
  createClassApi,
  importStudentsApi,
  getClassStudentsApi,
  addStudentApi,
  removeStudentsApi,
  updateStudentsApi,
} from "../api/class-api";
import {
  AddStudentPayload,
  ClassFilters,
  CreateClassPayload,
  ImportStudentsPayload,
  RemoveStudentsPayload,
  UpdateStudentsPayload,
} from "../types";

// Hook lấy danh sách lớp (Query)
export const useClasses = (filters: ClassFilters) => {
  return useQuery({
    queryKey: ["classes", filters],
    queryFn: () => getClassesApi(filters),
    staleTime: 1 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

// Hook tạo lớp học (Mutation)
export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClassPayload) => createClassApi(payload),
    onSuccess: () => {
      toast.success("Tạo lớp học thành công!");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Lỗi khi tạo lớp học";
      toast.error(msg);
    },
  });
};

export const useImportStudents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ImportStudentsPayload) => importStudentsApi(payload),
    onSuccess: (_, variables) => {
      toast.success("Import danh sách sinh viên thành công!");
      queryClient.invalidateQueries({
        queryKey: ["class-students", variables.classId],
      });
      // Or just refresh the classes list
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Lỗi khi import sinh viên";
      toast.error(msg);
    },
  });
};

export const useClassStudents = (classId: string | undefined) => {
  return useQuery({
    queryKey: ["class-students", classId],
    queryFn: () => getClassStudentsApi(classId!),
    enabled: !!classId, // Only fetch if classId is present
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Hook Thêm sinh viên lẻ
export const useAddStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddStudentPayload) => addStudentApi(payload),
    onSuccess: (_, variables) => {
      toast.success("Thêm sinh viên thành công!");
      queryClient.invalidateQueries({
        queryKey: ["class-students", variables.classId],
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Thêm thất bại");
    },
  });
};

// Hook Xóa sinh viên
export const useRemoveStudents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RemoveStudentsPayload) => removeStudentsApi(payload),
    onSuccess: (_, variables) => {
      toast.success("Xóa sinh viên thành công!");
      queryClient.invalidateQueries({
        queryKey: ["class-students", variables.classId],
      });
    },
    onError: (error: any) => {
      console.error("Delete Error:", error);
      toast.error(error.response?.data?.message || "Xóa thất bại");
    },
  });
};

// Hook Cập nhật sinh viên (VD: Set Leader)
export const useUpdateStudents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateStudentsPayload) => updateStudentsApi(payload),
    onSuccess: (_, variables) => {
      toast.success("Cập nhật thành công!");
      queryClient.invalidateQueries({
        queryKey: ["class-students", variables.classId],
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    },
  });
};
