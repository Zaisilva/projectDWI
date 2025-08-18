const request = require('supertest')
const app = require('../src/app')

describe('API Documentation', () => {
  afterAll(async () => {
    if (app.closeServer) {
      await app.closeServer()
    }
  })

  test('GET /docs should return documentation page', async () => {
    const response = await request(app)
    .get('/docs/')

    expect(response.status).toBe(200)
    expect(response.text).toContain('swagger-ui')
  })

  test('GET /docs/json should return swagger JSON', async () => {
    const response = await request(app)
      .get('/docs/json')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('openapi')
    expect(response.body).toHaveProperty('info')
    expect(response.body).toHaveProperty('paths')
  })

  test('GET /docs/info should return documentation info', async () => {
    const response = await request(app)
      .get('/docs/info')

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body).toHaveProperty('endpoints')
    expect(response.body).toHaveProperty('info')
  })

  test('Health endpoint should include documentation links', async () => {
    const response = await request(app)
      .get('/health')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('documentation')
    expect(response.body.documentation).toHaveProperty('interactive')
    expect(response.body.documentation).toHaveProperty('json')
  })
})