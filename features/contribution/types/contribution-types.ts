export type ContributionItem = {
  id: string;
  name: string;
  initials: string;
  value: number; // tổng hợp %
};

export type JiraContributionItem = {
  id: string;
  name: string;
  initials: string;
  issues: number;
  percent: number;
};

export type GithubContributionItem = {
  id: string;
  name: string;
  initials: string;
  commits: number;
  loc: number;
  percent: number;
};


