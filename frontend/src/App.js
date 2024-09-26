import React, { useState } from 'react';
import { Box, Flex, Grid } from '@chakra-ui/react';
import ChatBox from './components/ChatBox';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import ClearButton from './components/ClearButton';
import IntermediateResults from './components/IntermediateResults';
import './styles.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [intermediateResults, setIntermediateResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSend = async (message) => {
    setMessages((prev) => [...prev, { user: 'User', text: message }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: message }),
      });

      const data = await response.json();
      setIntermediateResults(data.intermediate_steps); // Store intermediate results
      setMessages((prev) => [...prev, { user: 'Bot', text: data.answer }]);
    } catch (error) {
      setMessages((prev) => [...prev, { user: 'Bot', text: 'Error fetching the answer.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setIntermediateResults({});
    setInputValue('');
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
        <IntermediateResults results={intermediateResults} />
      </Grid>
    </Box>
  );
};

export default App;
