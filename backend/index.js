const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const {connectDB} = require('./models/db')
const authRouter = require('./routes/authRouter')
const productRouter = require('./routes/productroute')
const port = process.env.PORT || 8080
connectDB()
if (!process.env.JWT_SECRET) {
  console.error('✗ ERROR: JWT_SECRET is not set in environment variables. Authentication will fail!')
  console.error('Please set JWT_SECRET in your .env file')
} else {
  console.log('✓ JWT_SECRET is configured')
}


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

app.get('/', (req, res) => {
  res.json({
    message: 'API is running...',
    status: 'ok',
    endpoints: {
      auth: '/auth',
      products: '/products'
    }
  })
})

app.use('/auth', authRouter)
app.use('/products', productRouter)

app.use((err, req, res, next) => {
  console.error('Error:', err.stack)
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    success: false
  })
})
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`)
  })
module.exports = app