import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const MessageList = ({ messages }) => {
  return (
    <Box>
      {messages.map((msg, index) => (
        <Box key={index} p={2} bg={msg.user === 'User' ? 'blue.200' : 'gray.200'} mb={2} borderRadius="md">
          <Text><strong>{msg.user}:</strong> {msg.text}</Text>
        </Box>
      ))}
    </Box>
  );
};

export default MessageList;
