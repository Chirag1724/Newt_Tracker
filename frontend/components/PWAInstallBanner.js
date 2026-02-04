'use client';

import { useState, useEffect } from 'react';

export default function PWAInstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showBanner, setShowBanner] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // 1. Check if already installed
        const isStandaloneActive = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
        setIsStandalone(isStandaloneActive);

        if (isStandaloneActive) return;

        // 2. Identify Platform
        const userAgent = window.navigator.userAgent.toLowerCase();
        const ios = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(ios);

        // 3. Listen for Android/Chrome Install Prompt
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Show banner immediately on mobile
            if (window.innerWidth < 768) {
                setShowBanner(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handler);

        // 4. For iOS or if the prompt doesn't fire immediately, show after a short delay
        const timer = setTimeout(() => {
            if (!isStandaloneActive && window.innerWidth < 768 && !localStorage.getItem('pwa-dismissed')) {
                setShowBanner(true);
            }
        }, 3000);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            clearTimeout(timer);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            // If prompt didn't fire, we can't trigger native UI, but we can show instructions
            // Browsers like Chrome on Android always have "Install app" in the 3-dot menu
            alert('To install: Click the 3 dots (⋮) in your browser and select "Install app" or "Add to Home screen"');
            return;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowBanner(false);
        }
        setDeferredPrompt(null);
    };

    const dismissBanner = () => {
        setShowBanner(false);
        localStorage.setItem('pwa-dismissed', 'true');
    };

    if (!showBanner || isStandalone) return null;

    return (
        <div className="fixed inset-x-0 bottom-0 z-[100] p-4 md:hidden animate-slideUp">
            <div className="glass-dark rounded-3xl p-6 shadow-2xl border border-white/10 relative overflow-hidden backdrop-blur-xl">
                {/* Visual Background Element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>

                <div className="flex items-start space-x-4 relative z-10">
                    {/* App Icon */}
                    <div className="w-14 h-14 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center p-2 shadow-inner">
                        <img src="/web-app-manifest-192x192.png" alt="App Icon" className="w-full h-full object-contain" />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-1">Install Newt Tracker</h3>
                        <p className="text-white/70 text-sm leading-tight mb-4 lowercase">
                            Download the app for a faster, better, and offline experience.
                        </p>

                        {isIOS ? (
                            <div className="flex items-center space-x-2 bg-white/10 rounded-xl p-3 border border-white/5">
                                <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </div>
                                <p className="text-white text-[11px] font-medium leading-tight lowercase">
                                    Tap <span className="font-bold text-primary-light">Share</span> then <span className="font-bold text-primary-light">Add to Home Screen</span>
                                </p>
                            </div>
                        ) : (
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleInstallClick}
                                    className="flex-1 bg-white text-dark font-black py-3 rounded-xl text-sm transition-transform active:scale-95 shadow-lg"
                                >
                                    INSTALL NOW
                                </button>
                                <button
                                    onClick={dismissBanner}
                                    className="px-4 py-3 text-white/50 font-bold text-sm hover:text-white transition-colors"
                                >
                                    NOT NOW
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Close Button */}
                    {isIOS && (
                        <button
                            onClick={dismissBanner}
                            className="absolute -top-2 -right-2 p-2 text-white/30 hover:text-white"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
