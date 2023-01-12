import {
  Box,
  HStack,
  Flex,
  Heading,
  Button,
  Icon,
  Input,
} from "@chakra-ui/react";
import { colors } from "App";
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
  toggleIssueStates,
  setSearchTerm,
  toggleSearchDestination,
} from "../repoSearchSlice";

export const IssueSearchHeader = () => {
  const location = useLocation();

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
  } = useGetMultipleIssuesQuery({
    cursor,
    per_page,
    paginationDirection,
    states: repoStates,
  });
  const { data: issuesBySearchTerm } = useGetIssuesBySearchTermQuery({
    searchTerm,
    per_page,
    state: repoStates[0],
    titleOrBody,
  });

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
          <Flex wrap="wrap" color="white">
            <Link to={`/`}>
              <Heading
                bgColor={colors.primary}
                color={"white"}
                p={4}
                rounded={10}
                size="xl"
              >
                <Icon as={MdArrowBack} />
                All Issues
              </Heading>
            </Link>
          </Flex>
        ) : (
          <>
            <Button
              bgColor={colors.primary}
              rounded={10}
              color={"white"}
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
              bgColor={colors.primary}
              rounded={10}
              color={"white"}
              padding={4}
              onClick={() => {
                dispatch(toggleIssueStates({}));
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
              bgColor={colors.primary}
              rounded={10}
              color={"white"}
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
              p={2}
              border="4px solid #colors.primary"
              rounded={10}
            />
            <Button
              bgColor={colors.primary}
              rounded={10}
              color={"white"}
              padding={4}
              onClick={() => {
                dispatch(toggleSearchDestination({}));
              }}
            >
              Search {titleOrBody}
            </Button>
            {!!searchTerm && (
              <Button
                bgColor={colors.primary}
                p={4}
                rounded={10}
                color={"white"}
                onClick={(e) => dispatch(setSearchTerm(""))}
              >
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
