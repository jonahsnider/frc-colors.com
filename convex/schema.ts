import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const ReviewStatus = v.union(v.literal('PENDING'), v.literal('FINISHED'), v.literal('REJECTED'));

export default defineSchema({
	teamNames: defineTable({
		team: v.number(),
		name: v.string(),
	}).index('by_team', ['team']),
	teamColors: defineTable({
		team: v.number(),
		primaryHex: v.string(),
		secondaryHex: v.string(),
		verified: v.boolean(),
		createdAt: v.number(),
		updatedAt: v.optional(v.number()),
	}).index('by_team', ['team']),
	verificationRequests: defineTable({
		id: v.string(),
		team: v.number(),
		status: ReviewStatus,
		createdAt: v.number(),
		updatedAt: v.optional(v.number()),
	})
		.index('by_request_id', ['id'])
		.index('by_team', ['team'])
		.index('by_status_and_updatedAt', ['status', 'updatedAt']),
	colorSubmissions: defineTable({
		id: v.string(),
		team: v.number(),
		primaryHex: v.string(),
		secondaryHex: v.string(),
		status: ReviewStatus,
		createdAt: v.number(),
		updatedAt: v.optional(v.number()),
	})
		.index('by_submission_id', ['id'])
		.index('by_team', ['team'])
		.index('by_status_and_updatedAt', ['status', 'updatedAt']),
});
