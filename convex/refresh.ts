import { v } from 'convex/values';
import { internal } from './_generated/api';
import { internalAction } from './_generated/server';
import { refreshPool } from './lib/workpool';

const batchSize = 100;

export const start = internalAction({
	args: {},
	returns: v.object({ teams: v.number(), jobs: v.number() }),
	handler: async (ctx) => {
		const username = process.env['FRC_EVENTS_USERNAME'];
		const password = process.env['FRC_EVENTS_API_KEY'];
		if (!username || !password) throw new Error('FRC Events API credentials are not configured');
		const authorization = `Basic ${btoa(`${username}:${password}`)}`;
		const teams: number[] = [];
		let page = 1;
		let pageTotal = 1;
		while (page <= pageTotal) {
			const response = await fetch(
				`https://frc-api.firstinspires.org/v3.0/${new Date().getFullYear()}/teams?page=${page}`,
				{
					headers: { authorization },
				},
			);
			if (!response.ok) throw new Error(`FRC Events API failed: ${response.status}`);
			const body = (await response.json()) as {
				pageCurrent: number;
				pageTotal: number;
				teams: { teamNumber: number; nameShort: string; nameFull: string }[];
			};
			teams.push(...body.teams.map((team) => team.teamNumber));
			const names = body.teams.flatMap(({ teamNumber, nameShort, nameFull }) => {
				const name = nameShort?.trim() || nameFull?.trim();
				return name ? [{ team: teamNumber, name }] : [];
			});
			for (let offset = 0; offset < names.length; offset += batchSize) {
				await ctx.runMutation(internal.teamNames.upsertBatch, { teams: names.slice(offset, offset + batchSize) });
			}
			page = body.pageCurrent + 1;
			pageTotal = body.pageTotal;
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
