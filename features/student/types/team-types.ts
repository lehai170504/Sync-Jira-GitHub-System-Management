export interface Team {
  _id: string;
  class_id: {
    _id: string;
    name: string;
    class_code: string;
  };
  project_name: string;
  sync_history: any[];
  created_at: string;
}

export interface ClassTeamsResponse {
  total: number;
  teams: Team[];
}
