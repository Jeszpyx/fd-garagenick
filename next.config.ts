import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/": ["./generated/prisma/**/*"],
    "/api/**": ["./generated/prisma/**/*"],
  },
  images: {
    localPatterns: [
      {
        pathname: "/api/products/**",
      },
    ],
  },
};

export default nextConfig;
