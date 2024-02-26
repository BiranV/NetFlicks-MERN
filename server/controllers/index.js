const Movie = require('../models/index');

// Function to handle error response
const handleErrorResponse = (res, error) => {
    res.status(500).json({ message: error.message });
};

// Get all movies
const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find({}).sort({ updatedAt: -1 });
        res.status(200).json(movies);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Get movie by ID
const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findById(id);
        res.status(200).json(movie);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Create a new movie
const createMovie = async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json({ message: 'Movie added successfully', movie });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Update an existing movie
const updateMovie = async (req, res) => {
    try {
        req.body.created = Date.now();
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json({ message: 'Movie updated successfully' });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Delete a movie
const deleteMovie = async (req, res) => {
    try {
        const result = await Movie.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
};
