require('dotenv').config()

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiKey: process.env.API_KEY,
  databaseUrl: process.env.DATABASE_URL,

  // API configuration
  api: {
    prefix: '/api',
    version: 'v1'
  },

  // CORS configuration
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? 'http://localhost:3000'
      : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
}

module.exports = config
