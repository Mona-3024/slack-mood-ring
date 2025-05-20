import React from 'react';
import { useMood } from '../contexts/MoodContext';
import { getAverageSentiment, getVibeColor } from '../utils/sentimentUtils';

const TeamMembers: React.FC = () => {
  const { teamMembers, getFilteredMessages, activeUserId, setActiveUserId } = useMood();

  // Toggle active user
  const handleUserClick = (userId: string) => {
    if (activeUserId === userId) {
      setActiveUserId(null); // Toggle off if already selected
    } else {
      setActiveUserId(userId);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-200">
      <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
        Team Members
      </h3>
      <div className="space-y-1">
        {teamMembers.map(member => {
          const messages = getFilteredMessages(member.id);
          const avgSentiment = getAverageSentiment(messages);
          const moodColor = getVibeColor(avgSentiment);
          const isActive = activeUserId === member.id;
          
          return (
            <div 
              key={member.id}
              onClick={() => handleUserClick(member.id)}
              className={`p-4 cursor-pointer flex items-center space-x-3 transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-750'
              }`}
            >
              <div className="relative">
                <img 
                  src={member.avatar} 
                  alt={member.name}
                  className="w-10 h-10 rounded-full"
                />
                <div 
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 bg-gradient-to-r ${moodColor}`}
                ></div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">{member.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
              </div>
              <div className="text-xs font-medium">
                {messages.length > 0 ? (
                  <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                    {messages.length} msg{messages.length !== 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">No messages</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamMembers;