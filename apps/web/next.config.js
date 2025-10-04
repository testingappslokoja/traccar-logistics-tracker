/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_TRACCAR_API_URL: process.env.NEXT_PUBLIC_TRACCAR_API_URL,
    NEXT_PUBLIC_TRACCAR_USERNAME: process.env.NEXT_PUBLIC_TRACCAR_USERNAME,
    NEXT_PUBLIC_TRACCAR_PASSWORD: process.env.NEXT_PUBLIC_TRACCAR_PASSWORD,
  },
};

module.exports = nextConfig;
