import { IssueManager } from "./features/repositories/components/IssueManager";
import "App.css";
import { Box, Flex, Heading, Spacer, Divider } from "@chakra-ui/react";
import { IssueListComp } from "features/repositories/components/IssueList";
import { IssuesCountStat } from "features/repositories/components/IssuesCount";
import { IssueSearchHeader } from "features/repositories/components/IssueSearchHeader";
import { SingleIssue } from "features/repositories/components/SingleIssue";
import { Routes, Route, useParams, useLocation } from "react-router-dom";

export const colors = {
  primary: "#2B2D42",
  bg: "#EDF2F4",
  accent: "#8D99AE",
};
function App() {
  const { pathname } = useLocation();

  return (
    <>
      <Box>
        <Flex wrap="wrap" bg={colors.accent} p={4} color={colors.primary}>
          <Box p={20}>
            <Heading fontSize={40} size="xl">
              {/\d/.test(pathname)
                ? `Issue: #${/\d+/.exec(pathname)?.[0]}`
                : "Browse Issues"}
            </Heading>
          </Box>
          <Spacer />
          <Box>
            <IssuesCountStat />
          </Box>
        </Flex>
        <Divider />
        <Box p={20} minHeight="100vh">
          <IssueSearchHeader />
          <Routes>
            <Route path="/issues/:number" element={<SingleIssue />} />
            <Route path="/" element={<IssueListComp />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
}

export default App;
