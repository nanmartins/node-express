const express = require('express')
const router = express.Router()
const Recommendation = require('../models/recommendation')


router.get('/recommendations', async (req, res) => {
  try {
    const recommendations = await Recommendation.find()
    res.status(200).send({
      recommendations
    })
  }
  catch (error) {
    res.status(500).send({ message: 'Internal Server Error' })
  }
})


router.post('/recommendations', async (req, res) => {
  try {
    const { recommendedBy, recommendedAlbum, message } = req.body
    const newRecommendation = new Recommendation({ recommendedBy, recommendedAlbum, message })
    await newRecommendation.save()
    res.status(201).send({ message: 'Recommendation added successfully', recommendation: newRecommendation })
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' })
  }
})


module.exports = router
