// File: src/components/AnimatedQABot/ThoughtProcess.js
import React, { useState, useEffect } from 'react';
import { FaBrain } from 'react-icons/fa'; // Changed from lucide-react to react-icons
import styles from './ThoughtProcess.module.css';

const ThoughtProcess = ({ thought }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className={`${styles.container} ${show ? styles.show : ''}`}>
      <div className={styles.header}>
        <FaBrain size={18} />
        <span>Bot's Thought Process</span>
      </div>
      <p>{thought}</p>
    </div>
  );
};

export default ThoughtProcess;