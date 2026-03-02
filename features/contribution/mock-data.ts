import type {
  ContributionItem,
  GithubContributionItem,
  JiraContributionItem,
} from "./types";

export const contributionData: ContributionItem[] = [
  { id: "m1", name: "Nguyễn Văn An", initials: "AN", value: 32 },
  { id: "m2", name: "Trần Thị Bình", initials: "BT", value: 28 },
  { id: "m3", name: "Lê Hoàng Cường", initials: "LC", value: 22 },
  { id: "m4", name: "Phạm Minh Dung", initials: "DM", value: 18 },
];

export const jiraContribution: JiraContributionItem[] = [
  { id: "m1", name: "Nguyễn Văn An", initials: "AN", issues: 18, percent: 35 },
  { id: "m2", name: "Trần Thị Bình", initials: "BT", issues: 15, percent: 29 },
  { id: "m3", name: "Lê Hoàng Cường", initials: "LC", issues: 11, percent: 21 },
  { id: "m4", name: "Phạm Minh Dung", initials: "DM", issues: 7, percent: 15 },
];

export const githubContribution: GithubContributionItem[] = [
  { id: "m1", name: "Nguyễn Văn An", initials: "AN", commits: 42, loc: 1250, percent: 34 },
  { id: "m2", name: "Trần Thị Bình", initials: "BT", commits: 38, loc: 980, percent: 31 },
  { id: "m3", name: "Lê Hoàng Cường", initials: "LC", commits: 26, loc: 760, percent: 22 },
  { id: "m4", name: "Phạm Minh Dung", initials: "DM", commits: 12, loc: 320, percent: 13 },
];

export const COLORS = ["#F97316", "#0EA5E9", "#22C55E", "#6366F1"];


