import { CouncilSession } from "./council-types";

export const mockCouncils: CouncilSession[] = [
  {
    id: 1,
    name: "Hội đồng 1 - Software Engineering",
    room: "Alpha - P.301",
    date: "25/04/2026",
    time: "08:00 - 12:00",
    status: "Upcoming",
    members: [
      { name: "Thầy Nguyễn Văn A", role: "President", email: "anv@fpt.edu.vn" },
      { name: "Cô Lê Thị B", role: "Secretary", email: "blt@fpt.edu.vn" },
      { name: "Thầy Trần C", role: "Member", email: "ct@fpt.edu.vn" },
    ],
    teams: ["Team SE1740", "Team AI1801", "Team JS_Pro"],
  },
  {
    id: 2,
    name: "Hội đồng 2 - AI & IoT",
    room: "Beta - P.205",
    date: "25/04/2026",
    time: "13:30 - 17:30",
    status: "Upcoming",
    members: [
      { name: "Thầy Phạm X", role: "President", email: "xph@fpt.edu.vn" },
      { name: "Cô Vũ Y", role: "Secretary", email: "yvu@fpt.edu.vn" },
      { name: "Thầy Đỗ Z", role: "Member", email: "zdo@fpt.edu.vn" },
    ],
    teams: ["Team Vision", "Team SmartHome"],
  },
  {
    id: 3,
    name: "Hội đồng 3 - Graphic Design",
    room: "Gamma - P.101",
    date: "24/04/2026",
    time: "08:00 - 12:00",
    status: "Completed",
    members: [
      { name: "Cô Hoàng M", role: "President", email: "mhoang@fpt.edu.vn" },
      { name: "Thầy Ngô N", role: "Secretary", email: "nngo@fpt.edu.vn" },
      { name: "Cô Lý P", role: "Member", email: "ply@fpt.edu.vn" },
    ],
    teams: ["Team Art1", "Team Creative", "Team 3D_Model"],
  },
];
