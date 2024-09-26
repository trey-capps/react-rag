import React from 'react';
import './ClearButton.css'; 

const ClearButton = ({ clearFunc }) => {
  return (
    <button className="clear-button" onClick={clearFunc}>
      Clear Conversation
    </button>
  );
};

export default ClearButton;
