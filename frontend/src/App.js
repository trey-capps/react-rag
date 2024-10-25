import React, { useState } from 'react';
import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import ChatBox from './components/ChatBox';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import ClearButton from './components/ClearButton';
import './styles.css';

import ResultsDisplayAccordion from './components/FullResultsDisplay';
import ResultsHistoryAccordion from './components/ResultsHistoryAccordion';
import SessionHistoryAccordion from './components/SessionHistoryAccordion';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [traceResults, setTraceResults] = useState([]);
  const [resultHistory, setResultHistory] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSend = async (message) => {
    setMessages((prev) => [...prev, { user: 'User', text: message }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: message, chatHistory: messages }),
      });

      const data = await response.json();
      setTraceResults(data.traces);
      setResultHistory((prev) => [...prev, { question: message, traces: data.traces }]);
      setMessages((prev) => [...prev, { user: 'Bot', text: data.response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { user: 'Bot', text: 'Error fetching the answer.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (resultHistory.length > 0) {
      setInteractions((prev) => [...prev, resultHistory]);
    }

    setMessages([]);
    setTraceResults([]);
    setInputValue('');
    setResultHistory([]);
  };

  return (
    <Box p={4} bg="gray.100" minH="100vh">
      <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={6} maxW="1200px" mx="auto">
        <Box>
          <ChatBox>
            <Flex direction="column" height="80vh" position="relative">
              <Box flex="1" overflowY="auto" paddingBottom="20px">
                <MessageList messages={messages} />
              </Box>
              <Flex mt={2} alignItems="center" paddingBottom="20px">
                <MessageInput onSend={handleSend} inputValue={inputValue} setInputValue={setInputValue} />
                <ClearButton onClear={handleClear} />
              </Flex>
            </Flex>
          </ChatBox>
        </Box>
        <Box overflowY="auto">
          <ResultsDisplayAccordion traces={traceResults}/>
        </Box>
      </Grid>
      <Box>
        <Text fontSize="xl" mb={4} fontWeight={'medium'}>
          Current Interation
        </Text>
        <ResultsHistoryAccordion resultHistory={resultHistory} />
        <Text fontSize="xl" mb={4} fontWeight={'medium'}>
          Previous Interation
        </Text>
        <SessionHistoryAccordion interactions={interactions} />
      </Box>
    </Box>
  );
};

export default App;
