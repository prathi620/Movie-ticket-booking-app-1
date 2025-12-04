const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Showtime = require('./models/Showtime');
require('dotenv').config();

const checkMovieShowtimeLink = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB\n');

        // Get all movies
        const movies = await Movie.find().limit(3);
        console.log('=== MOVIES IN DATABASE ===');
        movies.forEach(m => {
            console.log(`${m.title}: ${m._id}`);
        });

        // Get sample showtimes
        const showtimes = await Showtime.find().limit(5);
        console.log('\n=== SAMPLE SHOWTIMES ===');
        showtimes.forEach(s => {
            console.log(`Showtime ID: ${s._id}, Movie ID: ${s.movie}, Time: ${s.startTime}`);
        });

        // Check if Interstellar has showtimes
        const interstellar = await Movie.findOne({ title: 'Interstellar' });
        if (interstellar) {
            console.log(`\n=== INTERSTELLAR ===`);
            console.log(`Interstellar ID: ${interstellar._id}`);

            const interstellarShowtimes = await Showtime.find({ movie: interstellar._id });
            console.log(`Showtimes for Interstellar: ${interstellarShowtimes.length}`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
};

checkMovieShowtimeLink();
