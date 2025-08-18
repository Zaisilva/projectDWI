const express = require('express')
const cors = require('cors')
const compression = require('compression')
const morgan = require('morgan') 
require('express-async-errors') 

const config = require('./config/config')
const logger = require('./middleware/logger')
const { setupDocs } = require('./middleware/docs') 
const { setupAsyncErrorHandling } = require('./middleware/asyncHandler') 
const {
  generalLimiter,
  apiLimiter,
  speedLimiter,
  securityHeaders,
  hppProtection
} = require('./middleware/security')
const { sanitizeInput } = require('./middleware/sanitization')
const indexRoutes = require('./routes/index')
const userRoutes = require('./routes/users')

const app = express()

// HTTP request logging
app.use(morgan('dev'))

// Security middleware (apply first)
app.use(securityHeaders)
app.use(hppProtection)

// Compression middleware
app.use(compression())

// Rate limiting
app.use(generalLimiter)
app.use(speedLimiter)

// CORS and parsing middleware
app.use(cors(config.cors))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Input sanitization
app.use(sanitizeInput)

// Logging middleware
app.use(logger)

// Setup API documentation
setupDocs(app) // Nuevo: configurar documentación API

// Routes with specific rate limiting
app.use('/', indexRoutes)
app.use('/api', apiLimiter) // Apply API rate limiting to all /api routes
app.use('/api/users', userRoutes)

// Health check endpoint (exempt from rate limiting)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    security: {
      rateLimit: 'enabled',
      cors: 'enabled',
      helmet: 'enabled',
      compression: 'enabled'
    },
    documentation: {  
      interactive: '/docs',
      json: '/docs/json',
      info: '/docs/info'
    }
  })
})

// Setup global async error handling
setupAsyncErrorHandling(app) // Nuevo: configurar manejo de errores asíncronos

// 404 handler - Corregido para evitar el error de path-to-regexp
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  })
})

// Variable para almacenar referencia del servidor
let server

// Solo iniciar servidor si no estamos en testing
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`)
    console.log('🛡️  Security: Rate limiting, CORS, Helmet enabled')
    console.log(`📊 Health check: http://localhost:${config.port}/health`)
    console.log(`📚 API Documentation: http://localhost:${config.port}/docs`) // Nuevo: mensaje para documentación
  })
}

// Función para cerrar el servidor (usado en tests)
app.closeServer = () => {
  return new Promise((resolve) => {
    if (server) {
      server.close(resolve)
    } else {
      resolve()
    }
  })
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...')
  if (server) {
    server.close(() => {
      console.log('Process terminated')
    })
  }
})

module.exports = app
