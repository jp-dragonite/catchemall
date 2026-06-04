import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static build so it deploys to AWS Amplify Hosting as plain files.
  output: "export",
  // Static export can't use the Image Optimization server, so serve images as-is.
  images: {
    unoptimized: true,
  },
  // /plush/1 -> /plush/1/index.html, which static hosts (incl. Amplify) like.
  trailingSlash: true,
};

export default nextConfig;
