const Movie = require('../models/Movie');

// TMDB API Configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY || '8265bd1679663a7ea12ac168da84d2e8';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// 15 Popular Hollywood Movies
const hollywoodMovies = [
    {
        title: 'Interstellar',
        description: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
        genre: 'Sci-Fi',
        duration: 169,
        poster: '/assets/interstellar.png',
        releaseDate: new Date('2014-11-07'),
        externalId: 'hollywood_016'
    },
    {
        title: 'Deadpool & Wolverine',
        description: 'Ryan Reynolds and Hugh Jackman team up in this R-rated MCU adventure.',
        genre: 'Action',
        duration: 128,
        poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
        releaseDate: new Date('2024-07-26'),
        externalId: 'hollywood_001'
    },
    {
        title: 'Wicked',
        description: 'Cynthia Erivo and Ariana Grande star in the highly anticipated Broadway musical adaptation.',
        genre: 'Drama',
        duration: 160,
        poster: 'https://image.tmdb.org/t/p/w500/c5Tqxeo1UpBvnAc3csUm7j3hlQl.jpg',
        releaseDate: new Date('2024-11-22'),
        externalId: 'hollywood_002'
    },
    {
        title: 'Gladiator II',
        description: 'Paul Mescal stars in Ridley Scott\'s epic sequel to the Oscar-winning original.',
        genre: 'Action',
        duration: 148,
        poster: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
        releaseDate: new Date('2024-11-22'),
        externalId: 'hollywood_003'
    },
    {
        title: 'Moana 2',
        description: 'Moana and Maui return for another ocean adventure in this Disney animated sequel.',
        genre: 'Animation',
        duration: 100,
        poster: 'https://image.tmdb.org/t/p/w500/yh64qw9mgXBvlaWDi7Q9tpUBAvH.jpg',
        releaseDate: new Date('2024-11-27'),
        externalId: 'hollywood_004'
    },
    {
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against those who destroyed his family.',
        genre: 'Sci-Fi',
        duration: 166,
        poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        releaseDate: new Date('2024-03-01'),
        externalId: 'hollywood_005'
    },
    {
        title: 'Inside Out 2',
        description: 'Riley enters her teenage years and new emotions arrive at headquarters.',
        genre: 'Animation',
        duration: 96,
        poster: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
        releaseDate: new Date('2024-06-14'),
        externalId: 'hollywood_006'
    },
    {
        title: 'Venom: The Last Dance',
        description: 'Tom Hardy returns as Venom in the final chapter of the trilogy.',
        genre: 'Action',
        duration: 109,
        poster: 'https://image.tmdb.org/t/p/w500/k42Owka8v91trK1qMYwCQCNwJKr.jpg',
        releaseDate: new Date('2024-10-25'),
        externalId: 'hollywood_007'
    },
    {
        title: 'A Quiet Place: Day One',
        description: 'Lupita Nyong\'o stars in this prequel exploring the first day of the alien invasion.',
        genre: 'Horror',
        duration: 99,
        poster: 'https://image.tmdb.org/t/p/w500/yrpPYKijwdMHyTGIOd1iK1h0Xno.jpg',
        releaseDate: new Date('2024-06-28'),
        externalId: 'hollywood_008'
    },
    {
        title: 'Beetlejuice Beetlejuice',
        description: 'Michael Keaton returns as the ghost with the most in Tim Burton\'s long-awaited sequel.',
        genre: 'Comedy',
        duration: 104,
        poster: 'https://image.tmdb.org/t/p/w500/kKgQzkUCnQmeTPkyIwHly2t6ZFI.jpg',
        releaseDate: new Date('2024-09-06'),
        externalId: 'hollywood_009'
    },
    {
        title: 'The Wild Robot',
        description: 'A robot stranded on an island must learn to adapt to its surroundings and build relationships.',
        genre: 'Animation',
        duration: 102,
        poster: 'https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg',
        releaseDate: new Date('2024-09-27'),
        externalId: 'hollywood_010'
    },
    {
        title: 'Joker: Folie à Deux',
        description: 'Joaquin Phoenix returns as Arthur Fleck alongside Lady Gaga in this musical psychological thriller.',
        genre: 'Thriller',
        duration: 138,
        poster: 'https://image.tmdb.org/t/p/w500/aciP8Km0waTLXEYf5ybFK5CSUxl.jpg',
        releaseDate: new Date('2024-10-04'),
        externalId: 'hollywood_011'
    },
    {
        title: 'Kingdom of the Planet of the Apes',
        description: 'Many years after Caesar\'s reign, a young ape goes on a journey that will define the future.',
        genre: 'Sci-Fi',
        duration: 145,
        poster: 'https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg',
        releaseDate: new Date('2024-05-10'),
        externalId: 'hollywood_012'
    },
    {
        title: 'Furiosa: A Mad Max Saga',
        description: 'Anya Taylor-Joy stars in this prequel to Mad Max: Fury Road, revealing the origin of Furiosa.',
        genre: 'Action',
        duration: 148,
        poster: 'https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg',
        releaseDate: new Date('2024-05-24'),
        externalId: 'hollywood_013'
    },
    {
        title: 'Godzilla x Kong: The New Empire',
        description: 'Two ancient titans clash in an epic battle as humans unravel their intertwined origins.',
        genre: 'Action',
        duration: 115,
        poster: 'https://image.tmdb.org/t/p/w500/tM26baWgQyYXefTZNy9F7H4yqJ7.jpg',
        releaseDate: new Date('2024-03-29'),
        externalId: 'hollywood_014'
    },
    {
        title: 'Kung Fu Panda 4',
        description: 'Po must train a new Dragon Warrior while facing a wicked sorceress who can shapeshift.',
        genre: 'Animation',
        duration: 94,
        poster: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
        releaseDate: new Date('2024-03-08'),
        externalId: 'hollywood_015'
    }
];

