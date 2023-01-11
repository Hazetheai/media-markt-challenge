export const repoStatuses = ["OPEN", "CLOSED"] as const;
export type RepoStatusTuple = typeof repoStatuses;
export type RepoStatus = RepoStatusTuple[number];

export interface IssueComment {
  author: {
    avatarUrl: string;
    login: string;
  };
  bodyText: string;
  bodyHTML?: string;
  id: string;
}

export interface Issue {
  labels: Array<any>;
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

export interface Repo {
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

export interface RepoFromSearchTerm {
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
  repository: Repo;
}
export interface GetIssuesBySearchTermResponse {
  search: RepoFromSearchTerm;
}

export interface IssueResponse {
  repository: { issue: Issue };
}
