require('dotenv').config()

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const path = require('path')
const corsOptions = require('./config/cors')
const connectDB = require('./config/database')

//Test comment
const app = express()

connectDB()

// CORS 
// app.use(cors(corsOptions))
app.use(cors())

// application.x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// application/json response
app.use(express.json())

// middleware for cookies
app.use(cookieParser())

// static files
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/game', require('./routes/api/game'))
app.use('/api/task', require('./routes/api/task'))
app.use('/api/team', require('./routes/api/team'))

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