import { Hono } from 'hono';
import { storedColors } from '../../colors/stored/stored-colors.service';

export const healthController = new Hono().get('/', async (context) => {
	// Check that querying DB works
	await storedColors.getTeamColors(581);

	return context.json({
		status: 'ok',
	});
});
