const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const extractToken = (req) => {
  const authorizationHeader = req.headers['authorization'];
  if (authorizationHeader?.startsWith('Bearer ')) {
    return authorizationHeader.split(' ')[1];
  }

  const cookieHeader = req.headers.cookie || '';
  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim()).filter(Boolean);
  const tokenCookie = cookies.find((cookie) => cookie.startsWith('token='));

  if (tokenCookie) {
    return tokenCookie.split('=')[1];
  }

  return null;
};

const authenticate = (req, res, next) => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'invalid token' });
  }
};

module.exports = authenticate;
