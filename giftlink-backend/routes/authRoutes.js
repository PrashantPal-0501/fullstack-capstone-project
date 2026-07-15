const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const { createUser, findUserByEmail, verifyPassword, updateUser, toPublicUser } = require('../models/user');
const { authenticateToken, generateToken } = require('../util/authMiddleware');
const logger = require('../logger');

// POST /api/auth/register
router.post(
  '/register',
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { firstName, lastName, email, password } = req.body;
      const newUser = await createUser({ firstName, lastName, email, password });

      const token = generateToken({ id: newUser._id, email: newUser.email });
      logger.info(`New user registered: ${newUser.email}`);
      return res.status(201).json({ user: newUser, authtoken: token });
    } catch (err) {
      logger.error({ err }, 'Registration failed');
      return res.status(err.status || 500).json({ error: err.message || 'Registration failed' });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const user = await findUserByEmail(email);

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const passwordMatches = await verifyPassword(password, user.password);
      if (!passwordMatches) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = generateToken({ id: user._id, email: user.email });
      logger.info(`User logged in: ${user.email}`);
      return res.json({ user: toPublicUser(user), authtoken: token });
    } catch (err) {
      logger.error({ err }, 'Login failed');
      return res.status(500).json({ error: 'Login failed' });
    }
  }
);

// PUT /api/auth/update - requires authentication
router.put('/update', authenticateToken, async (req, res) => {
  try {
    const updatedUser = await updateUser(req.user.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user: updatedUser });
  } catch (err) {
    logger.error({ err }, 'Profile update failed');
    return res.status(500).json({ error: 'Profile update failed' });
  }
});

module.exports = router;
