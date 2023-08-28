import { z } from 'zod';

export class ConfigService {
	public readonly tbaApiKey: string | undefined;
	public readonly adminApiToken: string | undefined;
	public readonly baseUrl: URL | undefined;
	public readonly redisCacheEnabled: boolean;

	constructor(source: Readonly<Record<string, unknown>>) {
		this.tbaApiKey = z.string().min(1).optional().parse(source.TBA_API_KEY);
		this.adminApiToken = z.string().min(1).optional().parse(source.ADMIN_PASSWORD);
		this.baseUrl = z
			.string()
			.url()
			.optional()
			.transform((url) => (url !== undefined ? new URL(url) : undefined))
			.parse(source.BASE_URL);
		this.redisCacheEnabled = z
			.enum(['true', 'false'])
			.optional()
			.transform((value) => value === 'true')
			.pipe(z.boolean().default(false))
			.parse(source.REDIS_CACHE_ENABLED);
	}
}

export const configService = new ConfigService(process.env);
