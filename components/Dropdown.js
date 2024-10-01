import { useState } from 'react';

const Dropdown = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-2 py-2 text-gray-700 focus:outline-none"
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 transform ${
            isOpen ? 'rotate-180' : ''
          } transition-transform`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && <div className="mt-2 px-2">{children}</div>}
    </div>
  );
};

export default Dropdown;
