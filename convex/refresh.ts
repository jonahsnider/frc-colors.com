import { v } from 'convex/values';
import { internal } from './_generated/api';
import { internalAction } from './_generated/server';

const batchSize = 25;
const nameBatchSize = 100;

export const start = internalAction({
	args: {},
	returns: v.object({ teams: v.number(), batches: v.number() }),
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
			for (let offset = 0; offset < names.length; offset += nameBatchSize) {
				await ctx.runMutation(internal.teamNames.upsertBatch, { teams: names.slice(offset, offset + nameBatchSize) });
			}
			page = body.pageCurrent + 1;
			pageTotal = body.pageTotal;
		}
		for (let offset = 0; offset < teams.length; offset += batchSize) {
			await ctx.scheduler.runAfter(0, internal.refreshBatch.process, {
				teams: teams.slice(offset, offset + batchSize),
			});
		}
		return { teams: teams.length, batches: Math.ceil(teams.length / batchSize) };
	},
});
