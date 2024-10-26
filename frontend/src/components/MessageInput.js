import React from 'react';
import { Input, Button } from '@chakra-ui/react';

const MessageInput = ({ onSend, inputValue, setInputValue }) => {
  const handleSendClick = () => {
    if (inputValue.trim() !== '') {
      onSend(inputValue);
      setInputValue('');
    }
  };

  return (
    <>
      <Input
        placeholder="Type your message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        mr={2}
      />
      <Button colorScheme="blue" onClick={handleSendClick}>
        Send
      </Button>
    </>
  );
};

export default MessageInput;
