import React, { useState } from 'react';
import { Box, Button, VStack, IconButton, Collapse } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

const Navbar = ({ setCurrentView, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(true); // Manages collapse state

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box display="flex" flexDirection="column" minH="100vh" bg="gray.800" color="white" p={4}>
      {/* Toggle Button for Collapsible Navbar */}
      <IconButton
        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
        onClick={toggleNavbar}
        aria-label="Toggle Navigation"
        mb={4}
        alignSelf="center"
      />

      {/* Collapsible Menu */}
      <Collapse in={isOpen} animateOpacity>
        <VStack spacing={4} align="start">
          <Button
            variant="ghost"
            colorScheme="whiteAlpha"
            width="full"
            onClick={() => setCurrentView('home')}
          >
            Home
          </Button>
          <Button
            variant="ghost"
            colorScheme="whiteAlpha"
            width="full"
            onClick={() => setCurrentView('chat')}
          >
            Chat
          </Button>
          <Button
            variant="ghost"
            colorScheme="whiteAlpha"
            width="full"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </VStack>
      </Collapse>
    </Box>
  );
};

export default Navbar;
