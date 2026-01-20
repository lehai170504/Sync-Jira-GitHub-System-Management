import { ClassItem, Student } from "./class-types";

export const classesData: ClassItem[] = [
  {
    id: "C01",
    code: "SE1740",
    subject: "SWP391",
    lecturer: "gv_hien@fpt.edu.vn",
    students: 28,
    status: "Active",
    semester: "SP24",
  },
  {
    id: "C02",
    code: "SE1741",
    subject: "SWP391",
    lecturer: "gv_binh@fpt.edu.vn",
    students: 30,
    status: "Active",
    semester: "SP24",
  },
  {
    id: "C03",
    code: "AI1801",
    subject: "PRN231",
    lecturer: "gv_tuan@fpt.edu.vn",
    students: 25,
    status: "Finished",
    semester: "FA23",
  },
  {
    id: "C04",
    code: "SE1742",
    subject: "SWR302",
    lecturer: "gv_hoa@fpt.edu.vn",
    students: 32,
    status: "Active",
    semester: "SP24",
  },
  {
    id: "C05",
    code: "GD1201",
    subject: "GRA201",
    lecturer: "gv_minh@fpt.edu.vn",
    students: 18,
    status: "Upcoming",
    semester: "SU24",
  },
  {
    id: "C06",
    code: "MKT201",
    subject: "MKT101",
    lecturer: "gv_lan@fpt.edu.vn",
    students: 40,
    status: "Active",
    semester: "SP24",
  },
];

export const mockStudents: Student[] = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    roll: "SE123456",
    email: "annv@fpt.edu.vn",
    team: "Team 1",
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    roll: "SE123457",
    email: "binhtt@fpt.edu.vn",
    team: "Team 1",
  },
  {
    id: 3,
    name: "Lê Hoàng Cường",
    roll: "SE123458",
    email: "cuonglh@fpt.edu.vn",
    team: "Team 2",
  },
];
