import React, { useMemo } from 'react';
import { useMood } from '../contexts/MoodContext';
import { getAverageSentiment, getVibeZone, getVibeColor } from '../utils/sentimentUtils';
import { Activity, Brain, Coffee, Heart } from 'lucide-react';

const VibeZones: React.FC = () => {
  const { getFilteredMessages, activeUserId } = useMood();
  
  const messages = getFilteredMessages(activeUserId || undefined);
  const averageSentiment = getAverageSentiment(messages);
  const currentZone = getVibeZone(averageSentiment);
  const gradientColor = getVibeColor(averageSentiment);
  
  const zones = useMemo(() => [
    {
      id: 'energized',
      name: 'Energized',
      description: 'High energy and positivity',
      icon: <Activity className="w-6 h-6" />,
      color: 'from-green-400 to-emerald-500',
      isActive: currentZone === 'energized'
    },
    {
      id: 'relaxed',
      name: 'Relaxed',
      description: 'Calm and positive mood',
      icon: <Coffee className="w-6 h-6" />,
      color: 'from-blue-400 to-cyan-500',
      isActive: currentZone === 'relaxed'
    },
    {
      id: 'focused',
      name: 'Focused',
      description: 'Concentrating on tasks',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-400 to-indigo-500',
      isActive: currentZone === 'focused'
    },
    {
      id: 'stressed',
      name: 'Stressed',
      description: 'Tension or pressure',
      icon: <Heart className="w-6 h-6" />,
      color: 'from-red-400 to-rose-500',
      isActive: currentZone === 'stressed'
    }
  ], [currentZone]);

  // Animation for the mood ring
  const ringAnimation = useMemo(() => {
    return `animate-pulse ${gradientColor}`;
  }, [gradientColor]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors duration-200">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Vibe Zones
      </h3>
      
      <div className="flex flex-col items-center mb-6">
        <div className={`w-24 h-24 rounded-full mb-4 bg-gradient-to-r ${ringAnimation} flex items-center justify-center shadow-lg`}>
          <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
            {zones.find(zone => zone.isActive)?.icon}
          </div>
        </div>
        <h4 className="text-xl font-bold">
          {zones.find(zone => zone.isActive)?.name || 'Neutral'}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {messages.length > 0 
            ? `Score: ${averageSentiment.toFixed(2)}`
            : 'No messages to analyze'}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {zones.map(zone => (
          <div
            key={zone.id}
            className={`p-3 rounded-lg flex flex-col items-center text-center ${
              zone.isActive
                ? `bg-gradient-to-br ${zone.color} text-white`
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            } transition-all duration-300 hover:scale-105`}
          >
            <div className="mb-2">{zone.icon}</div>
            <h4 className="font-medium">{zone.name}</h4>
            <p className={`text-xs ${zone.isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
              {zone.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VibeZones;