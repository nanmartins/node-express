const mongoose = require('mongoose')

const recommendationSchema = new mongoose.Schema({
  recommendedBy: String,
  recommendedAlbum: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Recommendation', recommendationSchema)
