import { boolean, index, integer, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

export const VerificationRequestStatus = {
	Rejected: 'REJECTED',
	Finished: 'FINISHED',
	Pending: 'PENDING',
} as const;
export type VerificationRequestStatus = (typeof VerificationRequestStatus)[keyof typeof VerificationRequestStatus];

export const verificationRequestStatus = pgEnum('verification_request_status', [
	VerificationRequestStatus.Finished,
	VerificationRequestStatus.Pending,
	VerificationRequestStatus.Rejected,
]);

export const teams = pgTable(
	'teams',
	{
		number: integer('team_number').primaryKey().notNull(),
		createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	},
	(teams) => [uniqueIndex().on(teams.number)],
);

export const teamColors = pgTable(
	'team_colors',
	{
		team: integer('team_number')
			.notNull()
			.references(() => teams.number, { onDelete: 'restrict', onUpdate: 'cascade' }),
		primaryHex: text('primary_hex').notNull(),
		secondaryHex: text('secondary_hex').notNull(),
		createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'date' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'date' }),
		verified: boolean('verified').default(true).notNull(),
	},
	(teamColors) => [uniqueIndex().on(teamColors.team), index().on(teamColors.verified)],
);

export const verificationRequests = pgTable(
	'verification_requests',
	{
		uuid: uuid('id').primaryKey().notNull().defaultRandom(),
		team: integer('team_number')
			.notNull()
			.references(() => teams.number, { onDelete: 'restrict', onUpdate: 'cascade' }),
		status: verificationRequestStatus('status').notNull(),
		createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'date' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'date' }),
	},
	(verificationRequests) => [
		index().on(verificationRequests.team),
		index().on(verificationRequests.createdAt),
		index().on(verificationRequests.status),
	],
);

export const colorSubmissions = pgTable(
	'color_submissions',
	{
		uuid: uuid('id').primaryKey().notNull().defaultRandom(),
		team: integer('team_number')
			.notNull()
			.references(() => teams.number, { onDelete: 'restrict', onUpdate: 'cascade' }),
		primaryHex: text('primary_hex').notNull(),
		secondaryHex: text('secondary_hex').notNull(),
		status: verificationRequestStatus('status').notNull(),
		createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'date' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'date' }),
	},
	(colorFormSubmissions) => [
		index().on(colorFormSubmissions.team),
		index().on(colorFormSubmissions.createdAt),
		index().on(colorFormSubmissions.status),
		index().on(colorFormSubmissions.updatedAt),
	],
);
