const express = require('express');
const mongoose = require('mongoose');
const FAQ = require('../models/FAQ');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const validateId = (id) => mongoose.Types.ObjectId.isValid(id);

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { question, answer, category } = req.body || {};
    if (!question || !answer) return res.status(400).json({ success: false, message: 'Question and answer are required' });
    const faq = await FAQ.create({ question: String(question).trim(), answer: String(answer).trim(), category: category ? String(category).trim() : 'General', createdBy: req.user._id });
    res.status(201).json({ success: true, message: 'FAQ created successfully', data: faq });
  } catch (error) { next(error); }
});

router.get('/', async (req, res, next) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.json({ success: true, count: faqs.length, data: faqs });
  } catch (error) { next(error); }
});

router.get('/search', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) return res.status(400).json({ success: false, message: 'Search query q is required' });
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const faqs = await FAQ.find({ $or: [{ question: regex }, { answer: regex }, { category: regex }] }).sort({ createdAt: -1 });
    res.json({ success: true, count: faqs.length, data: faqs });
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!validateId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid FAQ ID' });
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, data: faq });
  } catch (error) { next(error); }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    if (!validateId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid FAQ ID' });
    const updates = {};
    for (const field of ['question', 'answer', 'category']) if (req.body?.[field] !== undefined) updates[field] = String(req.body[field]).trim();
    if (!Object.keys(updates).length) return res.status(400).json({ success: false, message: 'No fields to update' });
    const faq = await FAQ.findOneAndUpdate({ _id: req.params.id, createdBy: req.user._id }, updates, { new: true, runValidators: true });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found or not owned by user' });
    res.json({ success: true, message: 'FAQ updated successfully', data: faq });
  } catch (error) { next(error); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    if (!validateId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid FAQ ID' });
    const faq = await FAQ.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found or not owned by user' });
    res.json({ success: true, message: 'FAQ deleted successfully', data: faq });
  } catch (error) { next(error); }
});

module.exports = router;
