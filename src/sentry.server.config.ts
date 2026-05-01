// src/sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Ajuste a taxa de amostragem conforme necessário
  tracesSampleRate: 1.0,

  // Configurações de debug (apenas em desenvolvimento)
  debug: false,
});
