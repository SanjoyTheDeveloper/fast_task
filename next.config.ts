import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/task/:id",
        destination: "/tasks/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
