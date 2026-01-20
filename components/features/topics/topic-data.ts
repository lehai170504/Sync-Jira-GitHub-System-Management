// Định nghĩa Interface chuẩn cho toàn bộ Feature Topic
export interface Topic {
  id: string;
  name: string;
  description: string;
  team: string;
  members: string[]; // Danh sách thành viên
  mentor: string;
  mentorEmail: string; // Email GV
  status: "Pending" | "Approved" | "Rejected"; // Union type cho chính xác
  major: string;
  tags: string[];
  submittedDate: string;
}

export const mockTopics: Topic[] = [
  {
    id: "TP01",
    name: "Hệ thống quản lý chuỗi cung ứng bằng Blockchain",
    description:
      "Ứng dụng Hyperledger Fabric để truy xuất nguồn gốc nông sản sạch.",
    team: "Team A (SE1740)",
    members: ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"],
    mentor: "Thầy Hiến",
    mentorEmail: "hientv@fpt.edu.vn",
    status: "Pending",
    major: "Software Engineering",
    tags: ["Blockchain", "Supply Chain", "Web App"],
    submittedDate: "20/02/2026",
  },
  {
    id: "TP02",
    name: "AI Camera điểm danh tự động",
    description: "Sử dụng FaceID và Deep Learning để điểm danh sinh viên.",
    team: "Team B (SE1741)",
    members: ["Phạm Văn X", "Hoàng Thị Y"],
    mentor: "Cô Lan",
    mentorEmail: "lanlt@fpt.edu.vn",
    status: "Approved",
    major: "AI",
    tags: ["Computer Vision", "Python", "IoT"],
    submittedDate: "18/02/2026",
  },
  {
    id: "TP03",
    name: "Sàn thương mại điện tử đồ cũ (C2C)",
    description: "Mô hình Marketplace cho sinh viên trao đổi giáo trình.",
    team: "Team C (SE1740)",
    members: ["Đỗ Nam T", "Ngô Văn K"],
    mentor: "Thầy Tuấn",
    mentorEmail: "tuann@fpt.edu.vn",
    status: "Rejected",
    major: "Software Engineering",
    tags: ["React", "NodeJS", "E-commerce"],
    submittedDate: "15/02/2026",
  },
];
