/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  // Handle large GLB files
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: "asset/resource",
    })
    return config
  },
}

module.exports = nextConfig

