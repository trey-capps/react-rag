// File: src/components/AnimatedQABot/TypingIndicator.js
import React from 'react';
import { FaRobot } from 'react-icons/fa'; // Changed from lucide-react to react-icons
import styles from './TypingIndicator.module.css';

const TypingIndicator = () => (
  <div className={styles.container}>
    <FaRobot size={18} />
    <div className={styles.dots}>
      <div className={styles.dot} style={{ animationDelay: '0ms' }}></div>
      <div className={styles.dot} style={{ animationDelay: '150ms' }}></div>
      <div className={styles.dot} style={{ animationDelay: '300ms' }}></div>
    </div>
  </div>
);

export default TypingIndicator;