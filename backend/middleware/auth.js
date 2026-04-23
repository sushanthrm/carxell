const jwt = require('jsonwebtoken');

exports.requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token, authorization denied' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded; // Contains id, role, jurisdiction
    next();
  } catch (e) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
