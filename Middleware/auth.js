// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const bearerHeader = req.header('Authorization');
  if (!bearerHeader) return res.status(401).send('Accès refusé. Aucun token fourni.');

  const token = bearerHeader.split(' ')[1]; // Supposer que le format est "Bearer [token]"
  if (!token) return res.status(401).send('Accès refusé. Aucun token fourni.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Token invalide.');
  }
};
