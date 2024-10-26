import React from 'react';
import { Button } from '@chakra-ui/react';

const ClearButton = ({ onClear }) => (
  <Button variant="outline" colorScheme="red" ml={2} onClick={onClear}>
    Clear
  </Button>
);

export default ClearButton;

