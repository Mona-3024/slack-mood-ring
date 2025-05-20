import React from 'react';
import { useMood } from '../contexts/MoodContext';
import { getMoodInfluencers, getAverageSentiment } from '../utils/sentimentUtils';
import { Zap } from 'lucide-react';

const MoodInfluencers: React.FC = () => {
  const { getFilteredMessages, teamMembers } = useMood();
  
  const messages = getFilteredMessages();
  const influencerIds = getMoodInfluencers(messages);
  
  const influencers = influencerIds
    .map(id => {
      const member = teamMembers.find(m => m.id === id);
      if (!member) return null;
      
      const memberMessages = messages.filter(msg => msg.userId === id);
      const sentiment = getAverageSentiment(memberMessages);
      
      return {
        ...member,
        sentiment,
        messageCount: memberMessages.length
      };
    })
    .filter(Boolean);

  if (messages.length === 0 || influencers.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors duration-200">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Mood Influencers
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          Not enough data to determine mood influencers.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-200">
      <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
        Mood Influencers
      </h3>
      <div className="p-4">
        {influencers.map((member, index) => {
          const sentiment = member?.sentiment || 0;
          const isPositive = sentiment > 0;
          
          return (
            <div 
              key={member?.id}
              className="flex items-center mb-3 last:mb-0"
            >
              <div className="relative mr-3">
                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5 text-white">
                  <Zap size={12} />
                </div>
                <img 
                  src={member?.avatar} 
                  alt={member?.name}
                  className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{member?.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member?.messageCount} messages</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isPositive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {isPositive ? 'Positive' : 'Negative'} Influence
                  </div>
                </div>
                <div className="mt-1 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ 
                      width: `${Math.min(Math.abs(sentiment * 100), 100)}%`,
                      transition: 'width 1s ease-in-out' 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoodInfluencers;