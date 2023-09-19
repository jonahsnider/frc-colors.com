import * as Sentry from '@sentry/nextjs';
import { prisma } from './app/api/_lib/prisma';

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

	tracesSampleRate: 1.0,

	integrations: [new Sentry.Integrations.Prisma({ client: prisma })],
});
