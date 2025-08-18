const express = require('express')
const router = express.Router()

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - System
 *     summary: Get API information
 *     description: Returns basic information about the API
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Node.js Backend API',
    version: '1.0.0',
    documentation: '/docs',
    endpoints: {
      health: '/health',
      users: '/api/users',
      docs: {
        interactive: '/docs',
        json: '/docs/json',
        info: '/docs/info'
      }
    },
    features: [
      'RESTful API endpoints',
      'Rate limiting and security',
      'Input validation and sanitization',
      'API documentation with Swagger',
      'Docker containerization',
      'CI/CD with GitHub Actions'
    ]
  })
})

module.exports = router