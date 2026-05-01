import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import withPWA from '@ducanh2912/next-pwa';
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['10.164.69.51'],
  turbopack: {},
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@react-pdf/renderer",
      "sonner"
    ],
  },
  reactStrictMode: true,
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const pwa = withPWA({
  dest: 'public',
  disable: false, // Habilitado em dev para testes
  register: true,
  
  // Estratégias de cache otimizadas para Reibb
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  
  // Workbox customizado
  workboxOptions: {
    importScripts: ['/sw-push.js'],
    skipWaiting: true,
    disableDevLogs: true,
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB por arquivo
    runtimeCaching: [
      // 1. API Django: Cache por 5min, stale-while-revalidate
      {
        urlPattern: /^https?:\/\/.*\/api\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'reibb-api-cache',
          expiration: { maxEntries: 50, maxAgeSeconds: 300 },
          networkTimeoutSeconds: 10,
        },
      },
      // 2. Imagens/Mídia: Cache agressivo (1 ano)
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|mp4|pdf)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'reibb-media-cache',
          expiration: { maxEntries: 100, maxAgeSeconds: 31536000 },
        },
      },
      // 3. Fonts/Google: Cache estático
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'StaleWhileRevalidate',
        options: { cacheName: 'google-fonts-cache' },
      },
      // 4. Shell da aplicação: Offline-first
      {
        urlPattern: /^https?:\/\/.*\/(cursos|portal).*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'reibb-shell-cache',
          expiration: { maxEntries: 30, maxAgeSeconds: 86400 },
        },
      },
    ],
  },
});

const sentryConfig = {
  // Para todas as opções disponíveis, veja:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suprime mensagens de log do plugin no build
  silent: true,
  org: "reibb",
  project: "frontend",
  
  // Para todas as opções disponíveis, veja:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload automático de source maps
  widenClientFileUpload: true,

  // Transpila SDK para navegadores antigos
  transpileClientSDK: true,

  // Habilita captura de erros de renderização no servidor
  hideSourceMaps: true,

  // Remove sentry logger statements para reduzir bundle size
  disableLogger: true,

  // Habilita captura automática de transações
  automaticVercelMonitors: true,
};

export default withSentryConfig(
  pwa(bundleAnalyzer(nextConfig)),
  sentryConfig
);
