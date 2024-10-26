import React, { useState } from 'react';
import { Box, Button, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useToast } from '@chakra-ui/react';

const Register = ({ setIsAuthenticated, setShowLogin, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleRegister = async () => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Registration successful",
          description: "You can now log in",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setShowLogin(true);
      } else {
        toast({
          title: "Registration failed",
          description: data.error || "An error occurred",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Unable to register",
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
        <ModalHeader>Register</ModalHeader>
        <ModalBody>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} mb={4} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleRegister}>Register</Button>
          <Button variant="ghost" ml={2} onClick={() => setShowLogin(true)}>Back to Login</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Register;
