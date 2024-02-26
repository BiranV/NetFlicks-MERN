// routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const moviesControllers = require('../controllers/index');

// Route to get all movies
router.get('/', moviesControllers.getAllMovies);

// Route to get a specific movie by ID
router.get('/:id', moviesControllers.getMovieById);

// Route to create a new movie
router.post('/', moviesControllers.createMovie);

// Route to update a movie by ID
router.put('/:id', moviesControllers.updateMovie);

// Route to delete a movie by ID
router.delete('/:id', moviesControllers.deleteMovie);

module.exports = router;
