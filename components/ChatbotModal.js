// components/ChatbotModal.js
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Chatbot from './Chatbot';
import { motion } from 'framer-motion';

const ChatbotModal = ({ onClose }) => {
  const [chatData, setChatData] = useState(() => {
    // Only retrieve saved chat data if it exists and we're not in a fresh page load
    if (typeof window !== 'undefined' && !window.performance.getEntriesByType('navigation')[0]?.type.includes('reload')) {
      const savedData = sessionStorage.getItem('chatData');
      return savedData ? JSON.parse(savedData) : { 
        input: "", 
        recommendations: [],
        messages: []
      };
    }
    return { 
      input: "", 
      recommendations: [],
      messages: []
    };
  });

  // Save chat data to session storage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('chatData', JSON.stringify(chatData));
  }, [chatData]);

  // Clear chat data on page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('chatData');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleChatDataChange = (newData) => {
    console.log('Chat data changing to:', newData);
    setChatData(newData);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-end pb-24 mr-6 ml-6">
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <motion.div
        className="relative bg-white w-full md:w-1/2 h-3/4 md:h-3/4 p-4 overflow-auto z-50 rounded-t-lg md:rounded-lg"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '0%' }}
        transition={{ type: 'spring', stiffness: 50 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {/* Chatbot Component */}
        <Chatbot chatData={chatData} setChatData={handleChatDataChange} />
      </motion.div>
    </div>,
    document.body
  );
};

export default ChatbotModal;