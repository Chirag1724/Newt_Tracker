'use client';

import { useState, useEffect } from 'react';

/**
 * Reusable Search Component with debouncing
 * @param {string} placeholder - Placeholder text for search input
 * @param {function} onSearch - Callback function when search query changes (debounced)
 * @param {number} debounceMs - Debounce delay in milliseconds (default: 300)
 * @param {string} initialValue - Initial search value
 */
export default function SearchBar({
    placeholder = "Search...",
    onSearch,
    debounceMs = 300,
    initialValue = ""
}) {
    const [searchTerm, setSearchTerm] = useState(initialValue);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchTerm);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [searchTerm, debounceMs, onSearch]);

    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <div className="relative">
            {/* Search Icon */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {/* Search Input */}
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-200 bg-white text-dark placeholder-gray-400 focus:border-primary/30 focus:ring-4 focus:ring-primary/10 outline-none transition-smooth font-medium"
            />

            {/* Clear Button */}
            {searchTerm && (
                <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-smooth"
                    aria-label="Clear search"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
