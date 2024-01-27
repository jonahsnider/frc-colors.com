import { z } from 'zod';

export class ConfigService {
	public readonly tbaApiKey: string | undefined;
	public readonly adminApiToken: string | undefined;
	public readonly baseUrl: URL | undefined;
	public readonly nodeEnv: 'production' | 'development' | 'staging';
	public readonly frcEventsApi: Readonly<{ username: string; password: string }>;

	constructor(source: Readonly<Record<string, unknown>>) {
		this.tbaApiKey = z
			.string()
			.min(1)
			.optional()
			.parse(source['TBA_API_KEY']);
		this.adminApiToken = z
			.string()
			.min(1)
			.optional()
			.parse(source['ADMIN_PASSWORD']);
		this.baseUrl = z
			.string()
			.url()
			.optional()
			.transform((url) => (url !== undefined ? new URL(url) : undefined))
			.parse(source['BASE_URL']);
		this.nodeEnv = z
			.enum(['production', 'development', 'staging'])
			.default('production')
			.parse(source['NODE_ENV']);
		this.frcEventsApi = {
			username: z
				.string()
				.min(1)
				.parse(source['FRC_EVENTS_USERNAME']),
			password: z
				.string()
				.min(1)
				.parse(source['FRC_EVENTS_API_KEY']),
		};
	}
}

export const configService = new ConfigService(process.env);
