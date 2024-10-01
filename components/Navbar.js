// components/Navbar.js
import Link from 'next/link';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { FaSearch, FaHeart, FaShoppingCart } from 'react-icons/fa';
import shoes from '../data/shoes.json';
import clothes from '../data/clothes.json';
import Image from 'next/image';

const Navbar = ({ onCartClick }) => {
  const { cartItems } = useContext(CartContext);

  // Calculate total quantity
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Calculate total number of new items
  const totalItems = shoes.length + clothes.length;

  const navItems = [
    { name: `New`, href: '#' },
    { name: 'Men', href: '#' },
    { name: 'Women', href: '#' },
    { name: 'Kids', href: '#' },
    { name: 'Jordan', href: '#' },
    { name: 'Sale', href: '#' },
  ];

  return (
    <nav className="bg-white  px-4 py-2 flex items-center justify-between">
      {/* Left Side: Company Logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/images/company-logo.png" 
            alt="Company Logo"
            width={100}
            height={100}
            className="cursor-pointer"
          />
        </Link>
      </div>

      {/* Middle: Navigation Links */}
      <div className="hidden md:flex space-x-6">
        {navItems.map((item) => (
          <Link key={item.name} href={item.href} className="text-black-700 hover:text-gray-400 hover:underline">
            {item.name}
          </Link>
        ))}
      </div>

      {/* Right Side: Search Bar, Heart Icon, Cart Icon */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        {/* Heart Icon */}
        <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
          <FaHeart className="w-5 h-5" />
        </button>

        {/* Cart Icon */}
        <button
          onClick={onCartClick}
          className="relative text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <FaShoppingCart className="w-5 h-5" />
          {totalQuantity > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {totalQuantity}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
