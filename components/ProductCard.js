import Image from 'next/image';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="p-4">
      <div className="relative">
        <Image
          src={product.image}
          alt={product.name}
          layout="responsive"
          width={16} 
          height={9}
          style={{ objectFit: 'cover' }}
        />
      </div>
      <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.type}</p>
      <p className="text-sm text-gray-500">Available Colors:</p>
      <div className="flex space-x-2 mt-1">
        {product.colors.map((color) => (
          <span
            key={color}
            className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs"
          >
            {color}
          </span>
        ))}
      </div>
      <p className="text-lg font-bold text-blue-600 mt-2">
        ${product.price}
      </p>
      <button
        onClick={() => addToCart(product)}
        className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;