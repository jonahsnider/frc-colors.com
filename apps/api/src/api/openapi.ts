import type { Hook } from '@hono/zod-openapi';
import { OpenAPIHono, z } from '@hono/zod-openapi';
import { Http } from '@jonahsnider/util';
import type { Env } from 'hono';
import { BaseHttpException } from './exceptions/base.exception.ts';

const validationHook: Hook<unknown, Env, string, unknown> = (result) => {
	if (!result.success) {
		throw new BaseHttpException(
			result.error.issues[0]?.message ?? 'Invalid request',
			Http.Status.BadRequest,
			'E_VALIDATION',
		);
	}
};

export function createOpenAPIController() {
	return new OpenAPIHono({ defaultHook: validationHook });
}

export const TeamNumberHttpSchema = z.coerce.number().positive().int().max(50_000).openapi({
	example: 581,
});

export const TeamColorsHttpSchema = z
	.object({
		primaryHex: z
			.string()
			.regex(/^#[\da-f]{6}$/)
			.openapi({ example: '#591616' }),
		secondaryHex: z
			.string()
			.regex(/^#[\da-f]{6}$/)
			.openapi({ example: '#e86d38' }),
		verified: z.boolean().openapi({ example: true }),
	})
	.openapi('TeamColors');

const ManyTeamColorsHttpEntrySchema = z
	.object({
		colors: TeamColorsHttpSchema.nullable(),
		teamNumber: TeamNumberHttpSchema,
	})
	.openapi('TeamColorsEntry');

export const ManyTeamColorsHttpSchema = z
	.object({
		teams: z.record(z.string(), ManyTeamColorsHttpEntrySchema),
	})
	.openapi('ManyTeamColors');

export const ExceptionSchema = z
	.object({
		statusCode: z.number().int(),
		error: z.string(),
		code: z.string().optional(),
		message: z.string(),
	})
	.openapi('Error');

export const jsonResponse = <T extends z.ZodType>(schema: T, description: string) => ({
	content: {
		'application/json': {
			schema,
		},
	},
	description,
});
