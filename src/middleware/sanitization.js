const xss = require('xss')

// XSS protection middleware
const sanitizeInput = (req, res, next) => {
  // Sanitize body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body)
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query)
  }

  next()
}

// Recursively sanitize object properties
const sanitizeObject = (obj) => {
  const sanitized = {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]

      if (typeof value === 'string') {
        sanitized[key] = xss(value.trim())
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value)
      } else {
        sanitized[key] = value
      }
    }
  }

  return sanitized
}

// Sanitize specific fields
const sanitizeUserInput = (req, res, next) => {
  if (req.body.name) {
    req.body.name = xss(req.body.name.trim())
  }

  if (req.body.email) {
    req.body.email = xss(req.body.email.trim().toLowerCase())
  }

  next()
}

module.exports = {
  sanitizeInput,
  sanitizeUserInput
}
