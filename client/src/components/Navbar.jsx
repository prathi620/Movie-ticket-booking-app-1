import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setMobileMenuOpen(false);
        navigate('/login');
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-xl md:text-2xl font-bold text-red-500 hover:text-red-400 transition-colors"
                        onClick={closeMobileMenu}
                    >
                        MovieBook
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="hover:text-red-400 transition-colors">Home</Link>
                        {user ? (
                            <>
                                <Link to="/my-bookings" className="hover:text-red-400 transition-colors">My Bookings</Link>
                                <Link to="/profile" className="hover:text-red-400 transition-colors">Profile</Link>
                                {user.role === 'admin' && (
                                    <>
                                        <Link to="/admin" className="hover:text-red-400 transition-colors">Admin</Link>
                                        <Link to="/analytics" className="hover:text-red-400 transition-colors">Analytics</Link>
                                    </>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="hover:text-red-400 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            // Close Icon
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            // Hamburger Icon
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-800">
                        <div className="py-4 space-y-3">
                            <Link
                                to="/"
                                className="block px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                                onClick={closeMobileMenu}
                            >
                                Home
                            </Link>
                            {user ? (
                                <>
                                    <Link
                                        to="/my-bookings"
                                        className="block px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                                        onClick={closeMobileMenu}
                                    >
                                        My Bookings
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                                        onClick={closeMobileMenu}
                                    >
                                        Profile
                                    </Link>
                                    {user.role === 'admin' && (
                                        <>
                                            <Link
                                                to="/admin"
                                                className="block px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                                                onClick={closeMobileMenu}
                                            >
                                                Admin
                                            </Link>
                                            <Link
                                                to="/analytics"
                                                className="block px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                                                onClick={closeMobileMenu}
                                            >
                                                Analytics
                                            </Link>
                                        </>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
                                        onClick={closeMobileMenu}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                        onClick={closeMobileMenu}
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
