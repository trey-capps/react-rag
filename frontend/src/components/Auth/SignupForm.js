import React, { useState } from 'react';
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setSuccess('User registered successfully!');
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.error);
        setSuccess('');
      }
    } catch (err) {
      setError('Failed to register.');
    }
  };

  return (
    <VStack spacing={4}>
      <Text fontSize="2xl" fontWeight="bold">Sign Up</Text>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Text color="red.500">{error}</Text>}
      {success && <Text color="green.500">{success}</Text>}
      <Button onClick={handleSignup} colorScheme="green">Sign Up</Button>
    </VStack>
  );
};

export default SignupForm;
