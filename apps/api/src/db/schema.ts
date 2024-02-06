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
		number: integer('team_number').primaryKey().notNull(),
		createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	},
	(teams) => ({
		numberKey: uniqueIndex().on(teams.number),
	}),
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
	(teamColors) => ({
		teamIdKey: uniqueIndex().on(teamColors.team),
		verifiedIdx: index().on(teamColors.verified),
	}),
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
	(verificationRequests) => ({
		teamKey: index().on(verificationRequests.team),
		createdAtIdx: index().on(verificationRequests.createdAt),
		statusIdx: index().on(verificationRequests.status),
	}),
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
	(colorFormSubmissions) => ({
		teamIdKey: index().on(colorFormSubmissions.team),
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
	team: integer('team_number')
		.primaryKey()
		.notNull()
		.references(() => teams.number, { onDelete: 'restrict', onUpdate: 'cascade' }),
	png: bytea('png'),
	createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});
