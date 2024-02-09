import { AsyncLocalStorage } from 'node:async_hooks';
import { Context } from 'hono';
import * as hono from 'hono/timing';

const contextStorage = new AsyncLocalStorage<Context>();

export function startTime(key: string, description?: string): void {
	const context = contextStorage.getStore();

	if (context) {
		hono.startTime(context, key, description);
	}
}

export function endTime(key: string): void {
	const context = contextStorage.getStore();

	if (context) {
		hono.endTime(context, key);
	}
}

export async function trackDuration<T>(key: string, promise: Promise<T>): Promise<T>;
export async function trackDuration<T>(key: string, description: string, promise: Promise<T>): Promise<T>;
export async function trackDuration<T>(
	key: string,
	descriptionOrPromise: string | Promise<T>,
	maybePromise?: Promise<T>,
): Promise<T> {
	const promise = maybePromise ?? (descriptionOrPromise as Promise<T>);
	const description = maybePromise ? (descriptionOrPromise as string) : undefined;

	startTime(key, description);
	const result = await promise;
	endTime(key);

	return result;
}

export function trackFn<T>(context: Context, fn: () => T): T {
	return contextStorage.run(context, fn);
}
