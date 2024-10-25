import React from 'react';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, Box, Text } from '@chakra-ui/react';

const SessionHistoryAccordion = ({ interactions }) => {
  return (
    <Accordion allowMultiple>
      {interactions.map((interaction, interactionIndex) => (
        <AccordionItem key={interactionIndex}>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Interaction {interactionIndex + 1}
            </Box>
          </AccordionButton>
          <AccordionPanel pb={4}>
            {/* Nested accordion for questions within the interaction */}
            <Accordion allowMultiple>
              {interaction.map((entry, entryIndex) => (
                <AccordionItem key={entryIndex}>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      {entry.question}
                    </Box>
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    {entry.traces && entry.traces.map((trace, traceIndex) => (
                      <Box key={traceIndex} mb={2} p={2} border="1px" borderColor="gray.200" borderRadius="md">
                        {Object.entries(trace).map(([key, value]) => (
                          <Box key={key} mb={1}>
                            <Text fontWeight="bold" mb={1}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}:
                            </Text>
                            <Text>{typeof value === 'object' ? JSON.stringify(value, null, 2) : value}</Text>
                          </Box>
                        ))}
                      </Box>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default SessionHistoryAccordion;