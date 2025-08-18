const { swaggerDocument, swaggerUi, swaggerUiOptions } = require('../config/swagger')

// Middleware to serve API documentation
const setupDocs = (app) => {
  // Serve swagger documentation at /docs
  app.use('/docs', swaggerUi.serve)
  app.get('/docs', swaggerUi.setup(swaggerDocument, swaggerUiOptions))

  // Serve raw swagger JSON at /docs/json
  app.get('/docs/json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerDocument)
  })

  // API documentation info endpoint
  app.get('/docs/info', (req, res) => {
    res.json({
      success: true,
      message: 'API Documentation available',
      endpoints: {
        interactive: '/docs',
        json: '/docs/json',
        yaml: '/docs/yaml'
      },
      info: {
        title: swaggerDocument.info.title,
        version: swaggerDocument.info.version,
        description: swaggerDocument.info.description
      }
    })
  })
}

module.exports = { setupDocs }