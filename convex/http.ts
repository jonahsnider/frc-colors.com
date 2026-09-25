import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { HttpRouterWithHono } from 'convex-helpers/server/hono';
import { cors } from 'hono/cors';
import { api, internal } from './_generated/api';
import type { ActionCtx } from './_generated/server';
import { getTeamsForEvent } from './lib/tba';

type AppEnv = { Bindings: { [K in keyof ActionCtx]: ActionCtx[K] }; Variables: Record<never, never> };
type Colors = { primary: string; secondary: string; verified: boolean };
type Entry = { teamNumber: number; colors: Colors | null };

const teamNumber = z.coerce.number().int().positive().max(50_000);
const colorResponse = z.object({ primaryHex: z.string(), secondaryHex: z.string(), verified: z.boolean() });
const manyEntryResponse = z.object({
	teamNumber,
	colors: colorResponse.nullable(),
});
const manyResponse = z.object({ teams: z.record(z.string(), manyEntryResponse) });
const jsonResponse = (schema: z.ZodType, description: string) => ({
	content: { 'application/json': { schema } },
	description,
});
const errorResponse = z.object({ statusCode: z.number(), error: z.string(), code: z.string(), message: z.string() });

const app = new OpenAPIHono<AppEnv>({
	defaultHook: (result, c) => {
		if (!result.success) {
			return c.json(
				{
					statusCode: 400,
					error: 'Bad Request',
					code: 'E_VALIDATION',
					message: result.error.issues[0]?.message ?? 'Invalid request',
				},
				400,
			);
		}
		return undefined;
	},
}).onError((error, c) => {
	console.error(error);
	return c.json(
		{
			statusCode: 500,
			error: 'Internal Server Error',
			code: 'E_INTERNAL_ERROR',
			message: 'An internal error occurred',
		},
		500,
	);
});

app.use('/v1/*', cors());

const getTeam = createRoute({
	method: 'get',
	path: '/v1/team/{team}',
	operationId: 'getTeamColors',
	tags: ['Teams'],
	summary: 'Get colors for a team by number',
	request: { params: z.object({ team: teamNumber }) },
	responses: {
		200: jsonResponse(colorResponse, 'The team colors'),
		400: jsonResponse(errorResponse, 'Invalid team number'),
		404: jsonResponse(errorResponse, 'No colors are stored for the team'),
	},
});

app.openapi(getTeam, async (c) => {
	const { team } = c.req.valid('param');
	const colors = await c.env.runQuery(api.colors.getOne, { team });
	if (!colors) {
		return c.json(
			{ statusCode: 404, error: 'Not Found', code: 'E_TEAM_NOT_FOUND', message: `Team ${team} had no stored colors.` },
			404,
		);
	}
	return c.json(toHttpColors(colors), 200);
});

const getMany = createRoute({
	method: 'get',
	path: '/v1/team',
	operationId: 'getManyTeamColors',
	tags: ['Teams'],
	summary: 'Get colors for multiple teams or all teams',
	request: {
		query: z.object({ team: z.union([teamNumber, z.array(teamNumber)]).optional(), all: z.string().optional() }),
	},
	responses: {
		200: jsonResponse(manyResponse, 'The requested team colors'),
		400: jsonResponse(errorResponse, 'Invalid query parameters'),
	},
});

app.openapi(getMany, async (c) => {
	const url = new URL(c.req.url);
	const all = url.searchParams.has('all');
	const allValue = url.searchParams.get('all')?.toLowerCase();
	const teams = url.searchParams.getAll('team').map(Number);
	if (
		all === teams.length > 0 ||
		(all && !['', 'true', '1', 'yes', 'on', 'y'].includes(allValue ?? '')) ||
		teams.length > 500 ||
		teams.some((team) => !teamNumber.safeParse(team).success)
	) {
		return c.json(
			{
				statusCode: 400,
				error: 'Bad Request',
				code: 'E_VALIDATION',
				message: 'Pass either all or up to 500 valid team numbers',
			},
			400,
		);
	}
	let entries: Entry[];
	if (all) {
		entries = [];
		let cursor: string | null = null;
		for (;;) {
			const page: { items: Entry[]; cursor: string; done: boolean } = await c.env.runQuery(internal.colors.getPage, {
				cursor,
			});
			entries.push(...page.items);
			if (page.done) break;
			cursor = page.cursor;
		}
	} else {
		entries = await c.env.runQuery(api.colors.getMany, { teams });
	}
	return c.json(toManyResponse(entries), 200);
});

