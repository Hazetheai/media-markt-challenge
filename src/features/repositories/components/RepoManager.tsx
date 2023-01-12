import { Box, Divider, Flex, Heading, Spacer } from "@chakra-ui/react";
import * as React from "react";
import { Route, Routes } from "react-router-dom";
import { IssuesCountStat } from "./IssuesCount";
import { RepoListComp } from "./RepoList";
import { RepoSearchHeader } from "./RepoSearchHeader";
import { SingleIssue } from "./SingleIssue";

export const RepoManager: React.FC = () => {
  return (
    <Box>
      <Flex wrap="wrap" bg="#011627" p={4} color="white">
        <Box>
          <Heading size="xl">Manage Repos</Heading>
        </Box>
        <Spacer />
        <Box>
          <IssuesCountStat />
        </Box>
      </Flex>
      <Divider />
      <Box p={4} minHeight="100vh">
        <RepoSearchHeader />
        <Routes>
          <Route path="/issues/:number" element={<SingleIssue />} />
          <Route path="/" element={<RepoListComp />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default RepoManager;
