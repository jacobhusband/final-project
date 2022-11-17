const jwt = require("jsonwebtoken"); // eslint-disable-line
const ClientError = require("./client-error"); // eslint-disable-line

function authorizationMiddleware(req, res, next) {
  const token = req.headers['x-access-token'];
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = payload;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    throw new ClientError(401, 'Authentication required');
  }
}

module.exports = authorizationMiddleware;
