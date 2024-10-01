// pages/api/recommendations.js
import shoes from '../../data/shoes.json';
import clothes from '../../data/clothes.json';

export default function handler(req, res) {
  const { input } = req.body;

  const allProducts = [...shoes, ...clothes];

  // Simple search logic
  const recommendations = allProducts.filter((product) =>
    product.name.toLowerCase().includes(input.toLowerCase()) ||
    product.description.toLowerCase().includes(input.toLowerCase())
  );

  res.status(200).json(recommendations);
}
