const rateLimit = require('express-rate-limit');

/**
 * Rate limiter: 100 requests per 15 minutes per IP address.
 * Applies to all /api/* routes.
 */
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,  // Return RateLimit-* headers
  legacyHeaders: false,   // Disable X-RateLimit-* headers
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  },
});

module.exports = rateLimiter;
