import React from 'react';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, Box, Text } from '@chakra-ui/react';

const SessionHistoryAccordion = ({ interactions }) => {
  return (
    <Accordion allowMultiple>
      {Array.isArray(interactions) && interactions.length > 0 ? (
        interactions.map((interaction, interactionIndex) => {
          const interactionData = interaction.interaction || {}; // Safely access interaction.interaction
          const { question = 'No question available', traces = [] } = interactionData;

          return (
            <AccordionItem key={interactionIndex}>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold">
                  Interaction {interactionIndex + 1} - {question}
                </Box>
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Text fontWeight="bold" mb={2}>
                  Question: {question}
                </Text>

                {Array.isArray(traces) && traces.length > 0 ? (
                  traces.map((trace, traceIndex) => (
                    <Box key={traceIndex} mb={2} p={2} border="1px" borderColor="gray.200" borderRadius="md">
                      <Text fontWeight="bold">Trace Name: {trace.trace_name}</Text>
                      <Text fontWeight="bold" mt={2}>Content:</Text>
                      {typeof trace.content === 'object' && Object.keys(trace.content).length > 0 ? (
                        Object.entries(trace.content).map(([key, value], index) => (
                          <Box key={index} ml={4} mt={1}>
                            <Text fontWeight="bold">{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
                            <Text>
                              {Array.isArray(value) ? value.join(', ') : JSON.stringify(value, null, 2)}
                            </Text>
                          </Box>
                        ))
                      ) : (
                        <Text>No content available</Text>
                      )}
                    </Box>
                  ))
                ) : (
                  <Text>No traces available</Text>
                )}
              </AccordionPanel>
            </AccordionItem>
          );
        })
      ) : (
        <Text>No interactions available.</Text>
      )}
    </Accordion>
  );
};

export default SessionHistoryAccordion;
