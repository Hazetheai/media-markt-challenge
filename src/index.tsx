import React from "react";
import { createRoot } from "react-dom/client";

import { ChakraProvider } from "@chakra-ui/provider";
import { ApiProvider } from "@reduxjs/toolkit/dist/query/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { api } from "./app/services/repos";
import "./index.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ApiProvider api={api}>
      <ChakraProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </ApiProvider>
  </React.StrictMode>
);
