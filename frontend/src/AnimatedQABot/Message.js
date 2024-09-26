// File: src/components/AnimatedQABot/Message.js
import React, { useState, useEffect } from 'react';
import { FaUser, FaRobot } from 'react-icons/fa'; // Changed from lucide-react to react-icons
import styles from './Message.module.css';

const Message = ({ text, sender }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className={`${styles.messageContainer} ${styles[sender]} ${show ? styles.show : ''}`}>
      <div className={styles.message}>
        <div className={styles.messageHeader}>
          {sender === 'user' ? <FaUser size={18} /> : <FaRobot size={18} />}
          <span>{sender === 'user' ? 'You' : 'Bot'}</span>
        </div>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default Message;