import { ColorsWorker } from './colors.worker';
import { GeneratedColors } from './generated/generated-colors.service';
import { StoredColors } from './stored/stored-colors.service';

export class ColorsService {
	private readonly worker = new ColorsWorker();
	readonly stored = new StoredColors();
	readonly generated = new GeneratedColors();
}

export const colorsService = new ColorsService();
