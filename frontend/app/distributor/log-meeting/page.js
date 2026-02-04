'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import MapPicker from '@/components/MapPicker';
import PhotoUpload from '@/components/PhotoUpload';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from '@/lib/toastUtils';
import { ButtonLoader } from '@/components/LoadingSkeletons';

export default function LogMeetingPage() {
    const router = useRouter();
    const [meetingType, setMeetingType] = useState('one-on-one');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        person_name: '',
        category: 'Farmer',
        contact_number: '',
        business_potential: '',
        village_name: '',
        attendee_count: '',
        meeting_topic: '',
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
        toast.success('Location captured successfully');
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

        const validationError = validate();
        if (validationError) {
            toast.error(validationError);
            return;
        }

        setLoading(true);

        try {
            const payload = {
                meeting_type: meetingType,
                ...formData
            };

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

            toast.success('Meeting logged successfully!');
            router.push('/distributor/meetings');
        } catch (err) {
            console.error('Submit error:', err);
            toast.error(err.response?.data?.message || 'Failed to log meeting');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="distributor">
            <div className="min-h-screen bg-background py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <button
                            onClick={() => router.back()}
                            className="text-primary font-bold mb-4 flex items-center space-x-2 hover:translate-x-[-4px] transition-transform"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Back</span>
                        </button>
                        <h1 className="text-4xl font-bold text-dark mb-2">Log New Meeting</h1>
                        <p className="text-gray-600 font-medium">Capture field visit details and location</p>
                    </div>

                    <form onSubmit={handleSubmit} className="card-premium space-y-8">
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-dark uppercase tracking-wider">
                                Meeting Type <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setMeetingType('one-on-one')}
                                    className={`p-6 rounded-2xl border-2 font-bold transition-all duration-300 ${meetingType === 'one-on-one'
                                        ? 'border-primary bg-primary/10 text-primary shadow-lg scale-[1.02]'
                                        : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'
                                        }`}
                                >
                                    One-on-One
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMeetingType('group')}
                                    className={`p-6 rounded-2xl border-2 font-bold transition-all duration-300 ${meetingType === 'group'
                                        ? 'border-secondary bg-secondary/10 text-secondary shadow-lg scale-[1.02]'
                                        : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'
                                        }`}
                                >
                                    Group Meeting
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {meetingType === 'one-on-one' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold text-dark mb-2">Person Name *</label>
                                        <input
                                            type="text"
                                            name="person_name"
                                            value={formData.person_name}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="Farmer's / Retailer's Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-dark mb-2">Category *</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="input-field"
                                        >
                                            <option value="Farmer">Farmer</option>
                                            <option value="Retailer">Retailer</option>
                                            <option value="Distributor">Secondary Distributor</option>
                                            <option value="Influencer">Influencer</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-dark mb-2">Contact Number *</label>
                                        <input
                                            type="tel"
                                            name="contact_number"
                                            value={formData.contact_number}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-dark mb-2">Business Potential (₹)</label>
                                        <input
                                            type="number"
                                            name="business_potential"
                                            value={formData.business_potential}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="Estimated value"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold text-dark mb-2">Village / Location Name *</label>
                                        <input
                                            type="text"
                                            name="village_name"
                                            value={formData.village_name}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="Enter location"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-dark mb-2">Attendee Count *</label>
                                        <input
                                            type="number"
                                            name="attendee_count"
                                            value={formData.attendee_count}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="No. of people"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-dark mb-2">Meeting Topic</label>
                                        <input
                                            type="text"
                                            name="meeting_topic"
                                            value={formData.meeting_topic}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="What was discussed?"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="space-y-6">
                            <label className="block text-sm font-bold text-dark uppercase tracking-wider">Location Details *</label>
                            <MapPicker onLocationSelect={handleLocationSelect} />
                        </div>

                        <div className="space-y-6">
                            <label className="block text-sm font-bold text-dark uppercase tracking-wider">Photo Proofs</label>
                            <PhotoUpload onPhotosChange={handlePhotosChange} maxPhotos={5} />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-dark mb-2">Meeting Notes</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                className="input-field min-h-[120px]"
                                placeholder="Any additional observations..."
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="btn-soft flex-1"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary flex-1 py-4"
                                disabled={loading}
                            >
                                {loading ? <ButtonLoader /> : 'Record Meeting'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
