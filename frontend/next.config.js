/** @type {import('next').NextConfig} */
const nextConfig = {
    // Ensure proper output for Vercel
    output: 'standalone',
    // Compress images and optimize
    images: {
        domains: ['res.cloudinary.com'],
    },
    // Enable React strict mode for better error detection
    reactStrictMode: true,
    // Experimental features for better performance
    experimental: {
        serverActions: {
            allowedOrigins: ['localhost:3001', 'newt-tracker-vercel.app']
        }
    }
}

module.exports = nextConfig
