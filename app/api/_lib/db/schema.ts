import { customType, integer, pgEnum, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const suggestionStatus = pgEnum('suggestion_status', ['REJECTED', 'ACCEPTED', 'PENDING']);

export const teams = pgTable(
	'teams',
	{
		id: integer('id').primaryKey().notNull(),

		createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' }),
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
		createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' }),
	},
	(teamColors) => ({
		teamIdKey: uniqueIndex('team_colors_team_id_key').on(teamColors.teamId),
	}),
);

export const colorVerificationRequests = pgTable('color_verification_requests', {
	id: text('id').primaryKey().notNull(),

	teamId: integer('teamId')
		.notNull()
		.references(() => teams.id, { onDelete: 'restrict', onUpdate: 'cascade' }),

	status: suggestionStatus('status').notNull(),

	createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' }),
});

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

	createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).defaultNow().notNull(),
});
