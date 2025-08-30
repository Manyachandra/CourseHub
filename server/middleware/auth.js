const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({ message: 'Authentication required' });
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.userRole === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Admin access required' });
};

const isNotAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return next();
  }
  res.status(400).json({ message: 'Already authenticated' });
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isNotAuthenticated
};
