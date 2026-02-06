'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

function LocationMarker({ position, setPosition, onLocationSelect }) {
    const map = useMapEvents({
        click(e) {
            const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
            setPosition(newPos);
            onLocationSelect(newPos);
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position} draggable={true} eventHandlers={{
            dragend: (e) => {
                const marker = e.target;
                const newPos = marker.getLatLng();
                const pos = { lat: newPos.lat, lng: newPos.lng };
                setPosition(pos);
                onLocationSelect(pos);
            }
        }} />
    );
}

const OSMMap = ({ initialLocation, onLocationSelect, mapRef }) => {
    // Default to India center if no location
    const defaultCenter = initialLocation || { lat: 20.5937, lng: 78.9629 };

    return (
        <MapContainer
            center={defaultCenter}
            zoom={initialLocation ? 15 : 5}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker
                position={initialLocation}
                setPosition={(pos) => { }} // State managed by parent or internal marker logic 
                onLocationSelect={onLocationSelect}
            />
        </MapContainer>
    );
};

export default OSMMap;
