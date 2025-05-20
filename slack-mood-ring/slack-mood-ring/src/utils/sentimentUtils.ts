import Sentiment from 'sentiment';
import { MessageType, SentimentScore, VibeZone } from '../types';

const sentiment = new Sentiment();

export const analyzeSentiment = (text: string): SentimentScore => {
  return sentiment.analyze(text);
};

export const getAverageSentiment = (messages: MessageType[]): number => {
  if (messages.length === 0) return 0;
  
  const sum = messages.reduce((acc, message) => acc + message.sentiment.comparative, 0);
  return sum / messages.length;
};

export const getVibeZone = (score: number): VibeZone => {
  if (score > 0.5) return 'energized';
  if (score > 0.1) return 'relaxed';
  if (score > -0.3) return 'focused';
  return 'stressed';
};

export const getVibeColor = (score: number): string => {
  if (score > 0.5) return 'from-green-400 to-emerald-500'; // Energized
  if (score > 0.1) return 'from-blue-400 to-cyan-500'; // Relaxed
  if (score > -0.3) return 'from-purple-400 to-indigo-500'; // Focused
  return 'from-red-400 to-rose-500'; // Stressed
};

export const getMoodInfluencers = (messages: MessageType[]): string[] => {
  if (messages.length === 0) return [];
  
  // Group messages by user ID
  const userMessages: Record<string, MessageType[]> = {};
  
  messages.forEach(message => {
    if (!userMessages[message.userId]) {
      userMessages[message.userId] = [];
    }
    userMessages[message.userId].push(message);
  });
  
  // Calculate average sentiment per user
  const userSentiments = Object.entries(userMessages).map(([userId, messages]) => ({
    userId,
    avgSentiment: getAverageSentiment(messages),
    messageCount: messages.length
  }));
  
  // Sort by absolute sentiment value and message count
  userSentiments.sort((a, b) => 
    (Math.abs(b.avgSentiment) * b.messageCount) - (Math.abs(a.avgSentiment) * a.messageCount)
  );
  
  // Return top 3 influencers
  return userSentiments.slice(0, 3).map(u => u.userId);
};

export const getKeywords = (messages: MessageType[]): Record<string, number> => {
  const keywords: Record<string, number> = {};
  
  messages.forEach(message => {
    const tokens = message.text.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3) // Filter out short words
      .filter(word => !['that', 'this', 'with', 'from', 'have', 'would', 'about', 'there'].includes(word)); // Filter common words
    
    tokens.forEach(token => {
      if (keywords[token]) {
        keywords[token] += 1;
      } else {
        keywords[token] = 1;
      }
    });
  });
  
  return keywords;
};

export const getVibeAlertThreshold = -0.3; // Threshold for triggering vibe alerts

export const getVibeAlertSuggestions = (score: number): string[] => {
  if (score <= -0.5) {
    return [
      "Take a 15-minute team break",
      "Schedule a quick virtual coffee chat",
      "Share a funny GIF or meme",
      "Do a 5-minute stretching exercise together"
    ];
  } else if (score <= -0.3) {
    return [
      "Check in with the team",
      "Acknowledge challenges and offer support",
      "Share a quick win to boost morale",
      "Consider rescheduling non-critical meetings"
    ];
  }
  
  return [];
};