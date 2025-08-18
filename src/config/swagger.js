const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const path = require('path')

// Load swagger document from YAML file
const swaggerDocument = YAML.load(path.join(__dirname, '../../docs/swagger.yaml'))

// Swagger JSDoc options for inline documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Node.js Backend API',
      version: '1.0.0',
      description: 'API documentation generated from JSDoc comments'
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3000',
        description: 'API server'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/app.js'] // paths to files with OpenAPI definitions
}

// Generate swagger spec from JSDoc comments
const swaggerSpec = swaggerJsdoc(swaggerOptions)

// Swagger UI options
const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #3b82f6; }
  `,
  customSiteTitle: 'Node.js API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true
  }
}

module.exports = {
  swaggerDocument,
  swaggerSpec,
  swaggerUi,
  swaggerUiOptions
}