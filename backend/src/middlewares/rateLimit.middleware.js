import rateLimit from 'express-rate-limit';

export const createRateLimiter = ({ windowMs, max, standardHeaders = true, legacyHeaders = false, message }) =>
  rateLimit({ windowMs, max, standardHeaders, legacyHeaders, message });

export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many auth attempts, please try again later.' },
});


