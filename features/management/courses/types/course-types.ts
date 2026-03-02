/**
 * Type cho lớp học của sinh viên - dùng cho StudentClassesGrid
 */
export interface StudentClassItem {
  id: string;
  className: string;
  subjectCode: string;
  subjectName: string;
  semester: string;
  color: string;
  role: "Leader" | "Member";
  teamName: string;
  teamId?: string;
  isLeader: boolean;
}
