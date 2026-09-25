async function get(path: string): Promise<Response> {
	const apiKey = process.env['TBA_API_KEY'];
	if (!apiKey) throw new Error('TBA_API_KEY is not configured');
	return fetch(`https://www.thebluealliance.com/api/v3/${path}`, {
		headers: { 'X-TBA-Auth-Key': apiKey },
	});
}

export async function getTeamsPage(page: number): Promise<{ names: { team: number; name: string }[]; done: boolean }> {
	const response = await get(`teams/${page}`);
	if (response.status === 404 && page > 0) return { names: [], done: true };
	if (!response.ok) throw new Error(`TBA teams lookup failed: ${response.status}`);
	const body = (await response.json()) as { team_number: number; nickname?: string; name?: string }[];
	if (!Array.isArray(body)) throw new Error('TBA teams lookup returned an invalid response');
	const names = body.flatMap(({ team_number, nickname, name }) => {
		const displayName = nickname?.trim() || name?.trim();
		return displayName ? [{ team: team_number, name: displayName }] : [];
	});
	return { names, done: body.length === 0 };
}

export async function getTeamsForEvent(event: string): Promise<number[]> {
	const response = await get(`event/${encodeURIComponent(event)}/teams`);
	if (response.status === 404) throw new Error(`Event ${event} not found on TBA.`);
	if (!response.ok) throw new Error(`TBA event lookup failed: ${response.status}`);
	const body = (await response.json()) as { team_number: number }[];
	return body.map((team) => team.team_number);
}
