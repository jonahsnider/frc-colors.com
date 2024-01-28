import { cleanEnv, port, str } from 'envalid';

type NodeEnv = 'production' | 'development' | 'staging';

export class ConfigService {
	public readonly tbaApiKey: string | undefined;
	public readonly adminApiToken: string | undefined;
	public readonly nodeEnv: NodeEnv;
	public readonly frcEventsApi: Readonly<{ username: string; password: string }>;
	public readonly port: number;
	public readonly databaseUrl: string;

	constructor() {
		const env = cleanEnv(process.env, {
			// biome-ignore lint/style/useNamingConvention: This is an environment variable
			TBA_API_KEY: str({ desc: 'TBA API key' }),
			// biome-ignore lint/style/useNamingConvention: This is an environment variable
			ADMIN_PASSWORD: str({ desc: 'Password for accessing admin API' }),
			// biome-ignore lint/style/useNamingConvention: This is an environment variable
			FRC_EVENTS_USERNAME: str({ desc: 'Username for FRC Events API' }),
			// biome-ignore lint/style/useNamingConvention: This is an environment variable
			FRC_EVENTS_API_KEY: str({ desc: 'Password for FRC Events API' }),
			// biome-ignore lint/style/useNamingConvention: This is an environment variable
			NODE_ENV: str({ default: 'production', choices: ['production', 'development', 'staging'] }),
			// biome-ignore lint/style/useNamingConvention: This is an environment variable
			PORT: port({ default: 3000 }),
			// biome-ignore lint/style/useNamingConvention: This is an environment variable
			DATABASE_URL: str({ desc: 'PostgreSQL URL' }),
		});

		this.tbaApiKey = env.TBA_API_KEY;
		this.adminApiToken = env.ADMIN_PASSWORD;
		this.nodeEnv = env.NODE_ENV;
		this.frcEventsApi = {
			username: env.FRC_EVENTS_USERNAME,
			password: env.FRC_EVENTS_API_KEY,
		};
		this.port = env.PORT;
		this.databaseUrl = env.DATABASE_URL;
	}
}

export const configService = new ConfigService();
