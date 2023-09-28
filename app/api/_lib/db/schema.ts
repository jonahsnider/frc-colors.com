import { customType, index, integer, pgEnum, pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export enum VerificationRequestStatus {
	Rejected = 'REJECTED',
	Finished = 'FINISHED',
	Pending = 'PENDING',
}
export const verificationRequestStatus = pgEnum('verification_request_status', [
	VerificationRequestStatus.Finished,
	VerificationRequestStatus.Pending,
	VerificationRequestStatus.Rejected,
]);

export const teams = pgTable(
	'teams',
	{
		id: integer('id').primaryKey().notNull(),

		createdAt: timestamp('created_at', { precision: 3, mode: 'date', withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { precision: 3, mode: 'date', withTimezone: true }),
	},
	(teams) => ({
		idKey: uniqueIndex('teams_id_key').on(teams.id),
	}),
);

export const teamColors = pgTable(
	'team_colors',
	{
		teamId: integer('team_id')
			.notNull()
			.references(() => teams.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		primaryColorHex: text('primary_color_hex').notNull(),
		secondaryColorHex: text('secondary_color_hex').notNull(),
		createdAt: timestamp('created_at', { precision: 3, mode: 'date', withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { precision: 3, mode: 'date', withTimezone: true }),
	},
	(teamColors) => ({
		teamIdKey: uniqueIndex('team_colors_team_id_key').on(teamColors.teamId),
	}),
);

export const colorVerificationRequests = pgTable(
	'color_verification_requests',
	{
		id: serial('id').primaryKey().notNull(),

		teamId: integer('teamId')
			.notNull()
			.references(() => teams.id, { onDelete: 'restrict', onUpdate: 'cascade' }),

		status: verificationRequestStatus('status').notNull(),

		createdAt: timestamp('created_at', { precision: 3, mode: 'date', withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { precision: 3, mode: 'date', withTimezone: true }),
	},
	(colorVerificationRequests) => ({
		teamIdKey: index('color_verification_requests_team_id_key').on(colorVerificationRequests.teamId),
		createdAtIndex: index('color_verification_requests_created_at_index').on(colorVerificationRequests.createdAt),
		statusIndex: index('color_verification_requests_status_index').on(colorVerificationRequests.status),
	}),
);

const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
	dataType() {
		return 'bytea';
	},
});

export const avatars = pgTable('avatars', {
	teamId: integer('team_id')
		.primaryKey()
		.notNull()
		.references(() => teams.id, { onDelete: 'restrict', onUpdate: 'cascade' }),

	png: bytea('png'),

	createdAt: timestamp('created_at', { precision: 3, mode: 'date', withTimezone: true }).defaultNow().notNull(),
});
