import { z } from 'zod';

export class ConfigService {
	public readonly tbaApiKey: string;

	constructor(source: Readonly<Record<string, unknown>>) {
		this.tbaApiKey= z.string().min(1).parse(source.TBA_API_KEY);
	}
}

export const configService = new ConfigService(process.env);