// Combine all movies (Only Hollywood)
const allMovies = [...hollywoodMovies];

// Fetch from external API (returns our curated list)
const fetchFromExternalAPI = async () => {
    console.log('[CINEMA API] Loading curated Hollywood movie collection...');
    await new Promise(resolve => setTimeout(resolve, 500));
    return allMovies;
};

// Initial sync - Import movies
const syncMovies = async () => {
    try {
        console.log('[CINEMA SYNC] Starting movie sync...');

        const movies = await fetchFromExternalAPI();
        let importedCount = 0;
        const syncedMovieIds = [];

        for (const movieData of movies) {
            // Use findOneAndUpdate with upsert to preserve _id if movie exists
            const movie = await Movie.findOneAndUpdate(
                { externalId: movieData.externalId },
                movieData,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            syncedMovieIds.push(movie._id);
            importedCount++;
            console.log(`[CINEMA SYNC] Synced: ${movieData.title}`);
        }

        // Remove movies that are no longer in the curated list (e.g. if we removed Tamil movies)
        // But keep movies imported via search (which start with 'tmdb_')
        await Movie.deleteMany({
            _id: { $nin: syncedMovieIds },
            externalId: { $not: /^tmdb_/ } // Don't delete manually imported TMDB movies
        });

        console.log(`[CINEMA SYNC] Sync complete. Synced: ${importedCount}`);
    } catch (error) {
        console.error('[CINEMA SYNC] Error syncing movies:', error);
    }
};

// Real-time sync scheduler
const startRealTimeSync = async () => {
    console.log('[CINEMA SYNC] Real-time sync scheduler started.');
    console.log('[CINEMA SYNC] Will check for updates every 30 minutes.');

    // Run sync immediately on start
    await syncMovies();

    // Auto-generate showtimes after sync
    await autoGenerateShowtimes();

    setInterval(async () => {
        console.log('[CINEMA SYNC] Running scheduled sync...');
        await syncMovies();
        await autoGenerateShowtimes();
    }, 1800000); // 30 minutes
};

// Auto-generate showtimes for all movies
const autoGenerateShowtimes = async () => {
    try {
        const Movie = require('../models/Movie');
        const Theater = require('../models/Theater');
        const Showtime = require('../models/Showtime');

        console.log('[SHOWTIME SYNC] Checking showtimes...');

        // Check if showtimes exist
        const showtimeCount = await Showtime.countDocuments();

        if (showtimeCount > 0) {
            console.log(`[SHOWTIME SYNC] ${showtimeCount} showtimes already exist. Skipping generation.`);
            return;
        }

        console.log('[SHOWTIME SYNC] No showtimes found. Generating...');

        // Get all movies and theaters
        const movies = await Movie.find();
        const theaters = await Theater.find();

        if (movies.length === 0) {
            console.log('[SHOWTIME SYNC] No movies found. Skipping showtime generation.');
            return;
        }

        // Create default theaters if none exist
        if (theaters.length === 0) {
            console.log('[SHOWTIME SYNC] Creating default theaters...');
            const defaultTheaters = [
                { name: 'PVR Cinemas', location: 'Chennai', screens: [{ name: 'Screen 1', capacity: 100 }, { name: 'Screen 2', capacity: 120 }] },
                { name: 'Sathyam Cinemas', location: 'Chennai', screens: [{ name: 'Sathyam', capacity: 200 }, { name: 'Seasons', capacity: 150 }] },
                { name: 'IMAX', location: 'Chennai', screens: [{ name: 'IMAX Screen', capacity: 250 }] }
            ];
            await Theater.insertMany(defaultTheaters);
        }

        const allTheaters = await Theater.find();
        const today = new Date();
        const showtimes = [];

        // Generate showtimes for the next 7 days
        for (let i = 0; i < 7; i++) {
            const baseDate = new Date(today);
            baseDate.setDate(today.getDate() + i);
            baseDate.setHours(0, 0, 0, 0);

            for (const movie of movies) {
                for (const theater of allTheaters) {
                    const screen = theater.screens[0];

                    // Generate seats
                    const seats = [];
                    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
                    const seatsPerRow = 10;

                    for (let r = 0; r < rows.length; r++) {
                        for (let s = 1; s <= seatsPerRow; s++) {
                            if (seats.length >= screen.capacity) break;
                            seats.push({
                                row: rows[r],
                                number: s,
                                isBooked: false,
                                price: 150
                            });
                        }
                    }

                    // 4 Shows per day: 10 AM, 2 PM, 6 PM, 10 PM
                    const showTimes = [10, 14, 18, 22];

                    for (const hour of showTimes) {
                        const showTimeDate = new Date(baseDate);
                        showTimeDate.setHours(hour, 0, 0, 0);

                        showtimes.push({
                            movie: movie._id,
                            theater: theater._id,
                            screen: screen.name,
                            startTime: showTimeDate,
                            seats: [...seats]
                        });
                    }
                }
            }
        }

        await Showtime.insertMany(showtimes);
        console.log(`[SHOWTIME SYNC] Successfully generated ${showtimes.length} showtimes for ${movies.length} movies.`);

    } catch (error) {
        console.error('[SHOWTIME SYNC] Error generating showtimes:', error);
    }
};

// Handle webhook updates
const handleCinemaWebhook = async (webhookData) => {
    console.log('[CINEMA WEBHOOK] Received update from cinema database');

    try {
        if (!webhookData) {
            throw new Error('No webhook data received');
        }

        const { action, movieData } = webhookData;

        switch (action) {
            case 'create':
                await Movie.create(movieData);
                console.log(`[CINEMA WEBHOOK] Created: ${movieData.title}`);
                break;

            case 'update':
                const movie = await Movie.findOne({ externalId: movieData.externalId });
                if (movie) {
                    await Movie.findByIdAndUpdate(movie._id, movieData);
                    console.log(`[CINEMA WEBHOOK] Updated: ${movieData.title}`);
                }
                break;

            case 'delete':
                await Movie.findOneAndDelete({ externalId: movieData.externalId });
                console.log(`[CINEMA WEBHOOK] Deleted: ${movieData.title}`);
                break;

            default:
                console.log(`[CINEMA WEBHOOK] Unknown action: ${action}`);
        }
    } catch (error) {
        console.error('[CINEMA WEBHOOK] Error processing webhook:', error);
    }
};

// Map TMDB genre IDs to genre names
const getGenreFromIds = (genreIds) => {
    const genreMap = {
        28: 'Action',
        12: 'Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        14: 'Fantasy',
        36: 'History',
        27: 'Horror',
        10402: 'Music',
        9648: 'Mystery',
        10749: 'Romance',
        878: 'Sci-Fi',
        10770: 'TV Movie',
        53: 'Thriller',
        10752: 'War',
        37: 'Western'
    };

    if (!genreIds || genreIds.length === 0) return 'Drama';
    return genreMap[genreIds[0]] || 'Drama';
};

// Search movies on TMDB
const searchMoviesOnTMDB = async (query) => {
    try {
        console.log(`[TMDB API] Searching for: ${query}`);
        const response = await fetch(
            `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
        );
        const data = await response.json();

        if (!data.results) return [];

        return data.results
            .filter(movie => movie.poster_path) // Only return movies with posters
            .slice(0, 10) // Limit to 10 results
            .map(movie => ({
                title: movie.title,
                description: movie.overview || 'No description available',
                genre: getGenreFromIds(movie.genre_ids),
                duration: 120, // Default duration
                poster: `${TMDB_IMAGE_BASE}${movie.poster_path}`,
                releaseDate: new Date(movie.release_date || Date.now()),
                externalId: `tmdb_${movie.id}`,
                tmdbId: movie.id,
                rating: movie.vote_average,
                year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A'
            }));
    } catch (error) {
        console.error('[TMDB API] Error searching movies:', error);
        return [];
    }
};

// Import a specific movie from TMDB by ID
const importMovieFromTMDB = async (tmdbId) => {
    try {
        console.log(`[TMDB API] Importing movie ID: ${tmdbId}`);

        // Check if already exists
        const existingMovie = await Movie.findOne({ externalId: `tmdb_${tmdbId}` });
        if (existingMovie) {
            return existingMovie;
        }

        // Fetch details
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const movie = await response.json();

        const newMovie = {
            title: movie.title,
            description: movie.overview || 'No description available',
            genre: movie.genres && movie.genres.length > 0 ? movie.genres[0].name : 'Drama',
            duration: movie.runtime || 120,
            poster: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster',
            releaseDate: new Date(movie.release_date || Date.now()),
            externalId: `tmdb_${movie.id}`,
            rating: movie.vote_average
        };

        const createdMovie = await Movie.create(newMovie);
        console.log(`[CINEMA SYNC] Imported from search: ${createdMovie.title}`);
        return createdMovie;

    } catch (error) {
        console.error('[TMDB API] Error importing movie:', error);
        throw error;
    }
};

module.exports = {
    syncMovies,
    startRealTimeSync,
    handleCinemaWebhook,
    searchMoviesOnTMDB,
    importMovieFromTMDB
};
