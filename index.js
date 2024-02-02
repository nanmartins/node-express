const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
mongoose.connect(process.env.MONGODB_URI)

const vinylSchema = new mongoose.Schema({
  artist: String,
  album: String,
  year: String,
  albumCover: String,
  albumDescription: String,
  createdAt: { type: Date, default: Date.now }
})


const Vinyl = mongoose.model('Vinyl', vinylSchema)



app.get('/vinyls', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 9
    const skip = (page - 1) * limit
    const totalVinyls = await Vinyl.countDocuments()

    let sortQuery = {}
    if (req.query.sort === 'latest') {
      sortQuery = { createdAt: -1 }
    }

    const totalPages = Math.ceil(totalVinyls / limit)
    const vinyls = await Vinyl.find().sort(sortQuery).skip(skip).limit(limit)

    res.status(200).send({
      vinyls,
      page,
      totalPages
    });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


app.post('/vinyls', async (req, res) => {
  const { artist, album, year, albumCover, albumDescription } = req.body

  if(!artist || !album || !year || !albumCover || !albumDescription) {
    return res.status(400).send({ message: 'Incomplete information provided for creating a vinyl.' })
  }
  try {
    const newVinyl = new Vinyl({
      artist,
      album,
      year,
      albumCover,
      albumDescription,
      createdAt: new Date()
    })

    await newVinyl.save()
    res.status(201).send({ message: 'Vinyl created successfully', vinyl: newVinyl })
  }
  catch (error) {
    res.status(500).send({ message: 'Internal Server Error' })
  }
})


app.put('/vinyls/:id', async (req, res) => {
  const { id } = req.params
  const { artist, album, year, albumCover, albumDescription } = req.body

  try {
    const vinyl = await Vinyl.findById(id)
    if (!vinyl) {
      return res.status(404).send({ message: 'Vinyl not found.' })
    }
    vinyl.artist = artist || vinyl.artist
    vinyl.album = album || vinyl.album
    vinyl.year = year || vinyl.year
    vinyl.albumCover = albumCover || vinyl.albumCover
    vinyl.albumDescription = albumDescription || vinyl.albumDescription

    await vinyl.save()
    res.status(200).send({ message: 'Vinyl updated successfully', vinyl })
  }
  catch (error) {
    res.status(500).send({ message: 'Internal Server Error' })
  }
})


app.delete('/vinyls/:id', async (req, res) => {
  const { id } = req.params
  try {
    const vinyl = await Vinyl.findByIdAndDelete(id)
    if (!vinyl) {
      return res.status(404).send({ message: 'Vinyl not found.' })
    }
    res.status(200).send({ message: 'Vinyl deleted successfully' })
  }
  catch (error) {
    res.status(500).send({ message: 'Internal Server Error' })
  }
})



// Filter Vinyl by ID
app.get('/vinyls/:id', async (req, res) => {
  const { id } = req.params
  try {
    const vinyl = await Vinyl.findById(id)
    if (!vinyl) {
      return res.status(404).send({ message: 'Vinyl not found.' })
    }
    res.status(200).send({
      vinyl
    })
  }
  catch (error) {
    res.status(500).send({ message: 'Internal Server Error' })
  }
})


// Filter by Artist
app.get('/vinyls/artists/:artist', async (req, res) => {
  const { artist } = req.params
  try {
    const vinyls = await Vinyl.find({ artist })
    res.status(200).send({
      vinyls
    })
  }
  catch (error) {
    res.status(500).send({ message: 'Internal Server Error' })
  }
})



app.listen(
  PORT,
  () => console.log(`Server is running on http://localhost:${PORT}`)
)
