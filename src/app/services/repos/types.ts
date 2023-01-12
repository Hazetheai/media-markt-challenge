export const repoStatuses = ["OPEN", "CLOSED"] as const;
export type IssueStatusTuple = typeof repoStatuses;
export type IssueStatus = IssueStatusTuple[number];

export interface IssueComment {
  author: {
    avatarUrl: string;
    login: string;
  };
  bodyText: string;
  bodyHTML?: string;
  id: string;
}

export interface Label {
  id: string;
  description: string;
  name: string;
}
export interface Issue {
  labels: { edges: Array<{ cursor: string | null; node: Label }> };
  title: string;
  author: {
    avatarUrl: string;
    login: string;
  };
  state: string;
  bodyText: string;
  number: number;
  comments?: {
    edges: Array<{ cursor: string | null; node: IssueComment }>;
    pageInfo: {
      endCursor: string;
      startCursor: string;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface Issue {
  issues: {
    edges: Array<{ cursor: string | null; node: Issue }>;
    totalCount: number;
    pageInfo: {
      endCursor: string;
      startCursor: string;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface IssueFromSearchTerm {
  edges: Array<{ cursor: string | null; node: Issue }>;
  issueCount: number;
  pageInfo: {
    endCursor: string;
    startCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface GetMultipleIssuesResponse {
  repository: Issue;
}
export interface GetIssuesBySearchTermResponse {
  search: IssueFromSearchTerm;
}

export interface IssueResponse {
  repository: { issue: Issue };
}
