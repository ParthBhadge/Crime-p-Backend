const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract the token from the Authorization header
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach the decoded user information to the request object
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};
module.exports = auth;