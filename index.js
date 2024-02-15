const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
mongoose.connect(process.env.MONGODB_URI)

const vinylRoutes = require('./routes/vinylRoutes')
const recommendationRoutes = require('./routes/recommendationRoutes')

app.use('/vinyls', vinylRoutes)
app.use('/recommendations', recommendationRoutes)


// need update vinyl schema with more infos, like genre, tracks, etc. (done)
// create a new schema to receive recomendations
// also work on filters



app.listen(
  PORT,
  () => console.log(`Server is running on http://localhost:${PORT}`)
)
