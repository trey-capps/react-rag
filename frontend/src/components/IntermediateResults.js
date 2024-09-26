import React, { useState } from 'react';
import { Box, Text, Collapse, Button, VStack } from '@chakra-ui/react';

const IntermediateResults = ({ results }) => {
  const [expandedSections, setExpandedSections] = useState({});

  // Function to toggle the visibility of a category
  const toggleCategory = (category) => {
    setExpandedSections((prev) => ({
      ...prev,
      [category]: !prev[category], // Toggle the category's visibility
    }));
  };

  return (
    <Box padding={4} bg="white" borderRadius="md" boxShadow="md">
      <Text fontSize="xl" mb={4}>
        Intermediate Results
      </Text>
      {results && Object.keys(results).map((category) => (
        <VStack key={category} align="start" spacing={2} mb={4}>
          <Button onClick={() => toggleCategory(category)} colorScheme="teal" variant="outline">
            {expandedSections[category] ? 'Hide' : 'Show'} {category}
          </Button>
          <Collapse in={expandedSections[category]}>
            <Box padding={2} borderWidth="1px" borderRadius="md" borderColor="gray.300">
              {results[category].map((item, index) => (
                <Text key={index} mt={1}>
                  {item}
                </Text>
              ))}
            </Box>
          </Collapse>
        </VStack>
      ))}
    </Box>
  );
};

export default IntermediateResults;
