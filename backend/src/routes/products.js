import { Router } from 'express';
import productCatalog from '../data/productCatalog.js';
import { getProductsByCategory, searchProducts } from '../services/cartService.js';

const router = Router();

router.get('/', (req, res) => {
  const { category, search } = req.query;
  let products = productCatalog;
  if (category) products = getProductsByCategory(category);
  if (search) products = searchProducts(search);
  res.json({ success: true, data: products, count: products.length });
});

router.get('/categories', (req, res) => {
  const categories = [...new Set(productCatalog.map(p => p.category))];
  res.json({ success: true, data: categories });
});

router.get('/:id', (req, res) => {
  const product = productCatalog.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true, data: product });
});

export default router;
