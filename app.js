const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const app = express()

mongoose.connect('mongodb://localhost:27017/bookworm')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

app.use(session({
  secret: 'asdfhjsadfuenfo',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}))

app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId
  next()
})

// parse incoming requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// serve static files from /public
app.use(express.static(path.join(__dirname, '/public')))

// view engine setup
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '/views'))

// include routes
const routes = require('./routes/index')
app.use('/', routes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('File Not Found')
  err.status = 404
  next(err)
})

// error handler
// define as the last app.use callback
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

// listen on port 3000
app.listen(3000, () => {
  console.log('App is listening on port 3000')
})
