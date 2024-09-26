import { Box } from '@chakra-ui/react';

const ChatBox = ({ children }) => {
  return (
    <Box
      borderWidth={1}
      borderRadius="md"
      bg="white"
      boxShadow="md"
      height="100%" // Ensure it uses the full height of its container
      overflow="hidden" // Prevent overflow from child components
    >
      {children}
    </Box>
  );
};

export default ChatBox;
