import React from 'react';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, Box, Text } from '@chakra-ui/react';

const ResultsHistoryAccordion = ({ resultHistory }) => {
  return (
    <Accordion allowMultiple>
      {resultHistory.map((entry, index) => (
        <AccordionItem key={index}>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              {entry.question}
            </Box>
          </AccordionButton>
          <AccordionPanel pb={4}>
            {entry.traces && entry.traces.map((trace, traceIndex) => (
              <Box key={traceIndex} mb={4} p={2} border="1px" borderColor="gray.200" borderRadius="md">
                {/* Render trace details with labels */}
                {Object.entries(trace).map(([key, value]) => (
                  <Box key={key} mb={2}>
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
  );
};

export default ResultsHistoryAccordion;