const express = require('express')
const router = express.Router()

// Mock data
const users = [
  { id: 1, name: 'Zaira', email: 'zai@example.com' },
  { id: 2, name: 'Daniel', email: 'dani@example.com' }
]

// GET all users
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: users,
    count: users.length
  })
})

// GET user by ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id))
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }
  res.json({
    success: true,
    data: user
  })
})

// POST new user
router.post('/', (req, res) => {
  const { name, email } = req.body

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Name and email are required'
    })
  }

  const newUser = {
    id: users.length + 1,
    name,
    email
  }

  users.push(newUser)

  res.status(201).json({
    success: true,
    data: newUser,
    message: 'User created successfully'
  })
})

module.exports = router
