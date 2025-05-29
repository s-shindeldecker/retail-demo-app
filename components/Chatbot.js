// components/Chatbot.js
import { useState, useEffect } from "react";
import { useLDClient } from "launchdarkly-react-client-sdk";

const Chatbot = ({ chatData, setChatData }) => {
  const { input, messages = [] } = chatData;
  const [isLoading, setIsLoading] = useState(false);
  const ldClient = useLDClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    console.log('Submitting chat input:', input);
    console.log('Current chat data:', chatData);

    setIsLoading(true);
    try {
      // Add user message to chat
      const updatedChatData = {
        ...chatData,
        input: "",
        messages: [...(chatData.messages || []), { role: 'user', content: input }]
      };
      setChatData(updatedChatData);

      // Call the API
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: input
        }),
      });

      console.log('Got API response:', response);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.details || `API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response data:', data);

      if (!data.message) {
        throw new Error('No message received from API');
      }

      // Add assistant message to chat
      const finalChatData = {
        ...updatedChatData,
        messages: [
          ...updatedChatData.messages,
          { role: 'assistant', content: data.message }
        ]
      };
      setChatData(finalChatData);

      // Track the interaction
      ldClient.track("ai_assistant_interaction", {
        query: input,
        responseTime: data.responseTime,
        success: true
      });

    } catch (error) {
      console.error('Error in chat submission:', error);
      
      // Add error message to chat
      const errorChatData = {
        ...chatData,
        input: "",
        messages: [
          ...(chatData.messages || []),
          { 
            role: 'assistant', 
            content: `I apologize, but I encountered an error: ${error.message}. Please try again or contact support if the issue persists.`
          }
        ]
      };
      setChatData(errorChatData);

      // Track the error
      ldClient.track("ai_assistant_error", {
        query: input,
        error: error.message,
        success: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Your AI Assistant</h2>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-3 rounded-lg ${
              msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-left mb-4">
            <div className="inline-block p-3 rounded-lg bg-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="mt-4 flex">
        <input
          type="text"
          placeholder="What are you looking for?"
          value={input}
          onChange={(e) => setChatData({ ...chatData, input: e.target.value })}
          className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`p-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 focus:outline-none ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chatbot;