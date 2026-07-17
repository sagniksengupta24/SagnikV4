import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
let basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Normalize basePath to ensure it meets Next.js requirements:
// - Must start with a slash (or be empty)
// - Must not end with a slash
// - Cannot be just "/"
if (basePath === "/") {
  basePath = "";
} else if (basePath && !basePath.startsWith("/")) {
  basePath = `/${basePath}`;
}
if (basePath && basePath.endsWith("/")) {
  basePath = basePath.slice(0, -1);
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: "export",
  basePath: isProd ? basePath : "",
  assetPrefix: isProd ? basePath : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
