import { Hono } from 'hono';
import { timing } from 'hono/timing';
import { colorsService } from '../../colors/colors.service';

export const healthController = new Hono().use(timing()).get('/', async (context) => {
	// Check that querying DB works
	await colorsService.stored.getTeamColors(581);

	return context.json({
		status: 'ok',
	});
});
