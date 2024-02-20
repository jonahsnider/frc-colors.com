import { Hono } from 'hono';
import { colorsService } from '../../colors/colors.service';

export const healthController = new Hono().get('/', async (context) => {
	// Check that querying DB works
	await colorsService.stored.getTeamColors(581);

	return context.json({
		status: 'ok',
	});
});
