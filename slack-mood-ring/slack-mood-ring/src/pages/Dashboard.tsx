import React, { useState, useEffect } from 'react';
import ChatInput from '../components/ChatInput';
import MessageList from '../components/MessageList';
import MoodChart from '../components/MoodChart';
import VibeZones from '../components/VibeZones';
import KeywordCloud from '../components/KeywordCloud';
import TeamMembers from '../components/TeamMembers';
import VibeAlert from '../components/VibeAlert';
import MoodInfluencers from '../components/MoodInfluencers';
import ThemeToggle from '../components/ThemeToggle';
import SharingButton from '../components/SharingButton';
import { useMood } from '../contexts/MoodContext';
import { AlertCircle, MessageSquare, X } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { messages, activeUserId } = useMood();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  
  // Show onboarding tutorial if it's the first visit or no messages
  useEffect(() => {
    if (messages.length === 0) {
      setShowOnboarding(true);
    }
  }, [messages.length]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-xl font-bold">Slack Mood Ring</h1>
            </div>
            <div className="flex items-center space-x-3">
              <SharingButton />
              <ThemeToggle />
              <button
                onClick={() => setShowMobileChat(!showMobileChat)}
                className="md:hidden p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <MessageSquare size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Onboarding Tutorial */}
        {showOnboarding && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 relative transition-colors duration-200">
            <button 
              onClick={() => setShowOnboarding(false)}
              className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
            <div className="flex items-start">
              <AlertCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Welcome to Slack Mood Ring!</h3>
                <p className="text-blue-700 dark:text-blue-200 mb-2">
                  This dashboard visualizes team sentiment based on conversations. Here's how to use it:
                </p>
                <ul className="list-disc pl-5 text-blue-700 dark:text-blue-200 space-y-1">
                  <li>Start by adding messages with the chat input (select team members from dropdown)</li>
                  <li>View sentiment analytics on the dashboard as conversations grow</li>
                  <li>Toggle between time ranges to see mood changes over different periods</li>
                  <li>Click on team members to filter analytics for individual people</li>
                  <li>Watch for "Vibe Alerts" when team mood drops below thresholds</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Mobile Chat Drawer */}
        <div className={`fixed inset-0 bg-gray-900 bg-opacity-75 z-40 md:hidden transition-opacity duration-300 ${
          showMobileChat ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className={`fixed inset-y-0 right-0 max-w-full w-full bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 transform ${
            showMobileChat ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-center pb-2 border-b dark:border-gray-700">
                <h2 className="text-lg font-semibold">Team Chat</h2>
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                <MessageList />
              </div>
              <div className="pt-4 border-t dark:border-gray-700">
                <ChatInput onMessageSent={() => window.scrollTo(0, 0)} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Vibe Alert */}
        <VibeAlert />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MoodChart userId={activeUserId || undefined} />
              <VibeZones />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <KeywordCloud />
              <MoodInfluencers />
            </div>
            
            <div className="md:hidden">
              <TeamMembers />
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <div className="hidden md:block">
              <TeamMembers />
            </div>
            
            <div className="hidden md:block">
              <ChatInput />
            </div>
            
            <div className="hidden md:block">
              <MessageList />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 mt-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Slack Mood Ring &copy; {new Date().getFullYear()} • Real-time team sentiment analysis
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;