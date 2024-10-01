// components/ChatbotButton.js
import { useState } from 'react';
import ChatbotModal from './ChatbotModal';
import { BiConversation } from "react-icons/bi";


const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
      >
        <BiConversation className="w-8 h-8" />
      </button>

      {/* Chatbot Modal */}
      {isOpen && <ChatbotModal onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default ChatbotButton;
