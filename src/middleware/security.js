const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const slowDown = require('express-slow-down')
const hpp = require('hpp')

// Rate limiting configuration
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil(windowMs / 1000)
      })
    }
  })
}

// General rate limiter - 100 requests per 15 minutes
const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later'
)

// Strict rate limiter for auth endpoints - 5 requests per 15 minutes
const strictLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  'Too many authentication attempts, please try again later'
)

// API rate limiter - 50 requests per 10 minutes
const apiLimiter = createRateLimit(
  10 * 60 * 1000, // 10 minutes
  50, // limit each IP to 50 requests per windowMs
  'Too many API requests, please try again later'
)

// Speed limiter to slow down repeated requests
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 2, // allow 2 requests per windowMs without delay
  delayMs: 500, // add 500ms delay per request after delayAfter
  maxDelayMs: 20000 // max delay of 20 seconds
})

// Security headers configuration
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false // Disable for API compatibility
})

// HPP protection against HTTP Parameter Pollution
const hppProtection = hpp({
  whitelist: ['sort', 'filter'] // allow arrays for these parameters
})

module.exports = {
  generalLimiter,
  strictLimiter,
  apiLimiter,
  speedLimiter,
  securityHeaders,
  hppProtection
}
