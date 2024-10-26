import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';

const ChatHistory = ({ interactions }) => {
  return (
    <VStack spacing={4}>
      <Box w="full" h="300px" bg="gray.100" p={4} overflowY="scroll">
        {interactions.map((interaction, index) => (
          <Box key={index} mb={2}>
            <Text>{interaction.interaction}</Text>
            <Text fontSize="sm" color="gray.500">{new Date(interaction.timestamp).toLocaleString()}</Text>
          </Box>
        ))}
      </Box>
    </VStack>
  );
};

export default ChatHistory;
