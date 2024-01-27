import { RegisterController } from '../interfaces/controller.interface';

export const healthController: RegisterController = (app) =>
	app.get('/health', async (_req, res) => {
		res.json({
			status: 'ok',
		});
	});
