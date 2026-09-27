const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { answerQuestion, generateFaq } = require('../services/gemini');

const router = express.Router();

router.post('/answer', requireAuth, async (req, res, next) => {
  try {
    const question = String(req.body?.question || '').trim();
    if (!question) return res.status(400).json({ success: false, message: 'Question is required' });
    const answer = await answerQuestion(question);
    res.json({ success: true, answer });
  } catch (error) { next(error); }
});

router.post('/generate-faq', requireAuth, async (req, res, next) => {
  try {
    const topic = String(req.body?.topic || '').trim();
    if (!topic) return res.status(400).json({ success: false, message: 'Topic is required' });
    const faq = await generateFaq(topic);
    res.json({ success: true, question: faq.question, answer: faq.answer });
  } catch (error) { next(error); }
});

module.exports = router;
