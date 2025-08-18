// Async error handler wrapper
const asyncHandler = (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next)
    }
  }
  
  // Global async error handler middleware
  const setupAsyncErrorHandling = (app) => {
    // Handle async errors globally
    require('express-async-errors')
    
    // Enhanced error handler
    app.use((err, req, res, next) => {
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      })
  
      // Default error
      let error = { ...err }
      error.message = err.message
  
      // Validation errors
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ')
        error = { message, statusCode: 400 }
      }
  
      // Duplicate key error
      if (err.code === 11000) {
        const message = 'Duplicate field value entered'
        error = { message, statusCode: 400 }
      }
  
      // Cast error
      if (err.name === 'CastError') {
        const message = 'Resource not found'
        error = { message, statusCode: 404 }
      }
  
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && {
          stack: err.stack,
          error: err
        })
      })
    })
  }
  
  module.exports = {
    asyncHandler,
    setupAsyncErrorHandling
  }