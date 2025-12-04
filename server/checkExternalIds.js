const mongoose = require('mongoose');
const Movie = require('./models/Movie');
require('dotenv').config();

const checkExternalIds = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB\n');

        const movies = await Movie.find().limit(5);
        console.log('=== CHECKING EXTERNAL IDS ===');
        movies.forEach(m => {
            console.log(`Title: ${m.title}`);
            console.log(`  _id: ${m._id}`);
            console.log(`  externalId: ${m.externalId || 'NOT SET'}`);
            console.log('');
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.connection.close();
    }
};

checkExternalIds();
