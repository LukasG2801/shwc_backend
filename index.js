require('dotenv').config()

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const path = require('path')
const corsOptions = require('./config/cors')
const connectDB = require('./config/database')
const credentials = require('./middleware/credentials')
const errorHandlerMiddleware = require('./middleware/error_handler')
//Test comment
const app = express()

connectDB()

//Allow Credentials
app.use(credentials)

// CORS 
// app.use(cors(corsOptions))

// application.x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// application/json response
app.use(express.json())

// middleware for cookies
app.use(cookieParser())

// Default error handler
app.use(errorHandlerMiddleware)

// static files
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/game', require('./routes/api/game'))
app.use('/api/task', require('./routes/api/task'))

app.all('*', (req, res) => {
  res.status(404)

  if(req.accepts('json')) {
    res.json({'error': '404 Not Found'})
  }else {
    res.type('text').send('404 Not Found')
  }

})

app.get("/", function(req, res) {
  res.send("Hello World")
})

const PORT = process.env.PORT || 3000

mongoose.connection.once('open', () => {
  console.log('DB connected')
  app.listen(PORT, function() {
    console.log("Server is up and running")
  })
})