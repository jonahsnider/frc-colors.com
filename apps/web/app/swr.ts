import { ExceptionSchema } from './api/_lib/exceptions/dtos/exception.dto';

export class HttpError extends Error {
	static async create(response: Response): Promise<HttpError> {
		const text = await response.text();
		let json: Record<string, unknown> | undefined;
		try {
			json = JSON.parse(text);
			// biome-ignore lint/nursery/noEmptyBlockStatements: This is intentionally empty
			// biome-ignore lint/nursery/noUselessLoneBlockStatements: This is not a useless block statement
		} catch {}

		return new HttpError(json, text, response.status, response.statusText);
	}

	public readonly exception?: ExceptionSchema;

	private constructor(
		public readonly json: Record<string, unknown> | undefined,
		public readonly bodyText: string,
		public readonly statusCode: number,
		public readonly statusText: string,
	) {
		super(`An error occurred while fetching the data: ${statusCode} ${statusText} ${JSON.stringify(json)}`);
		const parsed = ExceptionSchema.safeParse(json);

		if (parsed.success) {
			this.exception = parsed.data;
		}
	}
}

export const fetcher = async <T>(url: string, apiKey?: string) => {
	const response = await fetch(url, {
		headers: {
			authorization: `Bearer ${apiKey}`,
		},
	});

	if (response.ok) {
		return response.json() as Promise<T>;
	}

	throw await HttpError.create(response);
};

export const fetcherWithApiKey = <T>([url, apiKey]: [string, string | undefined]) => fetcher<T>(url, apiKey);
