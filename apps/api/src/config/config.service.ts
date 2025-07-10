import { cleanEnv, port, str, url } from 'envalid';

type NodeEnv = 'production' | 'development' | 'staging';

export class ConfigService {
	public readonly tbaApiKey: string;
	public readonly adminUsername: string;
	public readonly adminApiToken: string;
	public readonly nodeEnv: NodeEnv;
	public readonly frcEventsApi: Readonly<{ username: string; password: string }>;
	public readonly port: number;
	public readonly databaseUrl: string;
	public readonly sentryDsn: string;
	public readonly websiteUrl: string;
	public readonly redisUrl: string;
	public readonly posthogApiKey: string;

	constructor() {
		const env = cleanEnv(process.env, {
			TBA_API_KEY: str({ desc: 'TBA API key' }),

			ADMIN_USERNAME: str({ desc: 'Username for accessing admin API' }),

			ADMIN_PASSWORD: str({ desc: 'Password for accessing admin API' }),

			FRC_EVENTS_USERNAME: str({ desc: 'Username for FRC Events API' }),

			FRC_EVENTS_API_KEY: str({ desc: 'Password for FRC Events API' }),

			NODE_ENV: str({ default: 'production', choices: ['production', 'development', 'staging'] }),

			PORT: port({ default: 3000 }),

			DATABASE_URL: url({ desc: 'PostgreSQL URL' }),

			SENTRY_DSN: url({ desc: 'Sentry DSN' }),

			WEBSITE_URL: url({ desc: 'URL of the website' }),

			REDIS_URL: url({ desc: 'Redis URL' }),

			POSTHOG_API_KEY: str({ desc: 'PostHog API key' }),
		});

		this.tbaApiKey = env.TBA_API_KEY;
		this.adminApiToken = env.ADMIN_PASSWORD;
		this.adminUsername = env.ADMIN_USERNAME;
		this.nodeEnv = env.NODE_ENV;
		this.frcEventsApi = {
			username: env.FRC_EVENTS_USERNAME,
			password: env.FRC_EVENTS_API_KEY,
		};
		this.port = env.PORT;
		this.databaseUrl = env.DATABASE_URL;
		this.sentryDsn = env.SENTRY_DSN;
		this.websiteUrl = env.WEBSITE_URL;
		this.redisUrl = env.REDIS_URL;
		this.posthogApiKey = env.POSTHOG_API_KEY;
	}
}

export const configService = new ConfigService();
