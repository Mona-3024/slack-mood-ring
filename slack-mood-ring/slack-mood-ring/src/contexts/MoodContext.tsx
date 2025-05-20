import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MessageType, TeamMember, TimeRange } from '../types';
import { analyzeSentiment } from '../utils/sentimentUtils';
import { getMessages, saveMessages, getTeamMembers, saveTeamMembers } from '../utils/storageUtils';
import { filterMessagesByTimeRange, aggregateMessagesByTime } from '../utils/timeUtils';

type MoodContextType = {
  messages: MessageType[];
  teamMembers: TeamMember[];
  activeTimeRange: TimeRange;
  activeUserId: string | null;
  addMessage: (userId: string, text: string) => void;
  setActiveTimeRange: (range: TimeRange) => void;
  setActiveUserId: (id: string | null) => void;
  getMoodData: (userId?: string) => { timestamp: number; score: number }[];
  getFilteredMessages: (userId?: string) => MessageType[];
};

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activeTimeRange, setActiveTimeRange] = useState<TimeRange>('day');
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  // Load initial data from local storage
  useEffect(() => {
    const storedMessages = getMessages();
    const storedTeamMembers = getTeamMembers();
    
    setMessages(storedMessages);
    setTeamMembers(storedTeamMembers);
  }, []);

  // Add a new message with sentiment analysis
  const addMessage = (userId: string, text: string) => {
    const sentiment = analyzeSentiment(text);
    const newMessage: MessageType = {
      id: Date.now().toString(),
      userId,
      text,
      timestamp: Date.now(),
      sentiment
    };
    
    // Update messages
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    
    // Update team member's messages
    const updatedTeamMembers = teamMembers.map(member => {
      if (member.id === userId) {
        return {
          ...member,
          messages: [...member.messages, newMessage]
        };
      }
      return member;
    });
    
    setTeamMembers(updatedTeamMembers);
    saveTeamMembers(updatedTeamMembers);
  };

  // Get mood data for charts based on the active time range
  const getMoodData = (userId?: string) => {
    const filteredMessages = userId 
      ? messages.filter(msg => msg.userId === userId)
      : messages;
    
    return aggregateMessagesByTime(filteredMessages, activeTimeRange);
  };

  // Get messages filtered by time range and optionally by user
  const getFilteredMessages = (userId?: string) => {
    let filtered = filterMessagesByTimeRange(messages, activeTimeRange);
    
    if (userId) {
      filtered = filtered.filter(msg => msg.userId === userId);
    }
    
    return filtered;
  };

  const value = {
    messages,
    teamMembers,
    activeTimeRange,
    activeUserId,
    addMessage,
    setActiveTimeRange,
    setActiveUserId,
    getMoodData,
    getFilteredMessages
  };

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};

export const useMood = (): MoodContextType => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};