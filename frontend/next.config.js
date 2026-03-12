/** @type {import('next').NextConfig} */
const nextConfig = {
    // Ensure proper output for Vercel
    output: 'standalone',
    // Compress images and optimize
    images: {
        domains: ['res.cloudinary.com', 'images.unsplash.com', 'images.pexels.com'],
    },
    reactStrictMode: true,
    swcMinify: true,
    poweredByHeader: false,
    compress: true,
    experimental: {
        serverActions: {
            allowedOrigins: ['localhost:3001', 'newt-tracker-vercel.app']
        }
    }
}

module.exports = nextConfig
