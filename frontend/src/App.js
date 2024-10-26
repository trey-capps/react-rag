import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { HomePage } from './pages';
import { Login, Register } from './components/Auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) setIsAuthenticated(true);
  }, []);

  return (
    <ChakraProvider>
      {isAuthenticated ? (
        <HomePage user={user} handleLogout={handleLogout} />
      ) : (
        showLogin ? (
          <Login setIsAuthenticated={setIsAuthenticated} setShowLogin={setShowLogin} setUser={setUser} />
        ) : (
          <Register setIsAuthenticated={setIsAuthenticated} setShowLogin={setShowLogin} setUser={setUser} />
        )
      )}
    </ChakraProvider>
  );
}

export default App;
