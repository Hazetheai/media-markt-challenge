import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { Repo, RepoStatus } from "../../app/services/repos/types";

interface RepoSearch {
  page: number;
  cursor: string | null;
  searchTerm: string;
  titleOrBody: "title" | "body";
  repoStates: [RepoStatus];
  paginationDirection: "forward" | "backward";
  per_page: number;
}

const initialState: RepoSearch = {
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
        direction: RepoSearch["paginationDirection"];
        pageInfo: Repo["issues"]["pageInfo"];
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
    toggleRepoStates: (state, action) => {
      state.repoStates = [state.repoStates[0] === "CLOSED" ? "OPEN" : "CLOSED"];
    },
  },
});

export const {
  paginate,
  setSearchTerm,
  toggleRepoStates,
  toggleSearchDestination,
} = repoSearchSlice.actions;

export default repoSearchSlice;
