'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet component with no SSR
const OSMMap = dynamic(() => import('./OSMMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-80 bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400">
            Map Loading...
        </div>
    )
});

export default function MapPicker({ onLocationSelect, initialLocation }) {
    const mapRef = useRef(null);
    const [selectedLocation, setSelectedLocation] = useState(initialLocation ? {
        latitude: initialLocation.lat,
        longitude: initialLocation.lng,
        address: initialLocation.address || ''
    } : null);

    // Convert initial format to Leaflet format {lat, lng}
    const [mapPosition, setMapPosition] = useState(initialLocation || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const reverseGeocode = async (lat, lng) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();

            if (data && data.display_name) {
                const locationData = {
                    latitude: lat,
                    longitude: lng,
                    address: data.display_name
                };
                setSelectedLocation(locationData);
                if (onLocationSelect) {
                    onLocationSelect(locationData);
                }
            }
        } catch (err) {
            console.error('Geocoding error:', err);
            // Fallback if network fails
            const locationData = {
                latitude: lat,
                longitude: lng,
                address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
            };
            setSelectedLocation(locationData);
            if (onLocationSelect) {
                onLocationSelect(locationData);
            }
        }
    };

    const handleMapClick = (pos) => {
        setMapPosition(pos);
        reverseGeocode(pos.lat, pos.lng);
    };

    const getCurrentLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setMapPosition(pos);
                    reverseGeocode(pos.lat, pos.lng);
                    setLoading(false);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setError('Unable to get your location. Please select manually.');
                    setLoading(false);
                }
            );
        } else {
            setError('Geolocation is not supported by your browser.');
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-dark">
                    Select Location <span className="text-red-500">*</span>
                </label>
                <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={loading}
                    className="text-sm text-primary font-semibold hover:text-primary/80 transition-smooth flex items-center space-x-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{loading ? 'Getting location...' : 'Use Current Location'}</span>
                </button>
            </div>

            <div className="w-full h-80 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg relative z-0">
                <OSMMap
                    initialLocation={mapPosition}
                    onLocationSelect={handleMapClick}
                    mapRef={mapRef}
                />
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                </div>
            )}

            {selectedLocation && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                    <p className="text-sm font-semibold text-dark mb-2">Selected Address:</p>
                    <p className="text-sm text-gray-600">{selectedLocation.address}</p>
                    <div className="mt-2 flex space-x-4 text-xs text-gray-500">
                        <span>Lat: {selectedLocation.latitude.toFixed(6)}</span>
                        <span>Lng: {selectedLocation.longitude.toFixed(6)}</span>
                    </div>
                </div>
            )}

            <p className="text-xs text-gray-500">
                💡 Click on the map or drag the marker to select a location
            </p>
        </div>
    );
}
