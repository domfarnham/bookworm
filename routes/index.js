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
    req.body.favoriteBook &&
    req.body.password &&
    req.body.confirmPassword) {
    if (req.body.password !== req.body.confirmPassword) {
      const err = new Error('Passwords do not match.')
      err.status = 400
      return next(err)
    }

    const userData = {
      email: req.body.email,
      name: req.body.name,
      favoriteBook: req.body.favoriteBook,
      password: req.body.password
    }

    User.create(userData, (err, user) => {
      if (err) {
        return next(err)
      } else {
        req.session.userId = user._id
        return res.redirect('/profile')
      }
    })
  } else {
    const err = new Error('All fields required.')
    err.status = 400
    next(err)
  }
})

router.get('/login', (req, res, next) => {
  return res.render('login', { title: 'Log In' })
})

router.post('/login', (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, (err, user) => {
      if (err || !user) {
        const err = new Error('Wrong email or password.')
        err.status = 401
        return next(err)
      } else {
        req.session.userId = user._id
        return res.redirect('/profile')
      }
    })
  } else {
    const err = new Error('Email and password are required.')
    err.status = 400
    return next(err)
  }
})

router.get('/profile', (req, res, next) => {
  res.send('Welcome to your profile')
})

module.exports = router
