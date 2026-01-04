import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
});

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    qualities: [75, 85],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 31536000,
  },

  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  experimental: {
    // এরর অনুযায়ী নতুন কনফিগারেশন:
    cacheComponents: true, // এটি PPR ফিচারের নতুন নাম/জায়গা

    optimizePackageImports: [
      "react-icons",
      "lucide-react",
      "@headlessui/react",
      "framer-motion"
    ],
  },
};

export default withBundleAnalyzer(nextConfig);