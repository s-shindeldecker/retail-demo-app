// components/Layout.js
import { useState, useContext } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatbotButton from './ChatbotButton';
import CartDrawer from './CartDrawer';
import Notification from './Notification';
import { CartContext } from '../context/CartContext';

const Layout = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { notification } = useContext(CartContext);

  return (
    <>
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <div className="flex flex-col md:flex-row min-h-screen">
        {children}
      </div>
      <Footer />
      {/* Chatbot Button */}
      <ChatbotButton />
      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {/* Notification */}
      <Notification message={notification} onClose={() => {}} />
    </>
  );
};

export default Layout;
