import React from 'react';
import { Box, VStack } from '@chakra-ui/react';

const MessageList = ({ messages }) => {
  return (
    <VStack align="start" spacing={2} padding={2}>
      {messages.map((msg, index) => (
        <Box
          key={index}
          padding={3}
          borderRadius="lg"
          maxWidth="70%"
          wordBreak="break-word"
          backgroundColor={msg.user === 'User' ? 'blue.500' : 'gray.200'}
          color={msg.user === 'User' ? 'white' : 'black'}
          alignSelf={msg.user === 'User' ? 'flex-end' : 'flex-start'} // Align user messages to the right
          boxShadow="md" // Optional shadow for a lifted effect
        >
          {msg.text}
        </Box>
      ))}
    </VStack>
  );
};

export default MessageList;
