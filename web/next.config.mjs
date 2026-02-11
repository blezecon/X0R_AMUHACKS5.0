/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET,
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
  },
};

export default nextConfig;
