export interface BurndownPoint {
  day: string;
  planned: number;
  actual: number;
}

export interface IssueTypeStat {
  name: string;
  value: number;
  color: string;
}
