'use client';

import { useState, useEffect } from 'react';

export default function MeetingDetailModal({ meeting, onClose }) {
    if (!meeting) return null;

    const isOneOnOne = meeting.meeting_type === 'one-on-one';

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scale-up">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-smooth z-10"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-8">
                    {/* Header */}
                    <div className="mb-8 pr-12">
                        <div className="flex items-center space-x-3 mb-3">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${isOneOnOne ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                                }`}>
                                {isOneOnOne ? 'One-on-One Meeting' : 'Group Meeting'}
                            </span>
                            {isOneOnOne && meeting.category && (
                                <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                                    {meeting.category}
                                </span>
                            )}
                        </div>
                        <h2 className="text-4xl font-extrabold text-dark leading-tight">
                            {isOneOnOne ? meeting.person_name : meeting.village_name}
                        </h2>
                        <p className="text-gray-500 font-medium mt-2 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(meeting.created_at)}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column: Details */}
                        <div className="space-y-8">
                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Meeting Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {isOneOnOne ? (
                                        <>
                                            <div className="p-4 bg-gray-50 rounded-2xl">
                                                <p className="text-xs text-gray-500 mb-1">Contact Number</p>
                                                <p className="font-bold text-dark">{meeting.contact_number || 'N/A'}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-2xl">
                                                <p className="text-xs text-gray-500 mb-1">Business Potential</p>
                                                <p className="font-bold text-primary">₹{parseFloat(meeting.business_potential || 0).toLocaleString('en-IN')}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-4 bg-gray-50 rounded-2xl">
                                                <p className="text-xs text-gray-500 mb-1">Attendee Count</p>
                                                <p className="font-bold text-dark">{meeting.attendee_count}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-2xl">
                                                <p className="text-xs text-gray-500 mb-1">Meeting Topic</p>
                                                <p className="font-bold text-dark">{meeting.meeting_topic || 'N/A'}</p>
                                            </div>
                                        </>
                                    )}
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-xs text-gray-500 mb-1">Distributor</p>
                                        <p className="font-bold text-dark">{meeting.user_name}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-xs text-gray-500 mb-1">Route State</p>
                                        <p className="font-bold text-dark">{meeting.state}</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Location</h3>
                                <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl">
                                    <div className="flex items-start">
                                        <div className="p-2 bg-white rounded-xl shadow-sm mr-4">
                                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-dark mb-1">{meeting.location_address}</p>
                                            <div className="flex space-x-4 text-xs text-gray-500 font-mono">
                                                <span>Lat: {parseFloat(meeting.latitude).toFixed(6)}</span>
                                                <span>Lng: {parseFloat(meeting.longitude).toFixed(6)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {meeting.notes && (
                                <section>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Notes</h3>
                                    <div className="p-6 bg-gray-50 rounded-2xl italic text-gray-700 leading-relaxed border-l-4 border-gray-200">
                                        "{meeting.notes}"
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Right Column: Photos */}
                        <div className="space-y-8">
                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                    Evidence Photos ({meeting.photos?.length || 0})
                                </h3>
                                {meeting.photos && meeting.photos.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                                            <img
                                                src={meeting.photos[0]}
                                                alt="Meeting Primary"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {meeting.photos.length > 1 && (
                                            <div className="grid grid-cols-2 gap-4">
                                                {meeting.photos.slice(1).map((photo, index) => (
                                                    <div key={index} className="aspect-square rounded-xl overflow-hidden shadow-md">
                                                        <img
                                                            src={photo}
                                                            alt={`Meeting ${index + 2}`}
                                                            className="w-full h-full object-cover hover:scale-110 transition-smooth"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-gray-500 font-medium text-center">No photos uploaded for this meeting.</p>
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="btn-soft px-8 py-3 rounded-xl font-bold"
                    >
                        Close Details
                    </button>
                    <a
                        href={`https://www.google.com/maps?q=${meeting.latitude},${meeting.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary ml-4 px-8 py-3 rounded-xl font-bold flex items-center"
                    >
                        View on Google Maps
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
