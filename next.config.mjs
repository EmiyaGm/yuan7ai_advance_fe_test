/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'build',
    images: {
        domains: ['localhost', '8.130.111.74', 'free.yuanqiai.xyz'],
    }
};

export default nextConfig;
