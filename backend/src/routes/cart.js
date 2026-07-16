import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { calculateCartTotal } from '../services/cartService.js';

const router = Router();

// In-memory cart store (replaced by DB in production)
const carts = new Map();

router.post('/create', (req, res) => {
  const { products, cartName, missionName, selectedPackTier } = req.body;
  const cartId = uuidv4();
  const totals = calculateCartTotal(products || []);

  const cart = {
    id: cartId,
    name: cartName || 'My Cart',
    missionName: missionName || cartName || 'Shopping Mission',
    selectedPackTier: selectedPackTier || 'Custom',
    products: products || [],
    totals,
    createdAt: new Date().toISOString(),
    status: 'active'
  };

  carts.set(cartId, cart);
  res.json({ success: true, data: cart });
});

router.get('/:cartId', (req, res) => {
  const cart = carts.get(req.params.cartId);
  if (!cart) return res.status(404).json({ error: 'Cart not found' });
  res.json({ success: true, data: cart });
});

router.put('/:cartId/add', (req, res) => {
  const { product } = req.body;
  const cart = carts.get(req.params.cartId);
  if (!cart) return res.status(404).json({ error: 'Cart not found' });
  if (!cart.products.find(p => p.id === product.id)) {
    cart.products.push(product);
  }
  cart.totals = calculateCartTotal(cart.products);
  res.json({ success: true, data: cart });
});

router.put('/:cartId/remove', (req, res) => {
  const { productId } = req.body;
  const cart = carts.get(req.params.cartId);
  if (!cart) return res.status(404).json({ error: 'Cart not found' });
  cart.products = cart.products.filter(p => p.id !== productId);
  cart.totals = calculateCartTotal(cart.products);
  res.json({ success: true, data: cart });
});

router.post('/:cartId/checkout', (req, res) => {
  const cart = carts.get(req.params.cartId);
  if (!cart) return res.status(404).json({ error: 'Cart not found' });

  cart.status = 'ordered';
  cart.orderedAt = new Date().toISOString();
  cart.orderId = `ORD-${Date.now()}`;
  cart.estimatedDelivery = '10-15 mins';

  res.json({
    success: true,
    data: {
      ...cart,
      message: `Order placed! Your ${cart.missionName || cart.name} will arrive in ${cart.estimatedDelivery}.`
    }
  });
});

export default router;
