import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useMood } from '../contexts/MoodContext';
import { TimeRange } from '../types';
import { formatTime } from '../utils/timeUtils';
import { useTheme } from '../contexts/ThemeContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type MoodChartProps = {
  userId?: string;
};

const MoodChart: React.FC<MoodChartProps> = ({ userId }) => {
  const { getMoodData, activeTimeRange, setActiveTimeRange } = useMood();
  const { theme } = useTheme();
  
  const moodData = getMoodData(userId);
  
  const labels = moodData.map(item => formatTime(item.timestamp, activeTimeRange));
  const dataPoints = moodData.map(item => item.score);
  
  // Color scheme based on theme
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const textColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Mood Score',
        data: dataPoints,
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: -1,
        max: 1,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          callback: (value: number) => {
            if (value === 1) return 'Very Positive';
            if (value === 0.5) return 'Positive';
            if (value === 0) return 'Neutral';
            if (value === -0.5) return 'Negative';
            if (value === -1) return 'Very Negative';
            return '';
          },
        },
      },
      x: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context: any) => {
            const score = context.raw;
            let sentiment;
            
            if (score > 0.5) sentiment = 'Very Positive';
            else if (score > 0) sentiment = 'Positive';
            else if (score > -0.5) sentiment = 'Neutral';
            else sentiment = 'Negative';
            
            return `Mood: ${sentiment} (${score.toFixed(2)})`;
          },
        },
      },
    },
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    setActiveTimeRange(range);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors duration-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Mood Over Time
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleTimeRangeChange('hour')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              activeTimeRange === 'hour'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            } transition-colors duration-200`}
          >
            Hour
          </button>
          <button
            onClick={() => handleTimeRangeChange('day')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              activeTimeRange === 'day'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            } transition-colors duration-200`}
          >
            Day
          </button>
          <button
            onClick={() => handleTimeRangeChange('week')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              activeTimeRange === 'week'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            } transition-colors duration-200`}
          >
            Week
          </button>
        </div>
      </div>
      <div className="h-60">
        {moodData.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            No mood data available for the selected time range
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodChart;