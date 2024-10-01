// components/Notification.js
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Auto-close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-10 py-4 rounded shadow-lg z-50"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
