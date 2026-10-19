import { v } from 'convex/values';
import { internal } from './_generated/api';
import { internalAction } from './_generated/server';
import { getTeamPages } from './lib/frcEvents';
import { refreshPool } from './lib/workpool';

const batchSize = 100;

export const start = internalAction({
	args: {},
	returns: v.object({ teams: v.number(), jobs: v.number() }),
	handler: async (ctx) => {
		const teams: number[] = [];
		for await (const page of getTeamPages(new Date().getFullYear())) {
			teams.push(...page.teams.map((team) => team.teamNumber));
			const names = page.teams.flatMap(({ teamNumber, nameShort, nameFull }) => {
				const name = nameShort?.trim() || nameFull?.trim();
				return name ? [{ team: teamNumber, name }] : [];
			});
			for (let offset = 0; offset < names.length; offset += batchSize) {
				await ctx.runMutation(internal.teamNames.upsertBatch, { teams: names.slice(offset, offset + batchSize) });
			}
		}
		let jobs = 0;
		for (let offset = 0; offset < teams.length; offset += batchSize) {
			const unverified = await ctx.runQuery(internal.colors.getUnverifiedTeams, {
				teams: teams.slice(offset, offset + batchSize),
			});
			await refreshPool.enqueueActionBatch(
				ctx,
				internal.refreshTeam.process,
				unverified.map((team) => ({ team })),
			);
			jobs += unverified.length;
		}
		return { teams: teams.length, jobs };
	},
});
