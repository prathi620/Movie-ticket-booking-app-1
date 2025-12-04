const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    duration: {
        type: Number, // in minutes
        required: true,
    },
    poster: {
        type: String, // URL
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    externalId: {
        type: String,
        unique: true,
        sparse: true, // Allow null/undefined but enforce uniqueness when present
    },
    rating: {
        type: Number,
    },
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
