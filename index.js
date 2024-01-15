const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
// const username = encodeURIComponent(process.env.USER_NAME)
// const password = encodeURIComponent(process.env.USER_PASSWORD)
const PORT = 8080

app.use(express.json())
app.use(cors())

// mongoose.connect('mongodb://localhost:27017/vinylsDB')
// mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.slzg83z.mongodb.net/?retryWrites=true&w=majority`)
mongoose.connect(process.env.MONGODB_URI)

const vinylSchema = new mongoose.Schema({
  artist: String,
  album: String,
  year: Number
})

const Vinyl = mongoose.model('Vinyl', vinylSchema)


app.get('/vinyls', async (req, res) => {
  try {
    const vinyls = await Vinyl.find()
    res.status(200).send({
      vinyls
    })
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' })
  }
})


app.post('/vinyls', async (req, res) => {
  const { artist, album, year } = req.body

  if(!artist || !album || !year) {
    return res.status(400).send({ message: 'Incomplete information provided for creating a vinyl.' })
  }

  try {
    const newVinyl = new Vinyl({
      artist,
      album,
      year
    })

    await newVinyl.save()

    res.status(201).send({ message: 'Vinyl created successfully', vinyl: newVinyl })
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' })
  }
})


app.put('/vinyls/:id', async (req, res) => {
  const { id } = req.params
  const { artist, album, year } = req.body

  try {
    const vinyl = await Vinyl.findById(id)

    if (!vinyl) {
      return res.status(404).send({ message: 'Vinyl not found.' })
    }

    vinyl.artist = artist || vinyl.artist
    vinyl.album = album || vinyl.album
    vinyl.year = year || vinyl.year

    await vinyl.save()

    res.status(200).send({ message: 'Vinyl updated successfully', vinyl })
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' })
  }
})

app.listen(
  PORT,
  () => console.log(`Server is running on http://localhost:${PORT}`)
)
