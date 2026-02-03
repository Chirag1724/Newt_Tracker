'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export default function MapPicker({ onLocationSelect, initialLocation }) {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(initialLocation || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initMap = async () => {
            try {
                const loader = new Loader({
                    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
                    version: 'weekly',
                    libraries: ['places', 'geometry']
                });

                await loader.load();

                const defaultCenter = initialLocation || { lat: 18.5204, lng: 73.8567 }; // Pune

                const mapInstance = new google.maps.Map(mapRef.current, {
                    center: defaultCenter,
                    zoom: 13,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false
                });

                const markerInstance = new google.maps.Marker({
                    map: mapInstance,
                    position: defaultCenter,
                    draggable: true,
                    animation: google.maps.Animation.DROP
                });

                // Click on map to set location
                mapInstance.addListener('click', (e) => {
                    const location = {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng()
                    };
                    markerInstance.setPosition(location);
                    reverseGeocode(location);
                });

                // Drag marker to set location
                markerInstance.addListener('dragend', (e) => {
                    const location = {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng()
                    };
                    reverseGeocode(location);
                });

                setMap(mapInstance);
                setMarker(markerInstance);
                setLoading(false);

                // If initial location provided, get address
                if (initialLocation) {
                    reverseGeocode(initialLocation);
                }
            } catch (err) {
                console.error('Error loading Google Maps:', err);
                setError('Failed to load map. Please check your API key.');
                setLoading(false);
            }
        };

        initMap();
    }, []);

    const reverseGeocode = async (location) => {
        try {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const address = results[0].formatted_address;
                    const locationData = {
                        latitude: location.lat,
                        longitude: location.lng,
                        address
                    };
                    setSelectedLocation(locationData);
                    if (onLocationSelect) {
                        onLocationSelect(locationData);
                    }
                }
            });
        } catch (err) {
            console.error('Geocoding error:', err);
        }
    };

    const getCurrentLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    map.setCenter(location);
                    marker.setPosition(location);
                    reverseGeocode(location);
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

            <div
                ref={mapRef}
                className="w-full h-80 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg"
            />

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
