import React from 'react';
import { useMood } from '../contexts/MoodContext';
import { getAverageSentiment, getVibeAlertThreshold, getVibeAlertSuggestions } from '../utils/sentimentUtils';
import { AlertTriangle } from 'lucide-react';

const VibeAlert: React.FC = () => {
  const { getFilteredMessages } = useMood();
  
  const messages = getFilteredMessages();
  const avgSentiment = getAverageSentiment(messages);
  
  // Check if we should show an alert
  const showAlert = avgSentiment <= getVibeAlertThreshold && messages.length > 0;
  
  // Get suggestions if needed
  const suggestions = showAlert ? getVibeAlertSuggestions(avgSentiment) : [];

  if (!showAlert) {
    return null;
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4 rounded-lg shadow-md mb-4 animate-fadeIn transition-colors duration-200">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-md font-medium text-amber-800 dark:text-amber-400">
            Vibe Alert
          </h3>
          <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
            <p>
              The team mood is currently {avgSentiment <= -0.5 ? 'very low' : 'below average'}.
              Here are some suggestions:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibeAlert;