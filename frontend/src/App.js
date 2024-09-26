import React, { useState } from 'react';
import ChatBox from './ChatBox';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import ClearButton from './ClearButton';
import IntermediateResults from './IntermediateResults';
import './ChatApp.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [intermediateResults, setIntermediateResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (message) => {
    setMessages((prev) => [...prev,{ user: 'User', text: message }]);
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({question: message}),
      });
      
      const data = await response.json();
      const botMessage = data.answer;

      setIntermediateResults(data.intermediate_results); 

      // Append bot response
      setMessages((prev) => [...prev, {user: 'Bot', text: botMessage}]);
    } catch (error) {
      console.log('Message', message)

      console.error('Error fetching the answer:', error);
      setMessages((prev) => [...prev, { user: 'Bot', text: 'Error fetching the answer.' }]);
    }
  };

  // Function to clear the state
  const handleClear = () => {
    setMessages([]);
    setIntermediateResults([]);
  };

  return (
    <div className="app-container">
      <ChatBox>
        <MessageList messages={messages} />
        <MessageInput onSend={handleSend} />
        <ClearButton clearFunc={handleClear}/>
        {loading && (
          <div className="loading-container">
            
          </div>
        )
        
        }
      </ChatBox>
      <IntermediateResults results={intermediateResults} />
    </div>
  );
};

export default App;

// src/App.js
// import React from 'react';
// import AnimatedQABot from './components/AnimatedQABot'; // adjust the import path as needed

// function App() {
//   return (
//     <div className="App">
//       <header>My React App</header>
//       <main>
//         <AnimatedQABot />
//       </main>
//       <footer>© 2024 My Company</footer>
//     </div>
//   );
// }

// export default App;