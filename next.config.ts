import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/spectreofsolitude.github.io', // Sesuaikan dengan nama repo GitHub Anda
  trailingSlash: true,
};

module.exports = nextConfig;

export default nextConfig;
