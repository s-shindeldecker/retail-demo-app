// components/Chatbot.js
import { useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;

    try {
      const res = await axios.post('/api/recommendations', { input });
      setRecommendations(res.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Chat with Us</h2>
      </div>
      {/* Chat Body */}
      <div className="flex-1 overflow-auto">
        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Recommendations:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendations.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
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
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none"
        />
        <button
          type="submit"
          className="p-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 focus:outline-none"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
