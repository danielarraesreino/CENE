import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['10.164.69.51'],
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@react-pdf/renderer",
      "sonner"
    ],
  },
  // Otimização de pacotes pesados
  bundleAnalyzer: {
    enabled: process.env.ANALYZE === 'true',
  },
};

export default nextConfig;
