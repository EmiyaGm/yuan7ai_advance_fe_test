/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'build',
  eslint: { ignoreDuringBuilds: true },
  images: {
    domains: ['localhost', '8.130.111.74', 'free.yuanqiai.xyz'],
  },
}


export default nextConfig
