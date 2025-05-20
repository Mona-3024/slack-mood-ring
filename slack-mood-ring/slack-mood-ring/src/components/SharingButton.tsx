import React, { useState } from 'react';
import { Share2 } from 'lucide-react';

const SharingButton: React.FC = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      // In a real app, we'd generate an actual screenshot or sharable link
      // For demo purposes, we'll just simulate a sharing action
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success toast
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Sharing failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        disabled={isSharing}
        className="flex items-center space-x-1 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        <Share2 size={18} />
        <span>{isSharing ? 'Sharing...' : 'Share Dashboard'}</span>
      </button>
      
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md animate-fadeIn">
          <p>Dashboard link copied to clipboard!</p>
        </div>
      )}
    </>
  );
};

export default SharingButton;