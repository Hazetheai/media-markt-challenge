import {
  Center,
  Box,
  Spinner,
  List,
  ListItem,
  ListIcon,
  Badge,
} from "@chakra-ui/react";
import { useAppSelector } from "app/hooks";
import {
  useGetMultipleIssuesQuery,
  useGetIssuesBySearchTermQuery,
} from "app/services/repos/repos";
import { Issue } from "app/services/repos/types";
import { MdBook } from "react-icons/md";
import { Link } from "react-router-dom";

export const RepoListComp: React.FC = () => {
  const {
    cursor,
    paginationDirection,
    per_page,
    repoStates,
    searchTerm,
    titleOrBody,
  } = useAppSelector((state) => state.repoSearchConfig);
  const {
    data: allIssuesData,
    isFetching,
    isLoading,
  } = useGetMultipleIssuesQuery(
    { cursor, per_page, paginationDirection, states: repoStates },
    { refetchOnMountOrArgChange: true }
  );
  const {
    data: issuesBySearchTerm,
    isFetching: isSLoading,
    isLoading: isSFetching,
  } = useGetIssuesBySearchTermQuery(
    { searchTerm, per_page, state: repoStates[0], titleOrBody },
    { refetchOnMountOrArgChange: true }
  );

  const currIssues = !!searchTerm
    ? issuesBySearchTerm?.search.edges
    : allIssuesData?.repository.issues.edges;

  if (isLoading || isFetching || isSLoading || isSFetching) {
    return (
      <Center>
        <Box>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Box>
      </Center>
    );
  }
  return (
    <Box minHeight="100vh">
      <List spacing={3} mt={6}>
        {!!currIssues &&
          currIssues.map((issue: { node: Issue }) => (
            <Link to={`/issues/${issue.node.number}`}>
              <ListItem key={issue.node.number}>
                <ListIcon as={MdBook} color="green.500" />
                <Badge ml="1" fontSize="0.8em"></Badge>
                {issue.node.title}
              </ListItem>
            </Link>
          ))}
      </List>
    </Box>
  );
};
