import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

const ProductList = ({ products }) => (
  <motion.div
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    {products.map((product, index) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </motion.div>
);

export default ProductList;
