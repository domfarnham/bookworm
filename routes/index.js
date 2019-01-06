const express = require('express')
const router = express.Router()
const User = require('../models/user')

// GET /
router.get('/', (req, res, next) => {
  return res.render('index', { title: 'Home' })
})

// GET /about
router.get('/about', (req, res, next) => {
  return res.render('about', { title: 'About' })
})

// GET /contact
router.get('/contact', (req, res, next) => {
  return res.render('contact', { title: 'Contact' })
})

router.get('/register', (req, res, next) => {
  return res.render('register', { title: 'Sign UP' })
})

router.post('/register', (req, res, next) => {
  if (req.body.email &&
    req.body.name &&
    req.body.fovoriteBook &&
    req.body.password &&
    req.body.confirmPassword) {
    if (req.body.password !== req.body.confirmPassword) {
      const err = new Error('Passwords do not match.')
      err.status = 400
      next(err)
    }
  } else {
    const err = new Error('All fields required.')
    err.status = 400
    next(err)
  }
})

module.exports = router
