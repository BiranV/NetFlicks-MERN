const mongoose = require('mongoose')

const movieSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        genre: {
            type: String,
            required: true
        },
        rate: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        plot: {
            type: String,
            required: true,
        },
        created: {
            type: Date,
            default: Date.now,
        },
        email: {
            type: String,
            required: true,
        },
    },
    {
        timeStamps: true,
        versionKey: false
    }
)
const Movie = mongoose.model('Movie', movieSchema)
module.exports = Movie