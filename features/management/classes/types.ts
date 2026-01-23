export interface Class {
  _id: string;
  name: string; // VD: "Software Engineering Project"
  semester_id: string; // ID của học kỳ
  lecturer_id: string; // ID của giảng viên
  // Các field khác nếu API trả về thêm (như lecturer_name, semester_code để hiển thị)
  lecturer?: {
    _id: string;
    full_name: string;
    email: string;
  };
  semester?: {
    _id: string;
    code: string;
  };
}

export interface ClassResponse {
  total: number;
  classes: Class[];
}

export interface CreateClassPayload {
  name: string;
  semester_id: string;
  lecturer_id: string;
}

export interface ClassFilters {
  semester_id?: string;
  page?: number;
  limit?: number;
}
