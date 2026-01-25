export interface MyClass {
  team_id: string;
  team_name: string;
  role_in_team: "Leader" | "Member";
  is_leader: boolean;
  class: {
    _id: string;
    name: string;
    class_code: string;
    semester: {
      _id: string;
      name: string;
    };
    subject?: {
      name: string;
      code: string;
    };
  };
}

export interface MyClassesResponse {
  total: number;
  classes: MyClass[];
}
