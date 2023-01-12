import {
  Center,
  Box,
  Spinner,
  List,
  ListItem,
  ListIcon,
  Badge,
  Icon,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import { colors } from "App";
import { useAppSelector } from "app/hooks";
import {
  useGetMultipleIssuesQuery,
  useGetIssuesBySearchTermQuery,
} from "app/services/repos/repos";
import { Issue } from "app/services/repos/types";
import { MdArrowForward, MdBook } from "react-icons/md";
import { Link } from "react-router-dom";

export const IssueListComp: React.FC = () => {
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
  } = useGetMultipleIssuesQuery({
    cursor,
    per_page,
    paginationDirection,
    states: repoStates,
  });
  const {
    data: issuesBySearchTerm,
    isFetching: isSLoading,
    isLoading: isSFetching,
  } = useGetIssuesBySearchTermQuery({
    searchTerm,
    per_page,
    state: repoStates[0],
    titleOrBody,
  });

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
      <List spacing={6} mt={6}>
        {!!currIssues &&
          currIssues.map((issue: { node: Issue }) => (
            <ListItem key={issue.node.number}>
              <Card>
                <CardBody display={"flex"} alignItems="center">
                  <ListIcon
                    fontSize={30}
                    margin={4}
                    padding={4}
                    backgroundColor={colors.accent}
                    as={MdBook}
                    rounded={10}
                  />
                  <Text size={"xl"}>
                    {" "}
                    <Badge ml="1" fontSize="0.8em"></Badge>
                    {issue.node.title}
                  </Text>
                  <Link to={`/issues/${issue.node.number}`}>
                    <Text
                      marginLeft={6}
                      bgColor={colors.primary}
                      rounded={10}
                      color={"white"}
                      padding={3}
                      display={"flex"}
                      alignItems="center"
                      fontSize={12}
                    >
                      View <Icon as={MdArrowForward} />
                    </Text>
                  </Link>
                </CardBody>
              </Card>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};
