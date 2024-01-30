import {
	boolean,
	customType,
	index,
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
} from 'drizzle-orm/pg-core';

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
		number: integer('id').primaryKey().notNull(),

		createdAt: timestamp('created_at', { precision: 3, mode: 'date', withTimezone: true }).defaultNow().notNull(),
	},
	(teams) => ({
		numberKey: uniqueIndex('teams_id_key').on(teams.number),
	}),
);

export const teamColors = pgTable(
	'team_colors',
	{
		team: integer('team_id')
			.notNull()
			.references(() => teams.number, { onDelete: 'restrict', onUpdate: 'cascade' }),
		primaryHex: text('primary_color_hex').notNull(),
		secondaryHex: text('secondary_color_hex').notNull(),
		verified: boolean('verified').notNull().default(true),
		createdAt: timestamp('created_at', { precision: 3, mode: 'date', withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { precision: 3, mode: 'date', withTimezone: true }),
	},
	(teamColors) => ({
		teamKey: uniqueIndex('team_colors_team_id_key').on(teamColors.team),
		verifiedIndex: index('team_colors_verified_index').on(teamColors.verified),
	}),
);

export const verificationRequests = pgTable(
	'color_verification_requests',
	{
		id: serial('id').primaryKey().notNull(),

		team: integer('teamId')
			.notNull()
			.references(() => teams.number, { onDelete: 'restrict', onUpdate: 'cascade' }),

		status: verificationRequestStatus('status').notNull(),

		createdAt: timestamp('created_at', { precision: 3, mode: 'date', withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { precision: 3, mode: 'date', withTimezone: true }),
	},
	(verificationRequests) => ({
		teamKey: index('color_verification_requests_team_id_key').on(verificationRequests.team),
		createdAtIndex: index('color_verification_requests_created_at_index').on(verificationRequests.createdAt),
		statusIndex: index('color_verification_requests_status_index').on(verificationRequests.status),
	}),
);

export const colorSubmissions = pgTable(
	'color_form_submissions',
	{
		id: serial('id').primaryKey().notNull(),

		team: integer('teamId')
			.notNull()
			.references(() => teams.number, { onDelete: 'restrict', onUpdate: 'cascade' }),
		primaryHex: text('primary_color_hex').notNull(),
		secondaryHex: text('secondary_color_hex').notNull(),

		status: verificationRequestStatus('status').notNull(),

		createdAt: timestamp('created_at', { precision: 3, mode: 'date', withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { precision: 3, mode: 'date', withTimezone: true }),
	},
	(colorSubmissions) => ({
		teamIdKey: index('color_form_submissions_team_id_key').on(colorSubmissions.team),
		createdAtIndex: index('color_form_submissions_created_at_index').on(colorSubmissions.createdAt),
		updatedAtIndex: index('color_form_submissions_updated_at_index').on(colorSubmissions.updatedAt),
		statusIndex: index('color_form_submissions_status_index').on(colorSubmissions.status),
	}),
);

const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
	dataType() {
		return 'bytea';
	},
});

export const avatars = pgTable('avatars', {
	team: integer('team_id')
		.primaryKey()
		.notNull()
		.references(() => teams.number, { onDelete: 'restrict', onUpdate: 'cascade' }),

	png: bytea('png'),

	createdAt: timestamp('created_at', { precision: 3, mode: 'date', withTimezone: true }).defaultNow().notNull(),
});
