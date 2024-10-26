import React, { useState, useEffect } from 'react';
import { Box, VStack, Flex, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import { Navbar } from '../components/Navbar';
import { UserProfile } from '../components/Profile';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import ClearButton from '../components/ClearButton';
import ResultsDisplayAccordion from '../components/FullResultsDisplay';
import InteractionHistory from '../components/InteractionHistory';

const HomePage = ({ user, handleLogout }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [currentView, setCurrentView] = useState('home');

  const [messages, setMessages] = useState([]);
  const [traceResults, setTraceResults] = useState([]);
  const [resultHistory, setResultHistory] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showTracesModal, setShowTracesModal] = useState(false);
  const [currentTraces, setCurrentTraces] = useState([]);
  const [isLoadedInteraction, setIsLoadedInteraction] = useState(false);
  const [loadedInteractionId, setLoadedInteractionId] = useState(null);

  useEffect(() => {
    const fetchInteractions = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const response = await fetch('/api/interactions', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok && data.interactions) {
          const parsedInteractions = data.interactions
            .map((interaction) => {
              try {
                const parsed = JSON.parse(interaction.interaction);
                return Array.isArray(parsed) ? { ...interaction, interaction: parsed } : null;
              } catch {
                return null;
              }
            })
            .filter((interaction) => interaction !== null);

          setInteractions(parsedInteractions);
        }
      } catch (error) {
        console.error("Error fetching interactions:", error);
      }
    };

    fetchInteractions();
  }, []);

  const handleSend = async (message) => {
    setMessages((prev) => [...prev, { user: 'User', text: message }]);
    setLoading(true);

    try {
      const response = await fetch('/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: message, chatHistory: messages }),
      });

      const data = await response.json();
      if (response.ok) {
        setTraceResults(data.traces);

        if (isLoadedInteraction && loadedInteractionId) {
          setResultHistory((prev) => [
            ...prev,
            { question: message, answer: data.response, traces: data.traces },
          ]);
          setMessages((prev) => [...prev, { user: 'Bot', text: data.response }]);
        } else {
          setResultHistory((prev) => [
            ...prev,
            { question: message, answer: data.response, traces: data.traces },
          ]);
          setMessages((prev) => [...prev, { user: 'Bot', text: data.response }]);
          setIsLoadedInteraction(false);
        }
      }
    } catch (error) {
      setMessages((prev) => [...prev, { user: 'Bot', text: 'Error fetching the answer.' }]);
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (resultHistory.length > 0 && !isLoadedInteraction) {
      saveInteraction(resultHistory);
    }

    setMessages([]);
    setTraceResults([]);
    setInputValue('');
    setResultHistory([]);
    setIsLoadedInteraction(false);
    setLoadedInteractionId(null);
  };

  const saveInteraction = async (interaction) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const response = await fetch('/api/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          interaction: JSON.stringify(interaction),
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setInteractions((prev) => [...prev, { interaction: interaction, ...data }]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddToCurrent = (interaction) => {
    if (resultHistory.length > 0 && !isLoadedInteraction) {
      saveInteraction(resultHistory);
    }

    setMessages([]);
    setResultHistory([]);

    if (Array.isArray(interaction.interaction)) {
      interaction.interaction.forEach((item) => {
        setMessages((prev) => [
          ...prev,
          { user: 'User', text: item.question },
          { user: 'Bot', text: item.answer },
        ]);
        setResultHistory((prev) => [...prev, item]);
      });

      setIsLoadedInteraction(true);
      setLoadedInteractionId(interaction.interactionId);
    }
  };

  const handleDeleteInteraction = async (index) => {
    const token = localStorage.getItem('access_token');
    const interactionId = interactions[index]?.interactionId;
    if (!interactionId) return;

    try {
      const response = await fetch(`/api/interactions/${interactionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setInteractions((prev) => prev.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Error deleting interaction:', error);
    }
  };

  const handleViewTraces = (traces) => {
    setCurrentTraces(traces);
    setShowTracesModal(true);
  };

  return (
    <Box display="flex" height="100vh">
      <Navbar setCurrentView={setCurrentView} handleLogout={handleLogout} />
      <Box flex="1" p={4}>
        {currentView === 'home' && (
          <VStack spacing={4}>
            <Text fontSize="2xl">Welcome, {user?.email}</Text>
            <Button onClick={() => setShowProfile(true)}>View Profile</Button>
          </VStack>
        )}

        {currentView === 'chat' && (
          <Flex direction="column" maxW="1200px" mx="auto">
            <Flex direction="column" height="70vh" position="relative" mb={4}>
              <Box flex="1" overflowY="auto" paddingBottom="20px">
                <MessageList messages={messages} />
              </Box>
              <Flex mt={2} alignItems="center" paddingBottom="20px">
                <MessageInput onSend={handleSend} inputValue={inputValue} setInputValue={setInputValue} />
                <ClearButton onClear={handleClear} />
              </Flex>
              {traceResults.length > 0 && (
                <ResultsDisplayAccordion traces={traceResults} />
              )}
            </Flex>

            <Box overflowY="auto" maxHeight="30vh">
              <InteractionHistory
                interactions={interactions}
                onDelete={handleDeleteInteraction}
                onAddToCurrent={handleAddToCurrent}
                onViewTraces={handleViewTraces}
              />
            </Box>
          </Flex>
        )}

        {showProfile && <UserProfile user={user} onClose={() => setShowProfile(false)} />}

        <Modal isOpen={showTracesModal} onClose={() => setShowTracesModal(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Traces</ModalHeader>
            <ModalBody>
              <ResultsDisplayAccordion traces={currentTraces} />
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setShowTracesModal(false)}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default HomePage;
