import React, { useState } from 'react';
import { Box, Button, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useToast } from '@chakra-ui/react';

const Login = ({ setIsAuthenticated, setShowLogin, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access_token);
        setIsAuthenticated(true);
        setUser({ email });
      } else {
        toast({
          title: "Login failed",
          description: data.error || "An error occurred",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Unable to login",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={true} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login</ModalHeader>
        <ModalBody>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} mb={4} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleLogin}>Login</Button>
          <Button variant="ghost" ml={2} onClick={() => setShowLogin(false)}>Register</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Login;