const getEvent = createRoute({
	method: 'get',
	path: '/v1/event/{event}',
	operationId: 'getEventColors',
	tags: ['Events'],
	summary: 'Get colors for teams at an event',
	request: { params: z.object({ event: z.string().max(64) }) },
	responses: {
		200: jsonResponse(manyResponse, 'Colors for teams at the event'),
		404: jsonResponse(errorResponse, 'Event not found'),
	},
});

app.openapi(getEvent, async (c) => {
	const { event } = c.req.valid('param');
	let teams: number[];
	try {
		teams = await getTeamsForEvent(event);
	} catch (error) {
		if (error instanceof Error && error.message.includes('not found on TBA')) {
			return c.json({ statusCode: 404, error: 'Not Found', code: 'E_EVENT_NOT_FOUND', message: error.message }, 404);
		}
		throw error;
	}
	const entries = await c.env.runQuery(api.colors.getMany, { teams });
	return c.json(toManyResponse(entries), 200);
});

const getHealth = createRoute({
	method: 'get',
	path: '/health',
	operationId: 'getHealth',
	tags: ['Health'],
	summary: 'Check API health',
	responses: {
		200: jsonResponse(z.object({ status: z.literal('ok') }), 'The API and database are healthy'),
		500: jsonResponse(errorResponse, 'The health check failed'),
	},
});

app.openapi(getHealth, async (c) => {
	await c.env.runQuery(api.colors.getOne, { team: 581 });
	return c.json({ status: 'ok' as const }, 200);
});
app.on('HEAD', '/health', async (c) => {
	await c.env.runQuery(api.colors.getOne, { team: 581 });
	return c.body(null, 200);
});

app.get('/internal/team/:team/avatar.png', (c) => {
	const parsed = teamNumber.safeParse(c.req.param('team'));
	if (!parsed.success)
		return c.json({ statusCode: 400, error: 'Bad Request', code: 'E_VALIDATION', message: 'Invalid team' }, 400);
	const progress = (Date.now() - Date.UTC(2026, 8, 1)) / (Date.UTC(2026, 11, 1) - Date.UTC(2026, 8, 1));
	const errorRate = Math.max(0.1, Math.min(1, 0.1 + progress * 0.9));
	const destination = `https://avatars.frc.sh/teams/${parsed.data}.png`;
	if (Math.random() < errorRate) {
		c.header('Cache-Control', 'no-store');
		return c.json({ error: `This legacy avatar endpoint has been retired. Migrate to ${destination}.` }, 410);
	}
	return c.redirect(destination, 308);
});

app.doc31('/openapi.json', {
	openapi: '3.1.0',
	info: {
		title: 'FRC Colors API',
		version: '1.0.0',
		description: 'Primary and secondary colors for FIRST Robotics Competition teams.',
	},
	servers: [{ url: 'https://api.frc-colors.com', description: 'Production' }],
	security: [],
});

function toHttpColors(colors: Colors) {
	return { primaryHex: colors.primary, secondaryHex: colors.secondary, verified: colors.verified };
}

function toManyResponse(entries: Entry[]) {
	return {
		teams: Object.fromEntries(
			entries.map(({ teamNumber, colors }) => [
				String(teamNumber),
				{ teamNumber, colors: colors ? toHttpColors(colors) : null },
			]),
		),
	};
}

export default new HttpRouterWithHono<ActionCtx>(app);
