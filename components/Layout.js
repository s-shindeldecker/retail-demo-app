// components/Layout.js
import { useState, useContext } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatbotButton from './ChatbotButton';
import CartDrawer from './CartDrawer';
import Notification from './Notification';
import { CartContext } from '../context/CartContext';
import { useLDClient } from 'launchdarkly-react-client-sdk';

const Layout = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { notification } = useContext(CartContext);
  const client = useLDClient();

  let enableAIAssistant = client.variation('enable-ai-assistant', client.getContext(), 'false');
  console.log('AI Assistant functionality:', enableAIAssistant);
  
  return (
    <>
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <div className="flex flex-col md:flex-row min-h-screen">
        {children}
      </div>
      <Footer />
      {/* AI Assistant Button */}
      {enableAIAssistant === true && <ChatbotButton />}
      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {/* Notification */}
      <Notification message={notification} onClose={() => {}} />
    </>
  );
};

export default Layout;
