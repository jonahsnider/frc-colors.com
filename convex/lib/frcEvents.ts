import { paginate, pipeline, withBaseUrl, withHeaders, withHttpError } from 'fetch-extras';
import { env } from '../_generated/server';

const baseUrl = 'https://frc-api.firstinspires.org/v3.0/';

type TeamsPage = {
	pageCurrent: number;
	pageTotal: number;
	teams: { teamNumber: number; nameShort: string; nameFull: string }[];
};

export const frcEventsFetch = pipeline(
	fetch,
	withBaseUrl(baseUrl),
	withHeaders(() => ({ authorization: `Basic ${btoa(`${env.FRC_EVENTS_USERNAME}:${env.FRC_EVENTS_API_KEY}`)}` })),
	withHttpError(),
);

export function getTeamPages(year: number) {
	return paginate<TeamsPage>(new URL(`${year}/teams?page=1`, baseUrl), {
		fetchFunction: frcEventsFetch,
		pagination: {
			transform: async (response) => [(await response.json()) as TeamsPage],
			paginate: ({ currentUrl, currentItems: [page] }) => {
				if (page.pageCurrent >= page.pageTotal) return false;
				const url = new URL(currentUrl);
				url.searchParams.set('page', String(page.pageCurrent + 1));
				return { url };
			},
		},
	});
}
