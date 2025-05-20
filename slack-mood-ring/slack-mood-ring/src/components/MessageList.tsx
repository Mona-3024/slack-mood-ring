import React from 'react';
import { useMood } from '../contexts/MoodContext';
import { MessageType, TeamMember } from '../types';
import { getVibeColor } from '../utils/sentimentUtils';

const MessageList: React.FC = () => {
  const { getFilteredMessages, teamMembers, activeUserId } = useMood();
  
  // Get messages filtered by active time range and user
  const messages = getFilteredMessages(activeUserId || undefined);
  
  // Sort messages by timestamp (newest first)
  const sortedMessages = [...messages].sort((a, b) => b.timestamp - a.timestamp);
  
  // Find team member by ID
  const findTeamMember = (userId: string): TeamMember | undefined => {
    return teamMembers.find(member => member.id === userId);
  };

  if (sortedMessages.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center transition-colors duration-200">
        <p className="text-gray-500 dark:text-gray-400">
          No messages in the selected time range. Start a conversation!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-200">
      <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
        Conversation History
      </h3>
      <div className="max-h-[400px] overflow-y-auto">
        {sortedMessages.map((message) => {
          const member = findTeamMember(message.userId);
          const sentimentColor = getVibeColor(message.sentiment.comparative);
          
          return (
            <div
              key={message.id}
              className="border-b border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
            >
              <div className="flex items-start gap-3">
                <img
                  src={member?.avatar || 'https://i.pravatar.cc/150'}
                  alt={member?.name || 'User'}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-semibold">
                      {member?.name || 'Unknown User'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200">{message.text}</p>
                  <div className="mt-2 flex items-center">
                    <div 
                      className={`inline-block h-2 w-2 rounded-full mr-2 bg-gradient-to-r ${sentimentColor}`}
                      title={`Sentiment score: ${message.sentiment.comparative.toFixed(2)}`}
                    ></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {message.sentiment.comparative > 0.3 ? 'Positive' : 
                       message.sentiment.comparative > 0 ? 'Slightly Positive' :
                       message.sentiment.comparative > -0.3 ? 'Neutral' : 'Negative'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessageList;