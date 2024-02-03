import {
	boolean,
	customType,
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
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
		createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'date' }).defaultNow().notNull(),
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
		createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'date' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'date' }),
		verified: boolean('verified').default(true).notNull(),
	},
	(teamColors) => ({
		teamIdKey: uniqueIndex('team_colors_team_id_key').on(teamColors.team),
		verifiedIdx: index().on(teamColors.verified),
	}),
);

export const verificationRequests = pgTable(
	'color_verification_requests',
	{
		uuid: uuid('uuid').primaryKey().notNull().defaultRandom(),
		team: integer('teamId')
			.notNull()
			.references(() => teams.number, { onDelete: 'restrict', onUpdate: 'cascade' }),
		status: verificationRequestStatus('status').notNull(),
		createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'date' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'date' }),
	},
	(verificationRequests) => ({
		teamKey: index('color_verification_requests_team_id_key').on(verificationRequests.team),
		createdAtIdx: index().on(verificationRequests.createdAt),
		statusIdx: index().on(verificationRequests.status),
	}),
);

export const colorSubmissions = pgTable(
	'color_form_submissions',
	{
		uuid: uuid('uuid').primaryKey().notNull().defaultRandom(),
		team: integer('teamId')
			.notNull()
			.references(() => teams.number, { onDelete: 'restrict', onUpdate: 'cascade' }),
		primaryHex: text('primary_color_hex').notNull(),
		secondaryHex: text('secondary_color_hex').notNull(),
		status: verificationRequestStatus('status').notNull(),
		createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'date' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'date' }),
	},
	(colorFormSubmissions) => ({
		teamIdKey: index('color_form_submissions_team_id_key').on(colorFormSubmissions.team),
		createdAtIdx: index().on(colorFormSubmissions.createdAt),
		statusIdx: index().on(colorFormSubmissions.status),
		updatedAtIdx: index().on(colorFormSubmissions.updatedAt),
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
	createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});
