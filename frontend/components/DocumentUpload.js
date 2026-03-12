'use client';

import { useState, useRef, useCallback } from 'react';
import api from '@/lib/api';

// ─── File type helpers ────────────────────────────────────────────────────────

const FILE_ICONS = {
    pdf: { emoji: '📄', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
    doc: { emoji: '📝', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    docx: { emoji: '📝', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    xls: { emoji: '📊', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    xlsx: { emoji: '📊', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    csv: { emoji: '📋', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
    txt: { emoji: '📃', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' },
};

const getExt = (filename) => (filename || '').split('.').pop().toLowerCase();

const getFileIcon = (filename) => FILE_ICONS[getExt(filename)] ?? FILE_ICONS.txt;

const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
];
const ALLOWED_EXTS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv'];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DocumentUpload({ onDocumentsChange, maxDocuments = 10, label = 'Supporting Documents' }) {
    const [documents, setDocuments] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    // ── Validation ───────────────────────────────────────────────────────────

    const validateFiles = useCallback((files) => {
        for (const file of files) {
            const ext = getExt(file.name);
            if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTS.includes(ext)) {
                return `"${file.name}" is not supported. Allowed: PDF, DOC, DOCX, XLS, XLSX, TXT, CSV.`;
            }
            if (file.size > 20 * 1024 * 1024) {
                return `"${file.name}" exceeds the 20 MB limit.`;
            }
        }
        if (documents.length + files.length > maxDocuments) {
            return `Maximum ${maxDocuments} documents allowed.`;
        }
        return null;
    }, [documents.length, maxDocuments]);

    // ── Upload ───────────────────────────────────────────────────────────────

    const processFiles = useCallback(async (fileList) => {
        const files = Array.from(fileList);
        if (!files.length) return;

        const validationError = validateFiles(files);
        if (validationError) { setError(validationError); return; }

        setError(null);
        setUploading(true);
        setProgress(0);

        try {
            const formData = new FormData();
            files.forEach(f => formData.append('documents', f));

            const response = await api.post('/meetings/upload-documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (evt) => {
                    if (evt.total) setProgress(Math.round((evt.loaded * 100) / evt.total));
                },
            });

            const uploaded = response.data.documents || [];
            const newDocuments = [...documents, ...uploaded];
            setDocuments(newDocuments);
            onDocumentsChange?.(newDocuments);
        } catch (err) {
            console.error('Document upload error:', err);
            setError(err.response?.data?.message || 'Failed to upload documents. Please try again.');
        } finally {
            setUploading(false);
            setProgress(0);
        }
    }, [documents, validateFiles, onDocumentsChange]);

    // ── Drag & Drop ──────────────────────────────────────────────────────────

    const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDragging(false); };
    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation();
        setDragging(false);
        processFiles(e.dataTransfer.files);
    };

    // ── Remove ───────────────────────────────────────────────────────────────

    const removeDocument = (index) => {
        const updated = documents.filter((_, i) => i !== index);
        setDocuments(updated);
        onDocumentsChange?.(updated);
    };

    // ─────────────────────────────────────────────────────────────────────────

    const isFull = documents.length >= maxDocuments;

    return (
        <div className="space-y-4">
            <label className="block text-sm font-bold text-dark">
                {label}
                <span className="ml-2 text-xs font-normal text-gray-400 normal-case">
                    (PDF, DOC, DOCX, XLS, XLSX, TXT, CSV — up to 20 MB each)
                </span>
            </label>

            {/* ── Drop Zone ── */}
            {!isFull && (
                <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => !uploading && inputRef.current?.click()}
                    className={`
                        relative w-full p-8 border-2 border-dashed rounded-2xl text-center
                        cursor-pointer select-none transition-all duration-300
                        ${dragging
                            ? 'border-secondary bg-secondary/10 scale-[1.01] shadow-lg'
                            : uploading
                                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                : 'border-primary/30 bg-primary/5 hover:border-primary hover:bg-primary/10'
                        }
                    `}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                        className="hidden"
                        onChange={(e) => processFiles(e.target.files)}
                        disabled={uploading || isFull}
                    />

                    {uploading ? (
                        <div className="flex flex-col items-center space-y-3">
                            {/* Progress ring */}
                            <div className="relative w-14 h-14">
                                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                                    <circle cx="28" cy="28" r="22" fill="none" stroke="#e5e7eb" strokeWidth="5" />
                                    <circle
                                        cx="28" cy="28" r="22" fill="none"
                                        stroke="#2E7D32" strokeWidth="5"
                                        strokeDasharray={`${2 * Math.PI * 22}`}
                                        strokeDashoffset={`${2 * Math.PI * 22 * (1 - progress / 100)}`}
                                        strokeLinecap="round"
                                        className="transition-all duration-200"
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary">
                                    {progress}%
                                </span>
                            </div>
                            <p className="text-sm font-semibold text-dark">Uploading documents…</p>
                            <p className="text-xs text-gray-500">Please wait</p>
                        </div>
                    ) : dragging ? (
                        <div className="flex flex-col items-center space-y-2">
                            <span className="text-5xl">📂</span>
                            <p className="font-bold text-secondary">Drop files here</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-2">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-1">
                                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <p className="font-semibold text-dark">
                                Drag & drop files or{' '}
                                <span className="text-primary underline underline-offset-2">browse</span>
                            </p>
                            <p className="text-xs text-gray-500">
                                {documents.length} / {maxDocuments} uploaded
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* ── Error ── */}
            {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            {/* ── Uploaded files list ── */}
            {documents.length > 0 && (
                <div className="space-y-2">
                    {documents.map((doc, idx) => {
                        const icon = getFileIcon(doc.name);
                        return (
                            <div
                                key={idx}
                                className={`flex items-center gap-3 p-3 rounded-xl border ${icon.border} ${icon.bg} group transition-all`}
                            >
                                {/* Icon */}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-white shadow-sm`}>
                                    {icon.emoji}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold ${icon.color} truncate`} title={doc.name}>
                                        {doc.name}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {formatBytes(doc.size)} &nbsp;·&nbsp; {getExt(doc.name).toUpperCase()}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    {/* View/Download */}
                                    <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-white transition-all"
                                        title="Open document"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                    {/* Remove */}
                                    <button
                                        type="button"
                                        onClick={() => removeDocument(idx)}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-white transition-all"
                                        title="Remove"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {isFull && (
                <p className="text-xs text-gray-500 text-center">
                    Maximum {maxDocuments} documents reached.
                </p>
            )}
        </div>
    );
}
