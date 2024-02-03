import { storedColors } from '../../colors/stored/stored-colors.service';
import { RegisterController } from '../interfaces/controller.interface';

export const healthController: RegisterController = (app) =>
	app.get('/health', async (_req, res) => {
		// Check that querying DB works
		await storedColors.getTeamColors(581);

		res.json({
			status: 'ok',
		});
	});
