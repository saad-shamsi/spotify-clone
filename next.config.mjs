/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'fiuesquibaszzhqwaqhu.supabase.co',
                // Optionally, you can specify the pathname if you want to limit to specific paths
                // pathname: '/storage/v1/object/public/songs/*',
            },
        ],
    },
};

export default nextConfig;