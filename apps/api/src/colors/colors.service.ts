import { GeneratedColors } from './generated/generated-colors.service.ts';
import { StoredColors } from './stored/stored-colors.service.ts';

class ColorsService {
	readonly stored = new StoredColors();
	readonly generated = new GeneratedColors();
}

export const colorsService = new ColorsService();
