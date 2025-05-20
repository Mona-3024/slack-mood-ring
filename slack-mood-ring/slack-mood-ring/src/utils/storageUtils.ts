import { MessageType, TeamMember } from '../types';

const STORAGE_KEYS = {
  MESSAGES: 'slack-mood-ring-messages',
  TEAM_MEMBERS: 'slack-mood-ring-team-members',
  THEME: 'slack-mood-ring-theme'
};

export const saveMessages = (messages: MessageType[]): void => {
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
};

export const getMessages = (): MessageType[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  return stored ? JSON.parse(stored) : [];
};

export const saveTeamMembers = (members: TeamMember[]): void => {
  localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(members));
};

export const getTeamMembers = (): TeamMember[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.TEAM_MEMBERS);
  if (stored) return JSON.parse(stored);
  
  // Default team members if none are stored
  return [
    {
      id: '1',
      name: 'Alex Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'Product Manager',
      messages: []
    },
    {
      id: '2',
      name: 'Sam Rivera',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'UX Designer',
      messages: []
    },
    {
      id: '3',
      name: 'Jamie Chen',
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: 'Frontend Developer',
      messages: []
    },
    {
      id: '4',
      name: 'Taylor Smith',
      avatar: 'https://i.pravatar.cc/150?img=4',
      role: 'Backend Developer',
      messages: []
    },
    {
      id: '5',
      name: 'Jordan Lee',
      avatar: 'https://i.pravatar.cc/150?img=5',
      role: 'Project Manager',
      messages: []
    }
  ];
};

export const saveTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
};

export const getTheme = (): 'light' | 'dark' => {
  const stored = localStorage.getItem(STORAGE_KEYS.THEME);
  return (stored as 'light' | 'dark') || 'light';
};

export const clearStorage = (): void => {
  localStorage.removeItem(STORAGE_KEYS.MESSAGES);
  localStorage.removeItem(STORAGE_KEYS.TEAM_MEMBERS);
};