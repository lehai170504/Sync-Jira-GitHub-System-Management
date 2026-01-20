export type ClassStatus = "Active" | "Finished" | "Upcoming";

export interface ClassItem {
  id: string;
  code: string;
  subject: string;
  lecturer: string;
  students: number;
  status: ClassStatus;
  semester: string;
}

export interface Student {
  id: number;
  name: string;
  roll: string;
  email: string;
  team: string;
}
