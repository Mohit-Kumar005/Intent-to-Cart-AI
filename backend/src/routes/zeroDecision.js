import { Router } from 'express';
import { generateZeroDecisionEngine } from '../services/zeroDecisionService.js';

const router = Router();

router.post('/generate', (req, res) => {
  const { intentResult, userInput } = req.body;

  if (!intentResult) {
    return res.status(400).json({ error: 'intentResult is required' });
  }

  const zeroDecision = generateZeroDecisionEngine(intentResult, userInput || '');
  res.json({ success: true, data: zeroDecision });
});

export default router;