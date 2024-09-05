/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        // Optionally, specify a path for a directory within the domain:
        // path: "/path/to/images",
      },
    ],
  },
};

export default nextConfig;
