import { MessageType, TimeRange } from '../types';

export const ONE_HOUR = 60 * 60 * 1000;
export const ONE_DAY = 24 * ONE_HOUR;
export const ONE_WEEK = 7 * ONE_DAY;

export const getTimeRangeMs = (range: TimeRange): number => {
  switch (range) {
    case 'hour': return ONE_HOUR;
    case 'day': return ONE_DAY;
    case 'week': return ONE_WEEK;
    default: return ONE_DAY;
  }
};

export const filterMessagesByTimeRange = (
  messages: MessageType[],
  range: TimeRange
): MessageType[] => {
  const now = Date.now();
  const rangeMs = getTimeRangeMs(range);
  
  return messages.filter(message => now - message.timestamp < rangeMs);
};

export const aggregateMessagesByTime = (
  messages: MessageType[],
  range: TimeRange
): { timestamp: number; score: number }[] => {
  if (messages.length === 0) return [];
  
  const now = Date.now();
  const rangeMs = getTimeRangeMs(range);
  const filtered = filterMessagesByTimeRange(messages, range);
  
  // Define time buckets based on range
  let interval: number;
  switch (range) {
    case 'hour':
      interval = 5 * 60 * 1000; // 5 minutes
      break;
    case 'day':
      interval = ONE_HOUR; // 1 hour
      break;
    case 'week':
      interval = 6 * ONE_HOUR; // 6 hours
      break;
    default:
      interval = ONE_HOUR;
  }
  
  // Create empty buckets
  const buckets: Record<number, MessageType[]> = {};
  const startTime = now - rangeMs;
  
  for (let time = startTime; time <= now; time += interval) {
    buckets[time] = [];
  }
  
  // Fill buckets with messages
  filtered.forEach(message => {
    const bucketTime = Math.floor((message.timestamp - startTime) / interval) * interval + startTime;
    if (buckets[bucketTime]) {
      buckets[bucketTime].push(message);
    }
  });
  
  // Calculate average sentiment for each bucket
  return Object.entries(buckets).map(([timestamp, bucketMessages]) => {
    let score = 0;
    if (bucketMessages.length > 0) {
      score = bucketMessages.reduce((sum, msg) => sum + msg.sentiment.comparative, 0) / bucketMessages.length;
    }
    
    return {
      timestamp: parseInt(timestamp),
      score
    };
  }).sort((a, b) => a.timestamp - b.timestamp);
};

export const formatTime = (timestamp: number, range: TimeRange): string => {
  const date = new Date(timestamp);
  
  switch (range) {
    case 'hour':
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    case 'day':
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    case 'week':
      return date.toLocaleDateString([], { weekday: 'short' }) + ' ' + 
        date.toLocaleTimeString([], { hour: '2-digit' });
    default:
      return date.toLocaleString();
  }
};