import { configureStore } from "@reduxjs/toolkit";
import repoSearchConfig from "features/repositories/repoSearchSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { repoSearchApi } from "./services/repos/repos";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

const rootReducer = combineReducers({
  repoSearchConfig: repoSearchConfig.reducer,
  [repoSearchApi.reducerPath]: repoSearchApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(repoSearchApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
