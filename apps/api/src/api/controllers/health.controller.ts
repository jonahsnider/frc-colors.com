import { createRoute, z } from '@hono/zod-openapi';
import { colorsService } from '../../colors/colors.service.ts';
import { createOpenAPIController, ExceptionSchema, jsonResponse } from '../openapi.ts';

const healthRoute = createRoute({
	method: 'get',
	path: '/',
	operationId: 'getHealth',
	tags: ['Health'],
	summary: 'Check API health',
	responses: {
		200: jsonResponse(z.object({ status: z.literal('ok') }), 'The API and database are healthy'),
		500: jsonResponse(ExceptionSchema, 'The health check failed'),
	},
});

export const healthController = createOpenAPIController().openapi(healthRoute, async (context) => {
	// Check that querying DB works
	await colorsService.stored.getTeamColors(581);

	return context.json(
		{
			status: 'ok' as const,
		},
		200,
	);
});
