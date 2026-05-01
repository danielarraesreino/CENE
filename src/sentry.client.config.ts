// src/sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Ajuste a taxa de amostragem conforme necessário
  tracesSampleRate: 1.0,

  // Captura erros de rede e erros de renderização automaticamente
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filtra erros irrelevantes
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "Non-Error promise rejection captured",
    "Script error.",
  ],

  // Sanitização de PII antes do envio
  beforeSend(event) {
    if (event.request?.cookies) delete event.request.cookies;
    if (event.user?.email) event.user.email = '[SANITIZED]';
    return event;
  },
});
