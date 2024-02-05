// routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const moviesControllers = require('../controllers/index');

router.get('/', moviesControllers.getAllMovies);
router.get('/:id', moviesControllers.getMovieById);
router.post('/', moviesControllers.createMovie);
router.put('/:id', moviesControllers.updateMovie);
router.delete('/:id', moviesControllers.deleteMovie);

module.exports = router;
