export type CouncilStatus = "Upcoming" | "Ongoing" | "Completed";

export interface CouncilMember {
  name: string;
  role: "President" | "Secretary" | "Member";
  email: string; // Để hiển thị Avatar fallback
}

export interface CouncilSession {
  id: number;
  name: string;
  room: string;
  date: string;
  time: string;
  status: CouncilStatus;
  members: CouncilMember[];
  teams: string[];
}
