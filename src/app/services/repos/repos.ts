import { createApi } from "@reduxjs/toolkit/query/react";
import { gql } from "graphql-request";
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import {
  GetMultipleIssuesResponse,
  RepoStatus,
  Issue,
  GetIssuesBySearchTermResponse,
  IssueResponse,
} from "./types";

const pat = process.env.REACT_APP_GITHUB_PAT;

const ISSUE_FRAGMENT = gql`
  fragment IssueFields on Issue {
    title
    bodyText
    id
    state
    number
    author {
      avatarUrl
      login
    }
    labels(first: 5) {
      edges {
        node {
          name
        }
      }
    }
  }
`;

export const repoSearchApi = createApi({
  reducerPath: "repoSearch",
  baseQuery: graphqlRequestBaseQuery({
    url: "https://api.github.com/graphql",
    requestHeaders: {
      Authorization: `Bearer ${pat}`,
    },
  }),
  endpoints: (builder) => ({
    getMultipleIssues: builder.query<
      GetMultipleIssuesResponse,
      {
        cursor: string | null;
        per_page?: number;
        owner?: string;
        name?: string;
        paginationDirection: "forward" | "backward";
        states: [RepoStatus];
      }
    >({
      query: ({
        owner = "facebook",
        name = "react",
        cursor,
        per_page,
        paginationDirection,
        states,
      }) => ({
        document: gql`
        ${ISSUE_FRAGMENT}
          query (
            $owner: String!
            $name: String!
            $cursor: String
            $per_page: Int!
            $states: [IssueState!]
          ) {
            repository(owner: $owner, name: $name) {
              issues(${
                paginationDirection === "forward"
                  ? "first: $per_page, after: $cursor"
                  : "last: $per_page, before: $cursor"
              },
              states: $states
              ) {
                pageInfo {
                  endCursor
                  startCursor
                  hasNextPage
                  hasPreviousPage
                }
                totalCount
                edges {
                  cursor
                  node {
                    ...IssueFields
                  }
                }
              }
            }
          }
        `,
        variables: {
          owner,
          name,
          cursor,
          per_page,
          states,
        },
      }),
    }),
    getIssueByNumber: builder.query<
      Issue,
      { number: number; owner?: string; name?: string; numComments?: number }
    >({
      query: ({
        owner = "facebook",
        name = "react",
        number,
        numComments = 50,
      }) => ({
        document: gql`
          ${ISSUE_FRAGMENT}
          query GetIssue(
            $number: Int!
            $numComments: Int!
            $owner: String!
            $name: String!
          ) {
            repository(owner: $owner, name: $name) {
              issue(number: $number) {
                ...IssueFields
                comments(first: $numComments) {
                  pageInfo {
                    endCursor
                    startCursor
                    hasNextPage
                    hasPreviousPage
                  }
                  edges {
                    node {
                      id
                      author {
                        login
                      }
                      bodyText
                      bodyHTML
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          owner,
          name,
          number,
          numComments,
        },
      }),
      transformResponse: (response: IssueResponse) => response.repository.issue,
    }),
    getIssuesBySearchTerm: builder.query<
      GetIssuesBySearchTermResponse,
      {
        searchTerm: string;
        owner?: string;
        name?: string;
        state: RepoStatus;
        per_page: number;
        titleOrBody: "title" | "body";
      }
    >({
      query: ({
        owner = "facebook",
        name = "react",
        searchTerm,
        state,
        per_page,
        titleOrBody,
      }) => {
        const query = `"repo:${owner}/${name} is:issue is:${state.toLowerCase()} ${
          searchTerm || ""
        } in:${titleOrBody}"`;
        console.log("query", query);
        return {
          document: gql`
          ${ISSUE_FRAGMENT}
            query GetIssueBySearchTerm($per_page: Int!) {
              search(query: ${query}, type: ISSUE, first: $per_page) {
                issueCount
                pageInfo {
                  endCursor
                  hasNextPage
                  hasPreviousPage
                  startCursor
                }
                edges {
                  cursor
                  node {
                    ... on Issue {
                      ...IssueFields
                    }
                  }
                }
              }
            }
          `,
          variables: {
            query,
            per_page,
          },
        };
      },
    }),
  }),
});

export const {
  useGetMultipleIssuesQuery,
  useGetIssueByNumberQuery,
  useGetIssuesBySearchTermQuery,
} = repoSearchApi;
