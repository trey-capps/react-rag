import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/accordion';
import { Box, Text } from '@chakra-ui/react';

const ResultsDisplayAccordion = ({ traces }) => {
  return (
    <Box padding={4} bg="white" borderRadius="md" boxShadow="md">
      <Text fontSize="xl" mb={4} fontWeight={'medium'}>
          Current Traces
      </Text>
      <Accordion allowMultiple defaultIndex={[0]}>
        {traces.map((trace, index) => (
          <AccordionItem key={index}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {trace.trace_name}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <pre>{JSON.stringify(trace.content, null, 2)}</pre>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export default ResultsDisplayAccordion;
