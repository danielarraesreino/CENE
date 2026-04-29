import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn && process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_ENV || 'production',
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
      Sentry.browserTracingIntegration(),
    ],

    // Intercepta logs padrão do frontend e converte para eventos Sentry
    beforeSend(event) {
      // Sanitização de PII antes do envio
      if (event.request?.cookies) delete event.request.cookies;
      if (event.user?.email) event.user.email = '[SANITIZED]';
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.filter(b => 
          !b.message?.includes('password') && !b.message?.includes('token')
        );
      }
      return event;
    },
  });
}

export { Sentry };
