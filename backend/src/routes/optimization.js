import { Router } from 'express';
import { optimizeCart } from '../services/optimizationService.js';

const router = Router();

router.post('/cart', (req, res) => {
  const { intentResult, products } = req.body;

  if (!intentResult || !Array.isArray(products)) {
    return res.status(400).json({ error: 'intentResult and products are required' });
  }

  const optimization = optimizeCart(intentResult, products);

  res.json({ success: true, data: optimization });
});

export default router;