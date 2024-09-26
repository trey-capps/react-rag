import React from 'react';
import { Button } from '@chakra-ui/react';

const ClearButton = ({ onClear }) => {
  return (
    <Button
      onClick={onClear}
      colorScheme="red"
      borderRadius="full" // Rounded button
      variant="outline" // Outline variant for a subtle look
    >
      Clear Chat
    </Button>
  );
};

export default ClearButton;
