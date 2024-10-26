import React from 'react';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, Box, Text } from '@chakra-ui/react';

const ResultsDisplayAccordion = ({ traces }) => {
  return (
    <Accordion allowMultiple>
      {Array.isArray(traces) && traces.length > 0 ? (
        traces.map((trace, index) => (
          <AccordionItem key={index}>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">
                Trace {index + 1}: {trace.trace_name}
              </Box>
            </AccordionButton>
            <AccordionPanel pb={4}>
              {typeof trace.content === 'object' && Object.keys(trace.content).length > 0 ? (
                Object.entries(trace.content).map(([key, value], index) => (
                  <Box key={index} mb={2}>
                    <Text fontWeight="bold">{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
                    <Text>{Array.isArray(value) ? value.join(', ') : JSON.stringify(value, null, 2)}</Text>
                  </Box>
                ))
              ) : (
                <Text>No content available.</Text>
              )}
            </AccordionPanel>
          </AccordionItem>
        ))
      ) : (
        <Text>No traces available.</Text>
      )}
    </Accordion>
  );
};

export default ResultsDisplayAccordion;
