/**
 *  @type {import('next').NextConfig}
 *
 * */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    topLevelAwait: true,
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};

module.exports = nextConfig;
