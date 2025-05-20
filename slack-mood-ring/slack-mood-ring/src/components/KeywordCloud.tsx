import React, { useState, useEffect } from 'react';
import { useMood } from '../contexts/MoodContext';
import { getKeywords } from '../utils/sentimentUtils';

type Word = {
  text: string;
  value: number;
};

const KeywordCloud: React.FC = () => {
  const { getFilteredMessages, activeUserId } = useMood();
  const [words, setWords] = useState<Word[]>([]);
  
  useEffect(() => {
    const messages = getFilteredMessages(activeUserId || undefined);
    const keywordsObj = getKeywords(messages);
    
    // Convert to array format for the word cloud
    const keywordsArray = Object.entries(keywordsObj)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 30); // Limit to top 30 words
    
    setWords(keywordsArray);
  }, [getFilteredMessages, activeUserId]);

  // Function to get a color based on frequency
  const getColor = (value: number, max: number) => {
    const normalized = value / max;
    if (normalized > 0.8) return 'text-blue-600 dark:text-blue-400';
    if (normalized > 0.6) return 'text-indigo-600 dark:text-indigo-400';
    if (normalized > 0.4) return 'text-purple-600 dark:text-purple-400';
    if (normalized > 0.2) return 'text-violet-600 dark:text-violet-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  // Calculate max frequency for scaling
  const maxValue = words.length > 0 ? Math.max(...words.map(w => w.value)) : 1;

  // Calculate font size based on frequency
  const getFontSize = (value: number) => {
    const minSize = 12;
    const maxSize = 28;
    const normalized = value / maxValue;
    return Math.floor(minSize + normalized * (maxSize - minSize));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors duration-200">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Trending Keywords
      </h3>
      
      <div className="flex flex-wrap justify-center p-4 min-h-[150px]">
        {words.length > 0 ? (
          words.map((word, index) => (
            <div 
              key={index}
              className={`m-2 ${getColor(word.value, maxValue)} transition-all duration-200 hover:scale-110`}
              style={{ 
                fontSize: `${getFontSize(word.value)}px`,
                transform: `rotate(${Math.random() * 20 - 10}deg)`
              }}
            >
              {word.text}
            </div>
          ))
        ) : (
          <div className="text-gray-500 dark:text-gray-400 text-center flex items-center justify-center h-full">
            No keywords available. Add more messages!
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordCloud;