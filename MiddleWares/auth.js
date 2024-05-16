const jwt = require('jsonwebtoken');

const authenticationMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied!' });
  }
  try {
    const decoded = jwt.verify(token, '123456');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid!' });
  }
};

module.exports = authenticationMiddleware;
