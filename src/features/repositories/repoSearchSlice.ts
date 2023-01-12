import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { Issue, IssueStatus } from "../../app/services/repos/types";

interface IssueSearch {
  page: number;
  cursor: string | null;
  searchTerm: string;
  titleOrBody: "title" | "body";
  repoStates: [IssueStatus];
  paginationDirection: "forward" | "backward";
  per_page: number;
}

const initialState: IssueSearch = {
  page: 1,
  cursor: null,
  searchTerm: "",
  titleOrBody: "title",
  repoStates: ["OPEN"],
  paginationDirection: "forward",
  per_page: 20,
};

export const repoSearchSlice = createSlice({
  name: "repoSearch",
  initialState,
  reducers: {
    paginate: (
      state,
      action: PayloadAction<{
        direction: IssueSearch["paginationDirection"];
        pageInfo: Issue["issues"]["pageInfo"];
      }>
    ) => {
      state.paginationDirection = action.payload.direction;
      const { hasNextPage, endCursor, hasPreviousPage, startCursor } =
        action.payload.pageInfo;

      if (hasNextPage && action.payload.direction === "forward") {
        state.page++;
        state.cursor = endCursor;
      }

      if (hasPreviousPage && action.payload.direction === "backward") {
        state.page--;
        state.cursor = startCursor;
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    toggleSearchDestination: (state, action) => {
      state.titleOrBody = state.titleOrBody === "body" ? "title" : "body";
    },
    toggleIssueStates: (state, action) => {
      state.repoStates = [state.repoStates[0] === "CLOSED" ? "OPEN" : "CLOSED"];
    },
  },
});

export const {
  paginate,
  setSearchTerm,
  toggleIssueStates,
  toggleSearchDestination,
} = repoSearchSlice.actions;

export default repoSearchSlice;
