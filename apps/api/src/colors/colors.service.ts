import { ColorsWorker } from './colors.worker';
import { GeneratedColors } from './generated/generated-colors.service';
import { StoredColors } from './stored/stored-colors.service';

export class ColorsService {
	readonly stored = new StoredColors();
	readonly generated = new GeneratedColors();

	private readonly worker = new ColorsWorker();

	constructor() {
		this.worker.noop();
	}
}

export const colorsService = new ColorsService();
