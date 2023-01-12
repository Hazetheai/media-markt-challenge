import {
  Center,
  Box,
  Spinner,
  Divider,
  List,
  ListItem,
  ListIcon,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useGetIssueByNumberQuery } from "app/services/repos/repos";
import { MdChatBubble } from "react-icons/md";
import { useParams } from "react-router-dom";

export const SingleIssue: React.FC = () => {
  const { number } = useParams();

  const {
    data: issue,
    isLoading,
    isFetching,
  } = useGetIssueByNumberQuery({ number: Number(number), numComments: 50 });

  if (!issue) return null;

  if (isLoading || isFetching) {
    return (
      <Center minH={"100vh"}>
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

  const { author, bodyText, labels, state, title, comments } = issue;
  return (
    <Box minHeight="100vh">
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
