// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

// File: src/components/AnimatedQABot/index.js
import React, { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import ThoughtProcess from './ThoughtProcess';
import styles from './AnimatedQABot.module.css';

const AnimatedQABot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [thoughtProcess, setThoughtProcess] = useState('');

  const fetchBotResponse = async (question) => {
    setIsTyping(true);
    try {
      const response = await fetch('http://http://127.0.0.1:5000/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setThoughtProcess(data.thought_process);
      setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      setMessages(prev => [...prev, { text: 'Sorry, I encountered an error. Please try again.', sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    setMessages([...messages, { text: input, sender: 'user' }]);
    fetchBotResponse(input);
    setInput('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Animated Q&A Bot</h1>
      <div className={styles.chatArea}>
        {messages.map((message, index) => (
          <Message key={index} {...message} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>
      {thoughtProcess && <ThoughtProcess thought={thoughtProcess} />}
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className={styles.input}
        />
        <button type="submit" className={styles.sendButton}>
          <IoSend size={24} />
        </button>
      </form>
    </div>
  );
};

export default AnimatedQABot;