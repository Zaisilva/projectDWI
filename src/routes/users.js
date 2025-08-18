const express = require('express')
const { userValidation, queryValidation } = require('../middleware/validation')
const { sanitizeUserInput } = require('../middleware/sanitization')
const { strictLimiter } = require('../middleware/security')

const router = express.Router()

// Mock data
const users = [
  { id: 1, name: 'Zaira', email: 'zai@example.com', createdAt: new Date().toISOString() },
  { id: 2, name: 'Daniel', email: 'dani@example.com', createdAt: new Date().toISOString() }
]

// GET all users with pagination
router.get('/', queryValidation.pagination, (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const paginatedUsers = users.slice(startIndex, endIndex)

  res.json({
    success: true,
    data: paginatedUsers,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(users.length / limit),
      totalItems: users.length,
      itemsPerPage: limit,
      hasNext: endIndex < users.length,
      hasPrev: startIndex > 0
    }
  })
})

// GET user by ID
router.get('/:id', userValidation.getById, (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id))

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
      id: req.params.id
    })
  }

  res.json({
    success: true,
    data: user
  })
})

// POST new user (with strict rate limiting)
router.post('/',
  strictLimiter, // Apply strict rate limiting to user creation
  userValidation.create,
  sanitizeUserInput,
  (req, res) => {
    const { name, email } = req.body

    // Check if email already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
        field: 'email'
      })
    }

    const newUser = {
      id: users.length + 1,
      name,
      email: email.toLowerCase(),
      createdAt: new Date().toISOString()
    }

    users.push(newUser)

    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully'
    })
  }
)

module.exports = router
