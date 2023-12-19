const express = require("express")
const Movie = require("../models/index")
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find({}).sort({ created: -1 });
        res.status(200).json(movies)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const movie = await Movie.findById(id)
        res.status(200).json(movie)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const movie = await Movie.create(req.body)
        res.status(201).json({ message: 'Movie added successfully', movie })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.put('/:id', async (req, res) => {
    try {
        req.body.created = Date.now();
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updatedMovie) {
            return res.status(404).json({ message: "Movie not found" })
        }
        res.status(200).json({ message: "Movie updated successfully" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const result = await Movie.findByIdAndDelete(req.params.id)

        if (!result) {
            return res.status(404).json({ message: "Movie not found" })
        }
        res.status(200).json({ message: "Movie deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router;