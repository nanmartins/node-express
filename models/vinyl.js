const mongoose = require('mongoose')

const vinylSchema = new mongoose.Schema({
  artist: String,
  album: String,
  year: String,
  albumCover: String,
  studio: String,
  albumLength: String,
  genre: [String],
  label: String,
  producer: String,
  tracks: {
    disc1: {
      sideA: [],
      sideB: []
    },
    disc2: {
      sideA: [],
      sideB: []
    }
  },
  albumDescription: String,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Vinyl', vinylSchema)
