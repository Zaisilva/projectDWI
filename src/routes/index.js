const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Node.js Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/api/users'
    }
  });
});

module.exports = router;