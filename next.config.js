/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Treat the worker file as a static asset and let Webpack emit it.
    config.module.rules.push({
      test: /pdf\.worker(\.min)?\.m?js$/,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;
