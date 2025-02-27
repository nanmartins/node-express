const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
mongoose.connect(process.env.MONGODB_URI)

const vinylRoutes = require('./routes/vinylRoutes.js')
const recommendationRoutes = require('./routes/recommendationRoutes.js')

app.use(vinylRoutes)
app.use(recommendationRoutes)


// need update vinyl schema with more infos, like genre, tracks, etc. (done)
// create a new schema to receive recomendations
// also work on filters
// test



app.listen(
  PORT,
  () => console.log(`Server is running on http://localhost:${PORT}`)
)
