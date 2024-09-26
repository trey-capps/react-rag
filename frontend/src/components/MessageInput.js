import React from 'react';
import { Input, Button, HStack } from '@chakra-ui/react';

const MessageInput = ({ onSend, inputValue, setInputValue }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue) {
      onSend(inputValue);
      setInputValue('');
    }
  };

  return (
    <HStack spacing={2} width="100%">
      <Input
        placeholder="Type your message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        borderRadius="full" // Rounded input
        borderColor="gray.300"
        focusBorderColor="blue.500"
        variant="outline"
      />
      <Button
        onClick={() => {
          if (inputValue) {
            onSend(inputValue);
            setInputValue('');
          }
        }}
        colorScheme="blue"
        borderRadius="full" // Rounded button
      >
        Send
      </Button>
    </HStack>
  );
};

export default MessageInput;
