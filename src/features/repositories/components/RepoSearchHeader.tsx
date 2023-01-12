import {
  Box,
  HStack,
  Flex,
  Heading,
  Button,
  Icon,
  Input,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "app/hooks";
import {
  useGetMultipleIssuesQuery,
  useGetIssuesBySearchTermQuery,
} from "app/services/repos/repos";
import {
  MdArrowBack,
  MdCheckCircle,
  MdBuildCircle,
  MdArrowForward,
  MdHighlightOff,
} from "react-icons/md";
import { useLocation, useParams, Link } from "react-router-dom";
import {
  paginate,
  toggleRepoStates,
  setSearchTerm,
  toggleSearchDestination,
} from "../repoSearchSlice";

export const RepoSearchHeader = () => {
  const location = useLocation();
  const { number } = useParams();
  const dispatch = useAppDispatch();

  const {
    cursor,
    page,
    paginationDirection,
    per_page,
    repoStates,
    searchTerm,
    titleOrBody,
  } = useAppSelector((state) => state.repoSearchConfig);
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

  const currPageInfo = !!searchTerm
    ? issuesBySearchTerm?.search.pageInfo
    : allIssuesData?.repository.issues.pageInfo;

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (!allIssuesData?.repository) {
    return <div>No repos!</div>;
  }

  return (
    <Box>
      <HStack spacing="14px" p={4}>
        {location.pathname !== "/" ? (
          <Flex wrap="wrap" bg="#011627" color="white">
            <Link to={`/`}>
              <Heading size="xl">&lt;- All Repos</Heading>
            </Link>
            <Heading size="md"> #{number}</Heading>
          </Flex>
        ) : (
          <>
            <Button
              onClick={() => {
                if (currPageInfo) {
                  dispatch(
                    paginate({ direction: "backward", pageInfo: currPageInfo })
                  );
                }
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
                dispatch(toggleRepoStates({}));
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
                if (currPageInfo) {
                  dispatch(
                    paginate({ direction: "forward", pageInfo: currPageInfo })
                  );
                }
              }}
              isLoading={isFetching}
              disabled={page === totalCount}
            >
              <Icon as={MdArrowForward} />
            </Button>

            <Input
              type={"text"}
              placeholder="Search"
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              value={searchTerm}
            />
            <Button
              padding={4}
              background="Highlight"
              onClick={() => {
                dispatch(toggleSearchDestination({}));
              }}
            >
              Search {titleOrBody}
            </Button>
            {!!searchTerm && (
              <Button onClick={(e) => dispatch(setSearchTerm(""))}>
                <Icon as={MdHighlightOff} />
                Clear
              </Button>
            )}
          </>
        )}
      </HStack>
    </Box>
  );
};
