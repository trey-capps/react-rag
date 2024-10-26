import React, { useState } from 'react';
import { Box, Button, Input, VStack, Text } from '@chakra-ui/react';

const ChatBox = ({ interactions, onNewInteraction }) => {
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (message.trim() === '') return;

    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch('/api/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ interaction: message, timestamp: new Date().toISOString() }),
      });

      const data = await response.json();

      if (response.ok) {
        onNewInteraction({
          interaction: message,
          timestamp: new Date().toISOString(),
        });
        setMessage('');
      } else {
        console.error('Error saving interaction:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <VStack spacing={4} align="start" w="full" p={4}>
      <Box w="full" h="300px" bg="gray.100" p={4} overflowY="scroll">
        {interactions.map((interaction, index) => (
          <Box key={index} mb={2}>
            <Text>{interaction.interaction}</Text>
            <Text fontSize="sm" color="gray.500">
              {new Date(interaction.timestamp).toLocaleString()}
            </Text>
          </Box>
        ))}
      </Box>
      <Input
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button colorScheme="blue" onClick={handleSend}>
        Send
      </Button>
    </VStack>
  );
};

export default ChatBox;
