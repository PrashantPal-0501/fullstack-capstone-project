const jwt = require('jsonwebtoken');
const logger = require('../logger');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.warn({ err }, 'Invalid or expired token');
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded; // { id, email }
    next();
  });
}

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
}

module.exports = { authenticateToken, generateToken };
