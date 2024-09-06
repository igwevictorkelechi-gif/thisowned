/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // hostname: "images.unsplash.com",
        hostname: "depojvulqfgrxvinsdgn.supabase.co",
        // Optionally, specify a path for a directory within the domain:
        // path: "/path/to/images",
      },
    ],
  },
};

export default nextConfig;
