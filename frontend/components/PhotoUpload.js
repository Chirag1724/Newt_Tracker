'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { optimizeImage } from '@/lib/imageOptimizer';

export default function PhotoUpload({ onPhotosChange, maxPhotos = 5 }) {
    const [photos, setPhotos] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [optimizing, setOptimizing] = useState(false);
    const [error, setError] = useState(null);

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);

        // Check total photo count
        if (photos.length + files.length > maxPhotos) {
            setError(`Maximum ${maxPhotos} photos allowed`);
            return;
        }

        // Check file types
        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                setError('Only image files are allowed');
                return;
            }
        }

        setError(null);
        setOptimizing(true);

        try {
            const formData = new FormData();

            // Optimize each image before adding to FormData
            for (const file of files) {
                const optimizedBlob = await optimizeImage(file);
                formData.append('photos', optimizedBlob, file.name);
            }

            setOptimizing(false);
            setUploading(true);

            const response = await api.post('/meetings/upload-photos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const uploadedPhotos = response.data.photos || [];
            const newPhotos = [...photos, ...uploadedPhotos];
            setPhotos(newPhotos);

            if (onPhotosChange) {
                onPhotosChange(newPhotos);
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'Failed to upload photos');
        } finally {
            setUploading(false);
        }
    };

    const removePhoto = (index) => {
        const newPhotos = photos.filter((_, i) => i !== index);
        setPhotos(newPhotos);
        if (onPhotosChange) {
            onPhotosChange(newPhotos);
        }
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-semibold text-dark">
                Meeting Photos (Max {maxPhotos})
            </label>

            {/* Upload Area */}
            <div className="relative">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    disabled={uploading || photos.length >= maxPhotos}
                    className="hidden"
                    id="photo-upload"
                />
                <label
                    htmlFor="photo-upload"
                    className={`block w-full p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-smooth ${uploading || optimizing || photos.length >= maxPhotos
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        : 'border-primary/30 bg-primary/5 hover:border-primary hover:bg-primary/10'
                        }`}
                >
                    {optimizing ? (
                        <div className="flex flex-col items-center space-y-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                            <p className="text-sm text-gray-600 font-bold">Saving mobile data...</p>
                            <p className="text-xs text-secondary font-semibold uppercase tracking-tighter">Compressing for rural Network</p>
                        </div>
                    ) : uploading ? (
                        <div className="flex flex-col items-center space-y-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <p className="text-sm text-gray-600 font-bold">Uploading proof...</p>
                        </div>
                    ) : photos.length >= maxPhotos ? (
                        <div>
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-600">Maximum photos reached</p>
                        </div>
                    ) : (
                        <div>
                            <svg className="mx-auto h-12 w-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="mt-2 text-sm font-semibold text-dark">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG, WEBP up to 5MB each
                            </p>
                        </div>
                    )}
                </label>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Photo Grid */}
            {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={photo}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
                            />
                            <button
                                type="button"
                                onClick={() => removePhoto(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-smooth hover:bg-red-600"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <p className="text-xs text-gray-500">
                {photos.length} / {maxPhotos} photos uploaded
            </p>
        </div>
    );
}
