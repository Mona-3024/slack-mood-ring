import React, { useState } from 'react';
import { useMood } from '../contexts/MoodContext';
import { Send } from 'lucide-react';

type ChatInputProps = {
  onMessageSent?: () => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ onMessageSent }) => {
  const { teamMembers, addMessage } = useMood();
  const [message, setMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(teamMembers[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && selectedUserId) {
      addMessage(selectedUserId, message.trim());
      setMessage('');
      
      if (onMessageSent) {
        onMessageSent();
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors duration-200">
      <div className="mb-4">
        <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Team Member
        </label>
        <select
          id="user-select"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        >
          {teamMembers.map(member => (
            <option key={member.id} value={member.id}>
              {member.name} ({member.role})
            </option>
          ))}
        </select>
      </div>
      
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12 min-h-[80px] resize-y transition-colors duration-200"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="absolute right-3 bottom-3 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;