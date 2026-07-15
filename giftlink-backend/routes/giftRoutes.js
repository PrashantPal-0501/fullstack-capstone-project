const express = require('express');
const { ObjectId } = require('mongodb');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const { connectToDatabase } = require('../models/db');
const { authenticateToken } = require('../util/authMiddleware');
const logger = require('../logger');

const COLLECTION = 'gifts';

async function getGiftsCollection() {
  const db = await connectToDatabase();
  return db.collection(COLLECTION);
}

// GET /api/gift - list all gifts
router.get('/', async (req, res) => {
  try {
    const gifts = await getGiftsCollection();
    const allGifts = await gifts.find({}).sort({ date_added: -1 }).toArray();
    res.json(allGifts);
  } catch (err) {
    logger.error({ err }, 'Failed to fetch gifts');
    res.status(500).json({ error: 'Failed to fetch gifts' });
  }
});

// GET /api/gift/:id - single gift detail
router.get('/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid gift id' });
    }
    const gifts = await getGiftsCollection();
    const gift = await gifts.findOne({ _id: new ObjectId(req.params.id) });
    if (!gift) {
      return res.status(404).json({ error: 'Gift not found' });
    }
    res.json(gift);
  } catch (err) {
    logger.error({ err }, 'Failed to fetch gift');
    res.status(500).json({ error: 'Failed to fetch gift' });
  }
});

// POST /api/gift - create a new listing (auth required)
router.post(
  '/',
  authenticateToken,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('condition').isIn(['New', 'Like New', 'Older']).withMessage('Invalid condition')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const gifts = await getGiftsCollection();
      const newGift = {
        name: req.body.name,
        category: req.body.category,
        condition: req.body.condition,
        description: req.body.description || '',
        image: req.body.image || '',
        date_added: new Date(),
        owner_id: req.user.id,
        comments: []
      };
      const result = await gifts.insertOne(newGift);
      res.status(201).json({ ...newGift, _id: result.insertedId });
    } catch (err) {
      logger.error({ err }, 'Failed to create gift');
      res.status(500).json({ error: 'Failed to create gift' });
    }
  }
);

// PUT /api/gift/:id - edit a listing (owner only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid gift id' });
    }
    const gifts = await getGiftsCollection();
    const gift = await gifts.findOne({ _id: new ObjectId(req.params.id) });

    if (!gift) {
      return res.status(404).json({ error: 'Gift not found' });
    }
    if (gift.owner_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own listings' });
    }

    const allowedFields = ['name', 'category', 'condition', 'description', 'image'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    updates.updatedAt = new Date();

    await gifts.updateOne({ _id: gift._id }, { $set: updates });
    const updatedGift = await gifts.findOne({ _id: gift._id });
    res.json(updatedGift);
  } catch (err) {
    logger.error({ err }, 'Failed to update gift');
    res.status(500).json({ error: 'Failed to update gift' });
  }
});

// DELETE /api/gift/:id - remove a listing (owner only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid gift id' });
    }
    const gifts = await getGiftsCollection();
    const gift = await gifts.findOne({ _id: new ObjectId(req.params.id) });

    if (!gift) {
      return res.status(404).json({ error: 'Gift not found' });
    }
    if (gift.owner_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own listings' });
    }

    await gifts.deleteOne({ _id: gift._id });
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, 'Failed to delete gift');
    res.status(500).json({ error: 'Failed to delete gift' });
  }
});

// POST /api/gift/:id/comments - add a comment (concurrency-safe via $push)
router.post(
  '/:id/comments',
  authenticateToken,
  [body('text').trim().notEmpty().withMessage('Comment text is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid gift id' });
    }

    try {
      const gifts = await getGiftsCollection();
      const comment = {
        _id: new ObjectId(),
        text: req.body.text,
        author_id: req.user.id,
        author_email: req.user.email,
        created_at: new Date()
      };

      // $push is atomic at the document level, so concurrent comment
      // submissions on the same gift never overwrite one another.
      const result = await gifts.findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $push: { comments: comment } },
        { returnDocument: 'after' }
      );

      const updated = result.value || result;
      if (!updated) {
        return res.status(404).json({ error: 'Gift not found' });
      }

      res.status(201).json(updated);
    } catch (err) {
      logger.error({ err }, 'Failed to add comment');
      res.status(500).json({ error: 'Failed to add comment' });
    }
  }
);

// GET /api/gift/:id/comments - list comments on a gift
router.get('/:id/comments', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid gift id' });
    }
    const gifts = await getGiftsCollection();
    const gift = await gifts.findOne(
      { _id: new ObjectId(req.params.id) },
      { projection: { comments: 1 } }
    );
    if (!gift) {
      return res.status(404).json({ error: 'Gift not found' });
    }
    res.json(gift.comments || []);
  } catch (err) {
    logger.error({ err }, 'Failed to fetch comments');
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

module.exports = router;
