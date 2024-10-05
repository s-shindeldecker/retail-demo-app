// context/CartContext.js
import { createContext, useState } from 'react';
import { useLDClient } from 'launchdarkly-react-client-sdk';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const ldClient = useLDClient();
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState('');

  // Add item to cart
  const addToCart = (product) => {
    
    ldClient.track("productAddedToCart");
    setCartItems((prevItems) => {
      // Check if the product is already in the cart
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        // Increase quantity
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Add new item
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });

    // Show notification
    setNotification(`${product.name} has been added to your cart`);

    // Hide notification after a delay
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        totalPrice,
        notification,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
