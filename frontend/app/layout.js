import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
    title: 'Newt Tracker - Field Operations Tracking Made Simple',
    description: 'Professional field operations tracking system for efficient team management and sales monitoring',
    keywords: 'field operations, sales tracking, distributor management, newt tracker',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="font-body">
                <Navbar />
                <main className="min-h-screen">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    )
}
