const sqlInjectionPattern = /('|--|;|\b(SELECT|UPDATE|DELETE|INSERT|DROP|ALTER|CREATE|GRANT|REVOKE)\b)/i;

function checkForSqlInjection(value) {
  if (typeof value === 'string') return sqlInjectionPattern.test(value);
  if (typeof value === 'object' && value !== null) {
    return Object.values(value).some(checkForSqlInjection);
  }
  return false;
}

const detectSqlInjection = (req, res, next) => {
  if (checkForSqlInjection(req.body) || checkForSqlInjection(req.query) || checkForSqlInjection(req.params)) {
    return res.status(400).json({ error: 'Potential SQL injection detected' });
  }
  next();
};

module.exports = detectSqlInjection;
