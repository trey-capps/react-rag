import React, { useState } from 'react';
import './IntermediateResults.css'; // Optional styling

const IntermediateResults = ({ results }) => {
  const [isExpanded, setIsExpanded] = useState(false); // State for tracking expansion

  // Toggle function for expanding/collapsing the sidebar
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Helper function to render list items
  const renderList = (list) => (
    <ul>
      {list.map((item, index) => (
        <li key={index}>{typeof item === 'object' ? JSON.stringify(item, null, 2) : item}</li>
      ))}
    </ul>
  );

  // Helper function to render dictionary
  const renderDictionary = (dict) => (
    <ul>
      {Object.entries(dict).map(([key, value], index) => (
        <li key={index}>
          <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
        </li>
      ))}
    </ul>
  );

  // Function to render content based on the type
  const renderContent = (info) => {
    if (Array.isArray(info)) {
      return renderList(info); // Render as list if info is an array
    } else if (typeof info === 'object' && info !== null) {
      return renderDictionary(info); // Render as dictionary if info is an object
    }
    return info; // Return as-is if it's a string
  };

  return (
    <div className={`intermediate-results-container ${isExpanded ? 'expanded' : ''}`}>
      <h3 onClick={toggleExpand} style={{ cursor: 'pointer' }}>
        Intermediate Process {isExpanded ? '' : '▼'}
      </h3>
      {isExpanded && (
        <div>
          {results.map((result, index) => (
            <div key={index}>
              <strong>Topics Identified:</strong> {renderContent(result.text)}<br></br><strong>Score: </strong>{result.score}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IntermediateResults;