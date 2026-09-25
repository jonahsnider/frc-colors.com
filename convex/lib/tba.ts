async function get(path: string): Promise<Response> {
	const apiKey = process.env['TBA_API_KEY'];
	if (!apiKey) throw new Error('TBA_API_KEY is not configured');
	return fetch(`https://www.thebluealliance.com/api/v3/${path}`, {
		headers: { 'X-TBA-Auth-Key': apiKey },
	});
}

export async function getTeamsForEvent(event: string): Promise<number[]> {
	const response = await get(`event/${encodeURIComponent(event)}/teams`);
	if (response.status === 404) throw new Error(`Event ${event} not found on TBA.`);
	if (!response.ok) throw new Error(`TBA event lookup failed: ${response.status}`);
	const body = (await response.json()) as { team_number: number }[];
	return body.map((team) => team.team_number);
}
