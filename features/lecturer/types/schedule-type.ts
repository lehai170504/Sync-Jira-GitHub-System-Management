// --- Dữ liệu từ API (Response) ---
export interface Schedule {
  _id: string;
  class_id: string;
  lecturer_id: string;
  date: string;
  slot: number;
  room: string;
  topic: string;
  content: string;
  note?: string;
  status?: string;
  created_at?: string;
}

export interface CreateSchedulePayload {
  classId: string;
  date: string;
  slot: number;
  room: string;
  topic: string;
  content: string;
  note?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "Teaching" | "Meeting" | "Grading";
  location: string;
  note?: string;
  status?: string;
}
