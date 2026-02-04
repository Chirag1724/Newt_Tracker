export default function manifest() {
    return {
        name: 'Newt Tracker Field Operations',
        short_name: 'Newt Tracker',
        description: 'Professional field force tracking and sales management for rural distributors.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2D5016',
        scope: '/',
        icons: [
            {
                src: '/web-app-manifest-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/web-app-manifest-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/web-app-manifest-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
