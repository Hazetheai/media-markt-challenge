import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  List,
  ListIcon,
  ListItem,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  Input,
  Text,
} from "@chakra-ui/react";
import * as React from "react";
import {
  MdArrowBack,
  MdArrowForward,
  MdBook,
  MdBuildCircle,
  MdChatBubble,
  MdCheckCircle,
  MdError,
  MdHighlightOff,
  MdSpeaker,
} from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import {
  useGetIssueByNumberQuery,
  useGetIssuesBySearchTermQuery,
  useGetMultipleIssuesQuery,
} from "../../app/services/repos";
import { Issue, RepoStatus } from "../../app/services/types";
const getColorForStatus = (state: Issue["state"]) => {
  return state === "closed" ? "gray" : state === "open" ? "orange" : "green";
};

const RepoList = () => {
  const [page, setPage] = React.useState(1);
  const [cursor, setCursor] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [titleOrBody, setSearchTermInTitleOrBody] = React.useState<
    "title" | "body"
  >("title");
  const [repoStates, setRepoStates] = React.useState<[RepoStatus]>(["OPEN"]);
  const [paginationDirection, setPaginationDirection] = React.useState<
    "forward" | "backward"
  >("forward");

  const [per_page, setPerPage] = React.useState(20);

  const {
    data: allIssuesData,
    isLoading,
    isFetching,
  } = useGetMultipleIssuesQuery(
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

  const currIssues = !!searchTerm
    ? issuesBySearchTerm?.search.edges
    : allIssuesData?.repository.issues.edges;

  function paginate(dir: "forward" | "backward") {
    if (!allIssuesData?.repository?.issues?.pageInfo) {
      console.error(`No page info - Cannot paginate`);

      return null;
    }
    setPaginationDirection(dir);
    const { hasNextPage, endCursor, hasPreviousPage, startCursor } =
      allIssuesData?.repository?.issues?.pageInfo;

    if (hasNextPage) {
      setCursor(endCursor);
    }

    if (hasPreviousPage) {
      setCursor(startCursor);
    }
  }

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (!allIssuesData?.repository) {
    return <div>No repos!</div>;
  }

  return (
    <Box>
      <HStack spacing="14px">
        <Button
          onClick={() => {
            setPage((prev) => prev - 1);
            paginate("backward");
          }}
          isLoading={isFetching}
          disabled={page === 1}
        >
          <Icon as={MdArrowBack} />
        </Button>

        <Box>{`${!!totalCount ? page : 0} / ${Math.floor(
          (totalCount || 0) / per_page
        )}`}</Box>

        <Button
          padding={4}
          background="Highlight"
          onClick={() => {
            setRepoStates([repoStates[0] === "CLOSED" ? "OPEN" : "CLOSED"]);
          }}
        >
          {[
            repoStates[0] === "CLOSED" ? (
              <Icon as={MdCheckCircle} />
            ) : (
              <Icon as={MdBuildCircle} />
            ),
          ]}{" "}
          {repoStates[0]} Issues
        </Button>
        <Button
          onClick={() => {
            setPage((prev) => prev + 1);
            paginate("forward");
          }}
          isLoading={isFetching}
          disabled={page === totalCount}
        >
          <Icon as={MdArrowForward} />
        </Button>

        <Input
          type={"text"}
          placeholder="Search"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <Button
          padding={4}
          background="Highlight"
          onClick={() => {
            setSearchTermInTitleOrBody(
              titleOrBody === "body" ? "title" : "body"
            );
          }}
        >
          Search {titleOrBody}
        </Button>
        {!!searchTerm && (
          <Button onClick={(e) => setSearchTerm("")}>
            <Icon as={MdHighlightOff} />
            Clear
          </Button>
        )}
      </HStack>
      <List spacing={3} mt={6}>
        {!!currIssues &&
          currIssues.map((issue: { node: Issue }) => (
            <Link to={`/issues/${issue.node.number}`}>
              <ListItem key={issue.node.number}>
                <ListIcon as={MdBook} color="green.500" />
                <Badge
                  ml="1"
                  fontSize="0.8em"
                  colorScheme={getColorForStatus(issue.node.state)}
                ></Badge>
                {issue.node.title}
              </ListItem>
            </Link>
          ))}
      </List>
    </Box>
  );
};

export const IssuesCountStat: React.FC<{ numIssues: number }> = ({
  numIssues,
}) => {
  return (
    <Stat>
      <StatLabel>Total Repos</StatLabel>
      <StatNumber>{`${numIssues}`}</StatNumber>
    </Stat>
  );
};

export const SingleIssue: React.FC = () => {
  const { number } = useParams();

  const {
    data: issue,
    isLoading: isIssueLoading,
    isFetching: isIssueFetching,
  } = useGetIssueByNumberQuery({ number: Number(number), numComments: 50 });

  if (!issue) return null;

  const { author, bodyText, labels, state, title, comments } = issue;
  return (
    <Box>
      <Flex wrap="wrap" bg="#011627" p={4} color="white">
        <Box>
          <Link to={`/`}>
            <Heading size="xl">&lt;- All Repos</Heading>
          </Link>
          <Heading size="md">
            {" "}
            #{number} - {title}
          </Heading>
        </Box>
        <Spacer />
        <Box>{/* <IssuesCountStat /> */}</Box>
      </Flex>
      <Divider />
      <Box p={4}>
        <div>{state}</div>
        <strong>@{author.login}</strong>
        <div>{bodyText}</div>
      </Box>
      <Divider />
      <List spacing={3} mt={6}>
        {!!comments &&
          comments.edges.map((comment) => (
            <ListItem key={comment.node.id}>
              <Text
                display={"flex"}
                alignItems={"center"}
                fontWeight={"bold"}
                size={"md"}
              >
                <ListIcon
                  as={MdChatBubble}
                  color="green.500"
                  marginTop={5}
                  marginRight={5}
                  marginLeft={5}
                />
                {comment?.node?.author?.login}
              </Text>
              {comment.node.bodyHTML && (
                <div
                  dangerouslySetInnerHTML={{ __html: comment.node.bodyHTML }}
                />
              )}
              <Spacer padding={4} />
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export const RepoManager = () => {
  return (
    <Box>
      <Flex wrap="wrap" bg="#011627" p={4} color="white">
        <Box>
          <Heading size="xl">Manage Repos</Heading>
        </Box>
        <Spacer />
        <Box>{/* <IssuesCountStat /> */}</Box>
      </Flex>
      <Divider />
      <Box p={4}>
        <RepoList />
      </Box>
    </Box>
  );
};

export default RepoManager;
