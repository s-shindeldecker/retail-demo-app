// components/CartDrawer.js
import { useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineDelete } from "react-icons/md";
import { useLDClient } from "launchdarkly-react-client-sdk";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, totalPrice, clearCart } =
    useContext(CartContext);
  const client = useLDClient();

  const handleCheckout = () => {
    client?.track('checkout');    
    client?.track('totalPrice', [], totalPrice);
    client?.flush();
    alert("Proceeding to checkout...");
    clearCart();
    onClose();
  };

  useEffect(() => {
    client?.track("cartAccessed");
    client?.flush();
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          ></div>

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-1/2 md:w-1/3 bg-white p-4 overflow-auto z-50"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween" }}
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

            <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>

            {/* Cart Items */}
            {cartItems.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              <div>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center mb-4">
                    <div className="w-16 h-16 relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-600">
                        ${item.price} x {item.quantity}
                      </p>
                      <p className="text-gray-500 text-sm">{item.attributes}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      {/* Remove Button */}

                      <MdOutlineDelete
                        className="text-black h-8 w-8 cursor-pointer"
                        onClick={() => removeFromCart(item.id)}
                      />
                    </div>
                  </div>
                ))}

                {/* Total Price */}
                <div className="mt-4">
                  <p className="text-xl font-semibold">
                    Total: ${totalPrice.toFixed(2)}
                  </p>
                </div>

                {/* Checkout Button */}

                <button
                  onClick={handleCheckout}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-green-700 focus:outline-none"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
