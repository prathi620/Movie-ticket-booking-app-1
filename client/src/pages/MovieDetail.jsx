import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API_URL from '../config/api';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const movieRes = await fetch(`${API_URL}/api/movies/${id}`);
                const movieData = await movieRes.json();
                setMovie(movieData);

                const showtimeRes = await fetch(`${API_URL}/api/theaters/showtimes/${id}`);
                const showtimeData = await showtimeRes.json();
                setShowtimes(showtimeData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchMovieData();
    }, [id]);

    if (!movie) return <div className="text-center mt-8">Loading...</div>;

    // Group showtimes by date
    const groupedByDate = showtimes.reduce((acc, showtime) => {
        const date = new Date(showtime.startTime).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(showtime);
        return acc;
    }, {});

    // Group showtimes by theater
    const groupedByTheater = showtimes.reduce((acc, showtime) => {
        const theaterName = showtime.theater.name;
        if (!acc[theaterName]) acc[theaterName] = [];
        acc[theaterName].push(showtime);
        return acc;
    }, {});

    // Filter showtimes by selected date
    const filteredShowtimes = selectedDate
        ? showtimes.filter(showtime => {
            const showtimeDate = new Date(showtime.startTime).toLocaleDateString();
            const filterDate = new Date(selectedDate).toLocaleDateString();
            return showtimeDate === filterDate;
        })
        : showtimes;

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                <img src={movie.poster} alt={movie.title} className="w-full md:w-1/3 rounded-lg shadow-md object-cover max-h-[400px] md:max-h-[500px] object-top" />
                <div className="w-full md:w-2/3">
                    <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">{movie.title}</h1>
                    <p className="text-sm md:text-base text-gray-600 mb-2"><strong>Genre:</strong> {movie.genre}</p>
                    <p className="text-sm md:text-base text-gray-600 mb-2"><strong>Duration:</strong> {movie.duration} min</p>
                    <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4"><strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
                    <p className="text-sm md:text-base text-gray-800 mb-4 md:mb-6 line-clamp-3 md:line-clamp-none">{movie.description}</p>

                    <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Available Showtimes</h2>

                    {/* View Mode Toggle */}
                    <div className="flex gap-2 md:gap-4 mb-4">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex-1 md:flex-none px-4 md:px-6 py-3 rounded-lg transition text-sm md:text-base font-medium ${viewMode === 'list'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            List View
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`flex-1 md:flex-none px-4 md:px-6 py-3 rounded-lg transition text-sm md:text-base font-medium ${viewMode === 'calendar'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Calendar View
                        </button>
                    </div>

                    {/* Date Filter for Calendar View */}
                    {viewMode === 'calendar' && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date</label>
                            <input
                                type="date"
                                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                            {selectedDate && (
                                <button
                                    onClick={() => setSelectedDate('')}
                                    className="ml-2 text-sm text-red-600 hover:underline"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    )}

                    {showtimes.length === 0 ? (
                        <p className="text-gray-500">No showtimes available for this movie.</p>
                    ) : (
                        <>
                            {/* List View */}
                            {viewMode === 'list' && (
                                <div className="space-y-4 md:space-y-6">
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-700">Grouped by Theater</h3>
                                    {Object.entries(groupedByTheater).map(([theaterName, theaterShowtimes]) => (
                                        <div key={theaterName} className="border rounded-lg p-3 md:p-4 bg-gray-50">
                                            <h4 className="font-bold text-base md:text-lg mb-3 text-gray-800">{theaterName}</h4>
                                            <div className="space-y-2">
                                                {theaterShowtimes.map(showtime => (
                                                    <div key={showtime._id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 bg-white rounded border hover:bg-gray-100 transition">
                                                        <div className="flex-1">
                                                            <p className="text-xs md:text-sm text-gray-600">{showtime.theater.location} - Screen {showtime.screen}</p>
                                                            <p className="text-blue-600 font-semibold text-sm md:text-base">
                                                                {new Date(showtime.startTime).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <Link
                                                            to={`/booking/${showtime._id}`}
                                                            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition text-center font-medium text-sm md:text-base min-h-[44px] flex items-center justify-center"
                                                        >
                                                            Select Seats
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Calendar View */}
                            {viewMode === 'calendar' && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-gray-700">
                                        {selectedDate ? `Showtimes for ${new Date(selectedDate).toLocaleDateString()}` : 'Grouped by Date'}
                                    </h3>
                                    {Object.entries(selectedDate ?
                                        filteredShowtimes.reduce((acc, showtime) => {
                                            const date = new Date(showtime.startTime).toLocaleDateString();
                                            if (!acc[date]) acc[date] = [];
                                            acc[date].push(showtime);
                                            return acc;
                                        }, {}) :
                                        groupedByDate
                                    ).map(([date, dateShowtimes]) => (
                                        <div key={date} className="border rounded-lg p-4 bg-gray-50">
                                            <h4 className="font-bold text-lg mb-3 text-gray-800">{date}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {dateShowtimes.map(showtime => (
                                                    <div key={showtime._id} className="p-3 bg-white rounded border hover:bg-gray-100 transition">
                                                        <div className="mb-2">
                                                            <p className="font-semibold text-gray-800">{showtime.theater.name}</p>
                                                            <p className="text-sm text-gray-600">{showtime.theater.location} - Screen {showtime.screen}</p>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-blue-600 font-semibold">
                                                                {new Date(showtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                            <Link
                                                                to={`/booking/${showtime._id}`}
                                                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                                            >
                                                                Book
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {filteredShowtimes.length === 0 && selectedDate && (
                                        <p className="text-gray-500 text-center">No showtimes available for the selected date.</p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;
