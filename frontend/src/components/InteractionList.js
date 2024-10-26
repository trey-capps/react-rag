import React from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

const InteractionList = ({ interactions, onDelete, onLoad }) => {
  return (
    <Box>
      {Array.isArray(interactions) && interactions.length > 0 ? (
        interactions.map((interaction, index) => (
          <Flex
            key={interaction.interactionId}
            alignItems="center"
            justifyContent="space-between"
            p={4}
            mb={2}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            bg="gray.50"
          >
            <Text fontWeight="bold">Interaction {index + 1}</Text>
            <Flex>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => onLoad(interaction)}
                mr={2}
              >
                Load
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                onClick={() => onDelete(interaction.interactionId)}
              >
                Delete
              </Button>
            </Flex>
          </Flex>
        ))
      ) : (
        <Text>No interactions available.</Text>
      )}
    </Box>
  );
};

export default InteractionList;
