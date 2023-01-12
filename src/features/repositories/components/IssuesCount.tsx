import { Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { useAppSelector } from "app/hooks";
import {
  useGetMultipleIssuesQuery,
  useGetIssuesBySearchTermQuery,
} from "app/services/repos/repos";

export const IssuesCountStat: React.FC = () => {
  const {
    cursor,
    paginationDirection,
    per_page,
    repoStates,
    searchTerm,
    titleOrBody,
  } = useAppSelector((state) => state.repoSearchConfig);
  const { data: allIssuesData } = useGetMultipleIssuesQuery(
    { cursor, per_page, paginationDirection, states: repoStates },
    { refetchOnMountOrArgChange: true }
  );
  const { data: issuesBySearchTerm } = useGetIssuesBySearchTermQuery(
    { searchTerm, per_page, state: repoStates[0], titleOrBody },
    { refetchOnMountOrArgChange: true }
  );

  const totalCount = !!searchTerm
    ? issuesBySearchTerm?.search.issueCount
    : allIssuesData?.repository.issues.totalCount;
  return (
    <Stat>
      <StatLabel>Total Issues</StatLabel>
      <StatNumber>{`${totalCount}`}</StatNumber>
    </Stat>
  );
};
