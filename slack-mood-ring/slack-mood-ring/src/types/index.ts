export type SentimentScore = {
  score: number;
  comparative: number;
  tokens: string[];
  words: string[];
  positive: string[];
  negative: string[];
};

export type MessageType = {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
  sentiment: SentimentScore;
};

export type TeamMember = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  messages: MessageType[];
};

export type MoodData = {
  hourly: { timestamp: number; score: number }[];
  daily: { timestamp: number; score: number }[];
  weekly: { timestamp: number; score: number }[];
};

export type TimeRange = 'hour' | 'day' | 'week';

export type VibeZone = 'energized' | 'focused' | 'stressed' | 'relaxed';

export type Theme = 'light' | 'dark';