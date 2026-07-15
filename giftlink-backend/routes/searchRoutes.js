const express = require('express');
const router = express.Router();

const { connectToDatabase } = require('../models/db');
const logger = require('../logger');

// GET /api/search?category=&condition=&age_years=&name=
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const gifts = db.collection('gifts');

    const { category, condition, age_years, name } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (condition && condition !== 'All') {
      query.condition = condition;
    }

    if (age_years) {
      const maxAgeYears = parseFloat(age_years);
      if (!Number.isNaN(maxAgeYears)) {
        const cutoffDate = new Date();
        cutoffDate.setFullYear(cutoffDate.getFullYear() - maxAgeYears);
        query.date_added = { $gte: cutoffDate };
      }
    }

    if (name) {
      // Case-insensitive partial match on name or description
      query.$or = [
        { name: { $regex: name, $options: 'i' } },
        { description: { $regex: name, $options: 'i' } }
      ];
    }

    const results = await gifts.find(query).sort({ date_added: -1 }).toArray();
    res.json(results);
  } catch (err) {
    logger.error({ err }, 'Search failed');
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
