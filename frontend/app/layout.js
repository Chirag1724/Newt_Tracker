import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ClientProviders from '@/components/ClientProviders'
import PWAInstallBanner from '@/components/PWAInstallBanner'

export const metadata = {
    title: 'Newt Tracker - Field Operations Tracking Made Simple',
    description: 'Professional field operations tracking system for efficient team management and sales monitoring',
    keywords: 'field operations, sales tracking, distributor management, newt tracker',
    icons: {
        icon: '/icon.png',
        apple: '/apple-icon.png',
    },
    appleWebApp: {
        title: 'Newt Tracker',
        statusBarStyle: 'default',
    },
    other: {
        'mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-capable': 'yes',
    }
}

export const viewport = {
    themeColor: '#2D5016',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="font-body">
                <ClientProviders>
                    <Navbar />
                    <main className="min-h-screen">
                        {children}
                    </main>
                    <Footer />
                    <PWAInstallBanner />
                </ClientProviders>
            </body>
        </html>
    )
}
