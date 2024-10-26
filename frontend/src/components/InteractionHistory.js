import React from 'react';
import { Box, Button, VStack, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';

const InteractionHistory = ({ interactions, onDelete, onAddToCurrent, onViewTraces }) => {
  const interactionList = Array.isArray(interactions) ? interactions : [];

  return (
    <VStack spacing={4} align="start" w="100%">
      {interactionList.length > 0 ? (
        interactionList.map((interaction, index) => (
          <Box
            key={interaction.interactionId || index}
            borderWidth="1px"
            borderRadius="md"
            p={4}
            w="100%"
          >
            <Text fontWeight="bold">Interaction {index + 1}</Text>

            {/* Display questions and answers in an accordion */}
            <Accordion allowMultiple mt={2}>
              {interaction.interaction.map((item, idx) => (
                <AccordionItem key={idx}>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Q: {item.question}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <Text><strong>Answer:</strong> {item.answer}</Text>
                    <Button mt={2} onClick={() => onViewTraces(item.traces)}>
                      View Traces
                    </Button>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>

            <Button onClick={() => onAddToCurrent(interaction)} mt={2} mr={2}>
              Add to Current
            </Button>
            <Button onClick={() => onDelete(index)} colorScheme="red" mt={2}>
              Delete
            </Button>
          </Box>
        ))
      ) : (
        <Text>No interactions available.</Text>
      )}
    </VStack>
  );
};

export default InteractionHistory;
