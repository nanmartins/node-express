const express = require('express')
const router = express.Router()
const Vinyl = require('../models/vinyl')


router.get('/vinyls', async (req, res) => {
  try {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
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
      totalPages,
    })
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' })
  }
})


router.post('/vinyls', async (req, res) => {
  const { artist, album, year, albumCover, studio, albumLength, genre, label, producer, tracks, albumDescription } = req.body
  const { disc1, disc2 } = req.body.tracks

  if(!artist || !album || !year || !albumCover || !albumDescription || !studio || !albumLength || !genre || !label || !producer || !tracks) {
    return res.status(400).send({ message: 'Incomplete information provided for creating a vinyl.' })
  }
  try {
    const newVinyl = new Vinyl({
      artist,
      album,
      year,
      albumCover,
      studio,
      albumLength,
      genre,
      label,
      producer,
      tracks: {
        disc1: {
          sideA: disc1.sideA,
          sideB: disc1.sideB
        },
        disc2: {
          sideA: disc2.sideA,
          sideB: disc2.sideB
        }
      },
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


router.put('/vinyls/:id', async (req, res) => {
  const { id } = req.params
  const { artist, album, year, albumCover, studio, albumLength, genre, label, producer, tracks, albumDescription } = req.body

  try {
    const vinyl = await Vinyl.findById(id)
    if (!vinyl) {
      return res.status(404).send({ message: 'Vinyl not found.' })
    }
    vinyl.artist = artist || vinyl.artist
    vinyl.album = album || vinyl.album
    vinyl.year = year || vinyl.year
    vinyl.albumCover = albumCover || vinyl.albumCover
    vinyl.studio = studio || vinyl.studio
    vinyl.albumLength = albumLength || vinyl.albumLength
    vinyl.genre = genre || vinyl.genre
    vinyl.label = label || vinyl.label
    vinyl.producer = producer || vinyl.producer
    vinyl.tracks = tracks || vinyl.tracks
    vinyl.albumDescription = albumDescription || vinyl.albumDescription

    await vinyl.save()
    res.status(200).send({ message: 'Vinyl updated successfully', vinyl })
  }
  catch (error) {
    res.status(500).send({ message: 'Internal Server Error' })
  }
})


router.delete('/vinyls/:id', async (req, res) => {
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
router.get('/vinyls/:id', async (req, res) => {
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
router.get('/vinyls/artists/:artist', async (req, res) => {
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


// Filter by Genre
router.get('/vinyls/genres/:genre', async (req, res) => {
  const { genre } = req.params;
  try {
    // Transforma a string em uma lista de gêneros
    const genresList = genre.split(',').map(g => g.trim())
    // Constrói a expressão regular para cada gênero
    const regexArray = genresList.map(g => new RegExp(g, 'i'))
    // Procura vinis que contenham qualquer um dos gêneros na lista
    const vinyls = await Vinyl.find({ genre: { $in: regexArray } })
    res.status(200).send({ vinyls })
  }
  catch (error) {
    res.status(500).send({ message: 'Internal Server Error' })
  }
})


module.exports = router
