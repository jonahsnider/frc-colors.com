import { z } from 'zod';

export class ConfigService {
	public readonly tbaApiKey: string | undefined;
	public readonly adminApiToken: string | undefined;
	public readonly baseUrl: URL | undefined;
	public readonly redisPrefix: string;

	constructor(source: Readonly<Record<string, unknown>>) {
		this.tbaApiKey = z.string().min(1).optional().parse(source.TBA_API_KEY);
		this.adminApiToken = z.string().min(1).optional().parse(source.ADMIN_PASSWORD);
		this.baseUrl = z
			.string()
			.url()
			.optional()
			.transform((url) => (url !== undefined ? new URL(url) : undefined))
			.parse(source.BASE_URL);
		this.redisPrefix = source.NODE_ENV !== 'production' ? 'dev:' : '';
	}
}

export const configService = new ConfigService(process.env);
