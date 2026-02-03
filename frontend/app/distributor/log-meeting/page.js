'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import MapPicker from '@/components/MapPicker';
import PhotoUpload from '@/components/PhotoUpload';
import DashboardLayout from '@/components/DashboardLayout';

export default function LogMeetingPage() {
    const router = useRouter();
    const [meetingType, setMeetingType] = useState('one-on-one');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        // One-on-one fields
        person_name: '',
        category: 'Farmer',
        contact_number: '',
        business_potential: '',

        // Group fields
        village_name: '',
        attendee_count: '',
        meeting_topic: '',

        // Common fields
        latitude: null,
        longitude: null,
        location_address: '',
        photos: [],
        notes: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLocationSelect = (locationData) => {
        setFormData(prev => ({
            ...prev,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            location_address: locationData.address
        }));
    };

    const handlePhotosChange = (photos) => {
        setFormData(prev => ({ ...prev, photos }));
    };

    const validate = () => {
        if (meetingType === 'one-on-one') {
            if (!formData.person_name) return 'Person name is required';
            if (!formData.contact_number) return 'Contact number is required';
        } else {
            if (!formData.village_name) return 'Village name is required';
            if (!formData.attendee_count || formData.attendee_count < 1) return 'Valid attendee count is required';
        }

        if (!formData.latitude || !formData.longitude) {
            return 'Please select a location on the map';
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const payload = {
                meeting_type: meetingType,
                ...formData
            };

            // Remove fields based on meeting type
            if (meetingType === 'one-on-one') {
                delete payload.village_name;
                delete payload.attendee_count;
                delete payload.meeting_topic;
            } else {
                delete payload.person_name;
                delete payload.category;
                delete payload.contact_number;
                delete payload.business_potential;
            }

            await api.post('/meetings', payload);

            setSuccess(true);
            setTimeout(() => {
                router.push('/distributor/meetings');
            }, 1500);
        } catch (err) {
            console.error('Submit error:', err);
            setError(err.response?.data?.message || 'Failed to log meeting');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="distributor">
            <div className="min-h-screen bg-background py-12">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => router.back()}
                            className="text-primary font-semibold mb-4 flex items-center space-x-2 hover:text-primary/80 transition-smooth"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Back</span>
                        </button>
                        <h1 className="text-4xl font-bold text-dark mb-2">Log New Meeting</h1>
                        <p className="text-gray-600">Record your field meeting details</p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center space-x-3">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="font-semibold text-green-800">Meeting logged successfully!</p>
                                <p className="text-sm text-green-600">Redirecting to meetings list...</p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="card-premium space-y-6">
                        {/* Meeting Type Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-dark mb-3">
                                Meeting Type <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setMeetingType('one-on-one')}
                                    className={`p-4 rounded-xl border-2 font-semibold transition-smooth ${meetingType === 'one-on-one'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    One-on-One Meeting
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMeetingType('group')}
                                    className={`p-4 rounded-xl border-2 font-semibold transition-smooth ${meetingType === 'group'
                                        ? 'border-secondary bg-secondary/10 text-secondary'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    Group Meeting
                                </button>
                            </div>
                        </div>

                        {/* Conditional Fields */}
                        {meetingType === 'one-on-one' ? (
                            <>
                                {/* Person Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Person Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="person_name"
                                        value={formData.person_name}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="Enter person's name"
                                        required={meetingType === 'one-on-one'}
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    >
                                        <option value="Farmer">Farmer</option>
                                        <option value="Seller">Seller</option>
                                        <option value="Influencer">Influencer</option>
                                    </select>
                                </div>

                                {/* Contact Number */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Contact Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="contact_number"
                                        value={formData.contact_number}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="+91 98765 43210"
                                        required={meetingType === 'one-on-one'}
                                    />
                                </div>

                                {/* Business Potential */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Business Potential (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="business_potential"
                                        value={formData.business_potential}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="50000"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Village Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Village Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="village_name"
                                        value={formData.village_name}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="Enter village name"
                                        required={meetingType === 'group'}
                                    />
                                </div>

                                {/* Attendee Count */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Number of Attendees <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="attendee_count"
                                        value={formData.attendee_count}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="25"
                                        min="1"
                                        required={meetingType === 'group'}
                                    />
                                </div>

                                {/* Meeting Topic */}
                                <div>
                                    <label className="block text-sm font-semibold text-dark mb-2">
                                        Meeting Topic
                                    </label>
                                    <input
                                        type="text"
                                        name="meeting_topic"
                                        value={formData.meeting_topic}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="e.g., Crop protection techniques"
                                    />
                                </div>
                            </>
                        )}

                        {/* Location Picker */}
                        <MapPicker onLocationSelect={handleLocationSelect} />

                        {/* Photo Upload */}
                        <PhotoUpload onPhotosChange={handlePhotosChange} maxPhotos={5} />

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-semibold text-dark mb-2">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                className="input-field"
                                rows="4"
                                placeholder="Add any additional notes about the meeting..."
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="btn-outline flex-1"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary flex-1"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center space-x-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Logging Meeting...</span>
                                    </span>
                                ) : (
                                    'Log Meeting'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
